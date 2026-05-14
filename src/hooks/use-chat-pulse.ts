// // 'use client';

// // import { useState, useEffect, useCallback } from 'react';
// // import { useFirestore } from '@/firebase';
// // import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
// // import { getErrorMessage } from '@/lib/error-dictionary';
// // import { useToast } from '@/hooks/use-toast';

// // /**
// //  * @hook useChatPulse
// //  * @description THE STERILIZED CHAT REACTOR (V2.0 - SCR-917-STERILIZED)
// //  * Protocol 16: Logic-only responsibility. Managed anonymous identity.
// //  * Protocol 88: Lazy-loading listener to prevent data hemorrhage.
// //  */

// // export interface ChatMessage {
// //     id: string;
// //     text: string;
// //     senderId: string;
// //     senderName: string;
// //     senderRole: 'carrier' | 'traveler' | 'agent' | 'system';
// //     createdAt: any;
// // }

// // export function useChatPulse(tripId: string, isOpen: boolean) {
// //     const firestore = useFirestore();
// //     const { toast } = useToast();
// //     const [messages, setMessages] = useState<ChatMessage[]>([]);
// //     const [isSending, setIsSending] = useState(false);
// //     const [guestId, setGuestId] = useState<string>('');

// //     // [PROTOCOL 16/SSOT]: Stable Identity Anchor - Prevents Hydration jitter
// //     useEffect(() => {
// //         if (typeof window === 'undefined') return;
// //         let id = localStorage.getItem('safar_guest_id');
// //         if (!id) {
// //             id = `guest_${Math.random().toString(36).substring(2, 11)}`;
// //             localStorage.setItem('safar_guest_id', id);
// //         }
// //         setGuestId(id);
// //     }, []);

// //     // [PROTOCOL 88]: Conditional Artery Pulse (Lazy Fetching)
// //     useEffect(() => {
// //         if (!firestore || !tripId || !isOpen) {
// //             setMessages([]);
// //             return;
// //         }

// //         const messagesRef = collection(firestore, 'trips', tripId, 'messages');
// //         const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(50));

// //         const unsubscribe = onSnapshot(q, (snapshot) => {
// //             const fetchedMessages = snapshot.docs.map(doc => ({
// //                 id: doc.id,
// //                 ...doc.data()
// //             })) as ChatMessage[];
// //             // O(n) local reverse to maintain chronological UI flow without redundant writes
// //             setMessages(fetchedMessages.reverse());
// //         }, (error) => {
// //             console.error("[Chat Pulse Error]:", error);
// //         });

// //         return () => unsubscribe();
// //     }, [firestore, tripId, isOpen]);

// //     // [PROTOCOL 16]: Memoized Dispatcher
// //     const sendMessage = useCallback(async (text: string, senderName: string = 'مسافر', role: 'carrier' | 'traveler' | 'agent' = 'traveler', customSenderId?: string) => {
// //         if (!firestore || !text.trim() || !tripId) return;

// //         setIsSending(true);
// //         try {
// //             const messagesRef = collection(firestore, 'trips', tripId, 'messages');
// //             await addDoc(messagesRef, {
// //                 text: text.trim(),
// //                 senderId: customSenderId || guestId,
// //                 senderName,
// //                 senderRole: role,
// //                 createdAt: serverTimestamp()
// //             });
// //         } catch (error: any) {
// //             toast({
// //                 variant: 'destructive',
// //                 title: 'فشل الإرسال',
// //                 description: getErrorMessage(error.code || 'unknown-error', 'حدث خطأ أثناء إرسال الرسالة.')
// //             });
// //         } finally {
// //             setIsSending(false);
// //         }
// //     }, [firestore, tripId, guestId, toast]);

// //     return {
// //         messages,
// //         sendMessage,
// //         isSending,
// //         currentGuestId: guestId
// //     };
// // }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useFirestore } from "@/firebase";
// import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
// import { getErrorMessage } from "@/lib/error-dictionary";
// import { useToast } from "@/hooks/use-toast";

// /**
//  * @hook useChatPulse
//  * @description THE STERILIZED CHAT REACTOR (V3.0 - SCR-917-PHONE-VERIFIED)
//  * [V3.0]: Replaced random guestId with verifiedPhone as stable identity anchor.
//  * Phone is verified against passengersDetails in the ticket page before this hook is used.
//  * Protocol 16: Logic-only responsibility. Protocol 88: Lazy-loading listener.
//  */

// export interface ChatMessage {
//   id: string;
//   text: string;
//   senderId: string;
//   senderName: string;
//   senderRole: "carrier" | "traveler" | "agent" | "system";
//   createdAt: any;
// }

// export function useChatPulse(tripId: string, isOpen: boolean, verifiedPhone?: string) {
//   const firestore = useFirestore();
//   const { toast } = useToast();
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [isSending, setIsSending] = useState(false);

//   // [V3.0 SSOT]: Identity is the verified phone — stable across devices & sessions.
//   // Falls back to sessionStorage guest id only if phone not yet verified.
//   const [stableId, setStableId] = useState<string>("");

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (verifiedPhone) {
//       const id = `phone_${verifiedPhone}`;
//       setStableId(id);
//       sessionStorage.setItem(`safar_verified_id_${tripId}`, id);
//     } else {
//       const sessionId = sessionStorage.getItem(`safar_verified_id_${tripId}`);
//       if (sessionId) {
//         setStableId(sessionId);
//       } else {
//         let id = sessionStorage.getItem("safar_guest_id_session");
//         if (!id) {
//           id = `guest_${Math.random().toString(36).substring(2, 11)}`;
//           sessionStorage.setItem("safar_guest_id_session", id);
//         }
//         setStableId(id);
//       }
//     }
//   }, [verifiedPhone, tripId]);

//   // [PROTOCOL 88]: Conditional Artery Pulse (Lazy Fetching)
//   useEffect(() => {
//     if (!firestore || !tripId || !isOpen) {
//       setMessages([]);
//       return;
//     }

//     const messagesRef = collection(firestore, "trips", tripId, "messages");
//     const q = query(messagesRef, orderBy("createdAt", "desc"), limit(50));

//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const fetchedMessages = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as ChatMessage[];
//         setMessages(fetchedMessages.reverse());
//       },
//       (error) => {
//         console.error("[Chat Pulse Error]:", error);
//       },
//     );

//     return () => unsubscribe();
//   }, [firestore, tripId, isOpen]);

//   // [PROTOCOL 16]: Memoized Dispatcher
//   const sendMessage = useCallback(
//     async (text: string, senderName: string = "مسافر", role: "carrier" | "traveler" | "agent" = "traveler", customSenderId?: string) => {
//       if (!firestore || !text.trim() || !tripId) return;

//       setIsSending(true);
//       try {
//         const messagesRef = collection(firestore, "trips", tripId, "messages");
//         await addDoc(messagesRef, {
//           text: text.trim(),
//           senderId: customSenderId || stableId,
//           senderName,
//           senderRole: role,
//           createdAt: serverTimestamp(),
//         });
//       } catch (error: any) {
//         toast({
//           variant: "destructive",
//           title: "فشل الإرسال",
//           description: getErrorMessage(error.code || "unknown-error", "حدث خطأ أثناء إرسال الرسالة."),
//         });
//       } finally {
//         setIsSending(false);
//       }
//     },
//     [firestore, tripId, stableId, toast],
//   );

//   return {
//     messages,
//     sendMessage,
//     isSending,
//     currentGuestId: stableId,
//   };
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { useFirestore } from "@/firebase";
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { sendPush } from "@/lib/send-push";
import { getErrorMessage } from "@/lib/error-dictionary";
import { useToast } from "@/hooks/use-toast";

/**
 * @hook useChatPulse
 * @description THE STERILIZED CHAT REACTOR (V3.0 - SCR-917-PHONE-VERIFIED)
 * [V3.0]: Replaced random guestId with verifiedPhone as stable identity anchor.
 * Phone is verified against passengersDetails in the ticket page before this hook is used.
 * Protocol 16: Logic-only responsibility. Protocol 88: Lazy-loading listener.
 */

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderRole: "carrier" | "traveler" | "agent" | "system";
  createdAt: any;
}

export function useChatPulse(tripId: string, isOpen: boolean, verifiedPhone?: string) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  // [V3.0 SSOT]: Identity is the verified phone — stable across devices & sessions.
  // Falls back to sessionStorage guest id only if phone not yet verified.
  const [stableId, setStableId] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (verifiedPhone) {
      const id = `phone_${verifiedPhone}`;
      setStableId(id);
      sessionStorage.setItem(`safar_verified_id_${tripId}`, id);
    } else {
      const sessionId = sessionStorage.getItem(`safar_verified_id_${tripId}`);
      if (sessionId) {
        setStableId(sessionId);
      } else {
        let id = sessionStorage.getItem("safar_guest_id_session");
        if (!id) {
          id = `guest_${Math.random().toString(36).substring(2, 11)}`;
          sessionStorage.setItem("safar_guest_id_session", id);
        }
        setStableId(id);
      }
    }
  }, [verifiedPhone, tripId]);

  // [PROTOCOL 88]: Conditional Artery Pulse (Lazy Fetching)
  useEffect(() => {
    if (!firestore || !tripId || !isOpen) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(firestore, "trips", tripId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"), limit(50));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ChatMessage[];
        setMessages(fetchedMessages.reverse());
      },
      (error) => {
        console.error("[Chat Pulse Error]:", error);
      },
    );

    return () => unsubscribe();
  }, [firestore, tripId, isOpen]);

  // [PROTOCOL 16]: Memoized Dispatcher
  const sendMessage = useCallback(
    async (text: string, senderName: string = "مسافر", role: "carrier" | "traveler" | "agent" = "traveler", customSenderId?: string) => {
      if (!firestore || !text.trim() || !tripId) return;

      setIsSending(true);
      try {
        const messagesRef = collection(firestore, "trips", tripId, "messages");
        await addDoc(messagesRef, {
          text: text.trim(),
          senderId: customSenderId || stableId,
          senderName,
          senderRole: role,
          createdAt: serverTimestamp(),
        });

        // [PUSH]: إشعار لباقي المشاركين في الشات
        if (firestore && tripId) {
          const chatRef = doc(firestore, "chats", tripId);
          const chatSnap = await getDoc(chatRef);
          if (chatSnap.exists()) {
            const participants: string[] = chatSnap.data()?.participants || [];
            const senderId = customSenderId || stableId;
            const others = participants.filter((p: string) => p !== senderId);
            await Promise.allSettled(
              others.map((userId: string) =>
                sendPush({
                  userId,
                  title: `رسالة جديدة من ${senderName} 💬`,
                  body: text.trim().slice(0, 80),
                  data: { type: "new_chat_message", tripId },
                }),
              ),
            );
          }
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "فشل الإرسال",
          description: getErrorMessage(error.code || "unknown-error", "حدث خطأ أثناء إرسال الرسالة."),
        });
      } finally {
        setIsSending(false);
      }
    },
    [firestore, tripId, stableId, toast],
  );

  return {
    messages,
    sendMessage,
    isSending,
    currentGuestId: stableId,
  };
}
