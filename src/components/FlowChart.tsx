import React from 'react';
import { FlowPath, FlowStepId } from '../flow/config';
import { ClickableNodeId, isNodeActive, isNodeCompleted, isNodeSkipped } from '../flow/graph';

interface FlowChartProps {
  activePath: FlowPath | null;
  currentStep: FlowStepId;
  completedSteps: FlowStepId[];
  skippedSteps: FlowStepId[];
  skippedFlow: boolean;
  hadStroop: boolean;
  onNodeClick: (nodeId: ClickableNodeId) => void;
}

type NodeDef = {
  id: ClickableNodeId;
  x: number;
  y: number;
  w: number;
  label: string;
  sub?: string;
  branch?: FlowPath;
};

const NODE_H = 36;

const NODES: NodeDef[] = [
  { id: 'register', x: 210, y: 32, w: 110, label: 'Register' },
  { id: 'connect', x: 210, y: 100, w: 110, label: 'Connect' },
  { id: 'invite', x: 210, y: 168, w: 110, label: 'Invite' },

  { id: 'invite_skip', x: 64, y: 244, w: 88, label: 'Skip', branch: 'C' },
  { id: 'home_c', x: 64, y: 316, w: 88, label: 'Home', branch: 'C' },

  { id: 'rest', x: 286, y: 244, w: 92, label: 'Rest' },
  { id: 'emotion', x: 286, y: 316, w: 92, label: 'Emotion' },

  // Path A · 3-phase
  { id: 'stroop', x: 196, y: 414, w: 88, label: 'Stroop', branch: 'A' },
  { id: 'coherence', x: 196, y: 490, w: 96, label: 'Breathing', branch: 'A' },
  { id: 'results', x: 196, y: 566, w: 96, label: 'Results', sub: '3 phases', branch: 'A' },
  { id: 'home', x: 196, y: 642, w: 96, label: 'Home', branch: 'A' },

  // Path B · 2-phase
  { id: 'coherence_b', x: 336, y: 490, w: 92, label: 'Breathing', branch: 'B' },
  { id: 'results_b', x: 336, y: 566, w: 92, label: 'Results', sub: '2 phases', branch: 'B' },
  { id: 'home_b', x: 336, y: 642, w: 92, label: 'Home', branch: 'B' },
];

function getNode(id: ClickableNodeId) {
  return NODES.find((n) => n.id === id)!;
}

export const FlowChart: React.FC<FlowChartProps> = ({
  activePath,
  currentStep,
  completedSteps,
  skippedSteps,
  skippedFlow,
  hadStroop,
  onNodeClick,
}) => {
  const renderNode = (n: NodeDef) => {
    const active = isNodeActive(n.id, currentStep, skippedFlow, hadStroop);
    const done = isNodeCompleted(n.id, completedSteps, skippedSteps, hadStroop);
    const skipped = isNodeSkipped(n.id, skippedSteps);
    const offBranch = !!(activePath && n.branch && n.branch !== activePath);

    const rx = 11;
    let fill = '#ffffff';
    let stroke = '#e2e8f0';
    let textFill = '#334155';
    let strokeW = 1.5;

    if (active) {
      fill = '#eff6ff';
      stroke = '#3b82f6';
      textFill = '#1d4ed8';
      strokeW = 2;
    } else if (done) {
      fill = '#f0fdf4';
      stroke = '#86efac';
      textFill = '#166534';
    } else if (skipped) {
      fill = '#f8fafc';
      stroke = '#cbd5e1';
      textFill = '#94a3b8';
    }

    return (
      <g
        key={n.id}
        onClick={() => onNodeClick(n.id)}
        className="cursor-pointer"
        style={{ opacity: skipped ? 0.5 : offBranch ? 0.4 : 1 }}
      >
        {active && (
          <rect
            x={n.x - n.w / 2 - 4}
            y={n.y - NODE_H / 2 - 4}
            width={n.w + 8}
            height={NODE_H + 8}
            rx={rx + 2}
            fill="none"
            stroke="#93c5fd"
            strokeWidth={2}
            opacity={0.6}
          />
        )}
        <rect
          x={n.x - n.w / 2}
          y={n.y - NODE_H / 2}
          width={n.w}
          height={NODE_H}
          rx={rx}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeW}
        />
        <text
          x={n.x}
          y={n.y + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textFill}
          fontSize={12}
          fontWeight={active ? 600 : 500}
          fontFamily="Inter, system-ui, sans-serif"
        >
          {n.label}
        </text>
        {n.sub && (
          <text
            x={n.x}
            y={n.y + NODE_H / 2 + 12}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={9}
            fontFamily="Inter, system-ui, sans-serif"
          >
            {n.sub}
          </text>
        )}
        {done && !active && (
          <circle cx={n.x + n.w / 2 - 7} cy={n.y - NODE_H / 2 + 7} r={5} fill="#22c55e" />
        )}
      </g>
    );
  };

  const line = (x1: number, y1: number, x2: number, y2: number, dim = false) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={dim ? '#e2e8f0' : '#cbd5e1'} strokeWidth={2} />
  );

  const path = (d: string, dim = false) => (
    <path
      d={d}
      fill="none"
      stroke={dim ? '#e2e8f0' : '#cbd5e1'}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  );

  const reg = getNode('register');
  const con = getNode('connect');
  const inv = getNode('invite');
  const skip = getNode('invite_skip');
  const homeC = getNode('home_c');
  const rest = getNode('rest');
  const emo = getNode('emotion');
  const strA = getNode('stroop');
  const cohA = getNode('coherence');
  const resA = getNode('results');
  const homeA = getNode('home');
  const cohB = getNode('coherence_b');
  const resB = getNode('results_b');
  const homeB = getNode('home_b');

  const forkY = emo.y + 46;
  const dimA = activePath === 'B' || activePath === 'C';
  const dimB = activePath === 'A' || activePath === 'C';

  const top = (n: NodeDef) => n.y - NODE_H / 2;
  const bottom = (n: NodeDef) => n.y + NODE_H / 2;

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      <div className="shrink-0">
        <h2 className="text-[15px] font-semibold text-slate-800 tracking-tight">Experience flow</h2>
        <p className="text-xs text-slate-400 mt-1">Click a node to jump to that step</p>
      </div>

      <div className="flex-1 min-h-0 rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/80 p-4 shadow-sm flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 400 700"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          style={{ minHeight: 520, maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Onboarding spine */}
          {line(reg.x, bottom(reg), con.x, top(con))}
          {line(con.x, bottom(con), inv.x, top(inv))}

          {/* Invite fork */}
          {path(
            `M ${inv.x - 26} ${bottom(inv)} L ${inv.x - 26} ${bottom(inv) + 22} L ${skip.x} ${bottom(inv) + 22} L ${skip.x} ${top(skip)}`,
            activePath === 'A' || activePath === 'B'
          )}
          {path(
            `M ${inv.x + 26} ${bottom(inv)} L ${inv.x + 26} ${bottom(inv) + 22} L ${rest.x} ${bottom(inv) + 22} L ${rest.x} ${top(rest)}`,
            activePath === 'C'
          )}
          {line(skip.x, bottom(skip), homeC.x, top(homeC), activePath === 'A' || activePath === 'B')}

          {line(rest.x, bottom(rest), emo.x, top(emo), activePath === 'C')}

          {/* Emotion fork → two independent branches */}
          {path(
            `M ${emo.x - 26} ${bottom(emo)} L ${emo.x - 26} ${forkY} L ${strA.x} ${forkY} L ${strA.x} ${top(strA)}`,
            dimA
          )}
          {path(
            `M ${emo.x + 26} ${bottom(emo)} L ${emo.x + 26} ${forkY} L ${cohB.x} ${forkY} L ${cohB.x} ${top(cohB)}`,
            dimB
          )}

          {/* Path A column */}
          {line(strA.x, bottom(strA), cohA.x, top(cohA), dimA)}
          {line(cohA.x, bottom(cohA), resA.x, top(resA), dimA)}
          {line(resA.x, bottom(resA), homeA.x, top(homeA), dimA)}

          {/* Path B column */}
          {line(cohB.x, bottom(cohB), resB.x, top(resB), dimB)}
          {line(resB.x, bottom(resB), homeB.x, top(homeB), dimB)}

          {/* Invite fork labels */}
          <text x={96} y={218} fontSize={10} fill="#94a3b8" fontFamily="Inter, sans-serif">
            Skip
          </text>
          <text x={244} y={218} fontSize={10} fill="#94a3b8" fontFamily="Inter, sans-serif">
            Continue
          </text>

          {/* Emotion fork labels */}
          <text
            x={strA.x}
            y={forkY - 8}
            textAnchor="middle"
            fontSize={10}
            fill="#64748b"
            fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            No shift
          </text>
          <text
            x={cohB.x}
            y={forkY - 8}
            textAnchor="middle"
            fontSize={10}
            fill="#64748b"
            fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            Has shift
          </text>

          {/* Branch headers */}
          <text
            x={strA.x}
            y={top(strA) - 12}
            textAnchor="middle"
            fontSize={9}
            fill="#94a3b8"
            fontFamily="Inter, sans-serif"
          >
            Path A · 3-phase
          </text>
          <text
            x={cohB.x}
            y={top(cohB) - 12}
            textAnchor="middle"
            fontSize={9}
            fill="#94a3b8"
            fontFamily="Inter, sans-serif"
          >
            Path B · 2-phase
          </text>

          {NODES.map(renderNode)}
        </svg>
      </div>
    </div>
  );
};
