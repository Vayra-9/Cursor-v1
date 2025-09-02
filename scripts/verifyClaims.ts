/**
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=/abs/path/to/serviceAccount.json \
 *   node -r esbuild-register scripts/verifyClaims.ts
 *
 * This script verifies custom claims for testuser@vayra.digital.
 */
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

async function main() {
  const email = 'testuser@vayra.digital';

  initializeApp(); // requires GOOGLE_APPLICATION_CREDENTIALS env var
  const auth = getAuth();

  try {
    const user = await auth.getUserByEmail(email);
    console.log(`✅ Found user: ${user.email} (UID: ${user.uid})`);
    
    if (user.customClaims) {
      console.log('📋 Current custom claims:', user.customClaims);
      
      const { role, plans, full_access } = user.customClaims as any;
      
      if (role === 'admin' && full_access === true) {
        console.log('🎉 User is admin with full access!');
      } else {
        console.log('⚠️  User is NOT admin or missing full access');
      }
      
      if (plans && Array.isArray(plans)) {
        console.log(`📚 Available plans: ${plans.join(', ')}`);
        const expectedPlans = ['free', 'starter', 'pro', 'premium'];
        const missingPlans = expectedPlans.filter(p => !plans.includes(p));
        if (missingPlans.length === 0) {
          console.log('✅ All expected plans are available');
        } else {
          console.log(`❌ Missing plans: ${missingPlans.join(', ')}`);
        }
      } else {
        console.log('❌ No plans array found in claims');
      }
    } else {
      console.log('❌ No custom claims found for user');
    }
  } catch (error) {
    console.error('❌ Error verifying claims:', error);
    process.exit(1);
  }
}

main();
