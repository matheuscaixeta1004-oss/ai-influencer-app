import { useDrag } from '../hooks/useDrag';
import type { Agent } from '../types';

interface AgentSpriteProps {
  agent: Agent;
  onClick: () => void;
  onDragEnd: (agentId: string, dropTarget: string | null) => void;
}

const statusColors = {
  working: '#22c55e',
  idle: '#eab308',
  meeting: '#3b82f6',
};

export function AgentSprite({ agent, onClick, onDragEnd }: AgentSpriteProps) {
  const { isDragging, dragRef, style: dragStyle } = useDrag(agent.id, onDragEnd);

  return (
    <div
      ref={dragRef}
      onClick={(e) => {
        if (!isDragging) {
          e.stopPropagation();
          onClick();
        }
      }}
      className="flex flex-col items-center cursor-pointer select-none group"
      style={{
        width: 56,
        opacity: isDragging ? 0.5 : 1,
        transition: 'transform 0.3s ease, opacity 0.15s',
        ...dragStyle,
      }}
    >
      {/* Speech bubble when working */}
      {agent.status === 'working' && agent.currentTask && (
        <div className="relative mb-1 px-2 py-0.5 rounded-md bg-white/90 text-[9px] text-gray-700 shadow-sm whitespace-nowrap max-w-[80px] truncate">
          {agent.currentTask}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/90 rotate-45" />
        </div>
      )}

      {/* Avatar circle */}
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg
            group-hover:scale-110 transition-transform duration-150"
          style={{
            backgroundColor: agent.color,
            boxShadow: `0 4px 12px ${agent.color}44`,
          }}
        >
          {agent.name[0]}
        </div>

        {/* Status indicator */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900"
          style={{
            backgroundColor: statusColors[agent.status],
            animation: agent.status === 'working' ? 'pulse-status 2s infinite' : undefined,
          }}
        />
      </div>

      {/* Name */}
      <span className="mt-1 text-[10px] font-medium text-white/80 text-center leading-tight truncate w-full">
        {agent.name}
      </span>
    </div>
  );
}
