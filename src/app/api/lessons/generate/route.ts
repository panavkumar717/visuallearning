import { NextRequest, NextResponse } from "next/server";
import { LessonOrchestrator } from "@/lib/engine/lesson-orchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientApiKey = req.headers.get("x-openai-key") || undefined;

    const result = await LessonOrchestrator.createLesson(body, clientApiKey);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      lesson: result.lesson,
    });
  } catch (error: any) {
    console.error("API /api/lessons/generate error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
