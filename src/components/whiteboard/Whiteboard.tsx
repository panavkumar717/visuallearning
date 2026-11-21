"use client";

import React, { useState, useEffect } from "react";
import { VisualElement } from "@/types/teachscript";
import { CanvasStage } from "./CanvasStage";
import { WhiteboardToolbar } from "./WhiteboardToolbar";
import { clampScale, VIRTUAL_CANVAS_WIDTH, VIRTUAL_CANVAS_HEIGHT } from "@/lib/utils/coordinates";

interface WhiteboardProps {
  visuals: VisualElement[];
  onClearCanvas?: () => void;
  title?: string;
  subject?: string;
}

export const Whiteboard: React.FC<WhiteboardProps> = ({
  visuals,
  onClearCanvas,
  title,
  subject,
}) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 50, y: 50 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  // Auto-fit virtual whiteboard to screen on mount and window resize
  const resetView = () => {
    setScale(1);
    setOffset({ x: 40, y: 40 });
  };

  const handleZoomIn = () => {
    setScale((prev) => clampScale(prev * 1.15));
  };

  const handleZoomOut = () => {
    setScale((prev) => clampScale(prev * 0.85));
  };

  const handleClear = () => {
    if (onClearCanvas) {
      onClearCanvas();
    }
    setSelectedId(null);
  };

  // Find selected visual for bottom status banner
  const selectedElement = visuals.find((v) => v.id === selectedId);

  return (
    <div className="relative w-full h-full flex flex-col bg-white overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm">
      {/* Top Floating Whiteboard Toolbar */}
      <WhiteboardToolbar
        scale={scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={resetView}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((prev) => !prev)}
        onClearCanvas={handleClear}
        objectCount={visuals.length}
      />

      {/* Main Canvas Stage */}
      <div className="flex-1 w-full h-full">
        <CanvasStage
          visuals={visuals}
          selectedId={selectedId}
          onSelectElement={setSelectedId}
          scale={scale}
          setScale={setScale}
          offset={offset}
          setOffset={setOffset}
          showGrid={showGrid}
        />
      </div>

      {/* Selected Element Quick Inspector Banner */}
      {selectedElement && (
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 px-4 py-2 bg-slate-900/90 text-white backdrop-blur-md rounded-xl text-xs shadow-lg animate-fade-in">
          <div className="flex items-center gap-1.5 font-semibold text-blue-400 uppercase tracking-wider text-[10px]">
            <span>{selectedElement.type}</span>
          </div>
          <span className="text-slate-400">|</span>
          <span className="text-slate-200">ID: {selectedElement.id}</span>
          {selectedElement.label && (
            <>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-400 font-medium">
                {selectedElement.label}
              </span>
            </>
          )}
          <button
            onClick={() => setSelectedId(null)}
            className="ml-2 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
