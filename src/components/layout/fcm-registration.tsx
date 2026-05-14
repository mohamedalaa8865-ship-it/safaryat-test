// // 'use client';

// // import { useEffect } from 'react';
// // import { getMessaging, getToken } from 'firebase/messaging';
// // import { initializeFirebase } from '@/firebase'; // 👈 1. التعديل هنا: استدعاء الدالة الخاصة بك بدلاً من app

// // export function FCMRegistration() {
// //     useEffect(() => {
// //         const setupFCM = async () => {
// //             // نتأكد أننا في بيئة المتصفح وأن المتصفح يدعم Service Worker
// //             if (typeof window !== "undefined" && "serviceWorker" in navigator) {
// //                 try {
// //                     // 1. طلب الصلاحية من المستخدم
// //                     const permission = await Notification.requestPermission();
// //                     if (permission !== 'granted') {
// //                         console.warn("تم رفض صلاحية الإشعارات من المستخدم");
// //                         return;
// //                     }

// //                     // 2. تسجيل ملف Firebase الخاص بالإشعارات يدوياً لمنع تعارضه مع Next-PWA
// //                     const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

// //                     // 👈 2. التعديل هنا: تشغيل الدالة الخاصة بك لاستخراج firebaseApp
// //                     const { firebaseApp } = initializeFirebase();

// //                     const messaging = getMessaging(firebaseApp);

// //                     // 3. الحصول على توكن الجهاز
// //                     const currentToken = await getToken(messaging, {
// //                         // ⚠️ هام: ضع الـ VAPID Key الخاص بك هنا من إعدادات Firebase
// //                         vapidKey: "BJLsP7Yk_RP58YEc3v9cBcU6s7uHFbYc2Knc-xuZo6OQ371OVOFnd3DVrqHkbUupLtxR1cgONUwwA9PJygm1NaY",
// //                         serviceWorkerRegistration: registration,
// //                     });

// //                     if (currentToken) {
// //                         console.log("FCM Token:", currentToken);
// //                         // يمكنك لاحقاً حفظ هذا التوكن في قاعدة بيانات المستخدم لترسل له الإشعارات
// //                     }
// //                 } catch (error) {
// //                     console.error("خطأ في إعداد الإشعارات:", error);
// //                 }
// //             }
// //         };

// //         setupFCM();
// //     }, []);

// //     return null;
// // }
// 'use client';

// import { useEffect } from 'react';
// import { getMessaging, getToken } from 'firebase/messaging';
// import { initializeFirebase } from '@/firebase';
// // 1. استيراد دوال قاعدة البيانات والمصادقة
// import { doc, setDoc, arrayUnion } from 'firebase/firestore';
// import { onAuthStateChanged } from 'firebase/auth';

// export function FCMRegistration() {
//     useEffect(() => {
//         const setupFCM = async () => {
//             if (typeof window !== "undefined" && "serviceWorker" in navigator) {
//                 try {
//                     const permission = await Notification.requestPermission();
//                     if (permission !== 'granted') {
//                         console.warn("تم رفض صلاحية الإشعارات من المستخدم");
//                         return;
//                     }

//                     const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

//                     // 2. استخراج firestore و auth بالإضافة إلى firebaseApp
//                     const { firebaseApp, firestore, auth } = initializeFirebase();

//                     const messaging = getMessaging(firebaseApp);

//                     const currentToken = await getToken(messaging, {
//                         // ⚠️ تأكد من وضع الـ VAPID Key الحقيقي الخاص بك هنا
//                         vapidKey: "BJLsP7Yk_RP58YEc3v9cBcU6s7uHFbYc2Knc-xuZo6OQ371OVOFnd3DVrqHkbUupLtxR1cgONUwwA9PJygm1NaY",
//                         serviceWorkerRegistration: registration,
//                     });

//                     if (currentToken) {
//                         // console.log("FCM Token Generated:", currentToken);

//                         // 🔴 3. حفظ التوكن في قاعدة البيانات 🔴
//                         // نستخدم onAuthStateChanged للتأكد من أن المستخدم سجل دخوله بنجاح
//                         onAuthStateChanged(auth, async (user) => {
//                             if (user) {
//                                 // تحديد مسار المستخدم (إذا كان الـ Collection اسمه carriers بدلاً من users، قم بتغييره)
//                                 const userRef = doc(firestore, 'users', user.uid);

//                                 // إضافة التوكن للمصفوفة (إذا لم يكن موجوداً مسبقاً)
//                                 await setDoc(userRef, {
//                                     fcmTokens: arrayUnion(currentToken)
//                                 }, { merge: true });

//                                 console.log("✅ تم ربط التوكن بحساب المستخدم بنجاح!");
//                             }
//                         });
//                     }
//                 } catch (error) {
//                     console.error("خطأ في إعداد الإشعارات:", error);
//                 }
//             }
//         };

//         setupFCM();
//     }, []);

//     return null;
// }
'use client';

import { useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast'; // 👈 (اختياري) يمكنك تفعيل هذا السطر لو أردت إشعارات داخلية

export function FCMRegistration() {
    const { toast } = useToast(); // 👈 (اختياري)

    useEffect(() => {
        const setupFCM = async () => {
            if (typeof window !== "undefined" && "serviceWorker" in navigator) {
                try {
                    // 1. طلب الصلاحية من المستخدم
                    const permission = await Notification.requestPermission();
                    if (permission !== 'granted') {
                        console.warn("تم رفض صلاحية الإشعارات من المستخدم");
                        return;
                    }

                    // 2. تسجيل الخدمة
                    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

                    // 3. تهيئة فايربيز
                    const { firebaseApp, firestore, auth } = initializeFirebase();
                    const messaging = getMessaging(firebaseApp);

                    // 4. استخراج التوكن
                    const currentToken = await getToken(messaging, {
                        // ⚠️ هام: تأكد من وضع الـ VAPID Key الحقيقي هنا (الحروف الإنجليزية فقط)
                        vapidKey: "BJLsP7Yk_RP58YEc3v9cBcU6s7uHFbYc2Knc-xuZo6OQ371OVOFnd3DVrqHkbUupLtxR1cgONUwwA9PJygm1NaY",
                        serviceWorkerRegistration: registration,
                    });

                    // 5. حفظ التوكن في قاعدة البيانات
                    if (currentToken) {
                        console.log("FCM Token Generated:", currentToken);

                        onAuthStateChanged(auth, async (user) => {
                            if (user) {
                                // ⚠️ ملاحظة: إذا كان ملف الناقل في جدول اسمه 'carriers'، قم بتغيير 'users' إلى 'carriers'
                                const userRef = doc(firestore, 'users', user.uid);

                                await setDoc(userRef, {
                                    fcmTokens: arrayUnion(currentToken)
                                }, { merge: true });

                                console.log("✅ تم ربط التوكن بحساب المستخدم بنجاح!");
                            }
                        });
                    }

                    // 🔴 6. استقبال الإشعارات والتطبيق مفتوح (Foreground) 🔴
                    onMessage(messaging, (payload) => {
                        console.log("إشعار وصل والتطبيق مفتوح:", payload);

                        // الطريقة الأولى: إظهار إشعار من المتصفح (حتى لو الموقع مفتوح)
                        if (Notification.permission === 'granted') {
                            new Notification(payload.notification?.title || "إشعار جديد", {
                                body: payload.notification?.body,
                                icon: '/icons/icon-192x192.png'
                            });
                        }

                        // الطريقة الثانية: إظهار إشعار Toast داخل الموقع (قم بإزالة علامتي // لتشغيلها)
                        if (payload.notification) {
                            toast({
                                title: payload.notification.title,
                                description: payload.notification.body,
                            });
                        }

                    });

                } catch (error) {
                    console.error("خطأ في إعداد الإشعارات:", error);
                }
            }
        };

        setupFCM();
    }, []); // لو فعلت الـ toast ضفها هنا هكذا: [toast]

    return null;
}