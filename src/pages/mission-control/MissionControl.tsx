import { useState, useCallback } from 'react';
import { MdWork, MdFreeBreakfast, MdMeetingRoom } from 'react-icons/md';
import { AgentSprite } from './components/AgentSprite';
import { AgentPanel } from './components/AgentPanel';
import { RoomLabel } from './components/RoomLabel';
import { initialAgents } from './data';
import type { Agent, RoomType } from './types';

/* ──────────────────── Isometric Room ──────────────────── */

function Room({
  type,
  label,
  icon,
  agents,
  onAgentClick,
  onDragEnd,
  children,
}: {
  type: RoomType;
  label: string;
  icon: typeof MdWork;
  agents: Agent[];
  onAgentClick: (a: Agent) => void;
  onDragEnd: (agentId: string, target: string | null) => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      data-room={type}
      className="relative rounded-2xl border border-slate-700/60 bg-slate-800/50 backdrop-blur-sm p-5 min-h-[220px] flex flex-col"
      style={{
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.2)',
      }}
    >
      <RoomLabel icon={icon} label={label} count={agents.length} />

      {/* Furniture placeholder */}
      {children}

      {/* Agents grid */}
      <div className="flex flex-wrap gap-3 mt-auto pt-3">
        {agents.map((agent) => (
          <AgentSprite
            key={agent.id}
            agent={agent}
            onClick={() => onAgentClick(agent)}
            onDragEnd={onDragEnd}
          />
        ))}
        {agents.length === 0 && (
          <span className="text-xs text-slate-600 italic">Nenhum agente</span>
        )}
      </div>
    </div>
  );
}

/* ──────────────────── Furniture SVGs ──────────────────── */

function Desk() {
  return (
    <div className="flex gap-2 mb-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-14 h-8 rounded bg-slate-700/60 border border-slate-600/30"
          style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
        >
          <div className="w-8 h-5 mx-auto mt-1 rounded-sm bg-slate-600/40 border border-slate-500/20" />
        </div>
      ))}
    </div>
  );
}

function Sofa() {
  return (
    <div className="flex gap-2 mb-2">
      <div className="w-20 h-7 rounded-lg bg-amber-900/30 border border-amber-800/20" />
      <div className="w-8 h-8 rounded bg-emerald-900/30 border border-emerald-800/20" title="planta" />
      <div className="w-12 h-6 rounded bg-amber-900/20 border border-amber-800/15" />
    </div>
  );
}

function MeetingTable() {
  return (
    <div className="flex justify-center mb-2">
      <div className="w-24 h-12 rounded-xl bg-slate-700/50 border border-slate-600/30 flex items-center justify-center">
        <div className="w-16 h-1 bg-slate-500/30 rounded-full" />
      </div>
    </div>
  );
}

/* ──────────────────── Main Component ──────────────────── */

export function MissionControl() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const byStatus = useCallback(
    (status: RoomType) => agents.filter((a) => a.status === status),
    [agents],
  );

  const moveAgent = useCallback((agentId: string, newStatus: RoomType) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== agentId) return a;
        const updated = { ...a, status: newStatus };
        if (newStatus === 'idle') updated.currentTask = undefined;
        return updated;
      }),
    );
    setSelectedAgent((prev) => {
      if (prev?.id === agentId) return { ...prev, status: newStatus };
      return prev;
    });
  }, []);

  const handleDragEnd = useCallback(
    (agentId: string, dropTarget: string | null) => {
      if (dropTarget && ['working', 'idle', 'meeting'].includes(dropTarget)) {
        moveAgent(agentId, dropTarget as RoomType);
      }
    },
    [moveAgent],
  );

  const working = byStatus('working');
  const idle = byStatus('idle');
  const meeting = byStatus('meeting');

  return (
    <div className="h-full flex flex-col bg-slate-950" style={{ fontFamily: "'Geist', sans-serif" }}>
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <h1 className="text-white font-semibold text-base tracking-tight flex items-center gap-2">
          <MdWork className="w-5 h-5 text-[#00AFF0]" />
          Mission Control
        </h1>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {working.length} trabalhando
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            {idle.length} no café
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {meeting.length} em reunião
          </span>
        </div>
      </div>

      {/* ── Isometric office ── */}
      <div className="flex-1 overflow-auto p-6">
        <div
          className="mx-auto"
          style={{
            perspective: '1200px',
            perspectiveOrigin: '50% 30%',
          }}
        >
          <div
            className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5"
            style={{
              maxWidth: 1100,
              transform: 'rotateX(8deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Work Room */}
            <Room
              type="working"
              label="Sala de Trabalho"
              icon={MdWork}
              agents={working}
              onAgentClick={setSelectedAgent}
              onDragEnd={handleDragEnd}
            >
              <Desk />
            </Room>

            {/* Lounge */}
            <Room
              type="idle"
              label="Café"
              icon={MdFreeBreakfast}
              agents={idle}
              onAgentClick={setSelectedAgent}
              onDragEnd={handleDragEnd}
            >
              <Sofa />
            </Room>

            {/* Meeting Room */}
            <Room
              type="meeting"
              label="Sala de Reunião"
              icon={MdMeetingRoom}
              agents={meeting}
              onAgentClick={setSelectedAgent}
              onDragEnd={handleDragEnd}
            >
              <MeetingTable />
            </Room>
          </div>
        </div>
      </div>

      {/* ── Agent Panel (slide-in) ── */}
      {selectedAgent && (
        <AgentPanel
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onMoveToMeeting={(id) => moveAgent(id, 'meeting')}
          onDismiss={(id) => moveAgent(id, 'idle')}
          onMoveToWork={(id) => moveAgent(id, 'working')}
        />
      )}

      {/* ── Global styles ── */}
      <style>{`
        @keyframes pulse-status {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
