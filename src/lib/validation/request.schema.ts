import { z } from "zod";

export const GenerateLessonRequestSchema = z.object({
  question: z
    .string()
    .min(3, "Question must be at least 3 characters")
    .max(500, "Question cannot exceed 500 characters"),
  subject: z.string().max(100).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  teachingMode: z
    .enum(["visual", "interactive", "fast", "detailed"])
    .default("visual"),
  sessionId: z.string().uuid().nullable().optional(),
});

export const FollowUpQuestionRequestSchema = z.object({
  question: z
    .string()
    .min(2, "Follow-up question must be at least 2 characters")
    .max(500, "Follow-up question cannot exceed 500 characters"),
  currentStepId: z.string().min(1).max(64),
  lessonId: z.string().optional(),
});

export const UpdateProgressRequestSchema = z.object({
  currentStepId: z.string().min(1).max(64),
  completedSteps: z.number().int().min(0).max(100),
});
