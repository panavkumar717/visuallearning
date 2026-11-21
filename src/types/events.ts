import { TeachScriptLesson, LessonStep, VisualElement } from "./teachscript";

export type LessonEventType =
  | "LESSON_STARTED"
  | "LESSON_PLAN_READY"
  | "STEP_READY"
  | "VISUAL_COMMAND"
  | "EXPLANATION_READY"
  | "LESSON_COMPLETED"
  | "GENERATION_ERROR";

export interface LessonEventPayload {
  type: LessonEventType;
  data: {
    lessonId?: string;
    stepIndex?: number;
    step?: LessonStep;
    visual?: VisualElement;
    explanation?: string;
    lesson?: TeachScriptLesson;
    error?: string;
  };
  timestamp: number;
}
