import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';

interface TopicGroupNodeData {
  label: string;
  color: string;
  width: number;
  height: number;
  [key: string]: unknown;
}

function TopicGroupNodeInner({ data }: NodeProps) {
  const { label, width, height } = data as unknown as TopicGroupNodeData;
  return (
    <div
      className="rounded-2xl border-2 border-dashed"
      style={{
        width,
        height,
        background: 'rgba(255,255,255,0.02)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div className="px-5 py-3 flex items-center gap-2">
        <span className="text-sm font-semibold select-none" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
      </div>
    </div>
  );
}

export const TopicGroupNode = memo(TopicGroupNodeInner);
