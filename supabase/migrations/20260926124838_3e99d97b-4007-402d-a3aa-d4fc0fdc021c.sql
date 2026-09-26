DROP POLICY IF EXISTS "Service role has full access" ON public.rate_limits;
CREATE POLICY "Service role has full access" ON public.rate_limits FOR ALL TO service_role USING (true) WITH CHECK (true);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['alcools','boucherie_traiteur','dépenses_mois','epicerie_boissons','fruits_legumes','hygiene_sante','magasin','patisserie_viennoiserie','surgeles_produits_frais','ticket_detail'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Enable read access for all users" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Admins can read" ON public.%I FOR SELECT TO authenticated USING (public.has_role(auth.uid(), ''admin''::app_role))', t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Shopping list is pucblic" ON public.shopping_list;
CREATE POLICY "Admins can read" ON public.shopping_list FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Select all logements" ON public.logements;
CREATE POLICY "Admins can read" ON public.logements FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));