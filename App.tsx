import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChannelManager from './components/ChannelManager';
import FacebookConfig from './components/FacebookConfig';
import Settings from './components/Settings';
import { Channel, FacebookPage, AgentConfig, VideoTask, AgentLogEntry, TaskStatus, AgentAction } from './types';
import { DEFAULT_CONFIG, MOCK_FB_PAGES, MOCK_VIDEO_TITLES } from './constants';
import { processAgentStep, createLog } from './services/agentSimulator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State
  const [channels, setChannels] = useState<Channel[]>([]);
  const [connectedPages, setConnectedPages] = useState<FacebookPage[]>(MOCK_FB_PAGES);
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_CONFIG);
  const [tasks, setTasks] = useState<VideoTask[]>([]);
  const [logs, setLogs] = useState<AgentLogEntry[]>([]);

  // Agent Loop
  useEffect(() => {
    // Only run if we have channels and pages connected
    const activePages = connectedPages.filter(p => p.isConnected);
    
    // Seed tasks if empty and we have sources
    if (tasks.length < 5 && channels.length > 0 && activePages.length > 0) {
        // Create mock tasks
        const channel = channels[Math.floor(Math.random() * channels.length)];
        const newTask: VideoTask = {
            id: Math.random().toString(36).substr(2, 9),
            channelId: channel.id,
            title: MOCK_VIDEO_TITLES[Math.floor(Math.random() * MOCK_VIDEO_TITLES.length)],
            status: TaskStatus.PENDING,
            progress: 0,
            scheduledTime: new Date().toISOString(), // Simplified
            facebookPageId: activePages[0].id
        };
        setTasks(prev => [...prev, newTask]);
    }

    const interval = setInterval(() => {
        if (channels.length === 0 || activePages.length === 0) return;

        processAgentStep(
            tasks, 
            config, 
            channels, 
            (log) => setLogs(prev => [...prev, log]),
            (id, updates) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
        );

    }, 3000); // 3-second tick for simulation speed

    return () => clearInterval(interval);
  }, [tasks, channels, connectedPages, config]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard tasks={tasks} logs={logs} />;
      case 'channels':
        return <ChannelManager channels={channels} setChannels={setChannels} addLog={(l) => setLogs(prev => [...prev, l])} />;
      case 'facebook':
        return <FacebookConfig connectedPages={connectedPages} setConnectedPages={setConnectedPages} />;
      case 'settings':
        return <Settings config={config} setConfig={setConfig} />;
      default:
        return <Dashboard tasks={tasks} logs={logs} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-emerald-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
