"use client";

import React, { useMemo } from "react";
import { GraphVisualElement } from "@/types/teachscript";

interface GraphRendererProps {
  element: GraphVisualElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export const GraphRenderer: React.FC<GraphRendererProps> = ({
  element,
  isSelected,
  onClick,
}) => {
  const {
    id,
    x,
    y,
    width = 320,
    height = 240,
    xRange = [-5, 5],
    yRange = [-5, 5],
    xLabel = "x",
    yLabel = "y",
    plotType,
    expression,
    points = [],
    bars = [],
    color = "#3b82f6",
    showGrid = true,
    opacity = 1,
  } = element;

  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const originX = ((0 - xMin) / (xMax - xMin)) * width;
  const originY = height - ((0 - yMin) / (yMax - yMin)) * height;

  // Generate SVG path for mathematical function if plotType === 'function'
  const functionPath = useMemo(() => {
    if (plotType !== "function" || !expression) return "";

    const samples = 100;
    const pathSegments: string[] = [];

    // Safely evaluate standard math expressions like "x^2", "sin(x)", "2*x + 1"
    const sanitizedExpr = expression
      .replace(/\^/g, "**")
      .replace(/sin/g, "Math.sin")
      .replace(/cos/g, "Math.cos")
      .replace(/tan/g, "Math.tan")
      .replace(/sqrt/g, "Math.sqrt")
      .replace(/abs/g, "Math.abs");

    let isFirst = true;

    for (let i = 0; i <= samples; i++) {
      const currentX = xMin + (i / samples) * (xMax - xMin);
      try {
        // Safe evaluation of mathematical curve
        const fn = new Function("x", `return (${sanitizedExpr});`);
        const currentY = fn(currentX);

        if (
          typeof currentY === "number" &&
          !isNaN(currentY) &&
          isFinite(currentY)
        ) {
          const px = ((currentX - xMin) / (xMax - xMin)) * width;
          const py = height - ((currentY - yMin) / (yMax - yMin)) * height;

          if (isFirst) {
            pathSegments.push(`M ${px.toFixed(1)} ${py.toFixed(1)}`);
            isFirst = false;
          } else {
            pathSegments.push(`L ${px.toFixed(1)} ${py.toFixed(1)}`);
          }
        }
      } catch (e) {
        // Skip invalid evaluation points
      }
    }

    return pathSegments.join(" ");
  }, [plotType, expression, xMin, xMax, yMin, yMax, width, height]);

  return (
    <g
      id={id}
      transform={`translate(${x}, ${y})`}
      opacity={opacity}
      onClick={onClick}
      className="cursor-pointer font-sans"
    >
      {/* Background card */}
      <rect
        width={width}
        height={height}
        fill="#f8fafc"
        stroke={isSelected ? "#2563eb" : "#e2e8f0"}
        strokeWidth={isSelected ? 2 : 1}
        rx={8}
      />

      {/* Grid Lines */}
      {showGrid && (
        <g stroke="#f1f5f9" strokeWidth={1}>
          {[-4, -2, 2, 4].map((val) => {
            const gx = ((val - xMin) / (xMax - xMin)) * width;
            const gy = height - ((val - yMin) / (yMax - yMin)) * height;
            return (
              <React.Fragment key={val}>
                <line x1={gx} y1={0} x2={gx} y2={height} />
                <line x1={0} y1={gy} x2={width} y2={gy} />
              </React.Fragment>
            );
          })}
        </g>
      )}

      {/* Axes */}
      <g stroke="#94a3b8" strokeWidth={1.5}>
        {/* X Axis */}
        <line x1={0} y1={originY} x2={width} y2={originY} />
        {/* Y Axis */}
        <line x1={originX} y1={0} x2={originX} y2={height} />
      </g>

      {/* Axis Labels */}
      <text
        x={width - 15}
        y={originY - 6}
        fill="#64748b"
        fontSize={12}
        fontWeight="bold"
      >
        {xLabel}
      </text>
      <text
        x={originX + 8}
        y={15}
        fill="#64748b"
        fontSize={12}
        fontWeight="bold"
      >
        {yLabel}
      </text>

      {/* Function curve */}
      {plotType === "function" && functionPath && (
        <path
          d={functionPath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          className="transition-all"
        />
      )}

      {/* Discrete Points */}
      {points.map((pt, pIdx) => {
        const px = ((pt.x - xMin) / (xMax - xMin)) * width;
        const py = height - ((pt.y - yMin) / (yMax - yMin)) * height;
        return (
          <g key={pIdx} transform={`translate(${px}, ${py})`}>
            <circle r={5} fill={color} stroke="#ffffff" strokeWidth={1.5} />
            {pt.label && (
              <text x={8} y={-8} fill="#334155" fontSize={11}>
                {pt.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Bar Chart */}
      {bars.length > 0 &&
        bars.map((bar, bIdx) => {
          const barWidth = width / (bars.length * 2);
          const barX = (bIdx * 2 + 1) * barWidth;
          const barH = (bar.value / Math.max(yMax, 1)) * (height * 0.7);
          const barY = height - 25 - barH;

          return (
            <g key={bIdx}>
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barH}
                fill={bar.color || color}
                rx={4}
              />
              <text
                x={barX + barWidth / 2}
                y={height - 8}
                textAnchor="middle"
                fontSize={10}
                fill="#64748b"
              >
                {bar.label}
              </text>
            </g>
          );
        })}
    </g>
  );
};
