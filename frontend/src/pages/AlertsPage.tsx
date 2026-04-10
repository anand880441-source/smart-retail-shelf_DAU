import React, { useState } from 'react';
import {
  Bell, BellOff, CheckCircle, AlertTriangle, XCircle,
  Mail, Smartphone, Monitor, Clock, DollarSign, Filter
} from 'lucide-react';
import { useAlerts } from '../hooks/useApiData';
import { api } from '../services/api';
import type { AlertPriority, AlertType, Alert } from '../types';

const priorityConfig: Record<AlertPriority, { color: string; bg: string; border: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  high: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  medium: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  low: { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-700/50' },
};

const typeIcons: Record<AlertType, React.ReactNode> = {
  stockout: <XCircle size={16} className="text-red-400" />,
  low_stock: <AlertTriangle size={16} className="text-amber-400" />,
  planogram_violation: <AlertTriangle size={16} className="text-purple-400" />,
  price_mismatch: <DollarSign size={16} className="text-blue-400" />,
  unauthorized_product: <XCircle size={16} className="text-orange-400" />,
};

const channelIcons: Record<string, React.ReactNode> = {
  dashboard: <Monitor size={10} />,
  mobile: <Smartphone size={10} />,
  email: <Mail size={10} />,
};

export default function AlertsPage() {
  const { data: alertList, loading, refetch, isLive } = useAlerts();
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(true);

  const filtered = alertList.filter(a => {
    if (filterPriority !== 'all' && a.priority !== filterPriority) return false;
    if (filterType !== 'all' && a.type !== filterType) return false;
    if (!showAcknowledged && a.acknowledged) return false;
    return true;
  });

  const acknowledge = async (id: string) => {
    try {
      if (isLive) {
        await api.acknowledgeAlert(id);
        refetch();
      } else {
        // Fallback for demo mode
        console.log('Acknowledged alert:', id);
      }
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const acknowledgeAll = async () => {
    console.log('Acknowledged all alerts');
  };

  const unacknowledgedCount = alertList.filter(a => !a.acknowledged).length;
  const criticalCount = alertList.filter(a => a.priority === 'critical' && !a.acknowledged).length;
  const totalRevenueImpact = alertList.filter(a => !a.acknowledged).reduce((s, a) => s + a.revenueImpact, 0);

  const getTimeSince = (timestamp: string) => {
    const mins = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading Alerts...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Real-Time Alert System</h2>
          <p className="text-sm text-slate-400 mt-1">Prioritized notifications with ≤5 min detection latency</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={acknowledgeAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-all border border-emerald-500/20">
            <CheckCircle size={12} /> Acknowledge All
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card rounded-lg p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center">
            <Bell size={18} className="text-red-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{unacknowledgedCount}</p>
            <p className="text-[10px] text-slate-500">Unacknowledged</p>
          </div>
        </div>
        <div className="glass-card rounded-lg p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center pulse-glow">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-red-400">{criticalCount}</p>
            <p className="text-[10px] text-slate-500">Critical Alerts</p>
          </div>
        </div>
        <div className="glass-card rounded-lg p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <DollarSign size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">${totalRevenueImpact.toFixed(0)}</p>
            <p className="text-[10px] text-slate-500">Revenue at Risk</p>
          </div>
        </div>
        <div className="glass-card rounded-lg p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center">
            <Clock size={18} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">3.2 min</p>
            <p className="text-[10px] text-slate-500">Avg Detection Time</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter size={12} className="text-slate-500" />
            <span className="text-xs text-slate-500">Priority:</span>
            {['all', 'critical', 'high', 'medium', 'low'].map(p => (
              <button key={p} onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  filterPriority === p ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800/60 text-slate-500 hover:text-slate-300'
                }`}>{p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}</button>
            ))}
          </div>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Type:</span>
            {['all', 'stockout', 'low_stock', 'planogram_violation', 'price_mismatch'].map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  filterType === t ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800/60 text-slate-500 hover:text-slate-300'
                }`}>{t === 'all' ? 'All' : t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</button>
            ))}
          </div>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <button onClick={() => setShowAcknowledged(!showAcknowledged)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              showAcknowledged ? 'bg-slate-800/60 text-slate-400' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
            {showAcknowledged ? <Bell size={11} /> : <BellOff size={11} />}
            {showAcknowledged ? 'Show All' : 'Active Only'}
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center">
            <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
            <p className="text-sm text-slate-300">No alerts matching your filters</p>
          </div>
        )}
        {filtered.map(alert => {
          const pc = priorityConfig[alert.priority];
          return (
            <div key={alert.id} className={`glass-card rounded-xl p-4 border ${pc.border} ${alert.acknowledged ? 'opacity-60' : ''} transition-all hover:border-opacity-60 animate-slide-in`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${pc.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {typeIcons[alert.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${pc.bg} ${pc.color}`}>{alert.priority}</span>
                        {alert.acknowledged && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Acknowledged</span>}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{alert.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Clock size={10} className="text-slate-600" />
                      <span className="text-[10px] text-slate-500">{getTimeSince(alert.timestamp)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2.5 text-[10px] flex-wrap">
                    <span className="text-slate-500">📍 {alert.location}</span>
                    {alert.product && <span className="text-slate-500">📦 {alert.product}</span>}
                    <span className="text-amber-400 font-medium">💰 ${alert.revenueImpact.toFixed(0)} impact</span>
                    <div className="flex items-center gap-1">
                      {alert.channels.map(ch => (
                        <span key={ch} className="p-1 rounded bg-slate-800 text-slate-500" title={ch}>
                          {channelIcons[ch]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2.5 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/30 flex items-start gap-2">
                    <CheckCircle size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-emerald-400/80">{alert.suggestedAction}</p>
                  </div>
                </div>

                {!alert.acknowledged && (
                  <button onClick={() => acknowledge(alert.id)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700/50">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}