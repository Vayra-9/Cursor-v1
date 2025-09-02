import { useEffect, useState } from 'react';
import { getClaims, onClaims } from '@/lib/auth/claims';

export function usePlanAccess() {
  const [claims, setClaims] = useState(getClaims());
  useEffect(() => onClaims(setClaims), []);

  // Dev override via URL or localStorage:
  const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;
  const queryGod = url?.searchParams.get('god') === '1';
  const lsGod = typeof window !== 'undefined' && localStorage.getItem('vayra-god') === '1';

  const isAdmin = queryGod || lsGod || claims.role === 'admin' || claims.full_access === true;
  const plans = new Set(claims.plans || []);

  const hasPlan = (p: string) => isAdmin || plans.has(p);
  const canUse = (required: string | string[]) => {
    if (isAdmin) return true;
    const reqs = Array.isArray(required) ? required : [required];
    return reqs.every((p) => plans.has(p));
  };

  return { claims, isAdmin, hasPlan, canUse };
}
