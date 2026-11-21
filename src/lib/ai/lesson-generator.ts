import { getOpenAIClient } from "./openai";
import { TEACHER_SYSTEM_PROMPT, FOLLOW_UP_SYSTEM_PROMPT } from "./prompts";
import { TeachScriptLesson, LessonStep } from "@/types/teachscript";
import { TeachScriptLessonSchema, LessonStepSchema } from "../validation/teachscript.schema";
import { findCurriculumMatch, MOCK_CURRICULUM } from "./mock-curriculum";

export interface GenerateLessonOptions {
  question: string;
  subject?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  model?: string;
  clientApiKey?: string;
}

export interface FollowUpOptions {
  question: string;
  currentStepId: string;
  lessonId: string;
  currentLessonContext?: TeachScriptLesson;
  model?: string;
  clientApiKey?: string;
}

/**
 * Generates an educational lesson with TeachScript visual whiteboard instructions.
 */
export async function generateLesson(
  options: GenerateLessonOptions
): Promise<TeachScriptLesson> {
  const { question, subject, difficulty = "beginner", model = "gpt-4o", clientApiKey } = options;

  const openai = getOpenAIClient(clientApiKey);

  // If no OpenAI client is configured, check curriculum match or generate standard fallback
  if (!openai) {
    const matched = findCurriculumMatch(question);
    if (matched) {
      return matched;
    }

    // Default template if no key and no direct match
    return {
      id: `lesson_${Date.now()}`,
      title: question.slice(0, 40),
      subject: subject || "General Science",
      topic: question,
      difficulty,
      overview: `A structured visual explanation of ${question}. Add your OpenAI API key in Settings to generate dynamic AI lessons for any topic!`,
      steps: [
        {
          id: "step_demo_1",
          stepNumber: 1,
          title: "Introduction to Concept",
          explanation: `Let's break down "${question}". Please configure your OpenAI API key in the top-right Settings to unlock live dynamic visual generation for any prompt.`,
          narration: `Welcome! Here is an overview of ${question}. Configure your OpenAI API key to experience unlimited real-time AI visual lessons.`,
          visuals: [
            {
              id: "demo_text_title",
              type: "text",
              x: 100,
              y: 80,
              text: `Concept: ${question}`,
              fontSize: 22,
              fontWeight: "bold",
              color: "#1e293b",
            },
            {
              id: "demo_box",
              type: "shape",
              shapeType: "rectangle",
              x: 100,
              y: 160,
              width: 520,
              height: 220,
              fill: "#f8fafc",
              stroke: "#3b82f6",
              strokeWidth: 2,
              cornerRadius: 16,
            },
            {
              id: "demo_equation",
              type: "equation",
              x: 140,
              y: 220,
              latex: "E = mc^2 \\quad \\iff \\quad \\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1",
              fontSize: 22,
              boxColor: "#eff6ff",
            },
            {
              id: "demo_arrow",
              type: "arrow",
              x: 0,
              y: 0,
              from: { x: 140, y: 320 },
              to: { x: 500, y: 320 },
              label: "Logical Progression",
              color: "#2563eb",
            },
          ],
          clearPrevious: false,
        },
      ],
      suggestedFollowUps: [
        "How do I configure my OpenAI API key in Settings?",
        "Can you show a binary search example?",
        "Can you demonstrate Newton's laws of motion?",
      ],
    };
  }

  // Call OpenAI API
  const promptMessage = `
Student Question: "${question}"
Requested Subject: ${subject || "Auto-detect"}
Difficulty Level: ${difficulty}

Please plan the lesson, structure 3 to 4 sequential steps, and generate the corresponding TeachScript visual elements.
`;

  try {
    const response = await openai.chat.completions.create({
      model: model || "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: TEACHER_SYSTEM_PROMPT },
        { role: "user", content: promptMessage },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from AI model");
    }

    const parsedJson = JSON.parse(content);
    const validated = TeachScriptLessonSchema.parse(parsedJson);
    return validated;
  } catch (error) {
    console.error("OpenAI Lesson Generation Error:", error);
    // If OpenAI call fails (e.g. rate limit / network), fallback gracefully
    const matched = findCurriculumMatch(question);
    if (matched) return matched;
    throw error;
  }
}

/**
 * Answers a student's follow-up question in the context of the active lesson.
 */
export async function answerFollowUpQuestion(
  options: FollowUpOptions
): Promise<{ newStep: LessonStep; suggestedFollowUps?: string[] }> {
  const { question, currentStepId, lessonId, currentLessonContext, model = "gpt-4o", clientApiKey } = options;

  const openai = getOpenAIClient(clientApiKey);

  if (!openai) {
    // Return standard follow-up step
    return {
      newStep: {
        id: `step_${Date.now()}`,
        stepNumber: 99,
        title: `Clarification: ${question.slice(0, 30)}`,
        explanation: `To explore "${question}" in real-time with custom AI whiteboard visuals, please configure your OpenAI API key in the top Settings panel.`,
        narration: `Great question regarding ${question}. Here is a helpful whiteboard visual annotation.`,
        visuals: [
          {
            id: `followup_note_${Date.now()}`,
            type: "text",
            x: 100,
            y: 420,
            text: `Q: ${question}`,
            fontSize: 14,
            fontWeight: "bold",
            color: "#2563eb",
            backgroundColor: "#eff6ff",
          },
        ],
        clearPrevious: false,
      },
      suggestedFollowUps: [
        "Can you explain the previous step again?",
        "What is the mathematical proof behind this?",
      ],
    };
  }

  const promptMessage = `
Active Lesson: ${currentLessonContext?.title || lessonId}
Current Step ID: ${currentStepId}
Student Follow-up Question: "${question}"

Please provide a helpful explanation answering the question and one new lesson step with TeachScript visuals.
`;

  try {
    const response = await openai.chat.completions.create({
      model: model || "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: FOLLOW_UP_SYSTEM_PROMPT },
        { role: "user", content: promptMessage },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from AI model");

    const parsedJson = JSON.parse(content);
    return {
      newStep: LessonStepSchema.parse(parsedJson.newStep),
      suggestedFollowUps: parsedJson.suggestedFollowUps,
    };
  } catch (error) {
    console.error("OpenAI Follow-up Error:", error);
    throw error;
  }
}
