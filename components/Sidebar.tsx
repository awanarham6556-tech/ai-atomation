import React from 'react';
import { IconActivity, IconYoutube, IconFacebook, IconSettings, IconRobot } from '../icons';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IconActivity },
    { id: 'channels', label: 'Sources', icon: IconYoutube },
    { id: 'facebook', label: 'Destinations', icon: IconFacebook },
    { id: 'settings', label: 'Agent Config', icon: IconSettings },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-3 text-emerald-400">
        <IconRobot className="w-8 h-8" />
        <span className="font-bold text-xl tracking-wider text-white">AUTOSTREAM</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-xs text-slate-500 uppercase font-semibold mb-2">System Status</div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-emerald-400 font-medium">Agent Active</span>
          </div>
          <div className="text-xs text-slate-400">Next run in: 04:23</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
