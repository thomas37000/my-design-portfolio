-- Function to get the current user's role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

-- Enable RLS on contact table (if not already enabled)
ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all contact messages
CREATE POLICY "Admins can view contact messages"
ON public.contact
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Anyone can insert contact messages (public form)
CREATE POLICY "Anyone can insert contact messages"
ON public.contact
FOR INSERT
WITH CHECK (true);

-- Policy: Admins can update contact messages (for status changes)
CREATE POLICY "Admins can update contact messages"
ON public.contact
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can delete contact messages
CREATE POLICY "Admins can delete contact messages"
ON public.contact
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));