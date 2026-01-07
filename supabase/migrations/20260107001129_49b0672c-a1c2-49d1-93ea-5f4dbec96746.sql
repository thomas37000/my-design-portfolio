-- Add hidden column to dev_projects table
ALTER TABLE public.dev_projects 
ADD COLUMN hidden boolean NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.dev_projects.hidden IS 'Whether the project is hidden from public view';