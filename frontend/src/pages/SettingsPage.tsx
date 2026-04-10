import React, { useState } from 'react';
import {
  Settings, User, Bell, Shield, Database, 
  Cpu, Save, RefreshCw, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      criticalOnly: false,
      dailyDigest: true
    },
    system: {
      autoResolution: true,
      highPrecision: false,
      saveFrames: true,
      edgeProcessing: true
    }
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const tabs = [
    { id: 'profile', icon: <User size={18} />, label: 'Profile Settings' },
    { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
    { id: 'system', icon: <Cpu size={18} />, label: 'CV System' },
    { id: 'security', icon: <Shield size={18} />, label: 'Security' },
    { id: 'data', icon: <Database size={18} />, label: 'Data Management' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-sm text-slate-400 mt-1">Configure your account and system preferences</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70"
        >
          {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/5'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-800">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-2xl font-bold text-white border border-white/10">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{user?.name || 'Administrator'}</h3>
                  <p className="text-sm text-slate-500">{user?.role || 'Store Manager'} • Store #1247</p>
                  <button className="text-xs text-blue-400 hover:underline mt-2">Change avatar</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-200 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                  <input type="email" defaultValue={user?.email} className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-200 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell size={20} className="text-blue-400" /> Notification Channels
              </h3>
              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Email Notifications', desc: 'Receive real-time alerts via email', checked: settings.notifications.email },
                  { id: 'push', label: 'Dashboard Push', desc: 'In-browser desktop notifications', checked: settings.notifications.push },
                  { id: 'critical', label: 'Critical Only', desc: 'Only alert for critical stockouts and violations', checked: settings.notifications.criticalOnly },
                  { id: 'digest', label: 'Daily Analytics Digest', desc: 'End-of-day summary report', checked: settings.notifications.dailyDigest }
                ].map(item => (
                   <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setSettings(s => ({...s, notifications: {...s.notifications, [item.id]: !item.checked}}))}
                        className={`w-10 h-5 rounded-full transition-all relative ${item.checked ? 'bg-blue-600' : 'bg-slate-700'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.checked ? 'left-5' : 'left-1'}`} />
                      </button>
                   </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu size={20} className="text-purple-400" /> Computer Vision Settings
              </h3>
              <div className="space-y-4">
                 <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Edge Processing</p>
                    <p className="text-xs text-slate-400">All video feeds are processed locally on the ShelfIQ Edge Node for maximum privacy and performance.</p>
                 </div>
                 {[
                  { id: 'auto', label: 'Auto-Resolution', desc: 'Automatically mark resolved when SKU is back in stock', checked: true },
                  { id: 'frames', label: 'Save Event Frames', desc: 'Save high-res frames when violations are detected', checked: true },
                  { id: 'precision', label: 'High Precision Mode', desc: 'Increases accuracy but uses 2x more edge compute', checked: false }
                ].map(item => (
                   <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <button className={`w-10 h-5 rounded-full transition-all relative ${item.checked ? 'bg-purple-600' : 'bg-slate-700'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.checked ? 'left-5' : 'left-1'}`} />
                      </button>
                   </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}