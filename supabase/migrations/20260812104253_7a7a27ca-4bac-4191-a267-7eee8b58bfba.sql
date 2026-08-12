-- Lock down EXECUTE on SECURITY DEFINER functions to the minimum needed
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.create_short_link(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_short_link(text, text) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.resolve_short_link(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_short_link(text, text, text, text) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.slug_available(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.slug_available(text) TO anon, authenticated, service_role;

-- Click events are recorded only by the trusted resolve_short_link function.
REVOKE INSERT, UPDATE, DELETE ON public.link_clicks FROM anon, authenticated;
GRANT ALL ON public.link_clicks TO service_role;

-- Role assignment: admin-only controlled path, no self-assignment
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

DROP POLICY IF EXISTS "Admins manage roles insert" ON public.user_roles;
CREATE POLICY "Admins manage roles insert" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage roles update" ON public.user_roles;
CREATE POLICY "Admins manage roles update" ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage roles delete" ON public.user_roles;
CREATE POLICY "Admins manage roles delete" ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));