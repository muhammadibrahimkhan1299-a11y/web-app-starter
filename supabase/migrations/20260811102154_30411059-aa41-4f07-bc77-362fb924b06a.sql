-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- SHORT LINKS
CREATE TABLE public.short_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  original_url text NOT NULL,
  short_code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  click_count integer NOT NULL DEFAULT 0,
  last_clicked_at timestamptz,
  status text NOT NULL DEFAULT 'active'
);
CREATE INDEX short_links_user_idx ON public.short_links(user_id);
GRANT SELECT, UPDATE, DELETE ON public.short_links TO authenticated;
GRANT ALL ON public.short_links TO service_role;
ALTER TABLE public.short_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read own links" ON public.short_links FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all links" ON public.short_links FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owners update own links" ON public.short_links FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update links" ON public.short_links FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owners delete own links" ON public.short_links FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- LINK CLICKS
CREATE TABLE public.link_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_link_id uuid NOT NULL REFERENCES public.short_links(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  country text,
  device_type text,
  referrer text
);
CREATE INDEX link_clicks_link_idx ON public.link_clicks(short_link_id, created_at DESC);
GRANT SELECT ON public.link_clicks TO authenticated;
GRANT ALL ON public.link_clicks TO service_role;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read own clicks" ON public.link_clicks FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.short_links l WHERE l.id = short_link_id AND l.user_id = auth.uid())
);

-- LINK REPORTS
CREATE TABLE public.link_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code text NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.link_reports TO anon, authenticated;
GRANT SELECT, UPDATE ON public.link_reports TO authenticated;
GRANT ALL ON public.link_reports TO service_role;
ALTER TABLE public.link_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can report" ON public.link_reports FOR INSERT TO anon, authenticated WITH CHECK (char_length(reason) BETWEEN 3 AND 500);
CREATE POLICY "Admins read reports" ON public.link_reports FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update reports" ON public.link_reports FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- RESERVED SLUGS
CREATE TABLE public.reserved_slugs (slug text PRIMARY KEY);
GRANT SELECT ON public.reserved_slugs TO anon, authenticated;
GRANT ALL ON public.reserved_slugs TO service_role;
ALTER TABLE public.reserved_slugs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reserved slugs readable" ON public.reserved_slugs FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.reserved_slugs(slug) VALUES
('dashboard'),('admin'),('auth'),('login'),('signup'),('tools'),('about'),('contact'),
('privacy'),('terms'),('cookies'),('disclaimer'),('sitemap'),('sitemap.xml'),('robots.txt'),
('api'),('category'),('link-shortener'),('qr-code-generator'),('assets'),('favicon.ico'),('_build');

-- CREATE SHORT LINK (secure, definer)
CREATE OR REPLACE FUNCTION public.create_short_link(p_original_url text, p_short_code text DEFAULT NULL)
RETURNS public.short_links
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_code text;
  v_row public.short_links;
  v_try int := 0;
BEGIN
  IF p_original_url IS NULL OR p_original_url !~* '^https?://[^\s/$.?#].[^\s]*$' THEN
    RAISE EXCEPTION 'invalid_url';
  END IF;
  IF char_length(p_original_url) > 2048 THEN
    RAISE EXCEPTION 'invalid_url';
  END IF;

  IF p_short_code IS NOT NULL AND char_length(trim(p_short_code)) > 0 THEN
    v_code := lower(trim(p_short_code));
    IF v_code !~ '^[a-z0-9-]{3,32}$' THEN
      RAISE EXCEPTION 'invalid_slug';
    END IF;
    IF EXISTS (SELECT 1 FROM public.reserved_slugs WHERE slug = v_code) THEN
      RAISE EXCEPTION 'reserved_slug';
    END IF;
    IF EXISTS (SELECT 1 FROM public.short_links WHERE short_code = v_code) THEN
      RAISE EXCEPTION 'slug_taken';
    END IF;
  ELSE
    LOOP
      v_try := v_try + 1;
      v_code := lower(substr(replace(encode(gen_random_bytes(6),'base64'),'/',''), 1, 6));
      v_code := regexp_replace(v_code, '[^a-z0-9]', '', 'g');
      EXIT WHEN char_length(v_code) >= 5
        AND NOT EXISTS (SELECT 1 FROM public.short_links WHERE short_code = v_code)
        AND NOT EXISTS (SELECT 1 FROM public.reserved_slugs WHERE slug = v_code);
      IF v_try > 20 THEN RAISE EXCEPTION 'code_generation_failed'; END IF;
    END LOOP;
  END IF;

  INSERT INTO public.short_links (user_id, original_url, short_code)
  VALUES (auth.uid(), p_original_url, v_code)
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;
GRANT EXECUTE ON FUNCTION public.create_short_link(text, text) TO anon, authenticated;

-- RESOLVE + RECORD CLICK
CREATE OR REPLACE FUNCTION public.resolve_short_link(p_code text, p_country text DEFAULT NULL, p_device text DEFAULT NULL, p_referrer text DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_row public.short_links;
BEGIN
  SELECT * INTO v_row FROM public.short_links WHERE short_code = lower(p_code) AND status = 'active';
  IF NOT FOUND THEN RETURN NULL; END IF;

  UPDATE public.short_links
     SET click_count = click_count + 1, last_clicked_at = now()
   WHERE id = v_row.id;

  INSERT INTO public.link_clicks (short_link_id, country, device_type, referrer)
  VALUES (v_row.id, nullif(left(coalesce(p_country,''),8),''), nullif(left(coalesce(p_device,''),32),''), nullif(left(coalesce(p_referrer,''),255),''));

  RETURN v_row.original_url;
END;
$$;
GRANT EXECUTE ON FUNCTION public.resolve_short_link(text, text, text, text) TO anon, authenticated;

-- slug availability check (no data leak)
CREATE OR REPLACE FUNCTION public.slug_available(p_code text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p_code ~ '^[a-z0-9-]{3,32}$'
    AND NOT EXISTS (SELECT 1 FROM public.short_links WHERE short_code = lower(p_code))
    AND NOT EXISTS (SELECT 1 FROM public.reserved_slugs WHERE slug = lower(p_code))
$$;
GRANT EXECUTE ON FUNCTION public.slug_available(text) TO anon, authenticated;