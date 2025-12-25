-- Create junction table for dev_projects and skills
CREATE TABLE public.dev_project_skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id bigint NOT NULL REFERENCES public.dev_projects(id) ON DELETE CASCADE,
    skill_id bigint NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(project_id, skill_id)
);

-- Create junction table for designer_projects and skills
CREATE TABLE public.designer_project_skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id bigint NOT NULL REFERENCES public.designer_projects(id) ON DELETE CASCADE,
    skill_id bigint NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(project_id, skill_id)
);

-- Enable RLS on both tables
ALTER TABLE public.dev_project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designer_project_skills ENABLE ROW LEVEL SECURITY;

-- RLS policies for dev_project_skills
CREATE POLICY "Anyone can view dev project skills" ON public.dev_project_skills
FOR SELECT USING (true);

CREATE POLICY "Admins can insert dev project skills" ON public.dev_project_skills
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update dev project skills" ON public.dev_project_skills
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete dev project skills" ON public.dev_project_skills
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS policies for designer_project_skills
CREATE POLICY "Anyone can view designer project skills" ON public.designer_project_skills
FOR SELECT USING (true);

CREATE POLICY "Admins can insert designer project skills" ON public.designer_project_skills
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update designer project skills" ON public.designer_project_skills
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete designer project skills" ON public.designer_project_skills
FOR DELETE USING (has_role(auth.uid(), 'admin'));