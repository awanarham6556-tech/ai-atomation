import React from 'react';
import { AgentConfig } from '../types';

interface SettingsProps {
  config: AgentConfig;
  setConfig: React.Dispatch<React.SetStateAction<AgentConfig>>;
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig }) => {
  const handleChange = (field: keyof AgentConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Agent Configuration</h1>
        <p className="text-slate-400">Fine-tune the behavior and scheduling of your AI agent.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scheduling Section */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-3">Posting Schedule</h3>
              
              <div>
                  <label htmlFor="videos-per-day" className="block text-slate-400 text-sm font-medium mb-2">Videos per Day</label>
                  <div className="flex items-center gap-4">
                      <input 
                        id="videos-per-day"
                        type="range" 
                        min="1" 
                        max="10" 
                        value={config.videosPerDay}
                        onChange={(e) => handleChange('videosPerDay', parseInt(e.target.value))}
                        className="flex-1 accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="bg-slate-700 text-white px-3 py-1 rounded font-mono font-bold">{config.videosPerDay}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Maximum number of videos the agent will process and upload daily.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="window-start" className="block text-slate-400 text-sm font-medium mb-2">Start Time</label>
                      <input 
                        id="window-start"
                        type="time" 
                        value={config.postingWindowStart}
                        onChange={(e) => handleChange('postingWindowStart', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 focus:ring-1 focus:ring-emerald-500"
                      />
                  </div>
                  <div>
                      <label htmlFor="window-end" className="block text-slate-400 text-sm font-medium mb-2">End Time</label>
                      <input 
                        id="window-end"
                        type="time" 
                        value={config.postingWindowEnd}
                        onChange={(e) => handleChange('postingWindowEnd', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 focus:ring-1 focus:ring-emerald-500"
                      />
                  </div>
              </div>
          </div>

          {/* AI Personality Section */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-3">Content Strategy</h3>
              
              <div>
                  <label htmlFor="target-audience" className="block text-slate-400 text-sm font-medium mb-2">Target Audience</label>
                  <select 
                    id="target-audience"
                    value={config.targetAudience}
                    onChange={(e) => handleChange('targetAudience', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded p-3 focus:ring-1 focus:ring-emerald-500"
                  >
                      <option>General Audience</option>
                      <option>Tech Enthusiasts</option>
                      <option>Young Adults (18-24)</option>
                      <option>Parents</option>
                      <option>Professionals</option>
                  </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div>
                      <div className="text-slate-200 font-medium">Auto-Approve Posts</div>
                      <div className="text-xs text-slate-500">Skip manual review for generated captions</div>
                  </div>
                  <button 
                    onClick={() => handleChange('autoApprove', !config.autoApprove)}
                    aria-label={config.autoApprove ? "Disable Auto-Approve" : "Enable Auto-Approve"}
                    className={`w-12 h-6 rounded-full transition-colors relative ${config.autoApprove ? 'bg-emerald-500' : 'bg-slate-600'}`}
                  >
                      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${config.autoApprove ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Settings;