const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated');
  const role = data.role;
  if (!['hacker','company'].includes(role)) throw new functions.https.HttpsError('invalid-argument');
  await admin.auth().setCustomUserClaims(context.auth.uid, { role });
  await admin.firestore().collection('users').doc(context.auth.uid).set({ role }, { merge: true });
  return { success: true };
});

exports.onReportCreate = functions.firestore.document('reports/{id}').onCreate(async (snap, context) => {
  const data = snap.data();
  const program = await admin.firestore().collection('programs').doc(data.programId).get();
  if (!program.exists) {
    await snap.ref.delete();
    return null;
  }
  return null;
});

exports.onReportUpdate = functions.firestore.document('reports/{id}').onUpdate(async (change, context) => {
  const after = change.after.data();
  const before = change.before.data();
  if (after.status !== before.status && after.status === 'rewarded') {
    // placeholder: notify user or trigger payment
  }
  return null;
});
