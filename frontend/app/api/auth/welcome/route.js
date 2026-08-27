import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/mail';

const sentEmailsCache = new Set();

export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = user.emailAddresses?.[0]?.emailAddress;
    const name = user.firstName || user.username || 'there';

    if (!email) {
      return NextResponse.json({ error: 'No email found for authenticated user' }, { status: 400 });
    }

    if (sentEmailsCache.has(user.id) || sentEmailsCache.has(email)) {
      return NextResponse.json({ message: 'Welcome email already sent in this session', skipped: true });
    }

    console.log(`[Welcome API] Sending welcome email to registered user: ${email} (${user.id})`);
    
    const result = await sendWelcomeEmail({
      toEmail: email,
      userName: name,
    });

    if (result.success) {
      sentEmailsCache.add(user.id);
      sentEmailsCache.add(email);
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('[Welcome API] Error processing welcome email:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}