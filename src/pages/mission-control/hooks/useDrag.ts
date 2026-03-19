import { useRef, useState, useCallback, useEffect } from 'react';

export function useDrag(agentId: string, onDragEnd: (agentId: string, dropTarget: string | null) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const onMouseDown = useCallback((e: MouseEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    hasMoved.current = false;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      if (!hasMoved.current && Math.abs(dx) + Math.abs(dy) > 5) {
        hasMoved.current = true;
        setIsDragging(true);
      }
      if (hasMoved.current) {
        setOffset({ x: dx, y: dy });
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      setIsDragging(false);
      setOffset({ x: 0, y: 0 });

      if (hasMoved.current) {
        // Find drop target room
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const room = el?.closest('[data-room]');
        const roomType = room?.getAttribute('data-room') || null;
        onDragEnd(agentId, roomType);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [agentId, onDragEnd]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousedown', onMouseDown);
    return () => el.removeEventListener('mousedown', onMouseDown);
  }, [onMouseDown]);

  return {
    isDragging,
    dragRef: ref,
    style: isDragging ? { transform: `translate(${offset.x}px, ${offset.y}px)`, zIndex: 100, position: 'relative' as const } : {},
  };
}
