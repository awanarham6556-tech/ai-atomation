import React, { useState } from 'react';
import { Channel, AgentLogEntry, AgentAction } from '../types';
import { analyzeChannel } from '../services/geminiService';
import { IconTrash, IconYoutube, IconRefresh } from '../icons';

interface ChannelManagerProps {
  channels: Channel[];
  setChannels: React.Dispatch<React.SetStateAction<Channel[]>>;
  addLog: (log: AgentLogEntry) => void;
}

const ChannelManager: React.FC<ChannelManagerProps> = ({ channels, setChannels, addLog }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAddChannel = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevent default form submission
    
    if (!inputUrl) return;
    setIsAnalyzing(true);
    addLog({
        id: Date.now().toString(),
        timestamp: new Date(),
        action: AgentAction.ANALYZING_CHANNEL,
        message: `Analyzing channel: ${inputUrl}`
    });

    try {
        const analysis = await analyzeChannel(inputUrl);
        const newChannel: Channel = {
            id: Date.now().toString(),
            url: inputUrl,
            name: analysis.name || 'Unknown Channel',
            description: analysis.description || 'No description found.',
            subscribers: analysis.subscribers || 'Unknown',
            tags: analysis.tags || []
        };
        
        setChannels(prev => [...prev, newChannel]);
        addLog({
            id: Date.now().toString(),
            timestamp: new Date(),
            action: AgentAction.COMPLETED,
            message: `Added channel: ${newChannel.name}`
        });
        setInputUrl('');
    } catch (e) {
        console.error(e);
        addLog({
            id: Date.now().toString(),
            timestamp: new Date(),
            action: AgentAction.FAILED,
            message: `Failed to analyze: ${inputUrl}`
        });
    } finally {
        setIsAnalyzing(false);
    }
  };

  const removeChannel = (id: string) => {
    setChannels(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Sources</h1>
        <p className="text-slate-400">Manage YouTube channels the agent should monitor.</p>
      </header>

      <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Add New Channel</h3>
        
        <form onSubmit={handleAddChannel} className="flex gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <IconYoutube className="h-5 w-5 text-slate-500" />
            </div>
            <label htmlFor="channel-url" className="sr-only">YouTube Channel URL</label>
            <input
              id="channel-url"
              name="channel-url"
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter YouTube Channel URL or Name..."
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing || !inputUrl}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isAnalyzing 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
            }`}
          >
            {isAnalyzing ? (
                <div className="flex items-center gap-2">
                    <IconRefresh className="animate-spin w-5 h-5" />
                    Analyzing...
                </div>
            ) : 'Analyze & Add'}
          </button>
        </form>
        <p className="mt-2 text-xs text-slate-500">
           * The AI agent will automatically analyze video content styles and audience from this channel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.map(channel => (
            <div key={channel.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg text-slate-100">{channel.name}</h4>
                    <button 
                        onClick={() => removeChannel(channel.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                        aria-label={`Remove ${channel.name}`}
                    >
                        <IconTrash className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2 min-h-[2.5rem]">{channel.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {channel.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-md bg-slate-700/50 text-xs text-slate-300 border border-slate-600/50">
                            #{tag}
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-700/50">
                    <IconYoutube className="w-4 h-4" />
                    <span>{channel.subscribers} Subscribers (Est.)</span>
                </div>
            </div>
        ))}

        {channels.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-xl">
                <IconYoutube className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <h3 className="text-slate-500 font-medium">No channels added yet</h3>
                <p className="text-slate-600 text-sm mt-1">Add a channel URL to start the agent.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChannelManager;