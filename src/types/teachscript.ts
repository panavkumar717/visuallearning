import { z } from "zod";

// --- Visual Types Definition ---
export type VisualElementType =
  | "text"
  | "shape"
  | "equation"
  | "array"
  | "graph"
  | "flowchart"
  | "arrow"
  | "diagram"
  | "highlight"
  | "group";

export interface BaseVisualElement {
  id: string;
  type: VisualElementType;
  x: number;
  y: number;
  opacity?: number;
  rotation?: number;
  scale?: number;
  zIndex?: number;
  label?: string;
  className?: string;
}

export interface TextVisualElement extends BaseVisualElement {
  type: "text";
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: "normal" | "bold" | "semibold" | "light";
  color?: string;
  align?: "left" | "center" | "right";
  width?: number;
  backgroundColor?: string;
  padding?: number;
  borderRadius?: number;
}

export interface ShapeVisualElement extends BaseVisualElement {
  type: "shape";
  shapeType: "rectangle" | "circle" | "ellipse" | "line" | "polygon";
  width?: number;
  height?: number;
  radius?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
  dash?: number[];
}

export interface EquationVisualElement extends BaseVisualElement {
  type: "equation";
  latex: string;
  fontSize?: number;
  color?: string;
  displayMode?: boolean; // Block vs inline
  boxColor?: string;
  highlightTerms?: string[];
}

export interface ArrayVisualElement extends BaseVisualElement {
  type: "array";
  values: (string | number)[];
  cellWidth?: number;
  cellHeight?: number;
  highlightedIndices?: number[];
  highlightColor?: string;
  activeIndex?: number;
  pointers?: {
    name: string;
    index: number;
    color?: string;
    position?: "top" | "bottom";
  }[];
}

export interface GraphVisualElement extends BaseVisualElement {
  type: "graph";
  width: number;
  height: number;
  xRange: [number, number];
  yRange: [number, number];
  xLabel?: string;
  yLabel?: string;
  plotType: "function" | "points" | "bars" | "parametric";
  expression?: string; // e.g., "Math.sin(x)" or "x^2 - 4"
  points?: { x: number; y: number; label?: string }[];
  bars?: { label: string; value: number; color?: string }[];
  color?: string;
  showGrid?: boolean;
}

export interface FlowchartNode {
  id: string;
  label: string;
  x: number;
  y: number;
  shape?: "rectangle" | "diamond" | "circle" | "rounded";
  fill?: string;
  stroke?: string;
}

export interface FlowchartEdge {
  from: string;
  to: string;
  label?: string;
  style?: "solid" | "dashed";
  color?: string;
}

export interface FlowchartVisualElement extends BaseVisualElement {
  type: "flowchart";
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
}

export interface ArrowVisualElement extends Omit<BaseVisualElement, "x" | "y"> {
  type: "arrow";
  x?: number;
  y?: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  strokeWidth?: number;
  dashed?: boolean;
  directed?: boolean;
  curve?: "straight" | "arc";
  pointerSize?: number;
}

export interface DiagramVisualElement extends BaseVisualElement {
  type: "diagram";
  diagramType:
    | "cell"
    | "plant"
    | "force_body"
    | "circuit"
    | "atom"
    | "binary_tree"
    | "molecule"
    | "generic_svg";
  params: Record<string, any>;
  svgString?: string;
}

export interface HighlightVisualElement extends BaseVisualElement {
  type: "highlight";
  targetId: string;
  color?: string;
  animation?: "pulse" | "glow" | "outline";
  duration?: number;
}

export interface GroupVisualElement extends BaseVisualElement {
  type: "group";
  memberIds: string[];
}

export type VisualElement =
  | TextVisualElement
  | ShapeVisualElement
  | EquationVisualElement
  | ArrayVisualElement
  | GraphVisualElement
  | FlowchartVisualElement
  | ArrowVisualElement
  | DiagramVisualElement
  | HighlightVisualElement
  | GroupVisualElement;

// --- Lesson Step ---
export interface LessonStep {
  id: string;
  stepNumber: number;
  title: string;
  explanation: string;
  narration?: string;
  visuals: VisualElement[];
  clearPrevious?: boolean;
  durationSeconds?: number;
}

// --- TeachScript Complete Structure ---
export interface TeachScriptLesson {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  overview: string;
  steps: LessonStep[];
  suggestedFollowUps?: string[];
  metadata?: {
    generatedAt?: string;
    model?: string;
    targetAgeGroup?: string;
  };
}
