import { useCallback, useState } from 'react';
import type { Node } from '@xyflow/react';

const SNAP_THRESHOLD = 8; // px distance to snap

interface GuideLine {
  x?: number;
  y?: number;
}

export function useSnapGuides(nodes: Node[]) {
  const [guides, setGuides] = useState<GuideLine[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onNodeDrag = useCallback(
    (_event: any, dragNode: Node) => {
      const newGuides: GuideLine[] = [];
      const dragLeft = dragNode.position.x;
      const dragTop = dragNode.position.y;
      const dragWidth = dragNode.measured?.width ?? 320;
      const dragHeight = dragNode.measured?.height ?? 200;
      const dragRight = dragLeft + dragWidth;
      const dragBottom = dragTop + dragHeight;
      const dragCenterX = dragLeft + dragWidth / 2;
      const dragCenterY = dragTop + dragHeight / 2;

      for (const node of nodes) {
        if (node.id === dragNode.id) continue;

        const nLeft = node.position.x;
        const nTop = node.position.y;
        const nWidth = node.measured?.width ?? 320;
        const nHeight = node.measured?.height ?? 200;
        const nRight = nLeft + nWidth;
        const nBottom = nTop + nHeight;
        const nCenterX = nLeft + nWidth / 2;
        const nCenterY = nTop + nHeight / 2;

        // Vertical alignment (X axis)
        if (Math.abs(dragLeft - nLeft) < SNAP_THRESHOLD) newGuides.push({ x: nLeft });
        if (Math.abs(dragRight - nRight) < SNAP_THRESHOLD) newGuides.push({ x: nRight });
        if (Math.abs(dragCenterX - nCenterX) < SNAP_THRESHOLD) newGuides.push({ x: nCenterX });
        if (Math.abs(dragLeft - nRight) < SNAP_THRESHOLD) newGuides.push({ x: nRight });
        if (Math.abs(dragRight - nLeft) < SNAP_THRESHOLD) newGuides.push({ x: nLeft });

        // Horizontal alignment (Y axis)
        if (Math.abs(dragTop - nTop) < SNAP_THRESHOLD) newGuides.push({ y: nTop });
        if (Math.abs(dragBottom - nBottom) < SNAP_THRESHOLD) newGuides.push({ y: nBottom });
        if (Math.abs(dragCenterY - nCenterY) < SNAP_THRESHOLD) newGuides.push({ y: nCenterY });
        if (Math.abs(dragTop - nBottom) < SNAP_THRESHOLD) newGuides.push({ y: nBottom });
        if (Math.abs(dragBottom - nTop) < SNAP_THRESHOLD) newGuides.push({ y: nTop });
      }

      // Dedupe
      const unique: GuideLine[] = [];
      const seen = new Set<string>();
      for (const g of newGuides) {
        const key = g.x !== undefined ? `x:${g.x}` : `y:${g.y}`;
        if (!seen.has(key)) { seen.add(key); unique.push(g); }
      }

      setGuides(unique);
    },
    [nodes]
  );

  const onNodeDragStop = useCallback(() => {
    setGuides([]);
  }, []);

  return { guides, onNodeDrag, onNodeDragStop };
}
