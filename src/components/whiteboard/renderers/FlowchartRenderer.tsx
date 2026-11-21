"use client";

import React from "react";
import { FlowchartVisualElement } from "@/types/teachscript";

interface FlowchartRendererProps {
  element: FlowchartVisualElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export const FlowchartRenderer: React.FC<FlowchartRendererProps> = ({
  element,
  isSelected,
  onClick,
}) => {
  const { id, x, y, nodes = [], edges = [], opacity = 1 } = element;

  // Build quick map of node positions
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <g
      id={id}
      transform={`translate(${x}, ${y})`}
      opacity={opacity}
      onClick={onClick}
      className="cursor-pointer font-sans"
    >
      {/* Draw Edges */}
      {edges.map((edge, eIdx) => {
        const fromNode = nodeMap.get(edge.from);
        const toNode = nodeMap.get(edge.to);
        if (!fromNode || !toNode) return null;

        const startX = fromNode.x + 60;
        const startY = fromNode.y + 25;
        const endX = toNode.x + 60;
        const endY = toNode.y + 25;

        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        return (
          <g key={eIdx}>
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={edge.color || "#64748b"}
              strokeWidth={2}
              strokeDasharray={edge.style === "dashed" ? "4 4" : undefined}
            />
            {/* Edge arrowhead */}
            <circle cx={endX} cy={endY} r={4} fill={edge.color || "#64748b"} />
            {edge.label && (
              <text
                x={midX}
                y={midY - 6}
                textAnchor="middle"
                fontSize={11}
                fill="#475569"
                fontWeight="500"
                className="bg-white"
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Draw Nodes */}
      {nodes.map((node) => {
        const isDiamond = node.shape === "diamond";
        const isCircle = node.shape === "circle";
        const width = 120;
        const height = 50;

        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            {isDiamond ? (
              <polygon
                points={`60,0 120,25 60,50 0,25`}
                fill={node.fill || "#fef3c7"}
                stroke={node.stroke || "#f59e0b"}
                strokeWidth={2}
              />
            ) : isCircle ? (
              <circle
                cx={30}
                cy={30}
                r={30}
                fill={node.fill || "#e0f2fe"}
                stroke={node.stroke || "#0284c7"}
                strokeWidth={2}
              />
            ) : (
              <rect
                width={width}
                height={height}
                rx={node.shape === "rounded" ? 25 : 8}
                ry={node.shape === "rounded" ? 25 : 8}
                fill={node.fill || "#f8fafc"}
                stroke={node.stroke || "#3b82f6"}
                strokeWidth={2}
              />
            )}

            <text
              x={isCircle ? 30 : width / 2}
              y={isCircle ? 35 : height / 2 + 5}
              textAnchor="middle"
              fontSize={12}
              fontWeight="600"
              fill="#1e293b"
              className="select-none"
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </g>
  );
};
