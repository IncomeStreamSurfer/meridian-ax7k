import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { sendEmail, waitlistWelcomeHtml } from '../../lib/email';

export const prerender = false;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: any = {};
  try {
    payload = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON body' });
  }

  const email = String(payload?.email || '').trim().toLowerCase();
  const source = payload?.source ? String(payload.source).slice(0, 64) : 'homepage';
  const referrer = payload?.referrer ? String(payload.referrer).slice(0, 500) : null;

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return json(400, { ok: false, error: 'Please enter a valid email address.' });
  }

  if (payload?.company && String(payload.company).trim() !== '') {
    return json(200, { ok: true, skipped: true });
  }

  const { error } = await supabase
    .from('meridian_waitlist')
    .insert({ email, source, referrer });

  if (error) {
    const msg = error.message || '';
    if (error.code === '23505' || /duplicate key/i.test(msg)) {
      return json(200, { ok: true, duplicate: true });
    }
    console.error('waitlist insert error:', error);
    return json(500, { ok: false, error: 'We could not save your email. Please try again.' });
  }

  try {
    await sendEmail({
      to: email,
      subject: "You're on the Meridian waitlist",
      html: waitlistWelcomeHtml(email),
    });
  } catch (e) {
    console.warn('welcome email failed:', e);
  }

  return json(200, { ok: true });
};

export const GET: APIRoute = () =>
  json(405, { ok: false, error: 'Use POST' });
