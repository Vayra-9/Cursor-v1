/**
 * Run with:
 *   GOOGLE_APPLICATION_CREDENTIALS=/abs/path/to/serviceAccount.json \
 *   node scripts/setClaims.js
 *
 * This sets custom claims for testuser@vayra.digital as admin with full access.
 */
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

async function main() {
  const email = 'testuser@vayra.digital'; // 👈 Hardcoded admin user

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

