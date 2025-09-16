import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

test.describe('Verify admin claims exist for production users', () => {
  const emails = ['test@vayra.digital', 'admin@vayra.digital'];
  // Polling helper: runs node scripts/verifyClaims.cjs and returns parsed claims map
  function runVerify() {
    try {
      const out = execSync(`node scripts/verifyClaims.cjs "${emails.join(',')}"`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
      const lines = out.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const map = {};
      for (const line of lines) {
        const [email, payload] = line.split('::');
        if (!email) continue;
        try {
          map[email] = JSON.parse(payload);
        } catch {
          map[email] = null;
        }
      }
      return map;
    } catch (e) {
      return {};
    }
  }

  test('poll until claims show full_access=true', async () => {
    const POLL_INTERVAL_MS = 5000;
    // WARNING: this will loop until claims are present; to abort, stop test run.
    while (true) {
      const map = runVerify();
      let ok = true;
      for (const e of emails) {
        const claims = map[e];
        if (!claims || !(claims.full_access === true || claims.role === 'admin')) {
          ok = false;
          console.log(`${e} not ready yet. Claims:`, claims);
        } else {
          console.log(`${e} has admin claims.`);
        }
      }
      if (ok) {
        expect(ok).toBeTruthy();
        break;
      }
      console.log(`Waiting ${POLL_INTERVAL_MS}ms before retrying...`);
      await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
    }
  });
});
