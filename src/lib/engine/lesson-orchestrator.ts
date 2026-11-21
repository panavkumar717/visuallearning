import { TeachScriptLesson, LessonStep } from "@/types/teachscript";
import { generateLesson, answerFollowUpQuestion } from "../ai/lesson-generator";
import { GenerateLessonRequestSchema, FollowUpQuestionRequestSchema } from "../validation/request.schema";
import { saveLessonToSupabase, getLessonFromSupabase } from "../database/supabase";
import { MOCK_CURRICULUM } from "../ai/mock-curriculum";

// In-memory cache for fast active session lookups
const activeSessions = new Map<string, TeachScriptLesson>();

export class LessonOrchestrator {
  /**
   * Orchestrates the creation of a new lesson
   */
  static async createLesson(
    payload: unknown,
    clientApiKey?: string
  ): Promise<{ success: boolean; lesson: TeachScriptLesson; error?: string }> {
    const parsed = GenerateLessonRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        success: false,
        lesson: null as any,
        error: parsed.error.issues.map((i) => i.message).join(", "),
      };
    }

    const { question, subject, difficulty } = parsed.data;

    try {
      const lesson = await generateLesson({
        question,
        subject,
        difficulty,
        clientApiKey,
      });

      // Cache session in memory
      activeSessions.set(lesson.id, lesson);

      // Attempt Supabase persistence in background
      saveLessonToSupabase(lesson).catch((err) => {
        console.warn("Supabase background save notice:", err.message);
      });

      return {
        success: true,
        lesson,
      };
    } catch (err: any) {
      return {
        success: false,
        lesson: null as any,
        error: err.message || "Failed to generate lesson",
      };
    }
  }

  /**
   * Retrieves a lesson by ID (from memory, database, or curriculum templates)
   */
  static async getLesson(lessonId: string): Promise<TeachScriptLesson | null> {
    if (activeSessions.has(lessonId)) {
      return activeSessions.get(lessonId)!;
    }

    // Check mock curriculum templates
    for (const mockLesson of Object.values(MOCK_CURRICULUM)) {
      if (mockLesson.id === lessonId) {
        activeSessions.set(lessonId, mockLesson);
        return mockLesson;
      }
    }

    const fromDb = await getLessonFromSupabase(lessonId);
    if (fromDb) {
      activeSessions.set(lessonId, fromDb);
      return fromDb;
    }

    return null;
  }

  /**
   * Handles contextual follow-up questions
   */
  static async handleFollowUp(
    sessionId: string,
    payload: unknown,
    clientApiKey?: string
  ): Promise<{
    success: boolean;
    newStep?: LessonStep;
    suggestedFollowUps?: string[];
    error?: string;
  }> {
    const parsed = FollowUpQuestionRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((i) => i.message).join(", "),
      };
    }

    const { question, currentStepId } = parsed.data;
    const lesson = activeSessions.get(sessionId);

    try {
      const result = await answerFollowUpQuestion({
        question,
        currentStepId,
        lessonId: sessionId,
        currentLessonContext: lesson,
        clientApiKey,
      });

      // If session exists in cache, update steps
      if (lesson && result.newStep) {
        lesson.steps.push(result.newStep);
      }

      return {
        success: true,
        newStep: result.newStep,
        suggestedFollowUps: result.suggestedFollowUps,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to process follow-up question",
      };
    }
  }
}
