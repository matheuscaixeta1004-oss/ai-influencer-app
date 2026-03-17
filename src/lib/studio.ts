import { supabase } from './supabase';

export interface StudioProject {
  id: string;
  user_id: string;
  name: string;
  nodes: unknown[];
  edges: unknown[];
  viewport: { x: number; y: number; zoom: number };
  created_at: string;
  updated_at: string;
}

/** List all projects for the current user (most recent first) */
export async function listProjects(): Promise<StudioProject[]> {
  const { data, error } = await supabase
    .from('studio_projects')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[Studio] listProjects error:', error);
    return [];
  }
  return (data ?? []) as StudioProject[];
}

/** Get a single project by ID */
export async function getProject(id: string): Promise<StudioProject | null> {
  const { data, error } = await supabase
    .from('studio_projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[Studio] getProject error:', error);
    return null;
  }
  return data as StudioProject;
}

/** Create a new project */
export async function createProject(name: string = 'Projeto sem nome'): Promise<StudioProject | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('studio_projects')
    .insert({ user_id: user.id, name, nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } })
    .select()
    .single();

  if (error) {
    console.error('[Studio] createProject error:', error);
    return null;
  }
  return data as StudioProject;
}

/** Save nodes, edges, and viewport for a project */
export async function saveProject(
  id: string,
  nodes: unknown[],
  edges: unknown[],
  viewport: { x: number; y: number; zoom: number },
): Promise<boolean> {
  const { error } = await supabase
    .from('studio_projects')
    .update({ nodes, edges, viewport })
    .eq('id', id);

  if (error) {
    console.error('[Studio] saveProject error:', error);
    return false;
  }
  return true;
}

/** Rename a project */
export async function renameProject(id: string, name: string): Promise<boolean> {
  const { error } = await supabase
    .from('studio_projects')
    .update({ name })
    .eq('id', id);

  if (error) {
    console.error('[Studio] renameProject error:', error);
    return false;
  }
  return true;
}

/** Delete a project */
export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('studio_projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Studio] deleteProject error:', error);
    return false;
  }
  return true;
}
