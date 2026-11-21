"use client";

import React from "react";
import { TextVisualElement } from "@/types/teachscript";

interface TextRendererProps {
  element: TextVisualElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export const TextRenderer: React.FC<TextRendererProps> = ({
  element,
  isSelected,
  onClick,
}) => {
  const {
    id,
    x,
    y,
    text,
    fontSize = 16,
    fontFamily = "inherit",
    fontWeight = "normal",
    color = "#1e293b",
    align = "left",
    width,
    backgroundColor,
    padding = 8,
    borderRadius = 6,
    opacity = 1,
  } = element;

  return (
    <g
      id={id}
      transform={`translate(${x}, ${y})`}
      opacity={opacity}
      onClick={onClick}
      className={`cursor-pointer transition-all ${
        isSelected ? "filter drop-shadow(0 0 4px #3b82f6)" : ""
      }`}
    >
      {backgroundColor && (
        <rect
          x={-padding}
          y={-padding}
          width={(width || text.length * (fontSize * 0.6)) + padding * 2}
          height={fontSize * 1.5 + padding * 2}
          fill={backgroundColor}
          rx={borderRadius}
          ry={borderRadius}
          stroke={isSelected ? "#2563eb" : "#e2e8f0"}
          strokeWidth={isSelected ? 2 : 1}
        />
      )}
      <text
        x={align === "center" ? (width ? width / 2 : 0) : align === "right" ? (width || 0) : 0}
        y={fontSize}
        fill={color}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        textAnchor={align === "center" ? "middle" : align === "right" ? "end" : "start"}
        className="select-none font-sans"
      >
        {text}
      </text>
    </g>
  );
};
