import React from 'react';
import { VideoTask, AgentLogEntry, TaskStatus, AgentAction } from '../types';
import { IconActivity, IconClock, IconCheck } from '../icons';

interface DashboardProps {
  tasks: VideoTask[];
  logs: AgentLogEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, logs }) => {
  const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const pending = tasks.filter(t => t.status === TaskStatus.PENDING).length;
  const processing = tasks.filter(t => t.status === TaskStatus.PROCESSING).length;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
        <p className="text-slate-400">Real-time overview of agent operations and performance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <IconActivity className="w-16 h-16 text-blue-400" />
          </div>
          <div className="text-slate-400 text-sm font-medium mb-1">Active Jobs</div>
          <div className="text-4xl font-bold text-white mb-2">{processing}</div>
          <div className="text-xs text-blue-400 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Processing now
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <IconClock className="w-16 h-16 text-amber-400" />
          </div>
          <div className="text-slate-400 text-sm font-medium mb-1">In Queue</div>
          <div className="text-4xl font-bold text-white mb-2">{pending}</div>
          <div className="text-xs text-amber-400">Scheduled for today</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <IconCheck className="w-16 h-16 text-emerald-400" />
          </div>
          <div className="text-slate-400 text-sm font-medium mb-1">Completed</div>
          <div className="text-4xl font-bold text-white mb-2">{completed}</div>
          <div className="text-xs text-emerald-400">+12% from yesterday</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal / Live Log */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-96">
          <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <span className="text-sm font-mono text-slate-300 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              AGENT TERMINAL
            </span>
            <span className="text-xs text-slate-500 font-mono">LIVE_EXECUTION_MODE</span>
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto scrollbar-hide space-y-2 bg-black/40">
            {logs.length === 0 && <div className="text-slate-600 italic">Waiting for agent activity...</div>}
            {logs.slice().reverse().map((log) => (
              <div key={log.id} className="flex gap-3">
                <span className="text-slate-600 shrink-0">[{log.timestamp.toLocaleTimeString()}]</span>
                <span className={`${
                  log.action === AgentAction.FAILED ? 'text-red-400' : 
                  log.action === AgentAction.COMPLETED ? 'text-emerald-400' :
                  log.action === AgentAction.ANALYZING_CHANNEL ? 'text-cyan-400' :
                  'text-slate-300'
                }`}>
                  <span className="font-bold opacity-75 mr-2">
                    {log.action.replace('_', ' ')}:
                  </span>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks List */}
        <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-0 overflow-hidden h-96 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-700/50">
               <h3 className="font-semibold text-slate-200">Processing Queue</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {tasks.filter(t => t.status !== TaskStatus.COMPLETED).length === 0 && (
                     <div className="text-center text-slate-500 mt-10">All caught up! No active tasks.</div>
                )}
                {tasks.filter(t => t.status !== TaskStatus.COMPLETED).slice(0, 5).map(task => (
                    <div key={task.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-slate-200 font-medium truncate w-4/5">{task.title}</span>
                            {task.status === TaskStatus.PROCESSING && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mt-1"></span>
                            )}
                        </div>
                        {task.status === TaskStatus.PROCESSING ? (
                             <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${task.progress}%` }}></div>
                             </div>
                        ) : (
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                <IconClock className="w-3 h-3" /> Scheduled
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
