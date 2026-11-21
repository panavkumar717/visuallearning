import { NextRequest, NextResponse } from "next/server";
import { UpdateProgressRequestSchema } from "@/lib/validation/request.schema";
import { supabase } from "@/lib/database/supabase";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await req.json();

    const parsed = UpdateProgressRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }

    const { currentStepId, completedSteps } = parsed.data;

    if (supabase) {
      await supabase.from("student_progress").upsert({
        lesson_id: sessionId,
        current_step_id: currentStepId,
        completed_steps: completedSteps,
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      currentStepId,
      completedSteps,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update progress" },
      { status: 500 }
    );
  }
}
