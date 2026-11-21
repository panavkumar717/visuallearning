"use client";

import React from "react";
import { ArrowVisualElement } from "@/types/teachscript";
import { calculateArrowHead } from "@/lib/utils/canvas-utils";

interface ArrowRendererProps {
  element: ArrowVisualElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ArrowRenderer: React.FC<ArrowRendererProps> = ({
  element,
  isSelected,
  onClick,
}) => {
  const {
    id,
    from,
    to,
    color = "#3b82f6",
    strokeWidth = 2.5,
    dashed = false,
    directed = true,
    curve = "straight",
    pointerSize = 12,
    label,
    opacity = 1,
  } = element;

  const head = calculateArrowHead(from.x, from.y, to.x, to.y, pointerSize);

  let pathD = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  if (curve === "arc") {
    const midX = (from.x + to.x) / 2 - (to.y - from.y) * 0.2;
    const midY = (from.y + to.y) / 2 + (to.x - from.x) * 0.2;
    pathD = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
  }

  const labelX = (from.x + to.x) / 2;
  const labelY = (from.y + to.y) / 2 - 10;

  return (
    <g
      id={id}
      opacity={opacity}
      onClick={onClick}
      className="cursor-pointer font-sans"
    >
      <path
        d={pathD}
        fill="none"
        stroke={isSelected ? "#2563eb" : color}
        strokeWidth={isSelected ? strokeWidth + 1.5 : strokeWidth}
        strokeDasharray={dashed ? "5 5" : undefined}
      />

      {directed && (
        <polygon
          points={`${to.x},${to.y} ${head.p1.x},${head.p1.y} ${head.p2.x},${head.p2.y}`}
          fill={isSelected ? "#2563eb" : color}
        />
      )}

      {label && (
        <text
          x={labelX}
          y={labelY}
          fill={color}
          fontSize={12}
          fontWeight="bold"
          textAnchor="middle"
          className="select-none"
        >
          {label}
        </text>
      )}
    </g>
  );
};
