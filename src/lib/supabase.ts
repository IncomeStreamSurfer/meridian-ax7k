import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';
const serviceRole = import.meta.env.SUPABASE_SERVICE_ROLE ?? '';

export const supabase: SupabaseClient = createClient(url, anonKey, {
  auth: { persistSession: false },
});

export const supabaseAdmin: SupabaseClient = createClient(
  url,
  serviceRole || anonKey,
  { auth: { persistSession: false } }
);

export type WaitlistRow = {
  id: string;
  email: string;
  source: string | null;
  referrer: string | null;
  created_at: string;
};

export type ContentRow = {
  id: string;
  slug: string;
  title: string;
  body: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
