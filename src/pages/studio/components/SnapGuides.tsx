interface GuideLine {
  x?: number;
  y?: number;
}

export function SnapGuides({ guides }: { guides: GuideLine[] }) {
  if (guides.length === 0) return null;

  return (
    <svg className="react-flow__snap-guides" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }}>
      {guides.map((g, i) =>
        g.x !== undefined ? (
          <line key={`v-${i}`} x1={g.x} y1={-10000} x2={g.x} y2={10000} stroke="#00AFF0" strokeWidth={1} strokeDasharray="4 4" opacity={0.6} />
        ) : g.y !== undefined ? (
          <line key={`h-${i}`} x1={-10000} y1={g.y} x2={10000} y2={g.y} stroke="#00AFF0" strokeWidth={1} strokeDasharray="4 4" opacity={0.6} />
        ) : null
      )}
    </svg>
  );
}
