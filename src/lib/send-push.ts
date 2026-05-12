/**
 * @file src/lib/send-push.ts
 * @description Helper بسيط — بتستخدمه في أي مكان في الكود عشان تبعت FCM Push
 *
 * استخدام:
 *   await sendPush({ userId: trip.carrierId, title: "طلب حجز جديد 🎫", body: "مسافر يطلب حجز..." });
 */

interface SendPushOptions {
  userId: string;
  title: string;
  body?: string;
  data?: Record<string, string>;
}

export async function sendPush({ userId, title, body, data }: SendPushOptions): Promise<void> {
  if (!userId) return;

  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title, body, data }),
    });
  } catch (err) {
    // الـ push مش حاجة تفشل الـ operation الأصلية
    console.warn("[sendPush] Failed to send push notification:", err);
  }
}
