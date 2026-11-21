"use client";

import React, { useMemo } from "react";
import katex from "katex";
import { EquationVisualElement } from "@/types/teachscript";

interface EquationRendererProps {
  element: EquationVisualElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export const EquationRenderer: React.FC<EquationRendererProps> = ({
  element,
  isSelected,
  onClick,
}) => {
  const {
    id,
    x,
    y,
    latex,
    fontSize = 20,
    color = "#0f172a",
    displayMode = true,
    boxColor = "rgba(241, 245, 249, 0.8)",
    opacity = 1,
  } = element;

  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: displayMode,
      });
    } catch (e) {
      return `<span style="color:red;">Error rendering LaTeX</span>`;
    }
  }, [latex, displayMode]);

  // Approximate width and height for foreignObject
  const approxWidth = Math.max(160, latex.length * (fontSize * 0.75) + 60);
  const approxHeight = Math.max(50, fontSize * 3 + 20);

  return (
    <g
      id={id}
      transform={`translate(${x}, ${y})`}
      opacity={opacity}
      onClick={onClick}
      className="cursor-pointer"
    >
      <foreignObject width={approxWidth} height={approxHeight}>
        <div
          style={{
            fontSize: `${fontSize}px`,
            color: color,
            backgroundColor: boxColor,
          }}
          className={`p-3 rounded-xl border backdrop-blur-sm shadow-sm transition-all inline-block ${
            isSelected
              ? "border-blue-500 shadow-blue-200 shadow-md ring-2 ring-blue-400"
              : "border-slate-200/80"
          }`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </foreignObject>
    </g>
  );
};
