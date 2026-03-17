import { type ReactNode } from 'react';
import { MdAdd, MdRemove, MdFitScreen, MdPerson } from 'react-icons/md';

interface ToolbarProps {
  modelName: string | null;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onToggleNsfw: () => void;
  nsfwEnabled: boolean;
  resultCount: number;
}

function ToolBtn({ children, onClick, title, active }: { children: ReactNode; onClick: () => void; title: string; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        w-8 h-8 rounded-lg flex items-center justify-center
        transition-all duration-150 cursor-pointer
        ${active
          ? 'text-blue-400'
          : 'text-gray-500 hover:text-gray-200'
        }
      `}
      style={active ? { background: 'rgba(59,130,246,0.15)' } : { background: 'transparent' }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}

const pillStyle = {
  background: '#1e1e1e',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
};

export function StudioToolbar({
  modelName, onZoomIn, onZoomOut, onFitView, onToggleNsfw, nsfwEnabled, resultCount,
}: ToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
      {/* Model indicator */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-xl"
        style={pillStyle}
      >
        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,175,240,0.2)' }}>
          <MdPerson size={12} style={{ color: '#00AFF0' }} />
        </div>
        <span className="text-[13px] font-semibold" style={{ color: '#e0e0e0' }}>
          {modelName || 'Nenhum modelo'}
        </span>
        {resultCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: 'rgba(0,175,240,0.15)', color: '#00AFF0' }}>
            {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
          </span>
        )}
      </div>

      {/* Zoom controls */}
      <div
        className="flex items-center gap-0.5 px-1.5 py-1 rounded-xl"
        style={pillStyle}
      >
        <ToolBtn onClick={onZoomOut} title="Zoom out">
          <MdRemove size={16} />
        </ToolBtn>
        <ToolBtn onClick={onFitView} title="Ajustar tela">
          <MdFitScreen size={16} />
        </ToolBtn>
        <ToolBtn onClick={onZoomIn} title="Zoom in">
          <MdAdd size={16} />
        </ToolBtn>
      </div>

      {/* NSFW toggle */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={pillStyle}
      >
        <span className="text-[11px] font-medium" style={{ color: '#666' }}>NSFW</span>
        <button
          onClick={onToggleNsfw}
          className={`
            relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer
            ${nsfwEnabled ? 'bg-red-600' : 'bg-[#333]'}
          `}
        >
          <div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
            style={{ transform: `translateX(${nsfwEnabled ? '18px' : '2px'})` }}
          />
        </button>
      </div>
    </div>
  );
}
