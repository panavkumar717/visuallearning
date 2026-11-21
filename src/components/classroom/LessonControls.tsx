"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";

interface LessonControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
  onReplayStep: () => void;
  isGenerating?: boolean;
  onStopGeneration?: () => void;
  isAudioEnabled?: boolean;
  onToggleAudio?: () => void;
}

export const LessonControls: React.FC<LessonControlsProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  onTogglePlay,
  onPreviousStep,
  onNextStep,
  onReplayStep,
  isGenerating = false,
  onStopGeneration,
  isAudioEnabled = true,
  onToggleAudio,
}) => {
  const isFirst = currentStepIndex <= 0;
  const isLast = currentStepIndex >= totalSteps - 1;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-white border-t border-slate-200/80 shadow-xs">
      {/* Left: Step navigation controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPreviousStep}
          disabled={isFirst || isGenerating}
          className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl transition-colors"
          title="Previous Step"
          aria-label="Previous Step"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={onTogglePlay}
          disabled={isGenerating || totalSteps <= 1}
          className="p-2 text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-40 rounded-xl transition-all shadow-sm shadow-blue-500/20"
          title={isPlaying ? "Pause Lesson" : "Auto-Play Lesson"}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={onNextStep}
          disabled={isLast || isGenerating}
          className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl transition-colors"
          title="Next Step"
          aria-label="Next Step"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={onReplayStep}
          disabled={isGenerating}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors ml-1"
          title="Replay Current Step"
          aria-label="Replay Step"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Step indicators */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-700">
          Step {Math.min(currentStepIndex + 1, totalSteps)} of {totalSteps}
        </span>
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? "w-6 bg-blue-600"
                  : idx < currentStepIndex
                  ? "w-2 bg-blue-300"
                  : "w-2 bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right: Audio narration toggle & Stop button */}
      <div className="flex items-center gap-2">
        {isGenerating && (
          <button
            onClick={onStopGeneration}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
          </button>
        )}

        <button
          onClick={onToggleAudio}
          className={`p-2 rounded-xl transition-colors ${
            isAudioEnabled
              ? "text-blue-600 hover:bg-blue-50"
              : "text-slate-400 hover:bg-slate-100"
          }`}
          title={isAudioEnabled ? "Mute Teacher Voice" : "Enable Teacher Voice"}
        >
          {isAudioEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
