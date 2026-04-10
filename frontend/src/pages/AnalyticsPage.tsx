import React, { useState } from 'react';
import {
  BarChart3, TrendingUp, Target, DollarSign
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend, ComposedChart, Area
} from 'recharts';
import { complianceTrend, stockoutTrend, categoryPerformance, generateHeatmapData } from '../data/mockData';
import { useAnalytics, useDashboardStats } from '../hooks/useApiData';

function Heatmap() {
  const data = generateHeatmapData();
  const aisles = [...new Set(data.map(d => d.aisle))];
  const hours = [...new Set(data.map(d => d.hour))].sort((a, b) => a - b);
  const [hoveredCell, setHoveredCell] = useState<{ aisle: string; hour: number; value: number } | null>(null);

  const getColor = (value: number) => {
    if (value >= 8) return 'bg-red-500/80';
    if (value >= 6) return 'bg-orange-500/60';
    if (value >= 4) return 'bg-amber-500/50';
    if (value >= 2) return 'bg-yellow-500/30';
    return 'bg-emerald-500/20';
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="flex">
          <div className="w-20" />
          {hours.map(h => (
            <div key={h} className="flex-1 text-center text-[9px] text-slate-500 pb-1">
              {h}:00
            </div>
          ))}
        </div>
        {/* Grid */}
        {aisles.map(aisle => (
          <div key={aisle} className="flex items-center gap-0.5 mb-0.5">
            <div className="w-20 text-right pr-2 text-[10px] text-slate-400">{aisle}</div>
            {hours.map(hour => {
              const cell = data.find(d => d.aisle === aisle && d.hour === hour);
              const value = cell?.value || 0;
              return (
                <div
                  key={hour}
                  onMouseEnter={() => setHoveredCell({ aisle, hour, value })}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`flex-1 h-7 rounded-sm ${getColor(value)} cursor-pointer transition-all hover:ring-1 hover:ring-white/30 relative`}
                >
                  {hoveredCell?.aisle === aisle && hoveredCell?.hour === hour && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-20 bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-[10px] whitespace-nowrap shadow-xl">
                      <p className="font-semibold text-white">{value.toFixed(1)} stockouts</p>
                      <p className="text-slate-400">{aisle} at {hour}:00</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end text-[9px] text-slate-500">
          <span>Less</span>
          <span className="w-4 h-3 rounded-sm bg-emerald-500/20" />
          <span className="w-4 h-3 rounded-sm bg-yellow-500/30" />
          <span className="w-4 h-3 rounded-sm bg-amber-500/50" />
          <span className="w-4 h-3 rounded-sm bg-orange-500/60" />
          <span className="w-4 h-3 rounded-sm bg-red-500/80" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: storeMetrics } = useDashboardStats();
  const { data: analyticsData } = useAnalytics();
  const [timeRange, setTimeRange] = useState('14d');

  // Revenue recovery data
  const revenueData = [
    { week: 'W1', recovered: 8200, potential: 12000, lost: 3800 },
    { week: 'W2', recovered: 9100, potential: 11500, lost: 2400 },
    { week: 'W3', recovered: 7800, potential: 13200, lost: 5400 },
    { week: 'W4', recovered: 10500, potential: 12800, lost: 2300 },
    { week: 'W5', recovered: 11200, potential: 13500, lost: 2300 },
    { week: 'W6', recovered: 9800, potential: 12100, lost: 2300 },
    { week: 'W7', recovered: 12400, potential: 14000, lost: 1600 },
    { week: 'W8', recovered: 11800, potential: 13200, lost: 1400 },
  ];

  // Forecast accuracy over time
  const forecastAccuracyData = [
    { month: 'Aug', wmape: 14.2, mae: 8.1 },
    { month: 'Sep', wmape: 12.8, mae: 7.4 },
    { month: 'Oct', wmape: 11.5, mae: 6.8 },
    { month: 'Nov', wmape: 13.1, mae: 7.2 },
    { month: 'Dec', wmape: 10.2, mae: 5.9 },
    { month: 'Jan', wmape: 8.3, mae: 4.8 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics & Insights</h2>
          <p className="text-sm text-slate-400 mt-1">Comprehensive performance metrics and trend analysis</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['7d', '14d', '30d', '90d'].map(range => (
            <button key={range} onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeRange === range ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-500 hover:text-slate-300'
              }`}>{range}</button>
          ))}
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-lg p-4 text-center">
          <BarChart3 size={20} className="text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{storeMetrics.shelfHealthScore}</p>
          <p className="text-xs text-slate-500 mt-1">Shelf Health Score</p>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${storeMetrics.shelfHealthScore}%` }} />
          </div>
        </div>
        <div className="glass-card rounded-lg p-4 text-center">
          <Target size={20} className="text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{storeMetrics.planogramCompliance}%</p>
          <p className="text-xs text-slate-500 mt-1">Planogram Compliance</p>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-400" style={{ width: `${storeMetrics.planogramCompliance}%` }} />
          </div>
        </div>
        <div className="glass-card rounded-lg p-4 text-center">
          <TrendingUp size={20} className="text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{storeMetrics.forecastAccuracy}%</p>
          <p className="text-xs text-slate-500 mt-1">Forecast Accuracy</p>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${storeMetrics.forecastAccuracy}%` }} />
          </div>
        </div>
        <div className="glass-card rounded-lg p-4 text-center">
          <DollarSign size={20} className="text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">${(storeMetrics.revenueRecovered / 1000).toFixed(1)}K</p>
          <p className="text-xs text-slate-500 mt-1">Revenue Recovered</p>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400" style={{ width: '78%' }} />
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Stockout Frequency Heatmap (by Aisle & Time of Day)</h3>
        <Heatmap />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Compliance Trend */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Planogram Compliance Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={complianceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="compliance" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} name="Compliance %" />
              <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Target" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Recovery */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue Recovery Through Faster Replenishment</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `$${v / 1000}K`} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => `$${Number(v).toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="recovered" fill="#10b981" name="Recovered" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="lost" fill="#ef4444" name="Lost" radius={[4, 4, 0, 0]} barSize={20} opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stockout Resolution */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Stockout Resolution Performance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={stockoutTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} unit=" min" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar yAxisId="left" dataKey="stockouts" fill="#ef4444" name="Stockouts" barSize={16} radius={[4, 4, 0, 0]} opacity={0.6} />
              <Bar yAxisId="left" dataKey="resolved" fill="#10b981" name="Resolved" barSize={16} radius={[4, 4, 0, 0]} opacity={0.6} />
              <Line yAxisId="right" type="monotone" dataKey="avgTime" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Avg Resolution Time" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast Accuracy */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Demand Forecast Accuracy Metrics</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={forecastAccuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="wmape" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="WMAPE %" />
              <Line type="monotone" dataKey="mae" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="MAE %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Table */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Category Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-2.5 px-3 text-slate-500 font-medium">Category</th>
                <th className="text-center py-2.5 px-3 text-slate-500 font-medium">In-Stock Rate</th>
                <th className="text-center py-2.5 px-3 text-slate-500 font-medium">Compliance</th>
                <th className="text-right py-2.5 px-3 text-slate-500 font-medium">Revenue ($)</th>
                <th className="text-center py-2.5 px-3 text-slate-500 font-medium">Health</th>
              </tr>
            </thead>
            <tbody>
              {categoryPerformance.map((cat, i) => {
                const health = (cat.inStock + cat.compliance) / 2;
                return (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-slate-200 font-medium">{cat.category}</td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full rounded-full bg-blue-400" style={{ width: `${cat.inStock}%` }} />
                        </div>
                        <span className={`font-medium ${cat.inStock >= 95 ? 'text-emerald-400' : cat.inStock >= 90 ? 'text-amber-400' : 'text-red-400'}`}>{cat.inStock}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full rounded-full bg-purple-400" style={{ width: `${cat.compliance}%` }} />
                        </div>
                        <span className={`font-medium ${cat.compliance >= 90 ? 'text-emerald-400' : cat.compliance >= 80 ? 'text-amber-400' : 'text-red-400'}`}>{cat.compliance}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-200 font-medium">${cat.revenue.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        health >= 90 ? 'bg-emerald-500/15 text-emerald-400' :
                        health >= 80 ? 'bg-amber-500/15 text-amber-400' :
                        'bg-red-500/15 text-red-400'
                      }`}>{health >= 90 ? 'Excellent' : health >= 80 ? 'Good' : 'Needs Work'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}