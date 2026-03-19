import type { ReactNode } from 'react';

interface IsometricFloorProps {
  children: ReactNode;
}

export function IsometricFloor({ children }: IsometricFloorProps) {
  return (
    <div className="flex-1 flex items-center justify-center overflow-auto p-8">
      <div
        className="relative"
        style={{
          transform: 'rotateX(60deg) rotateZ(-45deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Floor grid */}
        <div
          className="absolute inset-0 -m-8"
          style={{
            backgroundImage: `
              linear-gradient(rgba(51,65,85,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(51,65,85,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            backgroundColor: '#1E293B',
          }}
        />

        {/* Rooms container - flat layout in isometric space */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
