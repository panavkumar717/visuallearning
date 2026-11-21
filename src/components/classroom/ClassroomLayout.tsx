"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "./TopNav";
import { Whiteboard } from "../whiteboard/Whiteboard";
import { LessonControls } from "./LessonControls";
import { ExplanationPanel } from "./ExplanationPanel";
import { QuestionInput } from "./QuestionInput";
import { HistoryDrawer } from "./HistoryDrawer";
import { SettingsModal } from "./SettingsModal";
import { TeachScriptLesson, LessonStep, VisualElement } from "@/types/teachscript";
import { LessonSummary } from "@/types/lesson";
import { speakNarration, cancelSpeech } from "@/lib/voice/speech-service";

interface ClassroomLayoutProps {
  initialLesson?: TeachScriptLesson | null;
  initialLessonId?: string;
}

export const ClassroomLayout: React.FC<ClassroomLayoutProps> = ({
  initialLesson = null,
  initialLessonId,
}) => {
  const router = useRouter();
  const [currentLesson, setCurrentLesson] = useState<TeachScriptLesson | null>(initialLesson);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [lessonHistory, setLessonHistory] = useState<LessonSummary[]>([]);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load client settings and history on mount
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem("canvas_openai_key");
      const storedModel = localStorage.getItem("canvas_openai_model");
      const storedHistory = localStorage.getItem("canvas_lesson_history");

      if (storedKey) setApiKey(storedKey);
      if (storedModel) setModel(storedModel);
      if (storedHistory) setLessonHistory(JSON.parse(storedHistory));
    } catch (e) {
      console.error("Failed to load local storage:", e);
    }
  }, []);

  // Fetch or load lesson when initialLessonId changes
  useEffect(() => {
    if (!initialLessonId) return;

    if (currentLesson && currentLesson.id === initialLessonId) return;

    // Check localStorage cache first
    try {
      const cached = localStorage.getItem(`canvas_lesson_${initialLessonId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        setCurrentLesson(parsed);
        setCurrentStepIndex(0);
        return;
      }
    } catch (e) {}

    // Fetch from backend API
    setIsGenerating(true);
    fetch(`/api/lessons/${initialLessonId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.lesson) {
          setCurrentLesson(data.lesson);
          setCurrentStepIndex(0);
          recordLessonToHistory(data.lesson);
        }
      })
      .catch((err) => {
        console.error("Failed to load lesson from API:", err);
      })
      .finally(() => {
        setIsGenerating(false);
      });
  }, [initialLessonId]);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    try {
      localStorage.setItem("canvas_openai_key", key);
    } catch (e) {}
  };

  const saveModel = (m: string) => {
    setModel(m);
    try {
      localStorage.setItem("canvas_openai_model", m);
    } catch (e) {}
  };

  // Save lesson to history
  const recordLessonToHistory = (lesson: TeachScriptLesson) => {
    const summary: LessonSummary = {
      id: lesson.id,
      title: lesson.title,
      subject: lesson.subject,
      topic: lesson.topic,
      difficulty: lesson.difficulty,
      stepCount: lesson.steps.length,
      createdAt: new Date().toISOString(),
    };

    setLessonHistory((prev) => {
      const filtered = prev.filter((l) => l.id !== lesson.id);
      const updated = [summary, ...filtered].slice(0, 30);
      try {
        localStorage.setItem("canvas_lesson_history", JSON.stringify(updated));
        localStorage.setItem(`canvas_lesson_${lesson.id}`, JSON.stringify(lesson));
      } catch (e) {}
      return updated;
    });
  };

  // Derive visual elements to display on whiteboard
  // Visually accumulate visuals from step 0 up to currentStepIndex (respecting clearPrevious)
  const activeVisuals: VisualElement[] = React.useMemo(() => {
    if (!currentLesson || currentLesson.steps.length === 0) return [];

    let accumulated: VisualElement[] = [];

    for (let i = 0; i <= currentStepIndex; i++) {
      const step = currentLesson.steps[i];
      if (!step) continue;

      if (step.clearPrevious) {
        accumulated = [...step.visuals];
      } else {
        // Merge or replace by ID
        const existingIds = new Set(step.visuals.map((v) => v.id));
        accumulated = [
          ...accumulated.filter((v) => !existingIds.has(v.id)),
          ...step.visuals,
        ];
      }
    }

    return accumulated;
  }, [currentLesson, currentStepIndex]);

  const currentStep: LessonStep | undefined =
    currentLesson?.steps[currentStepIndex];

  // Speech narration when step changes
  useEffect(() => {
    if (isAudioEnabled && currentStep) {
      const textToSpeak = currentStep.narration || currentStep.explanation;
      speakNarration(textToSpeak);
    } else {
      cancelSpeech();
    }

    return () => {
      cancelSpeech();
    };
  }, [currentStepIndex, isAudioEnabled, currentStep]);

  // Auto-play timer effect
  useEffect(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    if (isPlaying && currentLesson) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < currentLesson.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 7000); // 7 seconds per step for comfortable reading
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, currentLesson]);

  // Navigation handlers
  const handleNextStep = () => {
    if (!currentLesson) return;
    if (currentStepIndex < currentLesson.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReplayStep = () => {
    if (isAudioEnabled && currentStep) {
      cancelSpeech();
      const textToSpeak = currentStep.narration || currentStep.explanation;
      speakNarration(textToSpeak);
    }
  };

  // Generate new lesson
  const handleAskQuestion = async (
    question: string,
    difficulty: "beginner" | "intermediate" | "advanced"
  ) => {
    setIsGenerating(true);
    cancelSpeech();

    try {
      const res = await fetch("/api/lessons/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-openai-key": apiKey } : {}),
        },
        body: JSON.stringify({
          question,
          difficulty,
          teachingMode: "visual",
          model,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Failed to generate lesson. Please check API settings or try again.");
        return;
      }

      setCurrentLesson(data.lesson);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      recordLessonToHistory(data.lesson);
      router.push(`/classroom/${data.lesson.id}`);
    } catch (err) {
      console.error("Error generating lesson:", err);
      alert("Network error while generating lesson. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Contextual follow-up question
  const handleAskFollowUp = async (followUpQuestion: string) => {
    if (!currentLesson || !currentStep) return;

    setIsGenerating(true);
    cancelSpeech();

    try {
      const res = await fetch(`/api/sessions/${currentLesson.id}/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-openai-key": apiKey } : {}),
        },
        body: JSON.stringify({
          question: followUpQuestion,
          currentStepId: currentStep.id,
          lessonId: currentLesson.id,
          model,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Failed to process follow-up question.");
        return;
      }

      // If new step was returned, append to steps and advance
      if (data.newStep) {
        const updatedSteps = [...currentLesson.steps, data.newStep];
        const updatedLesson = {
          ...currentLesson,
          steps: updatedSteps,
          suggestedFollowUps: data.suggestedFollowUps || currentLesson.suggestedFollowUps,
        };
        setCurrentLesson(updatedLesson);
        setCurrentStepIndex(updatedSteps.length - 1);
        recordLessonToHistory(updatedLesson);
      }
    } catch (err) {
      console.error("Error processing follow up:", err);
      alert("Failed to submit follow-up question.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Select lesson from history
  const handleSelectHistoryLesson = (lessonId: string) => {
    router.push(`/classroom/${lessonId}`);
  };

  const handleClearHistory = () => {
    setLessonHistory([]);
    try {
      localStorage.removeItem("canvas_lesson_history");
    } catch (e) {}
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 overflow-hidden font-sans">
      {/* Top Navigation */}
      <TopNav
        lessonTitle={currentLesson?.title}
        subject={currentLesson?.subject}
        topic={currentLesson?.topic}
        difficulty={currentLesson?.difficulty}
        onNewLesson={() => {
          setCurrentLesson(null);
          setCurrentStepIndex(0);
          setIsPlaying(false);
          cancelSpeech();
          router.push('/');
        }}
        onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {currentLesson ? (
          <>
            {/* Whiteboard Section (Canvas-First: Dominant space) */}
            <div className="flex-1 flex flex-col h-full min-h-[400px] overflow-hidden p-3 sm:p-4">
              <div className="flex-1 w-full h-full relative">
                <Whiteboard
                  visuals={activeVisuals}
                  onClearCanvas={() => {
                    if (confirm("Reset whiteboard view to initial step?")) {
                      setCurrentStepIndex(0);
                    }
                  }}
                  title={currentLesson.title}
                  subject={currentLesson.subject}
                />
              </div>

              {/* Bottom Playback & Step Controls */}
              <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <LessonControls
                  currentStepIndex={currentStepIndex}
                  totalSteps={currentLesson.steps.length}
                  isPlaying={isPlaying}
                  onTogglePlay={() => setIsPlaying((prev) => !prev)}
                  onPreviousStep={handlePreviousStep}
                  onNextStep={handleNextStep}
                  onReplayStep={handleReplayStep}
                  isGenerating={isGenerating}
                  onStopGeneration={() => {
                    setIsGenerating(false);
                    setIsPlaying(false);
                  }}
                  isAudioEnabled={isAudioEnabled}
                  onToggleAudio={() => setIsAudioEnabled((prev) => !prev)}
                />
              </div>
            </div>

            {/* Explanation & Contextual Follow-up Side Panel */}
            <div className="w-full lg:w-96 xl:w-[420px] h-80 lg:h-full border-t lg:border-t-0 shrink-0">
              <ExplanationPanel
                currentStep={currentStep}
                allSteps={currentLesson.steps}
                currentStepIndex={currentStepIndex}
                onSelectStep={setCurrentStepIndex}
                onAskFollowUp={handleAskFollowUp}
                suggestedQuestions={currentLesson.suggestedFollowUps}
                isThinking={isGenerating}
              />
            </div>
          </>
        ) : (
          /* Empty / Welcome State with Hero Question Input */
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
            <div className="w-full max-w-2xl text-center mb-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <span>Interactive AI Whiteboard Teacher</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Learn Any Concept <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Through Visuals & Diagrams
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
                Ask any question in Computer Science, Physics, Mathematics, Biology, or Chemistry. The AI teacher will break down the concept and illustrate it dynamically on the digital whiteboard.
              </p>
            </div>

            {/* Centered Question Input */}
            <QuestionInput
              onAsk={handleAskQuestion}
              isLoading={isGenerating}
            />
          </div>
        )}
      </div>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        lessons={lessonHistory}
        onSelectLesson={handleSelectHistoryLesson}
        onClearHistory={handleClearHistory}
        currentLessonId={currentLesson?.id}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={saveApiKey}
        model={model}
        onSaveModel={saveModel}
      />
    </div>
  );
};
