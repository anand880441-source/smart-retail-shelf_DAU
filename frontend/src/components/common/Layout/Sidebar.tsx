import React from 'react';
import {
  LayoutDashboard, Camera, Grid3X3, TrendingUp,
  Bell, BarChart3, Map, Cpu, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  alertCount: number;
}

const navItems = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'shelf-analysis', path: '/shelf-analysis', label: 'Shelf Analysis', icon: <Camera size={20} /> },
  { id: 'planogram', path: '/planogram', label: 'Planogram', icon: <Grid3X3 size={20} /> },
  { id: 'forecasting', path: '/forecasting', label: 'Forecasting', icon: <TrendingUp size={20} /> },
  { id: 'alerts', path: '/alerts', label: 'Alerts', icon: <Bell size={20} /> },
  { id: 'analytics', path: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { id: 'store-map', path: '/shelf-map', label: 'Store Map', icon: <Map size={20} /> },
  { id: 'settings', path: '/settings', label: 'Settings', icon: <Cpu size={20} /> },
];

export default function Sidebar({ collapsed, onToggle, alertCount }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname === path) return true;
    return false;
  };

  return (
    <aside className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 flex flex-col`}>
      <div className="p-4 flex items-center gap-3 border-b border-slate-700/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
          <Cpu size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">ShelfIQ</h1>
            <p className="text-[10px] text-slate-500 -mt-0.5">Retail Intelligence</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group
              ${isCurrent(item.path)
                ? 'bg-blue-500/15 text-blue-400 shadow-lg shadow-blue-500/5'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
          >
            {isCurrent(item.path) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-400 rounded-full" />
            )}
            <span className="flex-shrink-0 relative">
              {item.icon}
              {item.id === 'alerts' && alertCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </span>
            {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-slate-700">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-2 border-t border-slate-700/50">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="text-xs">Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}