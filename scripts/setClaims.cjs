/**
 * scripts/setClaims.cjs
 *
 * Usage:
 *   node scripts/setClaims.cjs "email1[,email2,...]"
 *
 * Requires:
 *   - GOOGLE_APPLICATION_CREDENTIALS pointing to a Firebase service account JSON for the target project.
 *
 * This script sets custom claims { role: 'admin', plans: [...], full_access: true } for each email.
 */
const admin = require('firebase-admin');

function initAdmin() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp();
    } catch (e) {
      // ignore if already initialized
    }
  }
}

async function setClaimsForEmail(email) {
  const auth = admin.auth();
  try {
    let user;
    try {
      user = await auth.getUserByEmail(email);
    } catch (getUserErr) {
      if (getUserErr.code === 'auth/user-not-found') {
        console.log(`Creating user ${email}...`);
        user = await auth.createUser({
          email: email,
          password: 'TempP@ss!234',
          emailVerified: false
        });
        console.log(`✅ Created user ${email} with temporary password`);
      } else {
        throw getUserErr;
      }
    }
    
    const claims = { role: 'admin', plans: ['free','starter','pro','premium'], full_access: true };
    await auth.setCustomUserClaims(user.uid, claims);
    console.log(`✅ Set claims for ${email}:`, claims);
  } catch (err) {
    console.error(`❌ Error setting claims for ${email}:`, err.message || err);
    throw err;
  }
}

async function main() {
  initAdmin();
  const raw = process.argv[2];
  if (!raw) {
    console.error('Usage: node scripts/setClaims.cjs <email1[,email2,...]>');
    process.exit(1);
  }
  const emails = raw.split(',').map(s => s.trim()).filter(Boolean);
  for (const e of emails) {
    try {
      await setClaimsForEmail(e);
    } catch (err) {
      // continue to next email
    }
  }
  console.log('Done.');
  process.exit(0);
}

main();