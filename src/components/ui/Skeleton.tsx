interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const roundedStyles = {
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
};

export function Skeleton({ className = '', width, height, rounded = 'md' }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer ${roundedStyles[rounded]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <Skeleton height="20px" width="40%" className="mb-3" />
      <Skeleton height="14px" width="70%" className="mb-2" />
      <Skeleton height="14px" width="55%" className="mb-4" />
      <Skeleton height="36px" width="100%" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton width="40px" height="40px" rounded="full" />
          <div className="flex-1 space-y-2">
            <Skeleton height="14px" width={`${60 + Math.random() * 30}%`} />
            <Skeleton height="12px" width={`${40 + Math.random() * 20}%`} />
          </div>
        </div>
      ))}
    </div>
  );
}
