# AI Whiteboard Teacher (Canvas-First Visual Learning Platform)

An interactive educational platform built with Next.js App Router, TypeScript, Tailwind CSS, KaTeX, and vector graphics. Instead of traditional text-heavy chatbot responses, the AI acts as an intelligent digital teacher who breaks down complex concepts into step-by-step visual lessons drawn on an interactive whiteboard.

---

## Key Features

- **Interactive Digital Whiteboard**:
  - Full vector canvas with mouse-wheel zoom, pan, grid dot background, and auto-fit view.
  - Interactive element selection and inspection.
- **Subject-Independent Visual Rendering Engine**:
  - `TextRenderer`: Crisp typography, annotations, cards.
  - `ShapeRenderer`: Rectangles, circles, ellipses, lines, polygons.
  - `EquationRenderer`: Beautiful mathematical typography using KaTeX ($F=ma$, $\lim_{x \to 0} \frac{\sin x}{x}$, quadratic formula).
  - `ArrayRenderer`: Computer science array visualizer with indices, highlight states, and movable pointers (`low`, `mid`, `high`).
  - `GraphRenderer`: Coordinate geometry, axes, plotted function curves ($x^2$, $\sin x$), scatter points, and bar charts.
  - `FlowchartRenderer`: Algorithm flowcharts with nodes and connecting labeled arrows.
  - `ArrowRenderer`: Directed vectors, curved arcs, force vectors with magnitude labels.
  - `DiagramRenderer`: Validated subject diagrams for Physics (Free-body diagrams), Biology (Photosynthesis leaf, Cell), Chemistry (Bohr atomic model), and CS (Binary trees).
  - `AnimationRenderer`: Visual pulsing and highlight effects for guided focus.
- **TeachScript Instruction Protocol**:
  - Safe, structured JSON protocol validated with Zod.
  - Strict coordinate validation, object bounds, and zero arbitrary code execution.
- **AI Teaching Engine**:
  - Powered by OpenAI (`gpt-4o` / `gpt-4o-mini`).
  - Pedagogical prompt engineering breaking topics into intuitive visual steps.
  - In-memory curriculum fallback for instant offline exploration (Binary Search, Newton's 2nd Law, Photosynthesis).
- **Synchronized Voice Narration**:
  - Web Speech API integration that narrates lesson steps with configurable cadence.
  - Microphone input for hands-free voice questions.
- **Contextual Follow-up Learning**:
  - Students can ask follow-ups ("Why does acceleration increase?", "Show another example").
  - AI answers contextually and appends visual steps to the whiteboard.

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ (tested with Node.js 24)
- npm or pnpm

### 2. Environment Configuration
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials:
```env
# OpenAI API Key (Required for live AI generation, or configure inside the app Settings modal)
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o

# Supabase (Optional for cloud persistence; guest mode works out of the box)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## TeachScript Example

```json
{
  "id": "lesson_binary_search",
  "title": "Binary Search Algorithm",
  "subject": "Computer Science",
  "topic": "Divide and Conquer",
  "difficulty": "beginner",
  "steps": [
    {
      "id": "step_1",
      "stepNumber": 1,
      "title": "Understanding the Array",
      "explanation": "Binary search works on a sorted array.",
      "visuals": [
        {
          "id": "array_1",
          "type": "array",
          "x": 100,
          "y": 180,
          "values": [2, 4, 6, 8, 10, 12, 14],
          "pointers": [{ "name": "mid", "index": 3, "color": "#3B82F6" }]
        }
      ]
    }
  ]
}
```

---

## Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Lucide React, KaTeX, Framer Motion.
- **Canvas & Visuals**: Vector SVG Stage, Konva/React-Konva support, KaTeX Math Overlay.
- **Backend**: Next.js Route Handlers, Zod Validation, OpenAI API, Server-Sent Events (SSE).
- **Database**: Supabase PostgreSQL with schema migrations (`supabase/schema.sql`).
