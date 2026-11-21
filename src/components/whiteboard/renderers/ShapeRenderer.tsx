"use client";

import React from "react";
import { ShapeVisualElement } from "@/types/teachscript";

interface ShapeRendererProps {
  element: ShapeVisualElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  element,
  isSelected,
  onClick,
}) => {
  const {
    id,
    x,
    y,
    shapeType,
    width = 100,
    height = 60,
    radius = 30,
    radiusX = 40,
    radiusY = 25,
    points = [],
    fill = "transparent",
    stroke = "#334155",
    strokeWidth = 2,
    cornerRadius = 0,
    dash,
    opacity = 1,
  } = element;

  const strokeColor = isSelected ? "#2563eb" : stroke;
  const currentStrokeWidth = isSelected ? strokeWidth + 1.5 : strokeWidth;
  const dashArray = dash ? dash.join(" ") : undefined;

  const renderShape = () => {
    switch (shapeType) {
      case "rectangle":
        return (
          <rect
            width={width}
            height={height}
            fill={fill}
            stroke={strokeColor}
            strokeWidth={currentStrokeWidth}
            rx={cornerRadius}
            ry={cornerRadius}
            strokeDasharray={dashArray}
          />
        );
      case "circle":
        return (
          <circle
            r={radius}
            cx={radius}
            cy={radius}
            fill={fill}
            stroke={strokeColor}
            strokeWidth={currentStrokeWidth}
            strokeDasharray={dashArray}
          />
        );
      case "ellipse":
        return (
          <ellipse
            rx={radiusX}
            ry={radiusY}
            cx={radiusX}
            cy={radiusY}
            fill={fill}
            stroke={strokeColor}
            strokeWidth={currentStrokeWidth}
            strokeDasharray={dashArray}
          />
        );
      case "line":
        const x2 = points[0] ?? width;
        const y2 = points[1] ?? height;
        return (
          <line
            x1={0}
            y1={0}
            x2={x2}
            y2={y2}
            stroke={strokeColor}
            strokeWidth={currentStrokeWidth}
            strokeDasharray={dashArray}
          />
        );
      case "polygon":
        // Group points into "x,y x,y"
        const pointsString =
          points.length >= 4
            ? points
                .reduce((acc, val, idx) => {
                  return idx % 2 === 0
                    ? `${acc} ${val},`
                    : `${acc}${val}`;
                }, "")
                .trim()
            : "0,0 50,0 25,50";
        return (
          <polygon
            points={pointsString}
            fill={fill}
            stroke={strokeColor}
            strokeWidth={currentStrokeWidth}
            strokeDasharray={dashArray}
          />
        );
      default:
        return null;
    }
  };

  return (
    <g
      id={id}
      transform={`translate(${x}, ${y})`}
      opacity={opacity}
      onClick={onClick}
      className="cursor-pointer transition-all"
    >
      {renderShape()}
    </g>
  );
};
