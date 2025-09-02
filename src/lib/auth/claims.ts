import { getAuth, onIdTokenChanged } from 'firebase/auth';

export type UserClaims = {
  role?: 'admin' | 'user';
  plans?: string[];
  full_access?: boolean;
};

let current: UserClaims = {};
const listeners: Array<(c: UserClaims) => void> = [];

export function getClaims() { return current; }
export function onClaims(cb: (c: UserClaims) => void) { listeners.push(cb); cb(current); }

export function initClaimsWatcher() {
  const auth = getAuth();
  onIdTokenChanged(auth, async (user) => {
    if (!user) { current = {}; listeners.forEach(fn => fn(current)); return; }
    const token = await user.getIdTokenResult(true); // force refresh to get updated claims
    current = (token.claims || {}) as UserClaims;
    listeners.forEach(fn => fn(current));
  });
}
