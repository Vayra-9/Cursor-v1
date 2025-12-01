/**
 * functions/setClaimsForUsers.ts
 *
 * Optional: callable function that can be deployed to set claims from a secure caller.
 * Deploy only if you want Cloud Function approach (recommended for auditable ops).
 *
 * NOTE: This file is a template; adapt allowed callers and deployment as needed.
 */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const setClaimsForUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('permission-denied', 'Unauthenticated');
  // Replace with your admin-check logic
  const allowedCallerUids = ['UID_OF_YOUR_SUPERADMIN'];
  if (!allowedCallerUids.includes(context.auth.uid)) {
    throw new functions.https.HttpsError('permission-denied', 'Not authorized');
  }
  const raw = data.emails;
  if (!raw) throw new functions.https.HttpsError('invalid-argument', 'emails required');
  const emails = Array.isArray(raw) ? raw : String(raw).split(',').map(s => s.trim());
  const results: Record<string, any> = {};
  for (const e of emails) {
    try {
      const user = await admin.auth().getUserByEmail(e);
      const claims = { role: 'admin', plans: ['free','starter','pro','premium'], full_access: true };
      await admin.auth().setCustomUserClaims(user.uid, claims);
      results[e] = { success: true, claims };
    } catch (err) {
      results[e] = { success: false, error: String(err) };
    }
  }
  // Optional: write audit to Firestore
  await admin.firestore().collection('adminClaimsAudit').add({ caller: context.auth.uid, emails, results, ts: admin.firestore.FieldValue.serverTimestamp() });
  return { results };
});
