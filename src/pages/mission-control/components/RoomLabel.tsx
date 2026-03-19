import type { IconType } from 'react-icons';

interface RoomLabelProps {
  icon: IconType;
  label: string;
  count: number;
}

export function RoomLabel({ icon: Icon, label, count }: RoomLabelProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full font-medium">
        {count}
      </span>
    </div>
  );
}
