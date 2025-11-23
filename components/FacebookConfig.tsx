import React, { useState } from 'react';
import { FacebookPage } from '../types';
import { MOCK_FB_PAGES } from '../constants';
import { IconFacebook, IconCheck, IconShare, IconLink, IconMail, IconTwitter } from '../icons';

interface FacebookConfigProps {
  connectedPages: FacebookPage[];
  setConnectedPages: React.Dispatch<React.SetStateAction<FacebookPage[]>>;
}

const FacebookConfig: React.FC<FacebookConfigProps> = ({ connectedPages, setConnectedPages }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock Login Flow
  const handleLogin = () => {
    setIsConnecting(true);
    setTimeout(() => {
        setIsLoggedIn(true);
        setIsConnecting(false);
        // Load mock pages initially disconnected
        setConnectedPages(MOCK_FB_PAGES);
    }, 2000);
  };

  const togglePageConnection = (pageId: string) => {
    setConnectedPages(prev => prev.map(page => 
        page.id === pageId ? { ...page, isConnected: !page.isConnected } : page
    ));
  };

  const handleShare = async (e: React.MouseEvent, platform: string, pageName: string) => {
    e.stopPropagation();
    const mockUrl = `https://facebook.com/${pageName.replace(/\s+/g, '').toLowerCase()}`;
    const text = `Check out ${pageName} on Facebook!`;

    switch (platform) {
        case 'Twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(mockUrl)}`, '_blank');
            break;
        case 'Email':
            window.location.href = `mailto:?subject=${encodeURIComponent(pageName)}&body=${encodeURIComponent(text + ' ' + mockUrl)}`;
            break;
        case 'Copy Link':
            try {
                await navigator.clipboard.writeText(mockUrl);
                // Use a temporary visual indicator logic or just alert for simplicity in this demo
                alert(`Link copied: ${mockUrl}`);
            } catch (err) {
                console.error('Failed to copy', err);
            }
            break;
        default:
            alert(`Shared on ${platform}`);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Destinations</h1>
        <p className="text-slate-400">Connect Facebook accounts and manage page permissions.</p>
      </header>

      {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50">
                  <IconFacebook className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Connect Facebook Account</h2>
              <p className="text-slate-400 max-w-md text-center mb-8">
                  Authorize the AI agent to manage your pages, post content, and upload videos automatically.
              </p>
              <button
                onClick={handleLogin}
                disabled={isConnecting}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-lg transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-wait"
              >
                  {isConnecting ? 'Connecting Securely...' : 'Login with Facebook'}
              </button>
          </div>
      ) : (
          <div className="space-y-6">
            <div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="font-bold text-white">JD</span>
                    </div>
                    <div>
                        <div className="font-bold text-white">John Doe</div>
                        <div className="text-xs text-blue-300">Account Connected</div>
                    </div>
                </div>
                <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="text-xs text-slate-400 hover:text-white underline"
                >
                    Disconnect
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <h3 className="text-lg font-semibold text-slate-200 mt-4">Available Pages</h3>
                {connectedPages.map(page => (
                    <div 
                        key={page.id}
                        className={`rounded-xl border transition-all overflow-hidden ${
                            page.isConnected 
                            ? 'bg-emerald-900/20 border-emerald-500/50' 
                            : 'bg-slate-800/30 border-slate-700 hover:border-slate-500'
                        }`}
                    >
                        {/* Page Info & Toggle Area */}
                        <div 
                            onClick={() => togglePageConnection(page.id)}
                            className="p-5 cursor-pointer flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                 <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                     page.isConnected ? 'bg-emerald-600' : 'bg-slate-700'
                                 }`}>
                                     <span className="font-bold text-white text-lg">{page.name.charAt(0)}</span>
                                 </div>
                                 <div>
                                     <div className="font-bold text-slate-200">{page.name}</div>
                                     <div className="text-sm text-slate-500">{page.category} • {page.followers.toLocaleString()} followers</div>
                                 </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                page.isConnected 
                                ? 'bg-emerald-500 border-emerald-500' 
                                : 'border-slate-600'
                            }`}>
                                {page.isConnected && <IconCheck className="w-4 h-4 text-white" />}
                            </div>
                        </div>

                        {/* Social Sharing Footer */}
                        <div className={`px-5 py-3 border-t flex items-center justify-between ${
                            page.isConnected ? 'border-emerald-500/30 bg-emerald-950/30' : 'border-slate-700/50 bg-slate-900/30'
                        }`}>
                            <span className="text-xs text-slate-500 font-medium">Share Page Profile</span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={(e) => handleShare(e, 'Twitter', page.name)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-white/5 transition-colors"
                                    title="Share on Twitter"
                                >
                                    <IconTwitter className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={(e) => handleShare(e, 'Email', page.name)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-colors"
                                    title="Share via Email"
                                >
                                    <IconMail className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={(e) => handleShare(e, 'Copy Link', page.name)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                                    title="Copy Link"
                                >
                                    <IconLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 mt-6">
                 <h4 className="font-semibold text-slate-300 mb-2 text-sm">Agent Permissions</h4>
                 <ul className="text-sm text-slate-500 space-y-2">
                     <li className="flex items-center gap-2"><IconCheck className="w-4 h-4 text-emerald-500"/> Read page insights</li>
                     <li className="flex items-center gap-2"><IconCheck className="w-4 h-4 text-emerald-500"/> Create new posts</li>
                     <li className="flex items-center gap-2"><IconCheck className="w-4 h-4 text-emerald-500"/> Upload video content</li>
                     <li className="flex items-center gap-2"><IconCheck className="w-4 h-4 text-emerald-500"/> Reply to comments (Optional)</li>
                 </ul>
            </div>
          </div>
      )}
    </div>
  );
};

export default FacebookConfig;