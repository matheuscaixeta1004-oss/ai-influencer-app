import { useCallback, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  type NodeTypes,
  type OnConnect,
  type OnNodesDelete,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useAuth } from '../../contexts/AuthContext';
import { getUserModels, getModelPhotos } from '../../lib/models';
import type { AIModel, ModelPhoto } from '../../types';

import { TopicGroupNode, GenerationCardNode, ResultCardNode } from './nodes';
import { StudioToolbar } from './StudioToolbar';
import { CARD_TEMPLATES, MENU_TO_TEMPLATE } from './constants';
import { ContextMenu } from './ContextMenu';
import type { CardCategory } from './types';

// Placeholder images for mock generation
const PLACEHOLDER_IMAGES: Record<string, string[]> = {
  image_gen: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop',
  ],
  video_gen: [],
  prompt: [],
  ref_image: [],
};

const nodeTypes: NodeTypes = {
  topicGroup: TopicGroupNode,
  generationCard: GenerationCardNode,
  resultCard: ResultCardNode,
};

// Default edge style — soft bezier, light gray
const defaultEdgeOptions = {
  type: 'default',
  style: { stroke: '#B0B8C4', strokeWidth: 2 },
  animated: false,
};

function StudioCanvas() {
  const { user } = useAuth();
  const { zoomIn, zoomOut, fitView, screenToFlowPosition } = useReactFlow();

  const [models, setModels] = useState<AIModel[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<ModelPhoto | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [nsfwEnabled, setNsfwEnabled] = useState(false);
  const [resultCounter, setResultCounter] = useState(0);
  const [cardCounter, setCardCounter] = useState(0);

  // Persistent card/result tracking — source of truth for spawned cards
  const spawnedCardsRef = useRef<Node[]>([]);
  const resultsRef = useRef<Node[]>([]);

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [contextMenuFlowPos, setContextMenuFlowPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Load user models
  useEffect(() => {
    if (!user) return;
    getUserModels().then((m) => {
      setModels(m);
      if (m.length > 0) setSelectedModel(m[0]);
    });
  }, [user]);

  // Load primary photo for selected model
  useEffect(() => {
    if (!selectedModel) return;
    getModelPhotos(selectedModel.id).then((photos) => {
      const primary = photos.find((p) => p.is_primary) || photos[0] || null;
      setPrimaryPhoto(primary);
    });
  }, [selectedModel]);

  // ── Helper: rebuild nodes from refs (spawned + results) with up-to-date data ──
  const rebuildNodes = useCallback(() => {
    const updatedSpawned = spawnedCardsRef.current.map((card) => {
      const tmplIdx = MENU_TO_TEMPLATE[String(card.data.category)] ?? 0;
      const tmpl = CARD_TEMPLATES[tmplIdx];
      return {
        ...card,
        data: {
          ...card.data,
          modelAvatar: primaryPhoto?.url || undefined,
          modelName: selectedModel?.name || (models.length === 0 ? 'Crie um modelo primeiro' : 'Selecionar modelo'),
          onGenerate: (params: Record<string, string>) =>
            handleGenerate(tmpl.category as CardCategory, params),
          hasSourceHandle: tmpl.hasSourceHandle,
          hasTargetHandle: tmpl.hasTargetHandle,
        },
      };
    });

    setNodes([...updatedSpawned, ...resultsRef.current]);
  }, [primaryPhoto, selectedModel, models, setNodes]);

  // Handle mock generation
  const handleGenerate = useCallback((category: CardCategory, params: Record<string, string>) => {
    const placeholders = PLACEHOLDER_IMAGES[category] || [];
    if (!placeholders.length) return;

    const idx = resultCounter % placeholders.length;
    const newId = `result-${Date.now()}`;

    const newNode: Node = {
      id: newId,
      type: 'resultCard',
      position: { x: 1200 + (resultCounter % 3) * 260, y: 80 + Math.floor(resultCounter / 3) * 360 },
      data: {
        imageUrl: '',
        prompt: Object.values(params).filter(Boolean).join(', '),
        modelName: selectedModel?.name || 'Modelo',
        category,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'generating',
      },
    };

    resultsRef.current = [...resultsRef.current, newNode];
    setResultCounter((c) => c + 1);
    rebuildNodes();

    setTimeout(() => {
      resultsRef.current = resultsRef.current.map((n) =>
        n.id === newId
          ? { ...n, data: { ...n.data, imageUrl: placeholders[idx], status: 'done' } }
          : n
      );
      rebuildNodes();
    }, 2000);
  }, [resultCounter, selectedModel, rebuildNodes]);

  // Rebuild when model/photo changes
  useEffect(() => {
    rebuildNodes();
  }, [rebuildNodes]);

  // ── Handle node deletion — remove from refs so they don't come back ──
  const handleNodesDelete: OnNodesDelete = useCallback((deletedNodes) => {
    const deletedIds = new Set(deletedNodes.map((n) => n.id));
    spawnedCardsRef.current = spawnedCardsRef.current.filter((c) => !deletedIds.has(c.id));
    resultsRef.current = resultsRef.current.filter((r) => !deletedIds.has(r.id));
    // nodes state is already updated by ReactFlow's onNodesChange
  }, []);

  // ── Handle edge connections ──
  const onConnect: OnConnect = useCallback((connection) => {
    setEdges((eds) => addEdge({ ...connection, ...defaultEdgeOptions }, eds));
  }, [setEdges]);

  // Handle context menu open (right-click on canvas)
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    setContextMenuFlowPos(flowPos);
    setContextMenu({ x: event.clientX, y: event.clientY });
  }, [screenToFlowPosition]);

  // Close context menu (called from pane click + ContextMenu's own outside-click)
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Handle context menu selection — spawn a card
  const handleMenuSelect = useCallback((itemId: string) => {
    const templateIdx = MENU_TO_TEMPLATE[itemId];
    if (templateIdx === undefined) return;

    const tmpl = CARD_TEMPLATES[templateIdx];
    if (tmpl.comingSoon) return;

    const newCard: Node = {
      id: `card-${tmpl.category}-${Date.now()}-${cardCounter}`,
      type: 'generationCard',
      position: { x: contextMenuFlowPos.x, y: contextMenuFlowPos.y },
      data: {
        ...tmpl,
        modelAvatar: primaryPhoto?.url || undefined,
        modelName: selectedModel?.name || (models.length === 0 ? 'Crie um modelo primeiro' : 'Selecionar modelo'),
        onGenerate: (params: Record<string, string>) => handleGenerate(tmpl.category as CardCategory, params),
      },
      draggable: true,
      style: { zIndex: 1 },
    };

    // Append to ref (source of truth) and rebuild
    spawnedCardsRef.current = [...spawnedCardsRef.current, newCard];
    setCardCounter((c) => c + 1);
    rebuildNodes();
    setContextMenu(null);
  }, [contextMenuFlowPos, cardCounter, primaryPhoto, selectedModel, models, handleGenerate, rebuildNodes]);

  return (
    <div className="w-full h-full relative">
      <StudioToolbar
        modelName={selectedModel?.name || null}
        onZoomIn={() => zoomIn({ duration: 200 })}
        onZoomOut={() => zoomOut({ duration: 200 })}
        onFitView={() => fitView({ duration: 300, padding: 0.15 })}
        onToggleNsfw={() => setNsfwEnabled((v) => !v)}
        nsfwEnabled={nsfwEnabled}
        resultCount={resultsRef.current.filter((r) => (r.data as Record<string, unknown>).status === 'done').length}
      />

      {/* Model selector (bottom-left) */}
      {models.length > 1 && (
        <div
          className="absolute bottom-4 left-4 z-10 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md"
          style={{
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Modelo ativo</label>
          <select
            value={selectedModel?.id || ''}
            onChange={(e) => {
              const m = models.find((mod) => mod.id === e.target.value);
              if (m) setSelectedModel(m);
            }}
            className="block mt-1 text-[13px] font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Empty state — no models */}
      {models.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center pointer-events-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Crie seu primeiro modelo</h2>
            <p className="text-[13px] text-gray-500 mb-4 max-w-sm">
              Para usar o Studio, primeiro crie uma modelo virtual no wizard.
            </p>
            <a
              href="/models/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg, #00AFF0, #0099D4)',
                boxShadow: '0 2px 8px rgba(0,175,240,0.3)',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Criar Modelo
            </a>
          </div>
        </div>
      )}

      {/* Canvas onboarding hint — when canvas is empty and models exist */}
      {models.length > 0 && spawnedCardsRef.current.length === 0 && resultsRef.current.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
              </svg>
            </div>
            <p className="text-[14px] font-medium text-gray-400 mb-1">Clique com botão direito</p>
            <p className="text-[12px] text-gray-300">para adicionar cards ao canvas</p>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={handleNodesDelete}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        className="studio-canvas"
        onContextMenu={handleContextMenu}
        onPaneClick={closeContextMenu}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="#B8D4E8" />
      </ReactFlow>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onSelect={handleMenuSelect}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
}

export function Studio() {
  return (
    <div className="fixed inset-0 ml-[244px] bg-[#FAFAFA]" style={{ fontFamily: "'Geist', sans-serif" }}>
      {/* Studio header */}
      <div
        className="absolute top-0 left-0 right-0 h-14 z-20 flex items-center px-6 bg-white/80 backdrop-blur-md"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00BFF5 0%, #0099D4 100%)' }}
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-gray-900">Studio</h1>
            <p className="text-[11px] text-gray-400 -mt-0.5">Crie conteúdo visual para suas modelos</p>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-mono">Right-click</kbd>
            <span>novo card</span>
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-mono">Scroll</kbd>
            <span>zoom</span>
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-mono">Drag</kbd>
            <span>mover</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="absolute inset-0 top-14">
        <ReactFlowProvider>
          <StudioCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
