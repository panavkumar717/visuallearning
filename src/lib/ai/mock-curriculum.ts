import { TeachScriptLesson } from "@/types/teachscript";

export const MOCK_CURRICULUM: Record<string, TeachScriptLesson> = {
  "binary-search": {
    id: "lesson_binary_search",
    title: "Binary Search Algorithm",
    subject: "Computer Science",
    topic: "Search Algorithms & Divide and Conquer",
    difficulty: "beginner",
    overview:
      "Binary search is an efficient O(log n) algorithm for finding an item in a sorted array by repeatedly halving the search interval.",
    steps: [
      {
        id: "bs_step_1",
        stepNumber: 1,
        title: "1. The Sorted Array",
        explanation:
          "Binary search operates on a sorted array of elements. Because the elements are ordered, we can eliminate half of the remaining elements in each step. Here, we are looking for the target value 14 in an array of 7 elements.",
        narration:
          "Welcome to binary search! Look at this sorted array on our whiteboard. Our mission is to find the number 14 efficiently.",
        visuals: [
          {
            id: "bs_title_text",
            type: "text",
            x: 80,
            y: 50,
            text: "Target: 14 in Sorted Array",
            fontSize: 22,
            fontWeight: "bold",
            color: "#1e293b",
          },
          {
            id: "bs_array_1",
            type: "array",
            x: 80,
            y: 130,
            values: [2, 5, 8, 12, 14, 19, 23],
            cellWidth: 64,
            cellHeight: 64,
            pointers: [
              { name: "low", index: 0, color: "#16a34a", position: "top" },
              { name: "high", index: 6, color: "#dc2626", position: "top" },
            ],
          },
          {
            id: "bs_formula_1",
            type: "equation",
            x: 80,
            y: 280,
            latex: "\\text{mid} = \\left\\lfloor \\frac{\\text{low} + \\text{high}}{2} \\right\\rfloor = \\left\\lfloor \\frac{0 + 6}{2} \\right\\rfloor = 3",
            fontSize: 18,
            boxColor: "#f8fafc",
          },
        ],
        clearPrevious: false,
      },
      {
        id: "bs_step_2",
        stepNumber: 2,
        title: "2. Inspect the Middle Element",
        explanation:
          "We check the value at index 3, which is 12. Since our target (14) is greater than 12, the target cannot exist in the left half of the array! We can discard elements 0 through 3.",
        narration:
          "Now look at index 3. The value is 12. Since 14 is greater than 12, we can eliminate the entire left side of the array!",
        visuals: [
          {
            id: "bs_array_1",
            type: "array",
            x: 80,
            y: 130,
            values: [2, 5, 8, 12, 14, 19, 23],
            cellWidth: 64,
            cellHeight: 64,
            activeIndex: 3,
            highlightedIndices: [0, 1, 2, 3],
            highlightColor: "#94a3b8",
            pointers: [
              { name: "low", index: 0, color: "#16a34a", position: "top" },
              { name: "mid = 3", index: 3, color: "#2563eb", position: "bottom" },
              { name: "high", index: 6, color: "#dc2626", position: "top" },
            ],
          },
          {
            id: "bs_compare_eq",
            type: "equation",
            x: 80,
            y: 360,
            latex: "14 > 12 \\implies \\text{low} = \\text{mid} + 1 = 4",
            fontSize: 20,
            boxColor: "#eff6ff",
          },
          {
            id: "bs_elim_arrow",
            type: "arrow",
            x: 0,
            y: 0,
            from: { x: 80, y: 220 },
            to: { x: 300, y: 220 },
            color: "#94a3b8",
            dashed: true,
            label: "Eliminated Half (<= 12)",
          },
        ],
        clearPrevious: false,
      },
      {
        id: "bs_step_3",
        stepNumber: 3,
        title: "3. Halve the Window & Match Found",
        explanation:
          "Our new search window is from index 4 to index 6. We calculate the new mid: (4 + 6) / 2 = 5 (value 19). Since 14 < 19, high becomes 4. Next, mid is 4. Value at index 4 is 14! Match found in only 3 comparisons instead of 7.",
        narration:
          "We narrow our window. Now we inspect index 4: value is 14. We found our target! That took only 3 steps instead of checking every element.",
        visuals: [
          {
            id: "bs_array_1",
            type: "array",
            x: 80,
            y: 130,
            values: [2, 5, 8, 12, 14, 19, 23],
            cellWidth: 64,
            cellHeight: 64,
            activeIndex: 4,
            highlightedIndices: [4],
            highlightColor: "#16a34a",
            pointers: [
              { name: "FOUND: Target 14", index: 4, color: "#16a34a", position: "bottom" },
            ],
          },
          {
            id: "bs_complexity_eq",
            type: "equation",
            x: 80,
            y: 440,
            latex: "\\text{Time Complexity: } O(\\log_2 n) \\quad (\\approx 3 \\text{ steps for } n=7)",
            fontSize: 18,
            boxColor: "#f0fdf4",
          },
        ],
        clearPrevious: false,
      },
    ],
    suggestedFollowUps: [
      "What happens if the array is not sorted?",
      "How does binary search compare to linear search for 1,000,000 items?",
      "Can binary search be implemented recursively?",
    ],
  },

  "newton-second-law": {
    id: "lesson_newton_second_law",
    title: "Newton's Second Law of Motion",
    subject: "Physics",
    topic: "Classical Mechanics & Dynamics",
    difficulty: "beginner",
    overview:
      "Newton's second law states that the acceleration of an object depends on the net force acting upon it and the mass of the object (F = ma).",
    steps: [
      {
        id: "n2_step_1",
        stepNumber: 1,
        title: "1. The Free Body & Forces",
        explanation:
          "Consider an object of mass m resting on a frictionless surface. Multiple forces can act on the object simultaneously. The vertical forces (normal force and gravity) balance each other out.",
        narration:
          "Let's study Newton's second law. On our whiteboard, here is a physical body of mass m with gravity pulling down and normal force pushing up.",
        visuals: [
          {
            id: "n2_body",
            type: "diagram",
            x: 240,
            y: 200,
            diagramType: "force_body",
            params: { mass: "m", fApplied: "F", fNormal: true, fGravity: true },
            label: "Free Body Diagram",
          },
          {
            id: "n2_law_eq",
            type: "equation",
            x: 480,
            y: 120,
            latex: "\\mathbf{F}_{\\text{net}} = m \\cdot \\mathbf{a}",
            fontSize: 26,
            boxColor: "#f5f3ff",
          },
        ],
        clearPrevious: false,
      },
      {
        id: "n2_step_2",
        stepNumber: 2,
        title: "2. Acceleration is Proportional to Force",
        explanation:
          "Rearranging the formula gives a = F / m. If mass is kept constant and we double the applied force, the acceleration doubles. Force and acceleration are directly proportional.",
        narration:
          "Notice how acceleration equals force divided by mass. If you push twice as hard with force 2F, the mass accelerates twice as fast!",
        visuals: [
          {
            id: "n2_rearranged",
            type: "equation",
            x: 480,
            y: 220,
            latex: "\\mathbf{a} = \\frac{\\mathbf{F}_{\\text{net}}}{m}",
            fontSize: 24,
            boxColor: "#eff6ff",
          },
          {
            id: "n2_graph",
            type: "graph",
            x: 480,
            y: 310,
            width: 320,
            height: 180,
            xRange: [0, 10],
            yRange: [0, 10],
            xLabel: "Force (N)",
            yLabel: "Accel (m/s²)",
            plotType: "function",
            expression: "x",
            color: "#7c3aed",
          },
        ],
        clearPrevious: false,
      },
      {
        id: "n2_step_3",
        stepNumber: 3,
        title: "3. Mass Resists Acceleration (Inertia)",
        explanation:
          "Mass acts as an object's inertia. For a fixed force F, a larger mass experiences smaller acceleration. An empty cart accelerates much faster than a cart loaded with bricks.",
        narration:
          "Heavier objects have greater inertia, meaning they resist changes in motion. Twice the mass means half the acceleration.",
        visuals: [
          {
            id: "n2_summary_box",
            type: "shape",
            shapeType: "rectangle",
            x: 120,
            y: 400,
            width: 300,
            height: 90,
            fill: "#f8fafc",
            stroke: "#7c3aed",
            strokeWidth: 2,
            cornerRadius: 12,
          },
          {
            id: "n2_summary_text1",
            type: "text",
            x: 140,
            y: 425,
            text: "• Force ↑  =>  Acceleration ↑",
            fontSize: 14,
            fontWeight: "bold",
            color: "#1e293b",
          },
          {
            id: "n2_summary_text2",
            type: "text",
            x: 140,
            y: 455,
            text: "• Mass ↑   =>  Acceleration ↓",
            fontSize: 14,
            fontWeight: "bold",
            color: "#1e293b",
          },
        ],
        clearPrevious: false,
      },
    ],
    suggestedFollowUps: [
      "What role does friction play in Newton's second law?",
      "How is weight different from mass?",
      "How does this connect to Newton's third law?",
    ],
  },

  photosynthesis: {
    id: "lesson_photosynthesis",
    title: "Photosynthesis Process in Plants",
    subject: "Biology",
    topic: "Plant Physiology & Cellular Bioenergetics",
    difficulty: "beginner",
    overview:
      "Photosynthesis is the biological process by which green plants transform light energy into chemical energy, converting water and carbon dioxide into glucose and oxygen.",
    steps: [
      {
        id: "photo_step_1",
        stepNumber: 1,
        title: "1. The Plant Leaf as a Solar Factory",
        explanation:
          "Plants capture sunlight using chlorophyll pigments inside chloroplast organelles. Chlorophyll absorbs red and blue light while reflecting green light, which is why leaves appear green.",
        narration:
          "Look at our digital plant leaf. It acts as nature's solar power factory, absorbing sunlight while drinking water from the soil.",
        visuals: [
          {
            id: "photo_diagram",
            type: "diagram",
            x: 200,
            y: 180,
            diagramType: "plant",
            params: { stage: "inputs" },
            label: "Photosynthetic Machinery",
          },
        ],
        clearPrevious: false,
      },
      {
        id: "photo_step_2",
        stepNumber: 2,
        title: "2. The Chemical Transformation",
        explanation:
          "Six molecules of carbon dioxide (CO2) from the air combine with six molecules of water (H2O) from the roots. Sunlight provides the activation energy to synthesize glucose (C6H12O6) and release six molecules of breathable oxygen (O2).",
        narration:
          "Here is the balanced chemical formula. Six molecules of carbon dioxide plus six molecules of water yield glucose energy and pure oxygen.",
        visuals: [
          {
            id: "photo_chem_eq",
            type: "equation",
            x: 120,
            y: 360,
            latex: "6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2",
            fontSize: 22,
            boxColor: "#f0fdf4",
          },
        ],
        clearPrevious: false,
      },
      {
        id: "photo_step_3",
        stepNumber: 3,
        title: "3. Light vs. Dark Reactions",
        explanation:
          "Photosynthesis consists of two stages: 1) Light-dependent reactions in the thylakoid membranes (water splitting & ATP generation), and 2) The Calvin Cycle in the stroma (carbon fixation into sugars).",
        narration:
          "In summary, water splitting produces oxygen during daytime light reactions, while the Calvin cycle converts carbon dioxide into glucose.",
        visuals: [
          {
            id: "photo_flow",
            type: "flowchart",
            x: 480,
            y: 160,
            nodes: [
              { id: "n1", label: "Light Reactions", x: 0, y: 0, fill: "#fef08a", stroke: "#eab308" },
              { id: "n2", label: "Calvin Cycle", x: 0, y: 100, fill: "#bbf7d0", stroke: "#22c55e" },
            ],
            edges: [
              { from: "n1", to: "n2", label: "ATP & NADPH", color: "#16a34a" },
            ],
          },
        ],
        clearPrevious: false,
      },
    ],
    suggestedFollowUps: [
      "Where does the oxygen released by plants actually come from: water or carbon dioxide?",
      "What is the difference between C3, C4, and CAM plants?",
      "Why does temperature affect the rate of photosynthesis?",
    ],
  },
};

/**
 * Matches a student's question against known curricular exemplars
 */
export function findCurriculumMatch(query: string): TeachScriptLesson | null {
  const lower = query.toLowerCase();

  if (lower.includes("binary") || lower.includes("search") || lower.includes("array")) {
    return MOCK_CURRICULUM["binary-search"];
  }

  if (lower.includes("newton") || lower.includes("force") || lower.includes("law of motion") || lower.includes("f = ma")) {
    return MOCK_CURRICULUM["newton-second-law"];
  }

  if (lower.includes("photo") || lower.includes("plant") || lower.includes("chlorophyll") || lower.includes("leaf")) {
    return MOCK_CURRICULUM["photosynthesis"];
  }

  return null;
}
