import { NextRequest, NextResponse } from "next/server";
import { LessonOrchestrator } from "@/lib/engine/lesson-orchestrator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await req.json();
    const clientApiKey = req.headers.get("x-openai-key") || undefined;

    const result = await LessonOrchestrator.handleFollowUp(
      sessionId,
      body,
      clientApiKey
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      newStep: result.newStep,
      suggestedFollowUps: result.suggestedFollowUps,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to answer follow-up" },
      { status: 500 }
    );
  }
}
