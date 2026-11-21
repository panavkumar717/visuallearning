import { NextRequest, NextResponse } from "next/server";
import { LessonOrchestrator } from "@/lib/engine/lesson-orchestrator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const lesson = await LessonOrchestrator.getLesson(lessonId);

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lesson,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve lesson" },
      { status: 500 }
    );
  }
}
