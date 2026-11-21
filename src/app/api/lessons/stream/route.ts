import { NextRequest } from "next/server";
import { LessonOrchestrator } from "@/lib/engine/lesson-orchestrator";
import { LessonEventPayload } from "@/types/events";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const clientApiKey = req.headers.get("x-openai-key") || undefined;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: LessonEventPayload) => {
        controller.enqueue(
          encoder.encode(`event: message\ndata: ${JSON.stringify(event)}\n\n`)
        );
      };

      try {
        sendEvent({
          type: "LESSON_STARTED",
          data: {},
          timestamp: Date.now(),
        });

        const result = await LessonOrchestrator.createLesson(body, clientApiKey);

        if (!result.success || !result.lesson) {
          sendEvent({
            type: "GENERATION_ERROR",
            data: { error: result.error || "Failed to generate lesson" },
            timestamp: Date.now(),
          });
          controller.close();
          return;
        }

        sendEvent({
          type: "LESSON_PLAN_READY",
          data: {
            lessonId: result.lesson.id,
            lesson: result.lesson,
          },
          timestamp: Date.now(),
        });

        // Stream each step progressively
        for (let i = 0; i < result.lesson.steps.length; i++) {
          const step = result.lesson.steps[i];
          sendEvent({
            type: "STEP_READY",
            data: {
              lessonId: result.lesson.id,
              stepIndex: i,
              step: step,
            },
            timestamp: Date.now(),
          });
        }

        sendEvent({
          type: "LESSON_COMPLETED",
          data: { lesson: result.lesson },
          timestamp: Date.now(),
        });
      } catch (err: any) {
        sendEvent({
          type: "GENERATION_ERROR",
          data: { error: err.message || "Streaming generation error" },
          timestamp: Date.now(),
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
