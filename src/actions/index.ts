import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { env } from 'cloudflare:workers';
import { getLocation } from '../lib/locations';
import { getProject } from '../lib/projects';
import { sendNotificationEmail } from '../lib/email';

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char,
  );

// Shared by every form action. Throws on a failed/missing verification so a
// caller's email never gets sent without it — never allow unverified
// submissions in production; only dev/preview (no real key configured yet)
// falls through with a warning.
async function verifyTurnstile(token: string, clientAddress: string | undefined): Promise<void> {
  const turnstileSecret = env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: token,
          ...(clientAddress ? { remoteip: clientAddress } : {}),
        }),
      },
    );
    const verifyResult = (await verifyResponse.json()) as { success: boolean };
    if (!verifyResult.success) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: 'Verification failed. Please try again.',
      });
    }
  } else if (import.meta.env.PROD) {
    throw new ActionError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Form is not yet configured. Please try again later.',
    });
  } else {
    console.warn('[actions] TURNSTILE_SECRET_KEY not set — skipping verification (dev only)');
  }
}

export const server = {
  getInvolved: defineAction({
    accept: 'form',
    input: z
      .object({
        name: z.string().trim().min(1, 'Please enter your name.'),
        email: z.string().trim().pipe(z.email('Please enter a valid email address.')),
        region: z.enum(['India', 'UK', 'USA']),
        interest: z.enum(['volunteer', 'donate', 'general', 'project']),
        projectSlug: z.string().optional(),
        message: z.string().trim().optional(),
        // Honeypot — real visitors never see or fill this field. Named to avoid
        // matching browser autofill heuristics (unlike e.g. "company"), so a
        // real visitor's autofill can't accidentally trigger it.
        _gotcha: z.string().optional(),
        'cf-turnstile-response': z.string().min(1, 'Verification failed. Please try again.'),
      })
      .refine((data) => data.interest !== 'project' || !!data.projectSlug, {
        message: 'Please choose a project.',
        path: ['projectSlug'],
      }),
    handler: async (input, context) => {
      // Bots that fill the honeypot get a silent success — no email, no tell.
      if (input._gotcha) {
        return { success: true };
      }

      await verifyTurnstile(input['cf-turnstile-response'], context.clientAddress);

      const to = getLocation(input.region)?.email;
      if (!to) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not determine where to send this — please try again later.',
        });
      }

      // Ignore a leftover projectSlug if the visitor switched away from
      // "project" after picking one — it's only meaningful for that interest.
      const project =
        input.interest === 'project' && input.projectSlug
          ? getProject(input.projectSlug)
          : undefined;
      const interestLabel = project ? `${input.interest} — ${project.title}` : input.interest;

      await sendNotificationEmail({
        to,
        replyTo: input.email,
        subject: `Get Involved: ${interestLabel} (${input.region})`,
        html: `
          <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
          <p><strong>Region:</strong> ${input.region}</p>
          <p><strong>Interest:</strong> ${escapeHtml(interestLabel)}</p>
          ${input.message ? `<p><strong>Message:</strong> ${escapeHtml(input.message)}</p>` : ''}
        `,
      });

      return { success: true };
    },
  }),

  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().trim().min(1, 'Please enter your name.'),
      email: z.string().trim().pipe(z.email('Please enter a valid email address.')),
      region: z.enum(['India', 'UK', 'USA']),
      message: z.string().trim().min(1, 'Please enter a message.'),
      _gotcha: z.string().optional(),
      'cf-turnstile-response': z.string().min(1, 'Verification failed. Please try again.'),
    }),
    handler: async (input, context) => {
      if (input._gotcha) {
        return { success: true };
      }

      await verifyTurnstile(input['cf-turnstile-response'], context.clientAddress);

      const to = getLocation(input.region)?.email;
      if (!to) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not determine where to send this — please try again later.',
        });
      }

      await sendNotificationEmail({
        to,
        replyTo: input.email,
        subject: `Contact form (${input.region})`,
        html: `
          <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
          <p><strong>Region:</strong> ${input.region}</p>
          <p><strong>Message:</strong> ${escapeHtml(input.message)}</p>
        `,
      });

      return { success: true };
    },
  }),
};
