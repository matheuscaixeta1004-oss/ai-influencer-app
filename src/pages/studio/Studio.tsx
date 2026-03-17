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
import { MdAutoFixHigh, MdAdd, MdPerson, MdFolder, MdDelete, MdEdit } from 'react-icons/md';

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

// Default edge style — soft bezier, dark gray
const defaultEdgeOptions = {
  type: 'default',
  style: { stroke: '#94A3B8', strokeWidth: 2 },
  animated: false,
};

function StudioCanvas({ activeProject, onProjectSaved }: { activeProject: StudioProject | null; onProjectSaved?: () => void }) {
  const { user } = useAuth();
  const { zoomIn, zoomOut, fitView, screenToFlowPosition, getViewport } = useReactFlow();

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
    // Allow auto-save again after a tick (so initial load doesn't trigger save)
    setTimeout(() => { loadingProjectRef.current = false; }, 500);
  }, [activeProject?.id]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const allNodes = [...spawnedCardsRef.current, ...resultsRef.current];
      const cleanNodes = allNodes.map((n) => ({
        ...n,
        data: { ...n.data, onGenerate: undefined },
      }));
      const success = await saveProject(proj.id, cleanNodes, edgesRef.current, viewport);
      setSaveStatus(success ? 'saved' : 'unsaved');
      // Don't call onProjectSaved to avoid reloading the active project
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

  // ── Handle node deletion ──────────────────────────────────────────────
  const handleNodesDelete: OnNodesDelete = useCallback((deletedNodes) => {
    const deletedIds = new Set(deletedNodes.map((n) => n.id));
    spawnedCardsRef.current = spawnedCardsRef.current.filter((c) => !deletedIds.has(c.id));
    resultsRef.current = resultsRef.current.filter((r) => !deletedIds.has(r.id));
  }, []);

  // ── Handle edge connections ──────────────────────────────────────────
  const onConnect: OnConnect = useCallback((connection) => {
    setEdges((eds) => addEdge({ ...connection, ...defaultEdgeOptions }, eds));
  }, [setEdges]);

  // Handle context menu open
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    setContextMenuFlowPos(flowPos);
    setContextMenu({ x: event.clientX, y: event.clientY });
  }, [screenToFlowPosition]);

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
        cardIndex: cardCounter + 1,
      },
      draggable: true,
      style: { zIndex: 1 },
    };

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
          className="absolute bottom-4 left-4 z-10 px-3 py-2 rounded-xl"
          style={{
            background: '#1e1e1e',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Modelo ativo</label>
          <select
            value={selectedModel?.id || ''}
            onChange={(e) => {
              const m = models.find((mod) => mod.id === e.target.value);
              if (m) setSelectedModel(m);
            }}
            className="block mt-1 text-[13px] font-medium bg-transparent border-none outline-none cursor-pointer text-gray-800"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id} style={{ background: '#222' }}>{m.name}</option>
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
        style={{ background: '#FAFAFA' }}
      >
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

export function Studio() {
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [activeProject, setActiveProject] = useState<StudioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showProjectList, setShowProjectList] = useState(false);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const projs = await listProjects();
    setProjects(projs);
    if (projs.length > 0 && !activeProject) {
      setActiveProject(projs[0]); // Most recent
    }
    setLoading(false);
  };

  const handleCreateProject = async () => {
    const proj = await createProject(`Projeto ${projects.length + 1}`);
    if (proj) {
      setProjects((prev) => [proj, ...prev]);
      setActiveProject(proj);
      setShowProjectList(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Deletar este projeto?')) return;
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) {
      const remaining = projects.filter((p) => p.id !== id);
      setActiveProject(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) return;
    await renameProject(id, renameValue.trim());
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, name: renameValue.trim() } : p));
    if (activeProject?.id === id) {
      setActiveProject((prev) => prev ? { ...prev, name: renameValue.trim() } : prev);
    }
    setRenamingId(null);
  };

  return (
    <div className="fixed inset-0 ml-[244px]" style={{ background: '#FAFAFA', fontFamily: "'Geist', sans-serif" }}>
      {/* Studio header */}
      <div
        className="absolute top-0 left-0 right-0 h-14 z-20 flex items-center px-6"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00BFF5 0%, #0099D4 100%)' }}
          >
            <MdAutoFixHigh size={16} style={{ color: 'white' }} />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-gray-800">Studio</h1>
            <p className="text-[11px] -mt-0.5 text-gray-500">Crie conteúdo visual para suas modelos</p>
          </div>
        </div>

        {/* Project selector */}
        <div className="ml-6 relative">
          <button
            onClick={() => setShowProjectList(!showProjectList)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <MdFolder size={16} className="text-gray-400" />
            {activeProject?.name || 'Nenhum projeto'}
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Project dropdown */}
          {showProjectList && (
            <div
              className="absolute top-full left-0 mt-1 w-72 rounded-xl overflow-hidden z-50"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Projetos</span>
                <button
                  onClick={handleCreateProject}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <MdAdd size={14} />
                  Novo
                </button>
              </div>

              {/* Project list */}
              <div className="max-h-64 overflow-y-auto">
                {projects.length === 0 && (
                  <div className="px-3 py-4 text-center text-[12px] text-gray-400">Nenhum projeto ainda</div>
                )}
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                      activeProject?.id === proj.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setActiveProject(proj);
                      setShowProjectList(false);
                    }}
                  >
                    <MdFolder size={14} className={activeProject?.id === proj.id ? 'text-blue-500' : 'text-gray-300'} />
                    {renamingId === proj.id ? (
                      <input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => handleRename(proj.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleRename(proj.id); if (e.key === 'Escape') setRenamingId(null); }}
                        className="flex-1 text-[12px] px-1 py-0.5 rounded border border-blue-300 outline-none"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="flex-1 text-[12px] font-medium text-gray-700 truncate">{proj.name}</span>
                    )}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100" style={{ opacity: activeProject?.id === proj.id ? 1 : undefined }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingId(proj.id);
                          setRenameValue(proj.name);
                        }}
                        className="p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                        title="Renomear"
                      >
                        <MdEdit size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(proj.id);
                        }}
                        className="p-0.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                        title="Deletar"
                      >
                        <MdDelete size={12} />
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-300">
                      {new Date(proj.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 text-[11px]" style={{ color: '#444' }}>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ background: '#F0F0F0', color: '#999', border: '1px solid rgba(0,0,0,0.08)' }}>Right-click</kbd>
            <span>novo card</span>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ background: '#F0F0F0', color: '#999', border: '1px solid rgba(0,0,0,0.08)' }}>Scroll</kbd>
            <span>zoom</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="absolute inset-0 top-14">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : !activeProject ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MdFolder size={48} className="mx-auto mb-4 text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Nenhum projeto</h2>
              <p className="text-[13px] text-gray-400 mb-4">Crie um projeto para começar a trabalhar no Studio</p>
              <button
                onClick={handleCreateProject}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #00AFF0, #0099D4)' }}
              >
                <MdAdd size={16} />
                Criar Projeto
              </button>
            </div>
          </div>
        ) : (
          <ReactFlowProvider>
            <StudioCanvas activeProject={activeProject} onProjectSaved={loadProjects} />
          </ReactFlowProvider>
        )}
      </div>

      {/* Click outside to close project list */}
      {showProjectList && (
        <div className="fixed inset-0 z-40" onClick={() => setShowProjectList(false)} />
      )}
    </div>
  );
}
