import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ site }) => {
  const origin = (site?.toString() || 'https://meridian-ax7k.vercel.app').replace(/\/$/, '');
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    `Sitemap: ${origin}/sitemap-index.xml`,
    '',
  ].join('\n');
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
