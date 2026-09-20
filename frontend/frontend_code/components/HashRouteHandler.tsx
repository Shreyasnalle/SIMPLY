"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HashRouteHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#/account') {
        router.push('/account');
      } else if (hash === '#/settings') {
        router.push('/settings');
      } else if (hash === '#/policies') {
        router.push('/policies');
      } else if (hash === '#/features/retrieval') {
        router.push('/features/retrieval');
      } else if (hash === '#/features/summary') {
        router.push('/features/summary');
      } else if (hash === '#/' || hash === '#') {
        router.push('/');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [router]);

  return null;
}
