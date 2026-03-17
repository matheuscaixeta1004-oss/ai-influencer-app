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
  const { label, color, width, height } = data as unknown as TopicGroupNodeData;
  return (
    <div
      className="rounded-2xl border-2 border-dashed"
      style={{
        width,
        height,
        backgroundColor: color,
        borderColor: `${color === '#EFF6FF' ? '#93C5FD' : color === '#FFF7ED' ? '#FDBA74' : '#FCA5A5'}`,
      }}
    >
      <div className="px-5 py-3 flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700 select-none">{label}</span>
      </div>
    </div>
  );
}

export const TopicGroupNode = memo(TopicGroupNodeInner);
