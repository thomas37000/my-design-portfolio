-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create settings table for admin configurations
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (for frontend display)
CREATE POLICY "Settings are readable by everyone"
ON public.settings
FOR SELECT
USING (true);

-- Only admins can update settings
CREATE POLICY "Only admins can update settings"
ON public.settings
FOR UPDATE
USING (public.get_current_user_role() = 'admin');

-- Only admins can insert settings
CREATE POLICY "Only admins can insert settings"
ON public.settings
FOR INSERT
WITH CHECK (public.get_current_user_role() = 'admin');

-- Insert default display mode setting
INSERT INTO public.settings (key, value)
VALUES ('display_mode', '{"projects": "gallery"}');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();