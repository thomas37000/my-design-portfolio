-- Add images array column to designer_projects
ALTER TABLE public.designer_projects 
ADD COLUMN images text[] DEFAULT '{}';

-- Migrate existing single image to images array where applicable
UPDATE public.designer_projects 
SET images = ARRAY[img] 
WHERE img IS NOT NULL AND img != '';