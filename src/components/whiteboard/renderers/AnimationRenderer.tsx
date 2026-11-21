"use client";

import React from "react";
import { HighlightVisualElement } from "@/types/teachscript";

interface HighlightRendererProps {
  element: HighlightVisualElement;
}

export const HighlightRenderer: React.FC<HighlightRendererProps> = ({ element }) => {
  const { id, x, y, color = "#3b82f6", animation = "pulse" } = element;

  return (
    <g id={id} transform={`translate(${x}, ${y})`}>
      {/* Outer pulsing ring */}
      <circle
        cx={0}
        cy={0}
        r={35}
        fill="none"
        stroke={color}
        strokeWidth={3}
        className={animation === "pulse" ? "animate-ping opacity-75 origin-center" : ""}
      />
      {/* Inner highlight circle */}
      <circle
        cx={0}
        cy={0}
        r={25}
        fill={`${color}30`}
        stroke={color}
        strokeWidth={2}
      />
    </g>
  );
};
