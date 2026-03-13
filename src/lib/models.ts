import { supabase } from './supabase';
import type { AIModel, ModelPhoto } from '../types';

// Fetch all models for the current user
export async function getUserModels(): Promise<AIModel[]> {
  const { data, error } = await supabase
    .from('ai_models')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get a single model by ID
export async function getModel(id: string): Promise<AIModel | null> {
  const { data, error } = await supabase
    .from('ai_models')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

// Create a new model
export async function createModel(
  userId: string,
  model: {
    name: string;
    age: number;
    ethnicity: string;
    location: string;
    niche: string;
    bio: string;
    config: Record<string, unknown>;
  }
): Promise<AIModel> {
  const { data, error } = await supabase
    .from('ai_models')
    .insert({
      user_id: userId,
      ...model,
      status: 'draft',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update model status
export async function updateModelStatus(id: string, status: AIModel['status']): Promise<void> {
  const { error } = await supabase
    .from('ai_models')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

// Delete a model
export async function deleteModel(id: string): Promise<void> {
  const { error } = await supabase
    .from('ai_models')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Upload photos to Supabase Storage + create model_photos records
export async function uploadModelPhotos(
  modelId: string,
  files: File[]
): Promise<ModelPhoto[]> {
  const uploaded: ModelPhoto[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `models/${modelId}/${Date.now()}-${i}.${ext}`;

    // Upload to storage
    const { error: uploadErr } = await supabase.storage
      .from('model-photos')
      .upload(path, file, { contentType: file.type });

    if (uploadErr) {
      console.error('Upload failed:', uploadErr);
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('model-photos')
      .getPublicUrl(path);

    // Insert record
    const { data, error } = await supabase
      .from('model_photos')
      .insert({
        model_id: modelId,
        storage_path: path,
        url: urlData.publicUrl,
        is_primary: i === 0 && uploaded.length === 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Record failed:', error);
      continue;
    }

    uploaded.push(data);
  }

  return uploaded;
}

// Get photos for a model
export async function getModelPhotos(modelId: string): Promise<ModelPhoto[]> {
  const { data, error } = await supabase
    .from('model_photos')
    .select('*')
    .eq('model_id', modelId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}
