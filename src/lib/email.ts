import { env } from 'cloudflare:workers';

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  /** Lets the organizer hit "reply" in their email client to reach the
   * visitor directly, instead of replying to EMAIL_FROM. */
  replyTo?: string;
}

export async function sendNotificationEmail({ to, subject, html, replyTo }: SendEmailInput) {
  const apiKey = env.RESEND_API_KEY;
  const from = env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn('[email] RESEND_API_KEY/EMAIL_FROM not set — skipping send', { to, subject });
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html, ...(replyTo ? { replyTo } : {}) }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error (${response.status}): ${body}`);
  }
}
