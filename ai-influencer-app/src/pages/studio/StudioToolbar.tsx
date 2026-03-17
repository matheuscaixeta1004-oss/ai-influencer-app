import { type ReactNode } from 'react';

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
          ? 'bg-primary/10 text-primary'
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
        }
      `}
    >
      {children}
    </button>
  );
}

export function StudioToolbar({
  modelName, onZoomIn, onZoomOut, onFitView, onToggleNsfw, nsfwEnabled, resultCount,
}: ToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
      {/* Model indicator */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md"
        style={{
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <span className="text-[13px] font-semibold text-gray-800">
          {modelName || 'Nenhum modelo'}
        </span>
        {resultCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold">
            {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
          </span>
        )}
      </div>

      {/* Zoom controls */}
      <div
        className="flex items-center gap-0.5 px-1.5 py-1 rounded-xl bg-white/90 backdrop-blur-md"
        style={{
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <ToolBtn onClick={onZoomOut} title="Zoom out">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
          </svg>
        </ToolBtn>
        <ToolBtn onClick={onFitView} title="Fit view">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </ToolBtn>
        <ToolBtn onClick={onZoomIn} title="Zoom in">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </ToolBtn>
      </div>

      {/* NSFW toggle */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md"
        style={{
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <span className="text-[11px] font-medium text-gray-500">NSFW</span>
        <button
          onClick={onToggleNsfw}
          className={`
            relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer
            ${nsfwEnabled ? 'bg-red-500' : 'bg-gray-200'}
          `}
        >
          <div
            className={`
              absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm
              transition-transform duration-200
              ${nsfwEnabled ? 'translate-x-4.5 left-0' : 'translate-x-0.5 left-0'}
            `}
            style={{ transform: `translateX(${nsfwEnabled ? '18px' : '2px'})` }}
          />
        </button>
      </div>
    </div>
  );
}
