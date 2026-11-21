import { z } from "zod";

// Base coordinate & layout validators
const coordinateSchema = z.number().min(-5000).max(5000);
const dimensionSchema = z.number().min(0).max(10000).optional();
const colorSchema = z.string().max(50).optional();

export const BaseVisualElementSchema = z.object({
  id: z.string().min(1).max(64),
  type: z.enum([
    "text",
    "shape",
    "equation",
    "array",
    "graph",
    "flowchart",
    "arrow",
    "diagram",
    "highlight",
    "group",
  ]),
  x: coordinateSchema,
  y: coordinateSchema,
  opacity: z.number().min(0).max(1).optional(),
  rotation: z.number().optional(),
  scale: z.number().positive().optional(),
  zIndex: z.number().int().optional(),
  label: z.string().max(200).optional(),
});

export const TextVisualElementSchema = BaseVisualElementSchema.extend({
  type: z.literal("text"),
  text: z.string().min(1).max(2000),
  fontSize: z.number().min(8).max(120).optional(),
  fontFamily: z.string().max(50).optional(),
  fontWeight: z.enum(["normal", "bold", "semibold", "light"]).optional(),
  color: colorSchema,
  align: z.enum(["left", "center", "right"]).optional(),
  width: dimensionSchema,
  backgroundColor: colorSchema,
  padding: z.number().min(0).max(100).optional(),
  borderRadius: z.number().min(0).max(50).optional(),
});

export const ShapeVisualElementSchema = BaseVisualElementSchema.extend({
  type: z.literal("shape"),
  shapeType: z.enum(["rectangle", "circle", "ellipse", "line", "polygon"]),
  width: dimensionSchema,
  height: dimensionSchema,
  radius: dimensionSchema,
  radiusX: dimensionSchema,
  radiusY: dimensionSchema,
  points: z.array(z.number()).max(100).optional(),
  fill: colorSchema,
  stroke: colorSchema,
  strokeWidth: z.number().min(0).max(20).optional(),
  cornerRadius: z.number().min(0).max(100).optional(),
  dash: z.array(z.number()).max(10).optional(),
});

export const EquationVisualElementSchema = BaseVisualElementSchema.extend({
  type: z.literal("equation"),
  latex: z.string().min(1).max(1000),
  fontSize: z.number().min(10).max(64).optional(),
  color: colorSchema,
  displayMode: z.boolean().optional(),
  boxColor: colorSchema,
  highlightTerms: z.array(z.string().max(50)).max(10).optional(),
});

export const ArrayVisualElementSchema = BaseVisualElementSchema.extend({
  type: z.literal("array"),
  values: z.array(z.union([z.string(), z.number()])).min(1).max(50),
  cellWidth: z.number().min(20).max(200).optional(),
  cellHeight: z.number().min(20).max(200).optional(),
  highlightedIndices: z.array(z.number().int().min(0)).max(50).optional(),
  highlightColor: colorSchema,
  activeIndex: z.number().int().optional(),
  pointers: z
    .array(
      z.object({
        name: z.string().max(30),
        index: z.number().int(),
        color: colorSchema,
        position: z.enum(["top", "bottom"]).optional(),
      })
    )
    .max(10)
    .optional(),
});

export const GraphVisualElementSchema = BaseVisualElementSchema.extend({
  type: z.literal("graph"),
  width: z.number().min(50).max(2000),
  height: z.number().min(50).max(2000),
  xRange: z.tuple([z.number(), z.number()]),
  yRange: z.tuple([z.number(), z.number()]),
  xLabel: z.string().max(50).optional(),
  yLabel: z.string().max(50).optional(),
  plotType: z.enum(["function", "points", "bars", "parametric"]),
  expression: z.string().max(200).optional(),
  points: z
    .array(
      z.object({
        x: z.number(),
        y: z.number(),
        label: z.string().max(50).optional(),
      })
    )
    .max(100)
    .optional(),
  bars: z
    .array(
      z.object({
        label: z.string().max(50),
        value: z.number(),
        color: colorSchema,
      })
    )
    .max(30)
    .optional(),
  color: colorSchema,
  showGrid: z.boolean().optional(),
});

export const FlowchartVisualElementSchema = BaseVisualElementSchema.extend({
  type: z.literal("flowchart"),
  nodes: z
    .array(
      z.object({
        id: z.string().min(1).max(50),
        label: z.string().min(1).max(200),
        x: coordinateSchema,
        y: coordinateSchema,
        shape: z.enum(["rectangle", "diamond", "circle", "rounded"]).optional(),
        fill: colorSchema,
        stroke: colorSchema,
      })
    )
    .min(1)
    .max(30),
  edges: z
    .array(
      z.object({
        from: z.string().min(1).max(50),
        to: z.string().min(1).max(50),
        label: z.string().max(100).optional(),
        style: z.enum(["solid", "dashed"]).optional(),
        color: colorSchema,
      })
    )
    .max(50),
});

export const ArrowVisualElementSchema = BaseVisualElementSchema.extend({
  type: z.literal("arrow"),
  x: coordinateSchema.optional().default(0),
  y: coordinateSchema.optional().default(0),
  from: z.object({ x: coordinateSchema, y: coordinateSchema }),
  to: z.object({ x: coordinateSchema, y: coordinateSchema }),
  color: colorSchema,
  strokeWidth: z.number().min(1).max(20).optional(),
  dashed: z.boolean().optional(),
  directed: z.boolean().optional(),
  curve: z.enum(["straight", "arc"]).optional(),
  pointerSize: z.number().min(2).max(40).optional(),
});

export const DiagramVisualElementSchema = BaseVisualElementSchema.extend({
  type: z.literal("diagram"),
  diagramType: z.enum([
    "cell",
    "plant",
    "force_body",
    "circuit",
    "atom",
    "binary_tree",
    "molecule",
    "generic_svg",
  ]),
  params: z.record(z.string(), z.any()).default({}),
  svgString: z.string().max(50000).optional(),
});

export const HighlightVisualElementSchema = BaseVisualElementSchema.extend({
  type: z.literal("highlight"),
  targetId: z.string().min(1).max(64),
  color: colorSchema,
  animation: z.enum(["pulse", "glow", "outline"]).optional(),
  duration: z.number().min(0.1).max(10).optional(),
});

export const GroupVisualElementSchema = BaseVisualElementSchema.extend({
  type: z.literal("group"),
  memberIds: z.array(z.string().min(1).max(64)).min(1).max(100),
});

export const VisualElementSchema = z.discriminatedUnion("type", [
  TextVisualElementSchema,
  ShapeVisualElementSchema,
  EquationVisualElementSchema,
  ArrayVisualElementSchema,
  GraphVisualElementSchema,
  FlowchartVisualElementSchema,
  ArrowVisualElementSchema,
  DiagramVisualElementSchema,
  HighlightVisualElementSchema,
  GroupVisualElementSchema,
]);

export const LessonStepSchema = z.object({
  id: z.string().min(1).max(64),
  stepNumber: z.number().int().min(1).max(30),
  title: z.string().min(1).max(200),
  explanation: z.string().min(1).max(4000),
  narration: z.string().max(4000).optional(),
  visuals: z.array(VisualElementSchema).max(50),
  clearPrevious: z.boolean().optional().default(false),
  durationSeconds: z.number().min(1).max(120).optional(),
});

export const TeachScriptLessonSchema = z.object({
  id: z.string().min(1).max(64),
  title: z.string().min(1).max(200),
  subject: z.string().min(1).max(100),
  topic: z.string().min(1).max(150),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  overview: z.string().min(1).max(2000),
  steps: z.array(LessonStepSchema).min(1).max(20),
  suggestedFollowUps: z.array(z.string().max(200)).max(10).optional(),
  metadata: z
    .object({
      generatedAt: z.string().optional(),
      model: z.string().optional(),
      targetAgeGroup: z.string().optional(),
    })
    .optional(),
});

export function validateTeachScript(data: unknown) {
  return TeachScriptLessonSchema.safeParse(data);
}
