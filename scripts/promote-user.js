/**
 * @file scripts/promote-user.js
 * @description THE SOVEREIGN PROMOTION TOOL (SC-556)
 * Executes a "Hard Weld" of user roles:
 * 1. Sets Custom Claims (Auth Token) for Middleware access.
 * 2. Updates Firestore Profile for UI visibility.
 * Usage: node scripts/promote-user.js <email> <role: admin|carrier|owner|traveler>
 */

require("dotenv").config({ path: ".env.local" });
const admin = require("firebase-admin");

// Protocol 30: Backend-First Authority Check
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("❌ FATAL ERROR: FIREBASE_SERVICE_ACCOUNT is missing from .env.local");
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

const targetEmail = process.argv[2];
const targetRole = process.argv[3];

if (!targetEmail || !["admin", "owner", "carrier", "traveler"].includes(targetRole)) {
  console.error("❌ Usage: node scripts/promote-user.js <email> <role>");
  console.error("Valid roles: admin, owner, carrier, traveler");
  process.exit(1);
}

async function promote() {
  try {
    console.log(`🔍 Locating user: ${targetEmail}...`);
    const user = await auth.getUserByEmail(targetEmail);

    console.log(`🛡️ Injecting Custom Claims (Passport Stamp: ${targetRole})...`);
    // Protocol 30: Stamping the JWT for Middleware enforcement
    await auth.setCustomUserClaims(user.uid, {
      role: targetRole,
      isAdmin: targetRole === "admin" || targetRole === "owner",
    });

    console.log(`🗄️ Updating Firestore Registry (Civil Record)...`);
    // Protocol 88: Write Once, sync registry

    const isAdminRole = targetRole === "admin" || targetRole === "owner";

    await db.collection("users").doc(user.uid).set(
      {
        role: targetRole,
        isAdmin: isAdminRole,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    console.log(`\n🎉 PROMOTION SUCCESSFUL!`);
    console.log(`🆔 User: ${targetEmail}`);
    console.log(`👑 New Rank: ${targetRole.toUpperCase()}`);
    console.log(`⚠️  NOTICE: User must re-login (Hard Sync) to apply changes.`);
    process.exit(0);
  } catch (error) {
    console.error("🔥 PROMOTION FAILED:", error.message);
    process.exit(1);
  }
}

promote();
