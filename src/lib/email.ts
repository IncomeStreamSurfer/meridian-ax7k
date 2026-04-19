const RESEND_API = 'https://api.resend.com/emails';

export type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  from = 'Meridian Coffee <onboarding@resend.dev>',
  replyTo,
}: SendArgs): Promise<{ ok: boolean; error?: string; id?: string }> {
  const key = import.meta.env.RESEND_API_KEY ?? '';
  if (!key) return { ok: false, error: 'RESEND_API_KEY not set' };
  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    const data: any = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.message || `HTTP ${res.status}` };
    return { ok: true, id: data?.id };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'send failed' };
  }
}

export function waitlistWelcomeHtml(email: string): string {
  return `
  <!doctype html>
  <html><body style="margin:0;background:#faf6ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0e0c0a;">
    <div style="max-width:560px;margin:0 auto;padding:48px 24px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:28px;">
        <svg width="24" height="24" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="13" stroke="#0e0c0a" stroke-width="1" fill="none"/>
          <line x1="1" y1="14" x2="27" y2="14" stroke="#0e0c0a" stroke-width="1"/>
        </svg>
        <span style="font-family:Georgia,serif;font-size:20px;">Meridian</span>
      </div>
      <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#746b5e;margin:0 0 12px;">Waitlist confirmed</p>
      <h1 style="font-family:Georgia,serif;font-size:34px;line-height:1.15;margin:0 0 20px;">You're on the list.</h1>
      <p style="font-size:16px;line-height:1.6;color:#2a241e;margin:0 0 18px;">
        Thanks for joining the Meridian waitlist with <strong>${email}</strong>. We're a specialty coffee brand in the making — single-origin beans, meticulous roasting, and the quiet ritual of a perfect cup.
      </p>
      <p style="font-size:16px;line-height:1.6;color:#2a241e;margin:0 0 30px;">
        You'll be first to hear when we open. Expect early access, tasting notes from our inaugural lots, and a little something in your inbox that feels less like marketing and more like a well-steamed cup.
      </p>
      <p style="font-size:16px;line-height:1.6;font-style:italic;color:#9f5e27;margin:0 0 36px;">
        — Coffee at the crossroads of craft and origin.
      </p>
      <hr style="border:none;border-top:1px solid rgba(14,12,10,0.1);margin:32px 0;" />
      <p style="font-size:12px;color:#746b5e;line-height:1.5;margin:0;">
        Meridian Coffee Co. · You received this because you joined our waitlist. Reply to this email any time — it reaches us directly.
      </p>
    </div>
  </body></html>`;
}
