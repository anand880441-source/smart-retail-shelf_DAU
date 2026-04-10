import React, { useState } from 'react';
import {
  Grid3X3, CheckCircle, AlertTriangle, XCircle, 
  Camera, ArrowRight, Info, Search
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell
} from 'recharts';
import { usePlanograms } from '../hooks/useApiData';

export default function PlanogramPage() {
  const { data: planograms, loading } = usePlanograms();
  const [selectedAisle, setSelectedAisle] = useState(planograms[0]?.aisleId || 'A1');

  const currentAisle = planograms.find(p => p.aisleId === selectedAisle);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading Planograms...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Planogram Compliance</h2>
          <p className="text-sm text-slate-400 mt-1">Automated shelf verification via Computer Vision</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search SKU or Aisle..." className="pl-9 pr-4 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-blue-500 transition-all w-60" />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-xs">
            <Camera size={14} /> Trigger Manual Scan
          </button>
        </div>
      </div>

      {/* Aisle Selection & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-2">
          {planograms.map(p => (
            <button
              key={p.aisleId}
              onClick={() => setSelectedAisle(p.aisleId)}
              className={`w-full p-4 rounded-xl border transition-all text-left ${
                selectedAisle === p.aisleId
                  ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-sm">{p.aisleName}</p>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  p.overallScore >= 90 ? 'bg-emerald-500/20 text-emerald-400' : 
                  p.overallScore >= 80 ? 'bg-amber-500/20 text-amber-400' : 
                  'bg-red-500/20 text-red-400'
                }`}>{p.overallScore}%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${
                  p.overallScore >= 90 ? 'bg-emerald-500' : 
                  p.overallScore >= 80 ? 'bg-amber-500' : 
                  'bg-red-500'
                }`} style={{ width: `${p.overallScore}%` }} />
              </div>
              <p className="text-[10px] mt-2 text-slate-500">
                {p.compliantProducts} / {p.totalProducts} compliant facings
              </p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-4">
          {/* Main Visualizer Placeholder */}
          <div className="glass-card rounded-xl p-6 relative min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white">Visual Verification: {currentAisle?.aisleName}</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" /> Compliant
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50" /> Misplaced
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50" /> Missing
                </div>
              </div>
            </div>

            {/* Mock Shelf Visualization */}
            <div className="space-y-4">
              {[...Array(3)].map((_, shelfIdx) => (
                <div key={shelfIdx} className="relative h-24 bg-slate-800/30 border border-slate-700 rounded-lg flex items-end px-4 gap-2 border-b-4 border-b-slate-600">
                  <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold">L{3-shelfIdx}</span>
                  {[...Array(8)].map((_, prodIdx) => {
                    const status = Math.random() > 0.8 ? (Math.random() > 0.5 ? 'misplaced' : 'missing') : 'compliant';
                    return (
                      <div
                        key={prodIdx}
                        className={`w-12 rounded-t-sm transition-all relative group cursor-help ${
                          status === 'compliant' ? 'h-16 bg-blue-500/20 border border-blue-500/40' :
                          status === 'misplaced' ? 'h-16 bg-amber-500/20 border border-amber-500/40' :
                          'h-4 bg-red-500/20 border border-red-500/40'
                        }`}
                      >
                        {status !== 'compliant' && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                            {status.toUpperCase()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={14} className="text-blue-400" />
                  <h4 className="text-xs font-semibold text-white">Detection Metrics</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Last Scan</p>
                    <p className="text-sm font-medium text-slate-200">2 mins ago</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Confidence</p>
                    <p className="text-sm font-medium text-emerald-400">98.5%</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-amber-400" />
                  <h4 className="text-xs font-semibold text-white">Active Violations</h4>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">2 Missing</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">1 Misplaced</span>
                  </div>
                  <button className="text-[10px] text-blue-400 hover:underline">View All Violations</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}