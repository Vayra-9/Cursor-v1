/**
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=/abs/path/to/serviceAccount.json \
 *   node -r esbuild-register scripts/setClaims.ts
 *
 * This script sets custom claims for testuser@vayra.digital as admin.
 */
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

async function main() {
  const email = 'testuser@vayra.digital'; // 👈 hardcoded admin user

  initializeApp(); // requires GOOGLE_APPLICATION_CREDENTIALS env var
  const auth = getAuth();

  const user = await auth.getUserByEmail(email);

  const claims = {
    role: 'admin',
    plans: ['free', 'starter', 'pro', 'premium'],
    full_access: true,
  };

  await auth.setCustomUserClaims(user.uid, claims);

  console.log(`✅ ${email} is now admin with full access`, claims);
}

main().catch((e) => {
  console.error('❌ Error setting claims:', e);
  process.exit(1);
});
