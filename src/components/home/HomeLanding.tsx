"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  Atom,
  Binary,
  Compass,
  Cpu,
  History,
  Settings,
  ChevronRight,
  Layers,
  Volume2,
} from "lucide-react";
import { QuestionInput } from "@/components/classroom/QuestionInput";
import { HistoryDrawer } from "@/components/classroom/HistoryDrawer";
import { SettingsModal } from "@/components/classroom/SettingsModal";
import { LessonSummary } from "@/types/lesson";
import { getSubjectColor } from "@/lib/utils/canvas-utils";

const SUBJECT_CARDS = [
  {
    title: "Binary Search Algorithm",
    subject: "Computer Science",
    topic: "Divide and Conquer",
    description: "Watch how a sorted array is partitioned in O(log n) time with mid pointers and range eliminations.",
    href: "/classroom/lesson_binary_search",
    icon: Binary,
    badge: "Computer Science",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    title: "Newton's Second Law",
    subject: "Physics",
    topic: "Dynamics & Force Vectors",
    description: "Explore free-body diagrams, force vectors, and the relationship between mass, force, and acceleration.",
    href: "/classroom/lesson_newton_second_law",
    icon: Compass,
    badge: "Physics",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    title: "Photosynthesis Process",
    subject: "Biology",
    topic: "Bioenergetics & Cellular Reactions",
    description: "Visualize sunlight absorption, chloroplast reactions, water splitting, and the balanced chemical formula.",
    href: "/classroom/lesson_photosynthesis",
    icon: Atom,
    badge: "Biology",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

export const HomeLanding: React.FC = () => {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [lessonHistory, setLessonHistory] = useState<LessonSummary[]>([]);

  // Load client settings and history
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem("canvas_openai_key");
      const storedModel = localStorage.getItem("canvas_openai_model");
      const storedHistory = localStorage.getItem("canvas_lesson_history");

      if (storedKey) setApiKey(storedKey);
      if (storedModel) setModel(storedModel);
      if (storedHistory) setLessonHistory(JSON.parse(storedHistory));
    } catch (e) {}
  }, []);

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

  // Handle question submission from landing page
  const handleAskQuestion = async (
    question: string,
    difficulty: "beginner" | "intermediate" | "advanced"
  ) => {
    setIsGenerating(true);

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

      // Save to localStorage history
      try {
        const summary: LessonSummary = {
          id: data.lesson.id,
          title: data.lesson.title,
          subject: data.lesson.subject,
          topic: data.lesson.topic,
          difficulty: data.lesson.difficulty,
          stepCount: data.lesson.steps.length,
          createdAt: new Date().toISOString(),
        };
        const updated = [summary, ...lessonHistory.filter((l) => l.id !== data.lesson.id)].slice(0, 30);
        localStorage.setItem("canvas_lesson_history", JSON.stringify(updated));
        localStorage.setItem(`canvas_lesson_${data.lesson.id}`, JSON.stringify(data.lesson));
      } catch (e) {}

      // ROUTE TO CLASSROOM WITH LESSON ID
      router.push(`/classroom/${data.lesson.id}`);
    } catch (err) {
      console.error("Error generating lesson:", err);
      alert("Network error while generating lesson. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="h-16 px-6 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base group-hover:text-blue-600 transition-colors">
                Antigravity Canvas
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                AI Teacher
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Visual Interactive Digital Whiteboard
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <Link
            href="/classroom/lesson_binary_search"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Whiteboard</span>
          </Link>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Lesson History"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Canvas-First Interactive AI Teaching</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Learn Any Concept Through <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
              Interactive Whiteboard Visuals
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Unlike conventional chatbots that send text paragraphs, our AI teacher draws dynamic diagrams, mathematical equations, graphs, flowcharts, and arrays directly on a digital whiteboard.
          </p>
        </div>

        {/* Interactive Question Input Box */}
        <div className="relative">
          <QuestionInput
            onAsk={handleAskQuestion}
            isLoading={isGenerating}
          />
        </div>

        {/* Curated Interactive Subjects Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Featured Visual Lessons
              </h2>
              <p className="text-xs text-slate-500">
                Click any topic below to open its whiteboard session immediately
              </p>
            </div>
            <Link
              href="/classroom/lesson_binary_search"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SUBJECT_CARDS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={idx}
                  href={card.href}
                  className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Icon className="w-5 h-5 text-slate-700 group-hover:text-blue-600" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {card.topic}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                    <span>Launch Whiteboard</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Lessons (if any in history) */}
        {lessonHistory.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Continue Recent Lessons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lessonHistory.slice(0, 6).map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/classroom/${lesson.id}`}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 transition-all flex items-center justify-between group"
                >
                  <div className="truncate pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {lesson.subject}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600">
                      {lesson.title}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {lesson.stepCount} steps • {lesson.difficulty}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Feature Capabilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80">
          <div className="p-4 bg-white/70 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
              <Layers className="w-4 h-4" />
              <span>Canvas-First Teaching</span>
            </div>
            <p className="text-xs text-slate-500">
              Whiteboard takes 75%+ of the screen with zoom, pan, and interactive object inspection.
            </p>
          </div>

          <div className="p-4 bg-white/70 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
              <BookOpen className="w-4 h-4" />
              <span>KaTeX Mathematical Equations</span>
            </div>
            <p className="text-xs text-slate-500">
              Crisp LaTeX formula rendering with live step highlighting and derivations.
            </p>
          </div>

          <div className="p-4 bg-white/70 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs">
              <Cpu className="w-4 h-4" />
              <span>Multi-Subject Engine</span>
            </div>
            <p className="text-xs text-slate-500">
              One unified visual engine for Computer Science, Physics, Chemistry, Biology, and Math.
            </p>
          </div>

          <div className="p-4 bg-white/70 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
              <Volume2 className="w-4 h-4" />
              <span>Synchronized Voice</span>
            </div>
            <p className="text-xs text-slate-500">
              Speech synthesis narrates every step with audio playback and microphone Q&A.
            </p>
          </div>
        </div>
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        lessons={lessonHistory}
        onSelectLesson={handleSelectHistoryLesson}
        onClearHistory={handleClearHistory}
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
