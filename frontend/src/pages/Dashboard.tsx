import React from 'react';
import {
  Package, ShieldCheck, Clock, DollarSign, AlertTriangle,
  TrendingUp, Camera, Target, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useDashboardStats, useRecentAlerts, useCameras } from '../hooks/useApiData';
import { stockoutTrend, categoryPerformance, detectionMetrics } from '../data/mockData';

function MetricCard({ icon, label, value, unit, trend, trendUp, color }: {
  icon: React.ReactNode; label: string; value: string | number; unit?: string;
  trend?: string; trendUp?: boolean; color: string;
}) {
  return (
    <div className="glass-card rounded-xl p-4 hover:border-slate-600/30 transition-all group">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${trendUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-white">
          {value}<span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: storeMetrics, loading: statsLoading, isLive: statsLive } = useDashboardStats();
  const { data: alerts, loading: alertsLoading } = useRecentAlerts(4);
  const { data: cameras } = useCameras();
  
  const recentAlerts = alerts.filter(a => !a.acknowledged).slice(0, 4);
  
  const stockStatusData = [
    { name: 'In Stock', value: 2742, color: '#10b981' },
    { name: 'Low Stock', value: 72, color: '#f59e0b' },
    { name: 'Out of Stock', value: 33, color: '#ef4444' },
  ];

  if (statsLoading) {
    return <div className="flex items-center justify-center h-full">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time shelf intelligence • Store #1247 Downtown</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {statsLive ? 'Live System Connected' : 'Demo Mode (Mock Data)'}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {detectionMetrics.camerasOnline}/{detectionMetrics.camerasTotal} Cameras
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<ShieldCheck size={20} className="text-blue-400" />} label="Shelf Health Score" value={storeMetrics.shelfHealthScore} unit="/ 100" trend="+2.1%" trendUp={true} color="bg-blue-500/15" />
        <MetricCard icon={<Package size={20} className="text-emerald-400" />} label="In-Stock Rate" value={storeMetrics.inStockRate} unit="%" trend="+0.8%" trendUp={true} color="bg-emerald-500/15" />
        <MetricCard icon={<Target size={20} className="text-purple-400" />} label="Planogram Compliance" value={storeMetrics.planogramCompliance} unit="%" trend="-1.2%" trendUp={false} color="bg-purple-500/15" />
        <MetricCard icon={<DollarSign size={20} className="text-amber-400" />} label="Revenue Recovered (MTD)" value={`$${(storeMetrics.revenueRecovered / 1000).toFixed(1)}K`} trend="+12.5%" trendUp={true} color="bg-amber-500/15" />
        <MetricCard icon={<Clock size={20} className="text-cyan-400" />} label="Avg Replenishment Time" value={storeMetrics.avgReplenishmentTime} unit="min" trend="-3.2 min" trendUp={true} color="bg-cyan-500/15" />
        <MetricCard icon={<TrendingUp size={20} className="text-indigo-400" />} label="Forecast Accuracy" value={storeMetrics.forecastAccuracy} unit="%" trend="+1.4%" trendUp={true} color="bg-indigo-500/15" />
        <MetricCard icon={<AlertTriangle size={20} className="text-red-400" />} label="Active Alerts" value={storeMetrics.alertsToday} trend="-5" trendUp={true} color="bg-red-500/15" />
        <MetricCard icon={<Camera size={20} className="text-teal-400" />} label="Detection mAP" value={(detectionMetrics.mAP * 100).toFixed(1)} unit="%" trend="+0.3%" trendUp={true} color="bg-teal-500/15" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Stockout Events & Resolution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stockoutTrend}>
              <defs>
                <linearGradient id="stockoutGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="stockouts" stroke="#ef4444" fill="url(#stockoutGrad)" strokeWidth={2} name="Stockouts" />
              <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="url(#resolvedGrad)" strokeWidth={2} name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Stock Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stockStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {stockStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {stockStatusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#94a3b8' }} width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="inStock" fill="#3b82f6" name="In-Stock %" radius={[0, 4, 4, 0]} barSize={12} />
              <Bar dataKey="compliance" fill="#8b5cf6" name="Compliance %" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Alerts</h3>
            <span className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">View All →</span>
          </div>
          <div className="space-y-3">
            {recentAlerts.map(alert => (
              <div key={alert.id} className={`p-3 rounded-lg border transition-all hover:border-opacity-50 ${
                alert.priority === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                alert.priority === 'high' ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-blue-500/5 border-blue-500/20'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className={
                      alert.priority === 'critical' ? 'text-red-400 mt-0.5' :
                      alert.priority === 'high' ? 'text-amber-400 mt-0.5' : 'text-blue-400 mt-0.5'
                    } />
                    <div>
                      <p className="text-xs font-semibold text-white">{alert.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{alert.description}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-slate-500">{alert.location}</span>
                        <span className="text-[10px] text-emerald-400">${alert.revenueImpact.toFixed(0)} impact</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    alert.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                    alert.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>{alert.priority}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <h4 className="text-xs font-semibold text-slate-400 mb-3">CV Model Performance</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/50 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-blue-400">{(detectionMetrics.mAP * 100).toFixed(1)}%</p>
                <p className="text-[10px] text-slate-500">Detection mAP</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-purple-400">{(detectionMetrics.skuAccuracy * 100).toFixed(1)}%</p>
                <p className="text-[10px] text-slate-500">SKU Accuracy</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-cyan-400">{detectionMetrics.inferenceTime}ms</p>
                <p className="text-[10px] text-slate-500">Inference Time</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-emerald-400">{(detectionMetrics.falsePositiveRate * 100).toFixed(1)}%</p>
                <p className="text-[10px] text-slate-500">False Positive Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}