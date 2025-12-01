/**
 * Run with:
 *   GOOGLE_APPLICATION_CREDENTIALS=/abs/path/to/serviceAccount.json \
 *   npm run claims:verify
 *
 * Verifies the claims for testuser@vayra.digital.
 */
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

async function main() {
  const email = 'test@vayra.digital';

  initializeApp();
  const auth = getAuth();

  const user = await auth.getUserByEmail(email);
  console.log(`✅ Claims for ${email}:`, user.customClaims || {});
}

main().catch((e) => {
  console.error('❌ Error verifying claims:', e);
  process.exit(1);
});
