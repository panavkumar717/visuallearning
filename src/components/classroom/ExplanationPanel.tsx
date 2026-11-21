"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Lightbulb,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { LessonStep } from "@/types/teachscript";

interface ExplanationPanelProps {
  currentStep?: LessonStep;
  allSteps: LessonStep[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
  onAskFollowUp: (question: string) => void;
  suggestedQuestions?: string[];
  isThinking?: boolean;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  currentStep,
  allSteps,
  currentStepIndex,
  onSelectStep,
  onAskFollowUp,
  suggestedQuestions = [],
  isThinking = false,
}) => {
  const [followUpInput, setFollowUpInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim() || isThinking) return;
    onAskFollowUp(followUpInput.trim());
    setFollowUpInput("");
  };

  const handleSuggestionClick = (q: string) => {
    if (isThinking) return;
    onAskFollowUp(q);
  };

  // Web Speech API Voice Input
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
        setFollowUpInput(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-slate-200/80 shadow-xs">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Teacher Explanation
            </h3>
            <p className="text-[11px] text-slate-500">
              Interactive visual lesson
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
          Step {currentStepIndex + 1} of {allSteps.length}
        </span>
      </div>

      {/* Step Sequence Tabs */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 overflow-x-auto no-scrollbar">
        {allSteps.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => onSelectStep(idx)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition-all ${
              idx === currentStepIndex
                ? "bg-slate-900 text-white shadow-xs"
                : idx < currentStepIndex
                ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {idx < currentStepIndex && (
              <CheckCircle2 className="w-3 h-3 inline mr-1 text-blue-500" />
            )}
            {idx + 1}. {step.title.slice(0, 16)}...
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {currentStep ? (
          <div>
            {/* Step Title */}
            <div className="mb-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                Concept Focus
              </span>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {currentStep.title}
              </h2>
            </div>

            {/* Explanation Prose */}
            <div className="text-sm text-slate-700 leading-relaxed space-y-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 font-normal">
              {currentStep.explanation}
            </div>

            {/* Narration Quote if provided */}
            {currentStep.narration && (
              <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="italic leading-normal">
                  Teacher says: &ldquo;{currentStep.narration}&rdquo;
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
            <HelpCircle className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
            <p className="text-sm font-medium">No lesson active yet</p>
            <p className="text-xs text-slate-400">
              Ask any question below to start visual teaching!
            </p>
          </div>
        )}

        {/* Suggested Follow-up Questions */}
        {suggestedQuestions.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-2">
              <MessageSquare className="w-3 h-3" />
              Suggested Follow-ups:
            </span>
            <div className="flex flex-col gap-1.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(q)}
                  disabled={isThinking}
                  className="text-left text-xs text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  💡 {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Follow-up Question Input Form */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/60">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={followUpInput}
            onChange={(e) => setFollowUpInput(e.target.value)}
            placeholder="Ask a follow-up or ask to explain..."
            disabled={isThinking}
            className="w-full pl-3.5 pr-20 py-2.5 text-xs bg-white border border-slate-300 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            {/* Microphone Button for Voice */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-1.5 rounded-lg transition-colors ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
              title={isListening ? "Listening... click to stop" : "Speak question"}
            >
              {isListening ? (
                <MicOff className="w-3.5 h-3.5" />
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!followUpInput.trim() || isThinking}
              className="p-1.5 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 rounded-lg transition-all shadow-xs"
              title="Submit follow-up"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
