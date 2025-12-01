/**
 * scripts/verifyClaims.cjs
 *
 * Usage:
 *   node scripts/verifyClaims.cjs "email1[,email2,...]"
 *
 * Prints customClaims for each supplied email.
 */
const admin = require('firebase-admin');

function initAdmin() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp();
    } catch (e) {}
  }
}

async function printClaims(email) {
  const auth = admin.auth();
  try {
    const user = await auth.getUserByEmail(email);
    console.log(`${email}::${JSON.stringify(user.customClaims || {})}`);
  } catch (err) {
    console.error(`${email}::ERROR::${err.message || err}`);
  }
}

async function main() {
  initAdmin();
  const raw = process.argv[2];
  if (!raw) {
    console.error('Usage: node scripts/verifyClaims.cjs <email1[,email2,...]>');
    process.exit(1);
  }
  const emails = raw.split(',').map(s => s.trim()).filter(Boolean);
  for (const e of emails) {
    await printClaims(e);
  }
  process.exit(0);
}

main();