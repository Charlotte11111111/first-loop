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
  { id: 'register', x: 150, y: 28, w: 100, label: 'Register' },
  { id: 'connect', x: 150, y: 92, w: 100, label: 'Connect' },
  { id: 'invite', x: 150, y: 156, w: 100, label: 'Invite' },
  { id: 'invite_skip', x: 48, y: 230, w: 88, label: 'Skip' },
  { id: 'home_c', x: 48, y: 304, w: 88, label: 'Home' },
  { id: 'rest', x: 252, y: 230, w: 88, label: 'Rest' },
  { id: 'emotion', x: 252, y: 304, w: 88, label: 'Emotion' },
  { id: 'stroop', x: 180, y: 378, w: 80, label: 'Stroop' },
  { id: 'coherence', x: 252, y: 452, w: 88, label: 'Breathing' },
  { id: 'results', x: 252, y: 526, w: 88, label: 'Results' },
  { id: 'home', x: 252, y: 600, w: 88, label: 'Home' },
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
    const h = 36;
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
        {done && !active && (
          <circle cx={n.x + n.w / 2 - 7} cy={n.y - h / 2 + 7} r={5} fill="#22c55e" />
        )}
      </g>
    );
  };

  const line = (x1: number, y1: number, x2: number, y2: number) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth={2} />
  );

  const reg = getNode('register');
  const con = getNode('connect');
  const inv = getNode('invite');
  const skip = getNode('invite_skip');
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
          viewBox="0 0 300 640"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          style={{ minHeight: 520, maxHeight: 'calc(100vh - 120px)' }}
        >
          {line(reg.x, reg.y + 18, con.x, con.y - 18)}
          {line(con.x, con.y + 18, inv.x, inv.y - 18)}
          {line(inv.x - 22, inv.y + 12, skip.x + 12, skip.y - 12)}
          {line(inv.x + 22, inv.y + 12, rest.x - 12, rest.y - 12)}
          {line(skip.x, skip.y + 18, homeC.x, homeC.y - 18)}
          {line(rest.x, rest.y + 18, emo.x, emo.y - 18)}
          {line(emo.x - 16, emo.y + 14, str.x + 6, str.y - 14)}
          {line(emo.x, emo.y + 18, coh.x, coh.y - 18)}
          {line(str.x + 12, str.y + 14, coh.x - 22, coh.y - 14)}
          {line(coh.x, coh.y + 18, res.x, res.y - 18)}
          {line(res.x, res.y + 18, home.x, home.y - 18)}

          <text x={95} y={200} fontSize={11} fill="#94a3b8" fontFamily="Inter, sans-serif">
            Skip
          </text>
          <text x={210} y={200} fontSize={11} fill="#94a3b8" fontFamily="Inter, sans-serif">
            Continue
          </text>
          <text x={195} y={358} fontSize={11} fill="#94a3b8" fontFamily="Inter, sans-serif">
            No shift
          </text>
          <text x={268} y={358} fontSize={10} fill="#94a3b8" fontFamily="Inter, sans-serif">
            Has shift
          </text>

          {NODES.map(renderNode)}
        </svg>
      </div>
    </div>
  );
};
