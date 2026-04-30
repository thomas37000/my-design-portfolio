CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  technos JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
ON public.services FOR SELECT
USING (true);

CREATE POLICY "Admins can insert services"
ON public.services FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update services"
ON public.services FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete services"
ON public.services FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.services (title, price, description, icon, features, technos, display_order) VALUES
('Création de site internet', 'À partir de 800€', 'Sites vitrines, portfolios ou applications web sur mesure, responsive et optimisés SEO.', 'Globe',
 '["Design sur mesure & responsive","Optimisation SEO & performance","Hébergement & nom de domaine","Formation à l''utilisation"]'::jsonb,
 '["React","TypeScript","Tailwind","Supabase"]'::jsonb, 1),
('Maintenance & Support', 'À partir de 50€/mois', 'Mises à jour, sauvegardes, corrections de bugs et évolutions de votre site.', 'Wrench',
 '["Mises à jour régulières","Sauvegardes automatiques","Corrections & évolutions","Support réactif par email"]'::jsonb,
 '[]'::jsonb, 2),
('Création de logo', 'À partir de 250€', 'Identité visuelle unique reflétant les valeurs de votre marque, déclinable sur tous supports.', 'Palette',
 '["Recherches & propositions","Déclinaisons (couleurs, N&B)","Fichiers vectoriels (SVG, AI)","Charte graphique simple"]'::jsonb,
 '["Illustrator","Photoshop","Figma"]'::jsonb, 3),
('Design print & stickers', 'Sur devis', 'Macarons, stickers, flyers, cartes de visite — design prêt à imprimer pour tous vos supports.', 'Sticker',
 '["Maquettes haute résolution","Préparation pour impression","Formats variés (A6, A5, custom)","Conseils d''impression"]'::jsonb,
 '["Illustrator","InDesign"]'::jsonb, 4);