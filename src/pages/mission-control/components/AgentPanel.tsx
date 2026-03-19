import { HiXMark } from 'react-icons/hi2';
import { MdMeetingRoom, MdFreeBreakfast, MdWork } from 'react-icons/md';
import type { Agent } from '../types';

interface AgentPanelProps {
  agent: Agent;
  onClose: () => void;
  onMoveToMeeting: (id: string) => void;
  onDismiss: (id: string) => void;
  onMoveToWork: (id: string) => void;
}

const statusLabels: Record<Agent['status'], string> = {
  working: 'Trabalhando',
  idle: 'No Café',
  meeting: 'Em Reunião',
};

const statusColors: Record<Agent['status'], string> = {
  working: 'bg-green-500',
  idle: 'bg-yellow-500',
  meeting: 'bg-blue-500',
};

export function AgentPanel({ agent, onClose, onMoveToMeeting, onDismiss, onMoveToWork }: AgentPanelProps) {
  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-slate-800 border-l border-slate-700 z-50 shadow-2xl flex flex-col animate-slide-in">
      {/* Header */}
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
              style={{ backgroundColor: agent.color, boxShadow: `0 4px 16px ${agent.color}44` }}
            >
              {agent.name[0]}
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">{agent.name}</h3>
              <p className="text-slate-400 text-sm">{agent.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors"
          >
            <HiXMark className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="p-5 space-y-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Status</span>
          <div className="mt-1.5 flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${statusColors[agent.status]}`} />
            <span className="text-white text-sm">{statusLabels[agent.status]}</span>
          </div>
        </div>

        {agent.currentTask && (
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Tarefa Atual</span>
            <p className="mt-1.5 text-white text-sm">{agent.currentTask}</p>
          </div>
        )}

        {agent.lastTask && (
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Última Tarefa</span>
            <p className="mt-1.5 text-slate-300 text-sm">{agent.lastTask}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto p-5 border-t border-slate-700 space-y-2">
        {agent.status !== 'meeting' && (
          <button
            onClick={() => onMoveToMeeting(agent.id)}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            <MdMeetingRoom className="w-4 h-4" />
            Chamar para Reunião
          </button>
        )}
        {agent.status !== 'idle' && (
          <button
            onClick={() => onDismiss(agent.id)}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors"
          >
            <MdFreeBreakfast className="w-4 h-4" />
            Dispensar para o Café
          </button>
        )}
        {agent.status !== 'working' && (
          <button
            onClick={() => onMoveToWork(agent.id)}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors"
          >
            <MdWork className="w-4 h-4" />
            Mandar Trabalhar
          </button>
        )}
      </div>
    </div>
  );
}
