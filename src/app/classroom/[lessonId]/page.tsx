"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";

function LessonContainer() {
  const params = useParams();
  const lessonId = typeof params?.lessonId === "string" ? params.lessonId : undefined;
  return <ClassroomLayout initialLessonId={lessonId} />;
}

export default function ClassroomLessonPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-slate-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-500">Loading Whiteboard...</span>
          </div>
        </div>
      }
    >
      <LessonContainer />
    </Suspense>
  );
}
