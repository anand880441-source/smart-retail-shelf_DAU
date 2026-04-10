import React, { useState, useEffect } from 'react';
import {
  Camera, Zap, Maximize2, RefreshCw, BarChart, 
  Settings, ChevronRight, Activity, Cpu, AlertTriangle
} from 'lucide-react';
import { shelfDetections, detectionMetrics } from '../data/mockData';

export default function ShelfAnalysis() {
  const [activeCamera, setActiveCamera] = useState('CAM-01');
  const [isProcessing, setIsProcessing] = useState(true);
  const [overlayEnabled, setOverlayEnabled] = useState(true);

  useEffect(() => {
    // Simulate model inference
    const interval = setInterval(() => {
      setIsProcessing(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Shelf Analysis</h2>
          <p className="text-sm text-slate-400 mt-1">Edge-processed computer vision feed with real-time SKU detection</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
            <Zap size={14} className="animate-pulse" /> Processing Live
          </div>
          <button className="p-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"><Maximize2 size={16} /></button>
          <button className="p-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"><Settings size={16} /></button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-4">
        {/* Main Viewport */}
        <div className="flex-1 glass-card rounded-2xl overflow-hidden relative bg-slate-950 flex flex-col">
          {/* Header Overlay */}
          <div className="absolute top-0 inset-x-0 p-4 z-10 bg-gradient-to-b from-slate-950/80 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="px-3 py-1 bg-slate-900/90 rounded border border-white/10 text-[10px] font-mono text-blue-400">
                  {activeCamera} • LIVE 
               </div>
               <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Activity size={12} className="text-emerald-500" /> 1080p @ 30fps
               </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Overlay:</span>
              <button 
                onClick={() => setOverlayEnabled(!overlayEnabled)}
                className={`w-8 h-4 rounded-full transition-all relative ${overlayEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${overlayEnabled ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Video Feed Component */}
          <div className="flex-1 relative group cursor-crosshair">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover opacity-60 grayscale-[0.3]"
              alt="Live Feed"
            />
            
            {/* Detection Overlays */}
            {overlayEnabled && shelfDetections.map((det, i) => (
              <div 
                key={det.id}
                className={`absolute border-2 transition-all duration-300 ${
                  det.compliant ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-red-500/70 bg-red-500/10'
                }`}
                style={{
                  left: `${det.position.x}%`,
                  top: `${det.position.y}px`,
                  width: `${det.position.width}px`,
                  height: `${det.position.height}px`,
                }}
              >
                <div className={`absolute -top-5 left-0 px-1 text-[9px] font-bold text-white whitespace-nowrap ${
                  det.compliant ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                  {det.product.name} • {Math.round(det.confidence * 100)}%
                </div>
                {det.stockLevel === 'empty' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/40 backdrop-blur-[2px]">
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Stockout</span>
                  </div>
                )}
                {!det.compliant && det.stockLevel !== 'empty' && (
                  <div className="absolute inset-0 bg-amber-500/10 border-2 border-dashed border-amber-500/50 flex items-start justify-end p-1">
                     <AlertTriangle size={10} className="text-amber-500" />
                  </div>
                )}
              </div>
            ))}

            {/* Scanning Line Effect */}
            <div className="absolute inset-x-0 h-0.5 bg-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] scan-line pointer-events-none" />
            
            {/* Center Crosshair */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/5 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/5 pointer-events-none" />
          </div>

          {/* Processing Indicator */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {isProcessing && (
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/90 rounded-full border border-blue-500/30 text-[10px] text-blue-400">
                <RefreshCw size={10} className="animate-spin" /> Inferring SKUs...
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Controls & Metrics */}
        <div className="w-80 flex flex-col gap-4">
          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Feed Selection</h3>
            <div className="space-y-2">
              {['CAM-01', 'CAM-02', 'CAM-03', 'BACK-01'].map(id => (
                <button 
                  key={id}
                  onClick={() => setActiveCamera(id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    activeCamera === id ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' : 'bg-slate-800/40 border-slate-700/50 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Camera size={14} />
                    <span className="text-xs font-semibold">{id}</span>
                  </div>
                  {activeCamera === id && <ChevronRight size={14} />}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inference Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 p-3 rounded-xl">
                 <p className="text-[10px] text-slate-500 mb-1">Inference</p>
                 <p className="text-lg font-bold text-white tracking-tight">{detectionMetrics.inferenceTime}ms</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl">
                 <p className="text-[10px] text-slate-500 mb-1">Precision</p>
                 <p className="text-lg font-bold text-emerald-400 tracking-tight">96%</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Edge Node:</span>
                <span className="text-slate-300 font-mono">Retail-Edge-04</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Model:</span>
                <span className="text-slate-300 font-mono">YOLOv8-Retail-L</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Last SKU Sync:</span>
                <span className="text-slate-300">14:02:11</span>
              </div>
            </div>
          </div>

          <div className="flex-1 glass-card rounded-2xl p-4 flex flex-col min-h-0">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
               <Cpu size={14} /> Detections Log
             </h3>
             <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-none text-[10px]">
                {shelfDetections.slice(0, 8).map((det, i) => (
                  <div key={i} className={`p-2 rounded-lg border flex items-center justify-between ${
                    det.compliant ? 'bg-slate-800/50 border-slate-700/50' : 'bg-red-500/5 border-red-500/20'
                  }`}>
                    <div>
                      <span className="font-semibold text-slate-200">{det.product.name}</span>
                      <p className="text-slate-500">Confidence: {Math.round(det.confidence * 100)}%</p>
                    </div>
                    {!det.compliant && <span className="text-red-400 font-bold uppercase">Alert</span>}
                  </div>
                ))}
             </div>
             <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all text-xs border border-slate-700">
                <BarChart size={12} /> Analytics Report
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
