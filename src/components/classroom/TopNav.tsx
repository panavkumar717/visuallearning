"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  History,
  Settings,
  PlusCircle,
  BookOpen,
  Home,
} from "lucide-react";
import { getSubjectColor } from "@/lib/utils/canvas-utils";

interface TopNavProps {
  lessonTitle?: string;
  subject?: string;
  topic?: string;
  difficulty?: string;
  onNewLesson: () => void;
  onToggleHistory: () => void;
  onOpenSettings: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  lessonTitle = "AI Whiteboard Teacher",
  subject,
  topic,
  difficulty,
  onNewLesson,
  onToggleHistory,
  onOpenSettings,
}) => {
  const palette = getSubjectColor(subject);

  return (
    <header className="h-16 px-5 bg-white border-b border-slate-200/80 flex items-center justify-between z-30 select-none shadow-xs">
      {/* Brand / Logo */}
      <Link href="/" className="flex items-center gap-3 group hover:opacity-95 transition-opacity">
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

      {/* Center: Current Lesson Info */}
      <div className="hidden md:flex items-center gap-3 max-w-md truncate">
        {subject && (
          <span
            style={{
              backgroundColor: palette.light,
              borderColor: palette.border,
              color: palette.primary,
            }}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {subject}
          </span>
        )}
        <div className="truncate">
          <h2 className="text-sm font-semibold text-slate-800 truncate">
            {lessonTitle}
          </h2>
          {topic && (
            <p className="text-[11px] text-slate-500 truncate">
              {topic} {difficulty ? `• ${difficulty}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onNewLesson}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/30"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Lesson</span>
        </button>

        <button
          onClick={onToggleHistory}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          title="Lesson History"
        >
          <History className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
