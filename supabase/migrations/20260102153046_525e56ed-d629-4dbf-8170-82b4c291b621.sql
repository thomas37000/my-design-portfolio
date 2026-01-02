-- Add cv_file_url column to cv_data table
ALTER TABLE public.cv_data ADD COLUMN IF NOT EXISTS cv_file_url text;

-- Create storage bucket for CV files
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-files', 'cv-files', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read CV files
CREATE POLICY "Anyone can view CV files"
ON storage.objects FOR SELECT
USING (bucket_id = 'cv-files');

-- Allow admins to upload CV files
CREATE POLICY "Admins can upload CV files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cv-files' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update CV files
CREATE POLICY "Admins can update CV files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'cv-files' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete CV files
CREATE POLICY "Admins can delete CV files"
ON storage.objects FOR DELETE
USING (bucket_id = 'cv-files' AND has_role(auth.uid(), 'admin'::app_role));