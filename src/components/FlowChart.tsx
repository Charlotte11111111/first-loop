import React from 'react';
import { FlowPath, FlowStepId } from '../flow/config';
import { ClickableNodeId, isNodeActive, isNodeCompleted, isNodeSkipped } from '../flow/graph';

interface FlowChartProps {
  activePath: FlowPath | null;
  currentStep: FlowStepId;
  completedSteps: FlowStepId[];
  skippedSteps: FlowStepId[];
  skippedFlow: boolean;
  onNodeClick: (nodeId: ClickableNodeId) => void;
}

type NodeDef = {
  id: ClickableNodeId;
  x: number;
  y: number;
  w: number;
  label: string;
};

const NODES: NodeDef[] = [
  { id: 'register', x: 150, y: 36, w: 112, label: 'Register' },
  { id: 'consent', x: 150, y: 108, w: 112, label: 'Consent' },
  { id: 'consent_skip', x: 48, y: 182, w: 96, label: 'Skip' },
  { id: 'home_c', x: 48, y: 258, w: 96, label: 'Home' },
  { id: 'rest', x: 252, y: 182, w: 96, label: 'Rest' },
  { id: 'emotion', x: 252, y: 258, w: 96, label: 'Emotion' },
  { id: 'stroop', x: 180, y: 334, w: 88, label: 'Stroop' },
  { id: 'coherence', x: 252, y: 410, w: 96, label: 'Breathing' },
  { id: 'results', x: 252, y: 486, w: 96, label: 'Results' },
  { id: 'home', x: 252, y: 562, w: 96, label: 'Home' },
];

function getNode(id: ClickableNodeId) {
  return NODES.find((n) => n.id === id)!;
}

export const FlowChart: React.FC<FlowChartProps> = ({
  currentStep,
  completedSteps,
  skippedSteps,
  skippedFlow,
  onNodeClick,
}) => {
  const nodeState = (id: ClickableNodeId) => {
    const active = isNodeActive(id, currentStep, skippedFlow);
    const done = isNodeCompleted(id, completedSteps, skippedSteps);
    const skipped = isNodeSkipped(id, skippedSteps);
    return { active, done, skipped };
  };

  const renderNode = (n: NodeDef) => {
    const { active, done, skipped } = nodeState(n.id);
    const h = 38;
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
        style={{ opacity: skipped ? 0.55 : 1 }}
      >
        {active && (
          <rect
            x={n.x - n.w / 2 - 4}
            y={n.y - h / 2 - 4}
            width={n.w + 8}
            height={h + 8}
            rx={rx + 2}
            fill="none"
            stroke="#93c5fd"
            strokeWidth={2}
            opacity={0.6}
          />
        )}
        <rect
          x={n.x - n.w / 2}
          y={n.y - h / 2}
          width={n.w}
          height={h}
          rx={rx}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeW}
          className="transition-colors duration-200"
        />
        <text
          x={n.x}
          y={n.y + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textFill}
          fontSize={13}
          fontWeight={active ? 600 : 500}
          fontFamily="Inter, system-ui, sans-serif"
        >
          {n.label}
        </text>
        {done && !active && (
          <circle cx={n.x + n.w / 2 - 7} cy={n.y - h / 2 + 7} r={6} fill="#22c55e" />
        )}
      </g>
    );
  };

  const line = (x1: number, y1: number, x2: number, y2: number, dashed = false) => (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#cbd5e1"
      strokeWidth={2}
      strokeDasharray={dashed ? '4 3' : undefined}
    />
  );

  const reg = getNode('register');
  const con = getNode('consent');
  const skip = getNode('consent_skip');
  const homeC = getNode('home_c');
  const rest = getNode('rest');
  const emo = getNode('emotion');
  const str = getNode('stroop');
  const coh = getNode('coherence');
  const res = getNode('results');
  const home = getNode('home');

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      <div className="shrink-0">
        <h2 className="text-[15px] font-semibold text-slate-800 tracking-tight">Experience flow</h2>
        <p className="text-xs text-slate-400 mt-1">Click a node to jump to that step</p>
      </div>

      <div className="flex-1 min-h-0 rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/80 p-4 shadow-sm flex items-center justify-center">
        <svg
          viewBox="0 0 300 598"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          style={{ minHeight: 520, maxHeight: 'calc(100vh - 120px)' }}
        >
          {line(reg.x, reg.y + 19, con.x, con.y - 19)}
          {line(con.x - 22, con.y + 12, skip.x + 12, skip.y - 12)}
          {line(con.x + 22, con.y + 12, rest.x - 12, rest.y - 12)}
          {line(skip.x, skip.y + 19, homeC.x, homeC.y - 19)}
          {line(rest.x, rest.y + 19, emo.x, emo.y - 19)}
          {line(emo.x - 16, emo.y + 14, str.x + 6, str.y - 14)}
          {line(emo.x, emo.y + 19, coh.x, coh.y - 19)}
          {line(str.x + 12, str.y + 14, coh.x - 22, coh.y - 14)}
          {line(coh.x, coh.y + 19, res.x, res.y - 19)}
          {line(res.x, res.y + 19, home.x, home.y - 19)}

          <text x={95} y={158} fontSize={11} fill="#94a3b8" fontFamily="Inter, sans-serif">
            Skip
          </text>
          <text x={210} y={158} fontSize={11} fill="#94a3b8" fontFamily="Inter, sans-serif">
            Continue
          </text>
          <text x={195} y={312} fontSize={11} fill="#94a3b8" fontFamily="Inter, sans-serif">
            No shift
          </text>
          <text x={268} y={312} fontSize={10} fill="#94a3b8" fontFamily="Inter, sans-serif">
            Has shift
          </text>

          {NODES.map(renderNode)}
        </svg>
      </div>
    </div>
  );
};
