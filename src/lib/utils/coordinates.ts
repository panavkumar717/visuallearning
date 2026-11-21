// Virtual whiteboard canvas coordinate system
export const VIRTUAL_CANVAS_WIDTH = 1000;
export const VIRTUAL_CANVAS_HEIGHT = 650;

export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Converts screen coordinates to virtual canvas coordinates
 */
export function screenToCanvas(
  screenX: number,
  screenY: number,
  canvasOffset: Point,
  scale: number
): Point {
  return {
    x: (screenX - canvasOffset.x) / scale,
    y: (screenY - canvasOffset.y) / scale,
  };
}

/**
 * Converts virtual canvas coordinates to screen coordinates
 */
export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  canvasOffset: Point,
  scale: number
): Point {
  return {
    x: canvasX * scale + canvasOffset.x,
    y: canvasY * scale + canvasOffset.y,
  };
}

/**
 * Clamps zoom scale within allowed limits
 */
export function clampScale(scale: number, min = 0.3, max = 3.0): number {
  return Math.min(Math.max(scale, min), max);
}

/**
 * Calculates bounding box of a collection of visual elements
 */
export function calculateElementsBounds(
  elements: Array<{ x: number; y: number; width?: number; height?: number }>
): BoundingBox {
  if (elements.length === 0) {
    return { minX: 0, minY: 0, maxX: VIRTUAL_CANVAS_WIDTH, maxY: VIRTUAL_CANVAS_HEIGHT };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const el of elements) {
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + (el.width || 100));
    maxY = Math.max(maxY, el.y + (el.height || 60));
  }

  return { minX, minY, maxX, maxY };
}
