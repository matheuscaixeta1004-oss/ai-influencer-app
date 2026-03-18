import { useCallback, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
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
import { MdAutoFixHigh, MdAdd, MdPerson, MdImage, MdVideocam, MdDelete, MdEdit } from 'react-icons/md';
import { DeletableEdge } from './edges';
import { useSnapGuides } from './hooks/useSnapGuides';
import { SnapGuides } from './components/SnapGuides';

import { useAuth } from '../../contexts/AuthContext';
import { getUserModels, getModelPhotos } from '../../lib/models';
import { listProjects, createProject, saveProject, deleteProject, renameProject, type StudioProject } from '../../lib/studio';
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

const edgeTypes: EdgeTypes = {
  deletable: DeletableEdge,
};

// Default edge style — soft bezier, dark gray
const defaultEdgeOptions = {
  type: 'deletable',
  style: { stroke: '#94A3B8', strokeWidth: 2 },
  animated: false,
};

function StudioCanvas({ activeProject, onProjectSaved }: { activeProject: StudioProject | null; onProjectSaved?: () => void }) {
  const { user } = useAuth();
  const rfFlow = useReactFlow();
  const { zoomIn, zoomOut, fitView, screenToFlowPosition, getViewport, getNodes: rfGetNodes, setViewport } = rfFlow;
  const rfInstance = useRef<{ setViewport: typeof setViewport }>({ setViewport });

  const [models, setModels] = useState<AIModel[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<ModelPhoto | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [nsfwEnabled, setNsfwEnabled] = useState(false);
  const [resultCounter, setResultCounter] = useState(0);
  const [cardCounter, setCardCounter] = useState(0);
  const [, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Persistent card/result tracking — source of truth for spawned cards
  const spawnedCardsRef = useRef<Node[]>([]);
  const resultsRef = useRef<Node[]>([]);

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Auto-save — all via refs to avoid callback recreation loops
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeProjectRef = useRef(activeProject);
  activeProjectRef.current = activeProject;
  const edgesRef = useRef(edges);
  edgesRef.current = edges;
  const getViewportRef = useRef(getViewport);
  getViewportRef.current = getViewport;
  const onProjectSavedRef = useRef(onProjectSaved);
  onProjectSavedRef.current = onProjectSaved;
  const loadingProjectRef = useRef(false);

  // Load project data when active project changes
  useEffect(() => {
    if (!activeProject) return;
    loadingProjectRef.current = true;
    const projectNodes = (activeProject.nodes || []) as Node[];
    const projectEdges = (activeProject.edges || []) as Edge[];

    spawnedCardsRef.current = projectNodes.filter((n) => n.type === 'generationCard');
    resultsRef.current = projectNodes.filter((n) => n.type === 'resultCard');
    setCardCounter(spawnedCardsRef.current.length);
    setResultCounter(resultsRef.current.length);
    setNodes(projectNodes);
    setEdges(projectEdges);
    setSaveStatus('saved');

    // Restore saved viewport (position + zoom)
    const savedViewport = activeProject.viewport as { x: number; y: number; zoom: number } | null;
    if (savedViewport && typeof savedViewport.x === 'number') {
      // Wait for nodes to render, then set viewport
      setTimeout(() => {
        const { setViewport } = rfInstance.current || {};
        if (setViewport) {
          setViewport(savedViewport, { duration: 0 });
        }
      }, 100);
    }

    // Allow auto-save again after a tick (so initial load doesn't trigger save)
    setTimeout(() => { loadingProjectRef.current = false; }, 500);
  }, [activeProject?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ref to get current nodes from ReactFlow state (includes updated positions from drags)
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  // Stable auto-save function — never changes identity
  const triggerAutoSave = useCallback(() => {
    if (!activeProjectRef.current || loadingProjectRef.current) return;
    setSaveStatus('unsaved');

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const proj = activeProjectRef.current;
      if (!proj) return;
      setSaveStatus('saving');
      const viewport = getViewportRef.current();

      // Use ReactFlow's current nodes (has updated positions from drags)
      const currentNodes = nodesRef.current;

      // Sync positions back to refs so rebuildNodes doesn't overwrite them
      spawnedCardsRef.current = spawnedCardsRef.current.map((card) => {
        const rfNode = currentNodes.find((n) => n.id === card.id);
        return rfNode ? { ...card, position: rfNode.position } : card;
      });
      resultsRef.current = resultsRef.current.map((res) => {
        const rfNode = currentNodes.find((n) => n.id === res.id);
        return rfNode ? { ...res, position: rfNode.position } : res;
      });

      const allNodes = [...spawnedCardsRef.current, ...resultsRef.current];
      const cleanNodes = allNodes.map((n) => ({
        ...n,
        data: { ...n.data, onGenerate: undefined },
      }));
      const success = await saveProject(proj.id, cleanNodes, edgesRef.current, viewport);
      setSaveStatus(success ? 'saved' : 'unsaved');
    }, 2000);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track node/edge changes for auto-save
  const wrappedOnNodesChange: typeof onNodesChange = useCallback((...args) => {
    onNodesChange(...args);
    triggerAutoSave();
  }, [onNodesChange, triggerAutoSave]);

  const wrappedOnEdgesChange: typeof onEdgesChange = useCallback((...args) => {
    onEdgesChange(...args);
    triggerAutoSave();
  }, [onEdgesChange, triggerAutoSave]);

  // Snap guides
  const { guides, onNodeDrag: snapOnNodeDrag, onNodeDragStop: snapOnNodeDragStop } = useSnapGuides(nodes);

  // Shift+Scroll → horizontal pan (intercept before ReactFlow zooms)
  useEffect(() => {
    const container = document.querySelector('.studio-canvas') as HTMLElement | null;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.shiftKey) return;
      e.preventDefault();
      e.stopPropagation();
      const vp = getViewport();
      setViewport({ x: vp.x - e.deltaY, y: vp.y, zoom: vp.zoom }, { duration: 0 });
    };
    container.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => container.removeEventListener('wheel', onWheel, { capture: true });
  }, [getViewport, setViewport]);

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

  // ── Helper: rebuild nodes from refs ──────────────────────────────────
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
            handleGenerate(tmpl.category as CardCategory, params, card.id),
          hasSourceHandle: tmpl.hasSourceHandle,
          hasTargetHandle: tmpl.hasTargetHandle,
        },
      };
    });

    setNodes([...updatedSpawned, ...resultsRef.current]);
  }, [primaryPhoto, selectedModel, models, setNodes]);

  // Handle mock generation — updates the card's preview, no new node
  const handleGenerate = useCallback((category: CardCategory, _params: Record<string, string>, sourceCardId?: string) => {
    const placeholders = PLACEHOLDER_IMAGES[category] || [];
    if (!placeholders.length) return;

    const idx = resultCounter % placeholders.length;

    // Mark card as generating
    if (sourceCardId) {
      spawnedCardsRef.current = spawnedCardsRef.current.map((c) =>
        c.id === sourceCardId ? { ...c, data: { ...c.data, generatedStatus: 'generating', generatedImageUrl: undefined } } : c
      );
      rebuildNodes();

      // Simulate generation delay, then show result in same card
      setTimeout(() => {
        spawnedCardsRef.current = spawnedCardsRef.current.map((c) =>
          c.id === sourceCardId ? { ...c, data: { ...c.data, generatedStatus: 'done', generatedImageUrl: placeholders[idx] } } : c
        );
        setResultCounter((r) => r + 1);
        rebuildNodes();
      }, 2000);
    }
  }, [resultCounter, rebuildNodes]);

  // Rebuild when model/photo changes
  useEffect(() => {
    rebuildNodes();
  }, [rebuildNodes]);

  // ── Handle node deletion ──────────────────────────────────────────────
  const handleNodesDelete: OnNodesDelete = useCallback((deletedNodes) => {
    const deletedIds = new Set(deletedNodes.map((n) => n.id));
    spawnedCardsRef.current = spawnedCardsRef.current.filter((c) => !deletedIds.has(c.id));
    resultsRef.current = resultsRef.current.filter((r) => !deletedIds.has(r.id));
  }, []);

  // ── Handle type classification ──────────────────────────────────────
  // Every handle has a data type. Only same-type connections are allowed.
  const getHandleDataType = (handleId: string | null | undefined): string => {
    if (!handleId) return 'unknown';
    // Text handles
    if (handleId === 'text-ref' || handleId === 'text-out' || handleId === 'text-in') return 'text';
    // Image handles
    if (handleId === 'image-ref' || handleId === 'image-ref-2' || handleId === 'image-out'
        || handleId === 'output-ref' || handleId === 'model-out'
        || handleId === 'keyframe-start' || handleId === 'keyframe-end') return 'image';
    // Video handles
    if (handleId === 'video-ref') return 'video';
    // Audio handles
    if (handleId === 'audio-ref') return 'audio';
    return 'unknown';
  };

  // ── Connection validation — same type only, no unknowns ─────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isValidConnection = useCallback((connection: any) => {
    const sourceType = getHandleDataType(connection.sourceHandle);
    const targetType = getHandleDataType(connection.targetHandle);
    if (sourceType === 'unknown' || targetType === 'unknown') return false;
    return sourceType === targetType;
  }, []);

  // ── Handle edge connections (see onConnectWithClear below) ──────────

  // ── Track last pointer position (reliable, always available) ────────
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  useEffect(() => {
    const onPointer = (e: PointerEvent) => { lastPointerRef.current = { x: e.clientX, y: e.clientY }; };
    const onMove = (e: MouseEvent) => { lastPointerRef.current = { x: e.clientX, y: e.clientY }; };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0] || e.changedTouches[0];
      if (t) lastPointerRef.current = { x: t.clientX, y: t.clientY };
    };
    window.addEventListener('pointermove', onPointer, { capture: true });
    window.addEventListener('mousemove', onMove, { capture: true });
    window.addEventListener('touchmove', onTouch, { capture: true });
    return () => {
      window.removeEventListener('pointermove', onPointer, { capture: true });
      window.removeEventListener('mousemove', onMove, { capture: true });
      window.removeEventListener('touchmove', onTouch, { capture: true });
    };
  }, []);

  // ── Drag from handle → empty space → open menu & auto-connect ──────
  const pendingConnectionRef = useRef<{ nodeId: string; handleId: string; handleType: 'source' | 'target' } | null>(null);

  const onConnectStart = useCallback((_event: unknown, params: { nodeId: string | null; handleId: string | null; handleType: 'source' | 'target' | null }) => {
    // Only track SOURCE (output) handles — inputs don't trigger drag-to-create
    if (params.nodeId && params.handleId && params.handleType === 'source') {
      pendingConnectionRef.current = {
        nodeId: params.nodeId,
        handleId: params.handleId,
        handleType: params.handleType,
      };
    } else {
      pendingConnectionRef.current = null;
    }
  }, []);

  // ── Handle map: which target handles exist per card category ────────
  const CARD_TARGET_HANDLES: Record<string, string[]> = {
    image_gen: ['text-ref', 'image-ref'],
    video_gen: ['text-ref', 'image-ref', 'image-ref-2', 'keyframe-start', 'keyframe-end', 'video-ref', 'audio-ref'],
    model_ref: [],
    prompt: [],
    ref_image: [],
  };

  // When a connection completes successfully (handle→handle), clear pending
  const onConnectWithClear: OnConnect = useCallback((connection) => {
    if (!isValidConnection(connection)) return;
    setEdges((eds) => addEdge({ ...connection, ...defaultEdgeOptions }, eds));
    pendingConnectionRef.current = null; // Consumed
  }, [setEdges, isValidConnection]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onConnectEnd = useCallback((_event: any) => {
    const pending = pendingConnectionRef.current;
    if (!pending) return;
    // If onConnect already consumed this, do nothing
    // (pendingConnectionRef was cleared in onConnectWithClear)

    const { x: cx, y: cy } = lastPointerRef.current;
    if (!cx && !cy) { pendingConnectionRef.current = null; return; }

    // Check if dropped on a card → auto-connect
    const elUnderCursor = document.elementFromPoint(cx, cy) as HTMLElement | null;
    const cardEl = elUnderCursor?.closest?.('.react-flow__node') as HTMLElement | null;
    if (cardEl) {
      const targetNodeId = cardEl.getAttribute('data-id');
      if (targetNodeId && targetNodeId !== pending.nodeId) {
        const targetNode = rfGetNodes().find((n) => n.id === targetNodeId);
        const category = (targetNode?.data as Record<string, unknown>)?.category as string | undefined;
        const targetHandles = category ? (CARD_TARGET_HANDLES[category] || []) : [];
        const sourceType = getHandleDataType(pending.handleId);

        const compatibleHandle = targetHandles.find((h) => getHandleDataType(h) === sourceType);
        if (compatibleHandle) {
          setEdges((eds) => addEdge({
            source: pending.nodeId,
            sourceHandle: pending.handleId,
            target: targetNodeId,
            targetHandle: compatibleHandle,
            ...defaultEdgeOptions,
          }, eds));
          pendingConnectionRef.current = null;
          return;
        }
      }
    }

    // Dropped on empty space or incompatible card → open context menu
    const flowPos = screenToFlowPosition({ x: cx, y: cy });
    setContextMenuFlowPos(flowPos);
    setContextMenu({ x: cx, y: cy });
    // pendingConnectionRef stays alive — handleMenuSelect will use it
  }, [screenToFlowPosition, rfGetNodes, setEdges]);

  // Handle context menu open
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    setContextMenuFlowPos(flowPos);
    setContextMenu({ x: event.clientX, y: event.clientY });
  }, [screenToFlowPosition]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
    pendingConnectionRef.current = null;
  }, []);

  // Fallback: if user clicks on pane after a connection drag that didn't trigger onConnectEnd properly
  const handlePaneClick = useCallback((event: React.MouseEvent) => {
    // If there's a pending connection and no context menu open, open it
    if (pendingConnectionRef.current && !contextMenu) {
      // Fallback: open menu from pending connection
      const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      setContextMenuFlowPos(flowPos);
      setContextMenu({ x: event.clientX, y: event.clientY });
      return;
    }
    // Normal pane click — close menu
    setContextMenu(null);
    pendingConnectionRef.current = null;
  }, [contextMenu, screenToFlowPosition]);

  // Handle context menu selection — spawn a card (+ auto-connect if from handle drag)
  const handleMenuSelect = useCallback((itemId: string) => {
    const templateIdx = MENU_TO_TEMPLATE[itemId];
    if (templateIdx === undefined) return;

    const tmpl = CARD_TEMPLATES[templateIdx];
    if (tmpl.comingSoon) return;

    const newCardId = `card-${tmpl.category}-${Date.now()}-${cardCounter}`;
    const newCard: Node = {
      id: newCardId,
      type: 'generationCard',
      position: { x: contextMenuFlowPos.x, y: contextMenuFlowPos.y },
      data: {
        ...tmpl,
        modelAvatar: primaryPhoto?.url || undefined,
        modelName: selectedModel?.name || (models.length === 0 ? 'Crie um modelo primeiro' : 'Selecionar modelo'),
        onGenerate: (params: Record<string, string>) => handleGenerate(tmpl.category as CardCategory, params, newCardId),
        cardIndex: cardCounter + 1,
      },
      draggable: true,
      style: { zIndex: 1 },
    };

    spawnedCardsRef.current = [...spawnedCardsRef.current, newCard];
    setCardCounter((c) => c + 1);
    rebuildNodes();

    // Auto-connect if spawned from a handle drag
    const pending = pendingConnectionRef.current;
    if (pending) {
      // Determine which handle on the new card to connect to
      const newCardHandles = tmpl.category === 'image_gen'
        ? { targets: ['text-ref', 'image-ref'], sources: ['output-ref'] }
        : tmpl.category === 'video_gen'
        ? { targets: ['text-ref', 'image-ref', 'image-ref-2', 'keyframe-start', 'keyframe-end', 'video-ref', 'audio-ref'], sources: [] }
        : tmpl.category === 'model_ref'
        ? { targets: [], sources: ['model-out'] }
        : tmpl.category === 'prompt'
        ? { targets: [], sources: ['text-out'] }
        : tmpl.category === 'ref_image'
        ? { targets: [], sources: ['image-out'] }
        : { targets: [], sources: [] };

      let newEdge: Parameters<typeof addEdge>[0] | null = null;

      // Find the first target handle that matches the source type
      const sourceDataType = getHandleDataType(pending.handleId);
      const targetHandle = newCardHandles.targets.find((h) => {
        const t = getHandleDataType(h);
        return t === sourceDataType || t === 'any' || sourceDataType === 'any';
      }) || newCardHandles.targets[0];
      if (targetHandle) {
        newEdge = {
          source: pending.nodeId,
          sourceHandle: pending.handleId,
          target: newCard.id,
          targetHandle,
          ...defaultEdgeOptions,
        };
      }

      if (newEdge) {
        setEdges((eds) => addEdge(newEdge!, eds));
      }
      pendingConnectionRef.current = null;
    }

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
          className="absolute bottom-4 left-4 z-10 px-3 py-2 rounded-xl"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Modelo ativo</label>
          <select
            value={selectedModel?.id || ''}
            onChange={(e) => {
              const m = models.find((mod) => mod.id === e.target.value);
              if (m) setSelectedModel(m);
            }}
            className="block mt-1 text-[13px] font-medium bg-transparent text-gray-700 border-none outline-none cursor-pointer"
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
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(0,175,240,0.1)', border: '1px solid rgba(0,175,240,0.2)' }}
            >
              <MdPerson size={32} style={{ color: '#00AFF0' }} />
            </div>
            <h2 className="text-lg font-semibold mb-1 text-gray-800">Crie seu primeiro modelo</h2>
            <p className="text-[13px] mb-4 max-w-sm" style={{ color: '#666' }}>
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
              <MdAdd size={16} />
              Criar Modelo
            </a>
          </div>
        </div>
      )}

      {/* Canvas onboarding hint — when canvas is empty and models exist */}
      {models.length > 0 && spawnedCardsRef.current.length === 0 && resultsRef.current.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div
              className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <MdAutoFixHigh size={24} className="text-gray-300" />
            </div>
            <p className="text-[14px] font-medium mb-1 text-gray-400">Clique com botão direito</p>
            <p className="text-[12px] text-gray-300">para adicionar cards ao canvas</p>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={wrappedOnNodesChange}
        onEdgesChange={wrappedOnEdgesChange}
        onNodesDelete={handleNodesDelete}
        onConnect={onConnectWithClear}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        edgesReconnectable
        edgesFocusable
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        className="studio-canvas"
        onNodeDrag={snapOnNodeDrag}
        onNodeDragStop={snapOnNodeDragStop}
        onContextMenu={handleContextMenu}
        onPaneClick={handlePaneClick}
        selectionOnDrag
        panOnDrag={[1]}
        selectionKeyCode={null}
        zoomOnScroll
        zoomOnPinch
        panOnScroll={false}
        style={{ background: '#FAFAFA' }}
      >
        <SnapGuides guides={guides} />
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1}
          color="#B8D4E8"
        />
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

// ─── Spaces listing (project browser) ────────────────────────────────
function SpacesView({
  projects,
  loading,
  onOpen,
  onCreate,
  onDelete,
  onRename,
}: {
  projects: StudioProject[];
  loading: boolean;
  onOpen: (p: StudioProject) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const filtered = search
    ? projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : projects;

  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Meus Spaces</h2>
          <p className="text-[13px] text-gray-400 mt-0.5">{projects.length} {projects.length === 1 ? 'projeto' : 'projetos'}</p>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #00AFF0, #0099D4)', boxShadow: '0 2px 8px rgba(0,175,240,0.3)' }}
        >
          <MdAdd size={18} />
          Novo Space
        </button>
      </div>

      {/* Search */}
      {projects.length > 3 && (
        <div className="mb-5">
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 rounded-xl text-[13px] text-gray-700 outline-none placeholder-gray-400"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(0,175,240,0.08)', border: '1px solid rgba(0,175,240,0.15)' }}
          >
            <MdAutoFixHigh size={36} style={{ color: '#00AFF0' }} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum space ainda</h3>
          <p className="text-[13px] text-gray-400 mb-5 max-w-sm text-center">
            Spaces são seus workflows visuais. Crie um para começar a gerar imagens e vídeos.
          </p>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #00AFF0, #0099D4)' }}
          >
            <MdAdd size={16} />
            Criar Primeiro Space
          </button>
        </div>
      )}

      {/* Project grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* New space card */}
          <button
            onClick={onCreate}
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50/50"
            style={{ borderColor: 'rgba(0,0,0,0.1)', minHeight: 180 }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors group-hover:bg-blue-100" style={{ background: 'rgba(0,0,0,0.04)' }}>
              <MdAdd size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <span className="text-[13px] font-medium text-gray-400 group-hover:text-blue-500 transition-colors">Novo Space</span>
          </button>

          {/* Existing projects */}
          {filtered.map((proj) => {
            const nodeCount = (proj.nodes as unknown[])?.length || 0;
            const updated = new Date(proj.updated_at);
            const isEditing = editingId === proj.id;

            return (
              <div
                key={proj.id}
                className="group rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                onClick={() => !isEditing && onOpen(proj)}
              >
                {/* Thumbnail area */}
                <div className="relative h-28 flex items-center justify-center" style={{ background: '#F3F4F6' }}>
                  {nodeCount > 0 ? (
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                        <MdImage size={14} className="text-gray-400" />
                      </div>
                      <div className="w-1.5 h-px bg-gray-300" />
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                        <MdVideocam size={14} className="text-gray-400" />
                      </div>
                      <span className="ml-2 text-[10px] text-gray-400 font-medium">{nodeCount} cards</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 opacity-30">
                      <MdAutoFixHigh size={24} className="text-gray-400" />
                      <span className="text-[10px] text-gray-400">Vazio</span>
                    </div>
                  )}

                  {/* Actions (top right) */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(proj.id);
                        setEditValue(proj.name);
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-white shadow-sm text-gray-400 hover:text-gray-600 transition-colors"
                      title="Renomear"
                    >
                      <MdEdit size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(proj.id);
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-white shadow-sm text-gray-400 hover:text-red-500 transition-colors"
                      title="Deletar"
                    >
                      <MdDelete size={14} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="px-3.5 py-3">
                  {isEditing ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => {
                        if (editValue.trim()) onRename(proj.id, editValue.trim());
                        setEditingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { if (editValue.trim()) onRename(proj.id, editValue.trim()); setEditingId(null); }
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="w-full text-[13px] font-semibold px-1 py-0.5 rounded border border-blue-300 outline-none text-gray-800"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h3 className="text-[13px] font-semibold text-gray-800 truncate">{proj.name}</h3>
                  )}
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {updated.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    {' · '}
                    {updated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Studio() {
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [activeProject, setActiveProject] = useState<StudioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'spaces' | 'canvas'>('spaces');

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    setLoading(true);
    const projs = await listProjects();
    setProjects(projs);
    setLoading(false);
  };

  const handleCreateProject = async () => {
    const proj = await createProject(`Space ${projects.length + 1}`);
    if (proj) {
      setProjects((prev) => [proj, ...prev]);
      setActiveProject(proj);
      setView('canvas');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Deletar este space?')) return;
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) setActiveProject(null);
  };

  const handleRenameProject = async (id: string, name: string) => {
    await renameProject(id, name);
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, name } : p));
    if (activeProject?.id === id) setActiveProject((prev) => prev ? { ...prev, name } : prev);
  };

  const handleOpenProject = (proj: StudioProject) => {
    setActiveProject(proj);
    setView('canvas');
  };

  const handleBackToSpaces = () => {
    setView('spaces');
    loadProjects(); // Refresh list
  };

  return (
    <div className="fixed inset-0 ml-[244px]" style={{ background: '#FAFAFA', fontFamily: "'Geist', sans-serif" }}>
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 h-14 z-20 flex items-center px-6"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-3">
          {view === 'canvas' && (
            <button
              onClick={handleBackToSpaces}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Voltar para Spaces"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00BFF5 0%, #0099D4 100%)' }}
          >
            <MdAutoFixHigh size={16} style={{ color: 'white' }} />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-gray-800">
              {view === 'spaces' ? 'Studio' : activeProject?.name || 'Studio'}
            </h1>
            <p className="text-[11px] -mt-0.5 text-gray-500">
              {view === 'spaces' ? 'Seus workflows visuais' : 'Crie conteúdo visual para suas modelos'}
            </p>
          </div>
        </div>

        {/* Canvas-only controls */}
        {view === 'canvas' && (
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-[11px]" style={{ color: '#444' }}>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ background: '#F0F0F0', color: '#999', border: '1px solid rgba(0,0,0,0.08)' }}>Right-click</kbd>
              <span>novo card</span>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ background: '#F0F0F0', color: '#999', border: '1px solid rgba(0,0,0,0.08)' }}>Scroll</kbd>
              <span>zoom</span>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ background: '#F0F0F0', color: '#999', border: '1px solid rgba(0,0,0,0.08)' }}>Mid-click</kbd>
              <span>mover</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 top-14">
        {view === 'spaces' ? (
          <SpacesView
            projects={projects}
            loading={loading}
            onOpen={handleOpenProject}
            onCreate={handleCreateProject}
            onDelete={handleDeleteProject}
            onRename={handleRenameProject}
          />
        ) : activeProject ? (
          <ReactFlowProvider>
            <StudioCanvas activeProject={activeProject} onProjectSaved={loadProjects} />
          </ReactFlowProvider>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
