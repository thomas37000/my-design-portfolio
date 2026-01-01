-- Create CV data table
CREATE TABLE public.cv_data (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  location text DEFAULT '',
  summary text DEFAULT '',
  experiences jsonb NOT NULL DEFAULT '[]'::jsonb,
  education jsonb NOT NULL DEFAULT '[]'::jsonb,
  languages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cv_data ENABLE ROW LEVEL SECURITY;

-- Anyone can view CV data (for download)
CREATE POLICY "Anyone can view CV data"
ON public.cv_data
FOR SELECT
USING (true);

-- Only admins can insert CV data
CREATE POLICY "Admins can insert CV data"
ON public.cv_data
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update CV data
CREATE POLICY "Admins can update CV data"
ON public.cv_data
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete CV data
CREATE POLICY "Admins can delete CV data"
ON public.cv_data
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_cv_data_updated_at
BEFORE UPDATE ON public.cv_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default empty CV
INSERT INTO public.cv_data (full_name, title, email) VALUES ('', '', '');