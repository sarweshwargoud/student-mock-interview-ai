"use client";

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

export default function WelcomeEmailTrigger() {
  const { user, isLoaded, isSignedIn } = useUser();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || hasTriggeredRef.current) return;

    const storageKey = `welcome_email_sent_${user.id}`;
    const alreadySent = localStorage.getItem(storageKey);

    if (!alreadySent) {
      hasTriggeredRef.current = true;

      const createdAt = user.createdAt ? new Date(user.createdAt).getTime() : 0;
      const isRecentlyCreated = (Date.now() - createdAt) < 20 * 60 * 1000;

      if (isRecentlyCreated) {
        fetch('/api/auth/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success || data.skipped) {
              localStorage.setItem(storageKey, 'true');
            }
          })
          .catch((err) => {
            console.error('[WelcomeEmailTrigger] Failed to trigger welcome email:', err);
          });
      } else {
        localStorage.setItem(storageKey, 'true');
      }
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}