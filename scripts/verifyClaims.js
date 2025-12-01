/**
 * Run with:
 *   GOOGLE_APPLICATION_CREDENTIALS=/abs/path/to/serviceAccount.json \
 *   node scripts/verifyClaims.js
 *
 * Verifies the claims for testuser@vayra.digital.
 */
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

async function main() {
  const email = 'testuser@vayra.digital';

  initializeApp();
  const auth = getAuth();

  const user = await auth.getUserByEmail(email);
  console.log(`✅ Claims for ${email}:`, user.customClaims || {});
}

main().catch((e) => {
  console.error('❌ Error verifying claims:', e);
  process.exit(1);
});

