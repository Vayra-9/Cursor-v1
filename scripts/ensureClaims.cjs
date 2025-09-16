/**
 * scripts/ensureClaims.cjs
 *
 * Usage:
 *  node scripts/ensureClaims.cjs "email1[,email2,...]"
 *
 * This wrapper will:
 *  - call scripts/setClaims.cjs once (best-effort),
 *  - then poll scripts/verifyClaims.cjs repeatedly every 5s until all emails report full_access=true in customClaims.
 *
 * WARNING: This script will loop indefinitely until the claims are observed. To stop it, Ctrl+C the process.
 * If you want a hard timeout, modify MAX_DURATION_MS below.
 */
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const POLL_INTERVAL_MS = 5000; // 5s
const MAX_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours safety cap; change as needed (set to 0 for no cap)
const START = Date.now();

async function runCmd(cmd) {
  try {
    const { stdout, stderr } = await execPromise(cmd, { maxBuffer: 10 * 1024 * 1024 });
    return { stdout, stderr };
  } catch (err) {
    return { stdout: err.stdout || '', stderr: err.stderr || String(err) };
  }
}

function parseVerifyOutput(output, email) {
  // verifyClaims prints lines like "email::{"role":"admin",...}"
  const lines = output.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  for (const l of lines) {
    if (l.startsWith(email + '::')) {
      const payload = l.slice((email + '::').length);
      try {
        if (payload.startsWith('ERROR::')) return { error: payload };
        return { claims: JSON.parse(payload) };
      } catch (e) {
        return { error: 'invalid-json' };
      }
    }
  }
  return { error: 'not-found' };
}

async function main() {
  const raw = process.argv[2];
  if (!raw) {
    console.error('Usage: node scripts/ensureClaims.cjs <email1[,email2,...]>');
    process.exit(1);
  }
  const emails = raw.split(',').map(s => s.trim()).filter(Boolean);
  // First, try to set claims (best-effort)
  console.log('Attempting one-time setClaims for:', emails.join(','));
  await runCmd(`node scripts/setClaims.cjs "${emails.join(',')}"`).catch(()=>{});

  // Poll until all emails show full_access === true
  while (true) {
    if (MAX_DURATION_MS > 0 && Date.now() - START > MAX_DURATION_MS) {
      console.error('Max duration exceeded. Exiting with non-zero code.');
      process.exit(2);
    }
    console.log('Polling verifyClaims for:', emails.join(','));
    const { stdout } = await runCmd(`node scripts/verifyClaims.cjs "${emails.join(',')}"`);
    let allOk = true;
    for (const e of emails) {
      const res = parseVerifyOutput(stdout, e);
      if (res.claims && (res.claims.full_access === true || res.claims.role === 'admin')) {
        console.log(`✅ ${e} shows admin/full_access`);
      } else {
        allOk = false;
        console.log(`... ${e} not ready:`, res.error ? res.error : JSON.stringify(res.claims));
      }
    }
    if (allOk) {
      console.log('All users report admin/full_access. Exiting SUCCESS.');
      process.exit(0);
    }
    console.log(`Waiting ${POLL_INTERVAL_MS}ms before re-checking... (Ctrl+C to abort)`);
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
  }
}

main();
