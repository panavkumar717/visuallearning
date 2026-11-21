"use client";

import React from "react";
import { X, BookOpen, Clock, ChevronRight, Trash2 } from "lucide-react";
import { LessonSummary } from "@/types/lesson";
import { getSubjectColor } from "@/lib/utils/canvas-utils";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: LessonSummary[];
  onSelectLesson: (lessonId: string) => void;
  onClearHistory?: () => void;
  currentLessonId?: string;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  lessons,
  onSelectLesson,
  onClearHistory,
  currentLessonId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-sm h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="font-bold text-slate-900 text-sm">Lesson History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lessons List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {lessons.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">No previous lessons</p>
              <p className="text-xs text-slate-400 mt-1">
                Your generated whiteboard lessons will appear here.
              </p>
            </div>
          ) : (
            lessons.map((lesson) => {
              const isSelected = lesson.id === currentLessonId;
              const palette = getSubjectColor(lesson.subject);

              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    onSelectLesson(lesson.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="space-y-1 truncate pr-2">
                    <span
                      style={{
                        backgroundColor: palette.light,
                        color: palette.primary,
                        borderColor: palette.border,
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block uppercase tracking-wider"
                    >
                      {lesson.subject}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {lesson.title}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {lesson.stepCount} steps • {lesson.difficulty}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {lessons.length > 0 && onClearHistory && (
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={onClearHistory}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
