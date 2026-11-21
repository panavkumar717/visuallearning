/**
 * Helper to calculate arrow head points
 */
export function calculateArrowHead(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  headLength = 12,
  headAngle = Math.PI / 6
) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const p1X = toX - headLength * Math.cos(angle - headAngle);
  const p1Y = toY - headLength * Math.sin(angle - headAngle);
  const p2X = toX - headLength * Math.cos(angle + headAngle);
  const p2Y = toY - headLength * Math.sin(angle + headAngle);

  return { p1: { x: p1X, y: p1Y }, p2: { x: p2X, y: p2Y } };
}

/**
 * Subject colors palette for clean, professional whiteboard themes
 */
export const SUBJECT_PALETTES: Record<string, { primary: string; secondary: string; light: string; border: string }> = {
  "Computer Science": {
    primary: "#2563EB", // blue-600
    secondary: "#0284C7", // sky-600
    light: "#EFF6FF", // blue-50
    border: "#93C5FD", // blue-300
  },
  Physics: {
    primary: "#7C3AED", // violet-600
    secondary: "#9333EA", // purple-600
    light: "#F5F3FF", // violet-50
    border: "#C4B5FD", // violet-300
  },
  Mathematics: {
    primary: "#059669", // emerald-600
    secondary: "#0D9488", // teal-600
    light: "#ECFDF5", // emerald-50
    border: "#6EE7B7", // emerald-300
  },
  Chemistry: {
    primary: "#D97706", // amber-600
    secondary: "#EA580C", // orange-600
    light: "#FFFBEB", // amber-50
    border: "#FCD34D", // amber-300
  },
  Biology: {
    primary: "#16A34A", // green-600
    secondary: "#65A30D", // lime-600
    light: "#F0FDF4", // green-50
    border: "#86EFAC", // green-300
  },
  default: {
    primary: "#3B82F6",
    secondary: "#6366F1",
    light: "#F8FAFC",
    border: "#CBD5E1",
  },
};

export function getSubjectColor(subject?: string) {
  if (!subject) return SUBJECT_PALETTES.default;
  return SUBJECT_PALETTES[subject] || SUBJECT_PALETTES.default;
}
