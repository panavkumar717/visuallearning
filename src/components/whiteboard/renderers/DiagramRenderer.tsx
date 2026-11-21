"use client";

import React from "react";
import { DiagramVisualElement } from "@/types/teachscript";

interface DiagramRendererProps {
  element: DiagramVisualElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({
  element,
  isSelected,
  onClick,
}) => {
  const { id, x, y, diagramType, params = {}, label, opacity = 1 } = element;

  const renderSubjectDiagram = () => {
    switch (diagramType) {
      // 1. PHYSICS: Free Body Force Diagram
      case "force_body": {
        const mass = params.mass || "m";
        const fApplied = params.fApplied || "F";
        const fFriction = params.fFriction;
        const fNormal = params.fNormal ?? true;
        const fGravity = params.fGravity ?? true;

        return (
          <g>
            {/* Ground Surface */}
            <line x1={-80} y1={50} x2={160} y2={50} stroke="#94a3b8" strokeWidth={2} />
            {[-60, -30, 0, 30, 60, 90, 120].map((gx) => (
              <line key={gx} x1={gx} y1={50} x2={gx - 10} y2={60} stroke="#cbd5e1" strokeWidth={1.5} />
            ))}

            {/* Mass Block */}
            <rect
              x={-30}
              y={-10}
              width={60}
              height={60}
              rx={6}
              fill="#e2e8f0"
              stroke="#475569"
              strokeWidth={2}
            />
            <text x={0} y={25} textAnchor="middle" fontWeight="bold" fontSize={16} fill="#1e293b">
              {mass}
            </text>

            {/* Force Applied Vector (Right) */}
            <g stroke="#2563eb" strokeWidth={3} fill="#2563eb">
              <line x1={30} y1={20} x2={110} y2={20} />
              <polygon points="110,20 98,14 98,26" />
              <text x={115} y={24} fontSize={14} fontWeight="bold" stroke="none">
                {fApplied}
              </text>
            </g>

            {/* Normal Force Vector (Up) */}
            {fNormal && (
              <g stroke="#16a34a" strokeWidth={3} fill="#16a34a">
                <line x1={0} y1={-10} x2={0} y2={-70} />
                <polygon points="0,-70 -6,-58 6,-58" />
                <text x={8} y={-70} fontSize={13} fontWeight="bold" stroke="none">
                  F_N
                </text>
              </g>
            )}

            {/* Gravity Force Vector (Down) */}
            {fGravity && (
              <g stroke="#dc2626" strokeWidth={3} fill="#dc2626">
                <line x1={0} y1={50} x2={0} y2={110} />
                <polygon points="0,110 -6,98 6,98" />
                <text x={8} y={115} fontSize={13} fontWeight="bold" stroke="none">
                  F_g = mg
                </text>
              </g>
            )}

            {/* Friction Force Vector (Left) */}
            {fFriction && (
              <g stroke="#d97706" strokeWidth={3} fill="#d97706">
                <line x1={-30} y1={20} x2={-80} y2={20} />
                <polygon points="-80,20 -68,14 -68,26" />
                <text x={-100} y={24} fontSize={13} fontWeight="bold" stroke="none">
                  {fFriction}
                </text>
              </g>
            )}
          </g>
        );
      }

      // 2. BIOLOGY: Photosynthesis Diagram
      case "plant": {
        return (
          <g>
            {/* Sun & Light Rays */}
            <g transform="translate(-80, -70)">
              <circle cx={0} cy={0} r={22} fill="#fbbf24" stroke="#f59e0b" strokeWidth={2} />
              <text x={-20} y={-30} fontSize={11} fontWeight="bold" fill="#b45309">
                Sunlight (Photons)
              </text>
              {/* Rays pointing to leaf */}
              <line x1={15} y1={15} x2={55} y2={45} stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" />
              <polygon points="55,45 44,40 48,34" fill="#f59e0b" />
            </g>

            {/* Stylized Leaf */}
            <path
              d="M 0,20 C 40,-40 100,-20 120,20 C 100,60 40,80 0,20 Z"
              fill="#4ade80"
              stroke="#15803d"
              strokeWidth={2.5}
            />
            {/* Leaf Veins */}
            <path d="M 0,20 Q 60,15 120,20" stroke="#15803d" strokeWidth={1.5} fill="none" />
            <line x1={40} y1={18} x2={60} y2={-5} stroke="#15803d" strokeWidth={1.2} />
            <line x1={80} y1={19} x2={95} y2={0} stroke="#15803d" strokeWidth={1.2} />
            <line x1={50} y1={20} x2={65} y2={40} stroke="#15803d" strokeWidth={1.2} />

            {/* Inputs: H2O and CO2 */}
            <g transform="translate(10, 80)">
              <text x={0} y={0} fill="#0284c7" fontWeight="bold" fontSize={13}>
                H₂O (Water)
              </text>
              <line x1={20} y1={-8} x2={25} y2={-30} stroke="#0284c7" strokeWidth={2} />
              <polygon points="25,-30 20,-20 30,-20" fill="#0284c7" />
            </g>
            <g transform="translate(-60, 20)">
              <text x={0} y={0} fill="#475569" fontWeight="bold" fontSize={13}>
                CO₂ (In)
              </text>
              <line x1={35} y1={-4} x2={65} y2={-4} stroke="#475569" strokeWidth={2} />
              <polygon points="65,-4 55,-8 55,0" fill="#475569" />
            </g>

            {/* Outputs: O2 and Glucose */}
            <g transform="translate(130, 20)">
              <line x1={0} y1={-4} x2={35} y2={-4} stroke="#16a34a" strokeWidth={2} />
              <polygon points="35,-4 25,-8 25,0" fill="#16a34a" />
              <text x={42} y={0} fill="#16a34a" fontWeight="bold" fontSize={13}>
                O₂ (Oxygen) + Glucose
              </text>
            </g>
          </g>
        );
      }

      // 3. CHEMISTRY / PHYSICS: Bohr Atomic Model
      case "atom": {
        const elementName = params.element || "Carbon";
        const symbol = params.symbol || "C";
        const protons = params.protons ?? 6;
        const neutrons = params.neutrons ?? 6;

        return (
          <g>
            {/* Electron Shell 1 */}
            <circle cx={0} cy={0} r={45} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" />
            {/* Shell 1 electrons (2) */}
            <circle cx={0} cy={-45} r={5} fill="#3b82f6" />
            <circle cx={0} cy={45} r={5} fill="#3b82f6" />

            {/* Electron Shell 2 */}
            <circle cx={0} cy={0} r={80} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" />
            {/* Shell 2 electrons */}
            <circle cx={-80} cy={0} r={5} fill="#3b82f6" />
            <circle cx={80} cy={0} r={5} fill="#3b82f6" />
            <circle cx={-56} cy={-56} r={5} fill="#3b82f6" />
            <circle cx={56} cy={56} r={5} fill="#3b82f6" />

            {/* Nucleus */}
            <circle cx={0} cy={0} r={25} fill="#fca5a5" stroke="#ef4444" strokeWidth={2} />
            <text x={0} y={-3} textAnchor="middle" fontWeight="bold" fontSize={13} fill="#991b1b">
              {symbol}
            </text>
            <text x={0} y={12} textAnchor="middle" fontSize={9} fill="#7f1d1d">
              {protons}p⁺ / {neutrons}n⁰
            </text>

            <text x={0} y={105} textAnchor="middle" fontWeight="bold" fontSize={13} fill="#334155">
              {elementName} Atom
            </text>
          </g>
        );
      }

      // 4. COMPUTER SCIENCE: Binary Tree
      case "binary_tree": {
        const rootVal = params.root || 10;
        const leftVal = params.left || 5;
        const rightVal = params.right || 15;

        return (
          <g>
            {/* Branches */}
            <line x1={0} y1={0} x2={-50} y2={60} stroke="#64748b" strokeWidth={2} />
            <line x1={0} y1={0} x2={50} y2={60} stroke="#64748b" strokeWidth={2} />

            {/* Root Node */}
            <circle cx={0} cy={0} r={20} fill="#dbeafe" stroke="#2563eb" strokeWidth={2.5} />
            <text x={0} y={5} textAnchor="middle" fontWeight="bold" fontSize={13} fill="#1d4ed8">
              {rootVal}
            </text>

            {/* Left Child */}
            <circle cx={-50} cy={60} r={18} fill="#f1f5f9" stroke="#64748b" strokeWidth={2} />
            <text x={-50} y={65} textAnchor="middle" fontWeight="bold" fontSize={12} fill="#334155">
              {leftVal}
            </text>

            {/* Right Child */}
            <circle cx={50} cy={60} r={18} fill="#f1f5f9" stroke="#64748b" strokeWidth={2} />
            <text x={50} y={65} textAnchor="middle" fontWeight="bold" fontSize={12} fill="#334155">
              {rightVal}
            </text>
          </g>
        );
      }

      // 5. BIOLOGY: Cell Diagram
      case "cell": {
        return (
          <g>
            {/* Outer Membrane */}
            <ellipse cx={0} cy={0} rx={90} ry={60} fill="#fef3c7" stroke="#d97706" strokeWidth={3} />
            {/* Nucleus */}
            <circle cx={-20} cy={-5} r={24} fill="#c7d2fe" stroke="#4f46e5" strokeWidth={2} />
            <circle cx={-22} cy={-6} r={10} fill="#818cf8" />
            <text x={-20} y={28} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#3730a3">
              Nucleus
            </text>
            {/* Mitochondria */}
            <ellipse cx={40} cy={15} rx={16} ry={9} fill="#fed7aa" stroke="#ea580c" strokeWidth={1.5} />
            <text x={40} y={35} textAnchor="middle" fontSize={9} fill="#c2410c">
              Mitochondria
            </text>
            {/* Cytoplasm label */}
            <text x={-50} y={-35} fontSize={10} fill="#92400e">
              Cytoplasm
            </text>
          </g>
        );
      }

      default:
        return (
          <rect width={100} height={60} fill="#f1f5f9" stroke="#94a3b8" rx={6} />
        );
    }
  };

  return (
    <g
      id={id}
      transform={`translate(${x}, ${y})`}
      opacity={opacity}
      onClick={onClick}
      className="cursor-pointer font-sans"
    >
      {renderSubjectDiagram()}
      {label && (
        <text
          x={0}
          y={130}
          textAnchor="middle"
          fontSize={12}
          fontWeight="bold"
          fill="#334155"
        >
          {label}
        </text>
      )}
    </g>
  );
};
