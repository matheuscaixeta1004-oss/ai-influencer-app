-- Create the storage bucket for model photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('model-photos', 'model-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: users can upload to their own model folders
CREATE POLICY "Users can upload model photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'model-photos');

CREATE POLICY "Users can view model photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'model-photos');

CREATE POLICY "Public can view model photos" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'model-photos');

-- Ensure RLS policies exist for all tables

-- profiles: users can read/update their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ai_models: users can CRUD their own models
CREATE POLICY "Users can read own models" ON public.ai_models
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create models" ON public.ai_models
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own models" ON public.ai_models
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own models" ON public.ai_models
  FOR DELETE USING (auth.uid() = user_id);

-- model_photos: users can manage photos of their own models
CREATE POLICY "Users can read own model photos" ON public.model_photos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ai_models WHERE id = model_photos.model_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can create model photos" ON public.model_photos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.ai_models WHERE id = model_photos.model_id AND user_id = auth.uid())
  );

-- content: users can manage their own content
CREATE POLICY "Users can read own content" ON public.content
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create content" ON public.content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- credit_transactions: users can read/create their own
CREATE POLICY "Users can read own transactions" ON public.credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON public.credit_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
