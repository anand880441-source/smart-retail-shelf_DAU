import React, { useState } from 'react';
import {
  Map, ZoomIn, ZoomOut, Layers, Navigation,
  Package, AlertTriangle, ShieldCheck, Info
} from 'lucide-react';
import { shelfSections } from '../data/mockData';

export default function ShelfMapPage() {
  const [selectedSection, setSelectedSection] = useState(shelfSections[0]);
  const [activeLayer, setActiveLayer] = useState<'stock' | 'compliance' | 'revenue'>('stock');

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Interactive Store Map</h2>
          <p className="text-sm text-slate-400 mt-1">Digital twin of store floor plan with real-time health data</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            {['stock', 'compliance', 'revenue'].map(layer => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer as any)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                  activeLayer === layer ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {layer}
              </button>
            ))}
          </div>
          <button className="p-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"><Layers size={16} /></button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-4">
        {/* Map Area */}
        <div className="flex-1 glass-card rounded-2xl relative overflow-hidden bg-slate-900/40">
          <div className="absolute inset-0 p-8">
            <div className="w-full h-full relative border-2 border-slate-700/50 rounded-xl bg-slate-950/30">
              {/* Mock Floor Plan Rendering */}
              {shelfSections.map(section => (
                <div
                  key={section.id}
                  onClick={() => setSelectedSection(section)}
                  style={{
                    left: `${section.x}%`,
                    top: `${section.y}%`,
                    width: `${section.width}%`,
                    height: `${section.height}%`,
                  }}
                  className={`absolute rounded border-2 transition-all cursor-pointer group ${
                    selectedSection.id === section.id 
                      ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20 z-10' 
                      : 'border-slate-700 bg-slate-800/40 hover:border-slate-500'
                  }`}
                >
                  <div className={`absolute inset-0 opacity-40 transition-colors ${
                    activeLayer === 'stock' ? (
                      section.stockLevel === 'full' ? 'bg-emerald-500' :
                      section.stockLevel === 'low' ? 'bg-amber-500' : 'bg-red-500'
                    ) : activeLayer === 'compliance' ? (
                      section.healthScore >= 90 ? 'bg-blue-500' : 'bg-orange-500'
                    ) : 'bg-purple-500'
                  }`} />
                  <span className="absolute -top-5 left-0 text-[9px] font-bold text-slate-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {section.name}
                  </span>
                </div>
              ))}

              {/* Navigation Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-5" 
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            </div>
          </div>

          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="p-2 rounded-lg bg-slate-800/90 text-slate-200 border border-white/10 shadow-xl hover:bg-slate-700"><ZoomIn size={18} /></button>
            <button className="p-2 rounded-lg bg-slate-800/90 text-slate-200 border border-white/10 shadow-xl hover:bg-slate-700"><ZoomOut size={18} /></button>
          </div>

          <div className="absolute top-4 left-4 flex gap-4 text-[10px] bg-slate-900/80 backdrop-blur px-3 py-2 rounded-lg border border-white/5">
             <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Healthy</div>
             <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Attention</div>
             <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-80 space-y-4 flex flex-col">
          <div className="glass-card rounded-2xl p-5 border-blue-500/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedSection.name}</h3>
                <p className="text-xs text-slate-500">{selectedSection.aisle}</p>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                selectedSection.healthScore >= 90 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {selectedSection.healthScore >= 90 ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-800/50 p-2.5 rounded-xl text-center">
                <p className="text-xl font-bold text-white">{selectedSection.products}</p>
                <p className="text-[10px] text-slate-500">Products Tracked</p>
              </div>
              <div className="bg-slate-800/50 p-2.5 rounded-xl text-center">
                <p className="text-xl font-bold text-blue-400">{selectedSection.healthScore}%</p>
                <p className="text-[10px] text-slate-500">Health Index</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status Overview</h4>
              <div className="flex justify-between text-xs items-center">
                <span className="text-slate-400">Stock Status</span>
                <span className={`font-semibold capitalize ${
                  selectedSection.stockLevel === 'full' ? 'text-emerald-400' : 'text-amber-400'
                }`}>{selectedSection.stockLevel}</span>
              </div>
              <div className="flex justify-between text-xs items-center">
                <span className="text-slate-400">Active Alerts</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedSection.alerts > 0 ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-500'
                }`}>{selectedSection.alerts}</span>
              </div>
            </div>

            <button className="w-full mt-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs transition-all hover:bg-blue-500 flex items-center justify-center gap-2">
              <Navigation size={14} /> Open Live Feed
            </button>
          </div>

          <div className="flex-1 glass-card rounded-2xl p-5 overflow-hidden flex flex-col">
            <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
              <Package size={14} className="text-blue-400" /> Top Missing SKUs
            </h4>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-none">
              {[
                { name: 'Fresh Milk 1L', sku: 'BV-7721', impact: 420 },
                { name: 'Red Apples 1kg', sku: 'PN-5512', impact: 156 },
                { name: 'Greek Yogurt', sku: 'BV-8832', impact: 84 },
                { name: 'Butter Croissant', sku: 'BK-2291', impact: 45 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/30 border border-slate-700/30 group hover:border-slate-600 transition-all">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-red-400">-${item.impact}</p>
                    <button className="text-[8px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Replenish</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-500">
              <Info size={12} /> Data updated 28s ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}