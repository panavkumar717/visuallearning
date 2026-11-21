"use client";

import React from "react";
import { GroupVisualElement, VisualElement } from "@/types/teachscript";

interface GroupRendererProps {
  element: GroupVisualElement;
  children: React.ReactNode;
}

export const GroupRenderer: React.FC<GroupRendererProps> = ({
  element,
  children,
}) => {
  const { id, x, y, opacity = 1 } = element;

  return (
    <g id={id} transform={`translate(${x}, ${y})`} opacity={opacity}>
      {children}
    </g>
  );
};
