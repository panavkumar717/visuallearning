"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { VisualElement } from "@/types/teachscript";
import { VIRTUAL_CANVAS_WIDTH, VIRTUAL_CANVAS_HEIGHT, clampScale } from "@/lib/utils/coordinates";
import { TextRenderer } from "./renderers/TextRenderer";
import { ShapeRenderer } from "./renderers/ShapeRenderer";
import { EquationRenderer } from "./renderers/EquationRenderer";
import { ArrayRenderer } from "./renderers/ArrayRenderer";
import { GraphRenderer } from "./renderers/GraphRenderer";
import { FlowchartRenderer } from "./renderers/FlowchartRenderer";
import { ArrowRenderer } from "./renderers/ArrowRenderer";
import { DiagramRenderer } from "./renderers/DiagramRenderer";
import { HighlightRenderer } from "./renderers/AnimationRenderer";

interface CanvasStageProps {
  visuals: VisualElement[];
  selectedId?: string | null;
  onSelectElement?: (id: string | null) => void;
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  offset: { x: number; y: number };
  setOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  showGrid?: boolean;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  visuals,
  selectedId,
  onSelectElement,
  scale,
  setScale,
  offset,
  setOffset,
  showGrid = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const newScale = clampScale(scale * zoomFactor, 0.4, 2.5);

      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Adjust offset so zoom centers on mouse
      const newOffsetX = mouseX - (mouseX - offset.x) * (newScale / scale);
      const newOffsetY = mouseY - (mouseY - offset.y) * (newScale / scale);

      setScale(newScale);
      setOffset({ x: newOffsetX, y: newOffsetY });
    },
    [scale, offset, setScale, setOffset]
  );

  // Pan drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking canvas background (not an object)
    if ((e.target as HTMLElement).tagName === "svg" || (e.target as HTMLElement).id === "canvas-bg") {
      setIsPanning(true);
      setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      onSelectElement?.(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setOffset({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Render individual element with correct renderer
  const renderVisualElement = (element: VisualElement) => {
    const isSelected = selectedId === element.id;
    const onClick = () => onSelectElement?.(element.id);

    switch (element.type) {
      case "text":
        return (
          <TextRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      case "shape":
        return (
          <ShapeRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      case "equation":
        return (
          <EquationRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      case "array":
        return (
          <ArrayRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      case "graph":
        return (
          <GraphRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      case "flowchart":
        return (
          <FlowchartRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      case "arrow":
        return (
          <ArrowRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      case "diagram":
        return (
          <DiagramRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onClick={onClick}
          />
        );
      case "highlight":
        return <HighlightRenderer key={element.id} element={element} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full overflow-hidden select-none bg-[#fbfcfd] ${
        isPanning ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <svg
        id="canvas-svg"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Whiteboard Dot Grid Pattern */}
          <pattern
            id="whiteboard-dots"
            x={offset.x % (30 * scale)}
            y={offset.y % (30 * scale)}
            width={30 * scale}
            height={30 * scale}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={2}
              cy={2}
              r={1.2 * Math.max(0.6, scale * 0.8)}
              fill="#cbd5e1"
              opacity={showGrid ? 0.7 : 0}
            />
          </pattern>
        </defs>

        {/* Canvas Background with Pattern */}
        <rect
          id="canvas-bg"
          width="100%"
          height="100%"
          fill="url(#whiteboard-dots)"
        />

        {/* Zoomed and Panned Canvas Container */}
        <g
          id="canvas-transform-group"
          transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}
        >
          {/* Virtual whiteboard canvas border hint */}
          <rect
            x={0}
            y={0}
            width={VIRTUAL_CANVAS_WIDTH}
            height={VIRTUAL_CANVAS_HEIGHT}
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth={1}
            strokeDasharray="6 6"
            className="pointer-events-none"
          />

          {/* Visual Elements List */}
          {visuals.map((visual) => renderVisualElement(visual))}
        </g>
      </svg>
    </div>
  );
};
