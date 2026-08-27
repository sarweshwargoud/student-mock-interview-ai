import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/mail';

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  try {
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    const payload = await req.json();
    const body = JSON.stringify(payload);

    let evt = payload;

    if (WEBHOOK_SECRET) {
      if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error('[Clerk Webhook] Missing svix headers');
        return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
      }

      const wh = new Webhook(WEBHOOK_SECRET);
      try {
        evt = wh.verify(body, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        });
      } catch (err) {
        console.error('[Clerk Webhook] Signature verification failed:', err.message);
        return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
      }
    }

    const eventType = evt?.type;
    console.log(`[Clerk Webhook] Received event: ${eventType}`);

    if (eventType === 'user.created') {
      const data = evt.data || {};
      const email = data.email_addresses?.[0]?.email_address;
      const firstName = data.first_name || data.username || 'there';

      console.log(`[Clerk Webhook] Processing user.created for ${email}`);

      if (email) {
        await sendWelcomeEmail({
          toEmail: email,
          userName: firstName,
        });
      } else {
        console.warn('[Clerk Webhook] No email address found in user.created payload');
      }
    }

    return NextResponse.json({ success: true, eventType });
  } catch (error) {
    console.error('[Clerk Webhook] Unhandled error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}