import React, { useState } from 'react';
import {
  TrendingUp, Clock, AlertCircle, ShoppingCart, 
  ArrowRight, Download, Calendar, Filter
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, BarChart, Bar
} from 'recharts';
import { products, replenishOrders } from '../data/mockData';

export default function ForecastingPage() {
  const [selectedRegion, setSelectedRegion] = useState('downtown');
  
  // Mock forecast data for dairy category
  const forecastData = [
    { date: '2024-04-01', actual: 450, predicted: 420, confidence: [400, 440] },
    { date: '2024-04-02', actual: 380, predicted: 390, confidence: [370, 410] },
    { date: '2024-04-03', actual: 520, predicted: 500, confidence: [480, 520] },
    { date: '2024-04-04', actual: 440, predicted: 460, confidence: [440, 480] },
    { date: '2024-04-05', actual: null, predicted: 580, confidence: [540, 620] },
    { date: '2024-04-06', actual: null, predicted: 640, confidence: [600, 680] },
    { date: '2024-04-07', actual: null, predicted: 490, confidence: [450, 530] },
  ];

  const seasonalTrend = [
    { name: 'Mon', demand: 2400 },
    { name: 'Tue', demand: 2100 },
    { name: 'Wed', demand: 2200 },
    { name: 'Thu', demand: 2600 },
    { name: 'Fri', demand: 3200 },
    { name: 'Sat', demand: 4100 },
    { name: 'Sun', demand: 3800 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Demand Forecasting</h2>
          <p className="text-sm text-slate-400 mt-1">Predictive inventory management powered by seasonal AI models</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs">
            <Download size={14} /> Export Report
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-xs">
            <ShoppingCart size={14} /> Batch Replenish
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="glass-card rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500" />
            <span className="text-xs text-slate-400">Category:</span>
            <select className="bg-slate-800 border-none rounded px-2 py-1 text-xs text-white outline-none">
              <option>Dairy & Eggs</option>
              <option>Produce</option>
              <option>Bakery</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-500" />
            <span className="text-xs text-slate-400">Horizon:</span>
            <select className="bg-slate-800 border-none rounded px-2 py-1 text-xs text-white outline-none">
              <option>7 Days</option>
              <option>14 Days</option>
              <option>30 Days</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> Model: XGBoost-v2
          <span className="mx-2 text-slate-700">|</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Accuracy: 94.2%
        </div>
      </div>

      {/* Main Forecast Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-white">7-Day Demand Forecast: Dairy Category</h3>
            <div className="flex items-center gap-4 text-[10px]">
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-400" /> Historical</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500" /> Predicted</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500/10" /> Confidence Interval</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="confidence" stroke="none" fill="#3b82f6" fillOpacity={0.1} name="Confidence CI (95%)" />
              <Line type="monotone" dataKey="actual" stroke="#94a3b8" strokeWidth={2} dot={{ r: 4 }} name="Actual Sales" />
              <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#3b82f6' }} name="Predicted Demand" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Stockout Risk Analysis</h3>
            <div className="space-y-4">
              {[
                { name: 'Fresh Milk 1L', risk: 85, days: 1 },
                { name: 'Greek Yogurt 500g', risk: 62, days: 2 },
                { name: 'Salted Butter 250g', risk: 38, days: 4 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">{item.name}</span>
                    <span className={item.risk > 70 ? 'text-red-400' : 'text-amber-400'}>{item.risk}% risk</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${item.risk > 70 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${item.risk}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Projected out of stock in ~{item.days} days</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Replenishment Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                <p className="text-lg font-bold text-blue-400">12</p>
                <p className="text-[10px] text-slate-500">Urgent Orders</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-lg font-bold text-emerald-400">845</p>
                <p className="text-[10px] text-slate-500">Units Required</p>
              </div>
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all text-xs border border-slate-700">
              View All Orders <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Replenishment */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Suggested Replenishment Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Product / SKU</th>
                <th className="text-center py-3 px-4 text-slate-500 font-medium">Demand Forecast</th>
                <th className="text-center py-3 px-4 text-slate-500 font-medium">Level / ROP</th>
                <th className="text-center py-3 px-4 text-slate-500 font-medium">Priority</th>
                <th className="text-right py-3 px-4 text-slate-500 font-medium">Order Quantity</th>
              </tr>
            </thead>
            <tbody>
              {replenishOrders.map((order, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <p className="text-slate-200 font-medium">{order.product}</p>
                    <p className="text-[10px] text-slate-500">{order.sku}</p>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-300">
                    42 units / day <span className="text-[10px] text-emerald-400 ml-1">↑ 12%</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-16 h-1 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-blue-400" style={{ width: '35%' }} />
                      </div>
                      <span className="text-[10px] text-slate-500">12 / 85 units</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      order.priority === 'urgent' ? 'bg-red-500/15 text-red-400' :
                      order.priority === 'high' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-blue-500/15 text-blue-400'
                    }`}>{order.priority.toUpperCase()}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-slate-200 font-bold">{order.quantity}</span>
                      <button className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-500">
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}