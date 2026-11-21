"use client";

import React from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
  Grid,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface WhiteboardToolbarProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  onClearCanvas: () => void;
  objectCount: number;
}

export const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onResetView,
  showGrid,
  onToggleGrid,
  onClearCanvas,
  objectCount,
}) => {
  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 transition-all">
      {/* Zoom Out */}
      <button
        onClick={onZoomOut}
        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {/* Current Zoom Level */}
      <span className="text-xs font-semibold text-slate-600 min-w-[42px] text-center select-none">
        {Math.round(scale * 100)}%
      </span>

      {/* Zoom In */}
      <button
        onClick={onZoomIn}
        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        title="Zoom In"
        aria-label="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-200 mx-1" />

      {/* Fit to Screen */}
      <button
        onClick={onResetView}
        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        title="Reset Zoom & Pan"
        aria-label="Reset View"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      {/* Toggle Grid */}
      <button
        onClick={onToggleGrid}
        className={`p-2 rounded-xl transition-colors ${
          showGrid
            ? "text-blue-600 bg-blue-50"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
        title="Toggle Whiteboard Grid"
        aria-label="Toggle Grid"
      >
        <Grid className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-200 mx-1" />

      {/* Reset/Clear */}
      <button
        onClick={onClearCanvas}
        className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        title="Reset Whiteboard"
        aria-label="Reset Canvas"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {/* Object Badge */}
      <div className="hidden sm:flex items-center gap-1 pl-2 pr-2.5 py-1 bg-slate-100 rounded-xl text-[11px] font-medium text-slate-500">
        <Sparkles className="w-3 h-3 text-blue-500" />
        <span>{objectCount} visuals</span>
      </div>
    </div>
  );
};
