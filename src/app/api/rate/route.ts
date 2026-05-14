/**
 * @file src/app/api/rate/route.ts
 * @description API Route — يحفظ تقييم المسافر للناقل بصلاحيات Admin
 *
 * POST /api/rate
 * Body: { tripId, carrierId, userId, ratingValue, details }
 */

import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { tripId, carrierId, userId, ratingValue, details } = await req.json();

    if (!tripId || !carrierId || !userId || ratingValue == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const app = getAdminApp();
    const db = getFirestore(app);

    // 1. حفظ التقييم في ratings collection
    const ratingRef = db.collection("ratings").doc();
    await ratingRef.set({
      id: ratingRef.id,
      tripId,
      carrierId,
      userId,
      details,
      ratingValue,
      createdAt: FieldValue.serverTimestamp(),
    });

    // 2. تحديث ratingStats للناقل
    const carrierRef = db.collection("users").doc(carrierId);
    const carrierSnap = await carrierRef.get();
    if (carrierSnap.exists) {
      const currentStats = carrierSnap.data()?.ratingStats || { average: 0, count: 0, tier: "bronze" };
      const newCount = (currentStats.count || 0) + 1;
      const newAverage = ((currentStats.average || 0) * (currentStats.count || 0) + ratingValue) / newCount;
      let newTier = "bronze";
      if (newAverage >= 4.5 && newCount >= 10) newTier = "platinum";
      else if (newAverage >= 4.0 && newCount >= 5) newTier = "gold";
      else if (newAverage >= 3.5) newTier = "silver";

      await carrierRef.update({
        "ratingStats.average": parseFloat(newAverage.toFixed(2)),
        "ratingStats.count": newCount,
        "ratingStats.tier": newTier,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    // 3. تحديث حالة الحجز إلى Rated
    const bookingsSnap = await db.collection("bookings").where("tripId", "==", tripId).where("userId", "==", userId).limit(1).get();

    if (!bookingsSnap.empty) {
      await bookingsSnap.docs[0].ref.update({
        status: "Rated",
        ratedAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Rate API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
