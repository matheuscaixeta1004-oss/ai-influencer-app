import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MdImage,
  MdVideocam,
  MdTextFields,
  MdUpload,
  MdPermMedia,
  MdAutoFixHigh,
  MdPerson,
  MdSearch,
} from 'react-icons/md';

export interface ContextMenuItem {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  category: string;
  disabled?: boolean;
  comingSoon?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  onSelect: (itemId: string) => void;
  onClose: () => void;
}

const MENU_ITEMS: ContextMenuItem[] = [
  { id: 'image_gen', label: 'Gerador de Imagem', Icon: MdImage, category: 'GERAÇÃO' },
  { id: 'video_gen', label: 'Gerador de Vídeo', Icon: MdVideocam, category: 'GERAÇÃO' },
  { id: 'model_ref', label: 'Modelo', Icon: MdPerson, category: 'GERAÇÃO' },
  { id: 'prompt', label: 'Prompt', Icon: MdTextFields, category: 'INPUT' },
  { id: 'ref_image', label: 'Imagem de Referência', Icon: MdImage, category: 'INPUT' },
  { id: 'upload', label: 'Upload', Icon: MdUpload, category: 'MÍDIA', disabled: true, comingSoon: true },
  { id: 'assets', label: 'Assets', Icon: MdPermMedia, category: 'MÍDIA', disabled: true, comingSoon: true },
  { id: 'upscaler', label: 'Image Upscaler', Icon: MdAutoFixHigh, category: 'FERRAMENTAS', disabled: true, comingSoon: true },
];

export function ContextMenu({ x, y, onSelect, onClose }: ContextMenuProps) {
  const [search, setSearch] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Animate in
  useEffect(() => {
    requestAnimationFrame(() => setAnimateIn(true));
    searchRef.current?.focus();
  }, []);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        onClose();
      }
    };
    const timer = setTimeout(() => {
      window.addEventListener('mousedown', handler, true);
    }, 100);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousedown', handler, true);
    };
  }, [onClose]);

  const filtered = search.trim()
    ? MENU_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      )
    : MENU_ITEMS;

  // Group by category
  const grouped = filtered.reduce<Record<string, ContextMenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleItemClick = useCallback((item: ContextMenuItem) => {
    if (item.disabled) return;
    onSelect(item.id);
  }, [onSelect]);

  // Adjust position to stay in viewport
  const menuWidth = 240;
  const menuHeight = 400;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 16);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight - 16);

  return (
    <div
      ref={menuRef}
      className="fixed z-50"
      style={{
        left: adjustedX,
        top: adjustedY,
        opacity: animateIn ? 1 : 0,
        transform: animateIn ? 'scale(1)' : 'scale(0.95)',
        transformOrigin: 'top left',
        transition: 'opacity 120ms ease-out, transform 120ms ease-out',
      }}
    >
      <div
        className="w-[240px] rounded-xl overflow-hidden"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {/* Search */}
        <div className="px-3 pt-3 pb-2">
          <div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
            style={{ background: '#F3F4F6', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <MdSearch size={14} className="text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-gray-700 outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Items */}
        <div className="px-1.5 pb-2 max-h-[320px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {Object.entries(grouped).map(([category, items], gi) => (
            <div key={category}>
              <div className="px-2.5 pt-2 pb-1 text-[10px] font-bold tracking-[0.08em] text-gray-400">
                {category}
              </div>

              {items.map((item) => {
                const { Icon } = item;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    className={`
                      w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-left
                      transition-colors duration-75
                      ${item.disabled
                        ? 'opacity-35 cursor-not-allowed'
                        : 'hover:bg-black/[0.04] cursor-pointer'
                      }
                    `}
                  >
                    <span className="w-5 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-gray-400" />
                    </span>
                    <span className="text-[13px] flex-1 text-gray-700">{item.label}</span>
                    {item.comingSoon && (
                      <span
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400"
                      >
                        SOON
                      </span>
                    )}
                  </button>
                );
              })}

              {gi < Object.keys(grouped).length - 1 && (
                <div className="mx-2.5 my-1 border-t border-gray-100" />
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-3 py-4 text-center text-[12px] text-gray-400">
              Nenhum resultado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
