"use client";

import React from "react";
import { ArrayVisualElement } from "@/types/teachscript";

interface ArrayRendererProps {
  element: ArrayVisualElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ArrayRenderer: React.FC<ArrayRendererProps> = ({
  element,
  isSelected,
  onClick,
}) => {
  const {
    id,
    x,
    y,
    values,
    cellWidth = 56,
    cellHeight = 56,
    highlightedIndices = [],
    highlightColor = "#3B82F6",
    activeIndex,
    pointers = [],
    label,
    opacity = 1,
  } = element;

  return (
    <g
      id={id}
      transform={`translate(${x}, ${y})`}
      opacity={opacity}
      onClick={onClick}
      className="cursor-pointer font-sans"
    >
      {/* Optional array label */}
      {label && (
        <text
          x={0}
          y={-12}
          fill="#475569"
          fontSize={14}
          fontWeight="bold"
          className="select-none"
        >
          {label}
        </text>
      )}

      {/* Array Cells */}
      {values.map((val, idx) => {
        const isHighlighted = highlightedIndices.includes(idx);
        const isActive = activeIndex === idx;
        const cellX = idx * (cellWidth + 4);

        let cellFill = "#ffffff";
        let cellStroke = "#cbd5e1";
        let textColor = "#1e293b";

        if (isActive) {
          cellFill = "#dbeafe";
          cellStroke = "#2563eb";
          textColor = "#1d4ed8";
        } else if (isHighlighted) {
          cellFill = `${highlightColor}20`;
          cellStroke = highlightColor;
          textColor = highlightColor;
        }

        return (
          <g key={idx} transform={`translate(${cellX}, 0)`}>
            {/* Cell Box */}
            <rect
              width={cellWidth}
              height={cellHeight}
              rx={8}
              ry={8}
              fill={cellFill}
              stroke={isSelected && isActive ? "#2563eb" : cellStroke}
              strokeWidth={isActive || isHighlighted ? 2.5 : 1.5}
              className="transition-colors duration-200"
            />

            {/* Value */}
            <text
              x={cellWidth / 2}
              y={cellHeight / 2 + 6}
              textAnchor="middle"
              fill={textColor}
              fontSize={18}
              fontWeight="bold"
              className="select-none"
            >
              {val}
            </text>

            {/* Index label below */}
            <text
              x={cellWidth / 2}
              y={cellHeight + 18}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize={11}
              fontWeight="500"
              className="select-none"
            >
              [{idx}]
            </text>
          </g>
        );
      })}

      {/* Pointers (e.g., low, mid, high) */}
      {pointers.map((pointer, pIdx) => {
        const targetX = pointer.index * (cellWidth + 4) + cellWidth / 2;
        const isTop = pointer.position === "top";
        const pointerY = isTop ? -28 : cellHeight + 36;
        const pointerColor = pointer.color || "#ef4444";

        return (
          <g key={`ptr-${pIdx}`} transform={`translate(${targetX}, ${pointerY})`}>
            {isTop ? (
              // Arrow pointing down into top of cell
              <>
                <text
                  x={0}
                  y={-6}
                  textAnchor="middle"
                  fill={pointerColor}
                  fontSize={12}
                  fontWeight="bold"
                  className="select-none"
                >
                  {pointer.name}
                </text>
                <path
                  d="M0,0 L0,18 M-4,12 L0,18 L4,12"
                  stroke={pointerColor}
                  strokeWidth={2}
                  fill="none"
                />
              </>
            ) : (
              // Arrow pointing up into bottom of cell
              <>
                <path
                  d="M0,8 L0,-10 M-4,-4 L0,-10 L4,-4"
                  stroke={pointerColor}
                  strokeWidth={2}
                  fill="none"
                />
                <text
                  x={0}
                  y={22}
                  textAnchor="middle"
                  fill={pointerColor}
                  fontSize={12}
                  fontWeight="bold"
                  className="select-none"
                >
                  {pointer.name}
                </text>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
};
