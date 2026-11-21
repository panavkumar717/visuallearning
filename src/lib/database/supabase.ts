import { createClient } from "@supabase/supabase-js";
import { TeachScriptLesson } from "@/types/teachscript";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey && supabaseUrl !== "https://your-project.supabase.co"
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Saves a generated lesson to Supabase PostgreSQL (if credentials configured)
 */
export async function saveLessonToSupabase(lesson: TeachScriptLesson): Promise<void> {
  if (!supabase) return;

  try {
    // 1. Insert lesson record
    const { error: lessonError } = await supabase.from("lessons").upsert({
      id: lesson.id,
      title: lesson.title,
      subject: lesson.subject,
      topic: lesson.topic,
      difficulty: lesson.difficulty,
      status: "completed",
      created_at: new Date().toISOString(),
    });

    if (lessonError) {
      console.warn("Supabase lessons table insert error:", lessonError.message);
      return;
    }

    // 2. Insert lesson steps
    const stepsData = lesson.steps.map((step) => ({
      id: step.id,
      lesson_id: lesson.id,
      step_number: step.stepNumber,
      title: step.title,
      explanation: step.explanation,
      visual_data: step.visuals,
      created_at: new Date().toISOString(),
    }));

    const { error: stepsError } = await supabase
      .from("lesson_steps")
      .upsert(stepsData);

    if (stepsError) {
      console.warn("Supabase lesson_steps insert error:", stepsError.message);
    }
  } catch (e: any) {
    console.warn("Supabase save exception:", e.message);
  }
}

/**
 * Retrieves a lesson and its steps from Supabase
 */
export async function getLessonFromSupabase(
  lessonId: string
): Promise<TeachScriptLesson | null> {
  if (!supabase) return null;

  try {
    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .single();

    if (lessonError || !lesson) return null;

    const { data: steps, error: stepsError } = await supabase
      .from("lesson_steps")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("step_number", { ascending: true });

    if (stepsError) return null;

    return {
      id: lesson.id,
      title: lesson.title,
      subject: lesson.subject,
      topic: lesson.topic,
      difficulty: lesson.difficulty,
      overview: lesson.title,
      steps: (steps || []).map((s) => ({
        id: s.id,
        stepNumber: s.step_number,
        title: s.title,
        explanation: s.explanation,
        visuals: s.visual_data || [],
        clearPrevious: false,
      })),
    };
  } catch (e) {
    return null;
  }
}
