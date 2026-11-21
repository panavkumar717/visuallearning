"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Mic, MicOff, BookOpen, Layers } from "lucide-react";

interface QuestionInputProps {
  onAsk: (question: string, difficulty: "beginner" | "intermediate" | "advanced") => void;
  isLoading?: boolean;
}

const EXAMPLE_TOPICS = [
  { label: "Binary Search", subject: "Computer Science", query: "Explain binary search algorithm" },
  { label: "Newton's Second Law", subject: "Physics", query: "Explain Newton's second law F = ma" },
  { label: "Photosynthesis", subject: "Biology", query: "Explain photosynthesis process in plants" },
  { label: "Quadratic Formula", subject: "Mathematics", query: "Explain the quadratic formula and graphing parabolas" },
  { label: "Bohr Atomic Model", subject: "Chemistry", query: "Explain Bohr's model of the atom" },
];

export const QuestionInput: React.FC<QuestionInputProps> = ({
  onAsk,
  isLoading = false,
}) => {
  const [question, setQuestion] = useState("");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    onAsk(question.trim(), difficulty);
  };

  const handleExampleClick = (query: string) => {
    if (isLoading) return;
    setQuestion(query);
    onAsk(query, difficulty);
  };

  // Web Speech API Voice Recognition
  const toggleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Please type your question.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Input Row */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything to teach on the whiteboard... (e.g. 'Explain binary search')"
            disabled={isLoading}
            className="w-full pl-5 pr-28 py-4 text-sm sm:text-base bg-slate-50 hover:bg-slate-50/80 border border-slate-300 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
          />

          <div className="absolute right-2.5 flex items-center gap-1.5">
            {/* Microphone button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2.5 rounded-xl transition-colors ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              }`}
              title={isListening ? "Listening... click to stop" : "Ask using voice"}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-40 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/25 transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Teaching...</span>
                </span>
              ) : (
                <>
                  <span>Teach Me</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Options & Difficulty Selection */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              Level:
            </span>
            {(["beginner", "intermediate", "advanced"] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setDifficulty(lvl)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all ${
                  difficulty === lvl
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400">
            Powered by TeachScript & OpenAI
          </div>
        </div>

        {/* Example Questions Pills */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Try a visual lesson example:
          </span>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_TOPICS.map((topic, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleExampleClick(topic.query)}
                disabled={isLoading}
                className="px-3 py-1.5 bg-slate-100/80 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-600 rounded-xl border border-slate-200 text-xs font-medium transition-all text-left flex items-center gap-1.5"
              >
                <BookOpen className="w-3 h-3 text-slate-400" />
                <span>{topic.label}</span>
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
