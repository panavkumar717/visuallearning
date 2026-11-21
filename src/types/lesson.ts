import { TeachScriptLesson, LessonStep, VisualElement } from "./teachscript";

export type LessonDifficulty = "beginner" | "intermediate" | "advanced";

export type TeachingMode = "visual" | "interactive" | "fast" | "detailed";

export interface LessonSummary {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: LessonDifficulty;
  stepCount: number;
  createdAt: string;
}

export interface StudentProgress {
  lessonId: string;
  currentStepIndex: number;
  completedStepIds: string[];
  lastUpdated: string;
}

export interface LessonSession {
  sessionId: string;
  lesson: TeachScriptLesson;
  progress: StudentProgress;
  conversationHistory: {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
    associatedStepId?: string;
  }[];
}

export interface WhiteboardViewport {
  scale: number;
  x: number;
  y: number;
}
