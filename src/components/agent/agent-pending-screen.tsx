// // 'use client';

// // import { useState, useEffect, useRef } from 'react';
// // import { useFirestore, useUser } from '@/firebase';
// // import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from 'firebase/firestore';
// // import { Clock, Send, Loader2, ShieldCheck, MessageCircle } from 'lucide-react';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import type { UserProfile } from '@/lib/data';

// // interface Message {
// //   id: string;
// //   text: string;
// //   senderId: string;
// //   senderName: string;
// //   createdAt: any;
// //   isAdmin: boolean;
// // }

// // export function AgentPendingScreen({ profile }: { profile: Partial<UserProfile> }) {
// //   const firestore = useFirestore();
// //   const { user } = useUser();
// //   const [messages, setMessages] = useState<Message[]>([]);
// //   const [text, setText] = useState('');
// //   const [sending, setSending] = useState(false);
// //   const [chatId, setChatId] = useState<string | null>(null);
// //   const bottomRef = useRef<HTMLDivElement>(null);

// //   // جيب أو أنشئ الـ chat
// //   useEffect(() => {
// //     if (!firestore || !user) return;

// //     const initChat = async () => {
// //       // شوف لو فيه chat موجود للوكيل ده
// //       const chatRef = doc(firestore, 'agent_approval_chats', user.uid);
// //       const chatSnap = await getDoc(chatRef);

// //       if (!chatSnap.exists()) {
// //         // أنشئ chat جديد
// //         const { setDoc } = await import('firebase/firestore');
// //         await setDoc(chatRef, {
// //           agentUid: user.uid,
// //           agentName: profile.firstName || 'وكيل جديد',
// //           agentEmail: profile.email || '',
// //           status: 'pending',
// //           createdAt: serverTimestamp(),
// //           updatedAt: serverTimestamp(),
// //         });
// //       }
// //       setChatId(user.uid);
// //     };

// //     initChat();
// //   }, [firestore, user, profile]);

// //   // اسمع على الرسائل
// //   useEffect(() => {
// //     if (!firestore || !chatId) return;

// //     const q = query(
// //       collection(firestore, 'agent_approval_chats', chatId, 'messages'),
// //       orderBy('createdAt', 'asc')
// //     );

// //     const unsub = onSnapshot(q, (snap) => {
// //       setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
// //       setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
// //     });

// //     return () => unsub();
// //   }, [firestore, chatId]);

// //   const sendMessage = async () => {
// //     if (!text.trim() || !firestore || !chatId || !user) return;
// //     setSending(true);
// //     try {
// //       await addDoc(
// //         collection(firestore, 'agent_approval_chats', chatId, 'messages'),
// //         {
// //           text: text.trim(),
// //           senderId: user.uid,
// //           senderName: profile.firstName || 'وكيل',
// //           isAdmin: false,
// //           createdAt: serverTimestamp(),
// //         }
// //       );
// //       setText('');
// //     } finally {
// //       setSending(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" dir="rtl">
// //       <div className="w-full max-w-md space-y-6">

// //         {/* Header */}
// //         <div className="text-center space-y-3">
// //           <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto">
// //             <Clock className="h-10 w-10 text-amber-500 animate-pulse" />
// //           </div>
// //           <h1 className="text-2xl font-black text-foreground">بانتظار الموافقة</h1>
// //           <p className="text-muted-foreground text-sm leading-relaxed">
// //             تم إنشاء حسابك بنجاح كوكيل. يراجع فريقنا طلبك حالياً.
// //             يمكنك التواصل معنا مباشرة من هنا.
// //           </p>
// //           <div className="flex items-center justify-center gap-2 text-xs text-amber-500 font-bold">
// //             <ShieldCheck className="h-4 w-4" />
// //             <span>حسابك آمن وسيتم تفعيله قريباً</span>
// //           </div>
// //         </div>

// //         {/* Chat Box */}
// //         <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
// //           <div className="bg-primary/10 border-b px-4 py-3 flex items-center gap-2">
// //             <MessageCircle className="h-4 w-4 text-primary" />
// //             <span className="font-bold text-sm">تواصل مع فريق سفريات</span>
// //           </div>

// //           {/* Messages */}
// //           <div className="h-72 overflow-y-auto p-4 space-y-3">
// //             {messages.length === 0 && (
// //               <div className="text-center text-muted-foreground text-xs py-8">
// //                 ابدأ المحادثة — فريقنا سيرد عليك قريباً
// //               </div>
// //             )}
// //             {messages.map((msg) => (
// //               <div
// //                 key={msg.id}
// //                 className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
// //               >
// //                 <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.isAdmin
// //                     ? 'bg-muted text-foreground rounded-tr-sm'
// //                     : 'bg-primary text-primary-foreground rounded-tl-sm'
// //                   }`}>
// //                   {msg.isAdmin && (
// //                     <p className="text-[10px] font-bold text-primary mb-1">فريق سفريات</p>
// //                   )}
// //                   <p>{msg.text}</p>
// //                 </div>
// //               </div>
// //             ))}
// //             <div ref={bottomRef} />
// //           </div>

// //           {/* Input */}
// //           <div className="border-t p-3 flex gap-2">
// //             <Input
// //               value={text}
// //               onChange={e => setText(e.target.value)}
// //               placeholder="اكتب رسالتك..."
// //               className="flex-1 rounded-xl"
// //               onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
// //               disabled={sending || !chatId}
// //             />
// //             <Button
// //               size="icon"
// //               onClick={sendMessage}
// //               disabled={sending || !text.trim() || !chatId}
// //               className="rounded-xl"
// //             >
// //               {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
// //             </Button>
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }

// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useFirestore, useUser } from '@/firebase';
// import {
//   collection,
//   addDoc,
//   query,
//   orderBy,
//   onSnapshot,
//   serverTimestamp,
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
// } from 'firebase/firestore';
// import { Clock, Send, Loader2, ShieldCheck, MessageCircle, CheckCircle2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import type { UserProfile } from '@/lib/data';

// interface Message {
//   id: string;
//   content: string;   // ← unified field name مع admin page
//   senderId: string;
//   senderName: string;
//   timestamp: any;    // ← unified field name مع admin page
//   type?: 'text' | 'system';
// }

// export function AgentPendingScreen({ profile }: { profile: Partial<UserProfile> }) {
//   const firestore = useFirestore();
//   const { user } = useUser();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [text, setText] = useState('');
//   const [sending, setSending] = useState(false);
//   const [chatReady, setChatReady] = useState(false);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   const chatId = user?.uid ?? null;

//   // أنشئ أو تحقق من الـ chat doc
//   useEffect(() => {
//     if (!firestore || !user || !chatId) return;

//     const initChat = async () => {
//       const chatRef = doc(firestore, 'agent_approval_chats', chatId);
//       const chatSnap = await getDoc(chatRef);

//       if (!chatSnap.exists()) {
//         // إنشاء الشات لأول مرة
//         await setDoc(chatRef, {
//           agentUid: user.uid,
//           agentName: profile.firstName || 'وكيل جديد',
//           agentEmail: profile.email || '',
//           agentPhone: profile.phoneNumber || '',
//           status: 'pending',
//           createdAt: serverTimestamp(),
//           lastMessage: 'طلب انضمام جديد',
//           lastMessageTimestamp: serverTimestamp(),
//         });

//         // رسالة ترحيب تلقائية
//         await addDoc(
//           collection(firestore, 'agent_approval_chats', chatId, 'messages'),
//           {
//             content: `مرحباً ${profile.firstName || ''}! 👋\n\nتم استلام طلب انضمامك كوكيل. سيتواصل معك الفريق قريباً.\nيمكنك إرسال أي سؤال هنا.`,
//             senderId: 'system',
//             senderName: 'النظام',
//             timestamp: serverTimestamp(),
//             type: 'system',
//           }
//         );
//       }

//       setChatReady(true);
//     };

//     initChat();
//   }, [firestore, user, chatId, profile]);

//   // اسمع على الرسائل
//   useEffect(() => {
//     if (!firestore || !chatId || !chatReady) return;

//     const q = query(
//       collection(firestore, 'agent_approval_chats', chatId, 'messages'),
//       orderBy('timestamp', 'asc')
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
//       setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
//     });

//     return () => unsub();
//   }, [firestore, chatId, chatReady]);

//   const sendMessage = async () => {
//     if (!text.trim() || !firestore || !chatId || !user) return;
//     setSending(true);
//     const content = text.trim();
//     setText('');
//     try {
//       // أضف الرسالة
//       await addDoc(
//         collection(firestore, 'agent_approval_chats', chatId, 'messages'),
//         {
//           content,                          // ← content مش text
//           senderId: user.uid,
//           senderName: profile.firstName || 'وكيل',
//           timestamp: serverTimestamp(),     // ← timestamp مش createdAt
//           type: 'text',
//         }
//       );

//       // حدّث الـ chat doc عشان يظهر في قائمة الأدمن
//       await updateDoc(doc(firestore, 'agent_approval_chats', chatId), {
//         lastMessage: content,
//         lastMessageTimestamp: serverTimestamp(),
//         lastSenderId: user.uid,
//       });
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" dir="rtl">
//       <div className="w-full max-w-md space-y-6">

//         {/* Header */}
//         <div className="text-center space-y-3">
//           <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto">
//             <Clock className="h-10 w-10 text-amber-500 animate-pulse" />
//           </div>
//           <h1 className="text-2xl font-black text-foreground">بانتظار الموافقة</h1>
//           <p className="text-muted-foreground text-sm leading-relaxed">
//             تم إنشاء حسابك بنجاح كوكيل. يراجع فريقنا طلبك حالياً.
//             يمكنك التواصل معنا مباشرة من هنا.
//           </p>

//           {/* Steps */}
//           <div className="flex items-center justify-center gap-3 pt-1">
//             <div className="flex items-center gap-1.5 text-xs text-green-500 font-bold">
//               <CheckCircle2 className="h-3.5 w-3.5" />
//               <span>تم التسجيل</span>
//             </div>
//             <div className="h-px w-6 bg-border" />
//             <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
//               <Clock className="h-3.5 w-3.5 animate-pulse" />
//               <span>انتظار الموافقة</span>
//             </div>
//             <div className="h-px w-6 bg-border" />
//             <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
//               <div className="h-3.5 w-3.5 rounded-full border-2 border-muted" />
//               <span>التفعيل</span>
//             </div>
//           </div>
//         </div>

//         {/* Chat Box */}
//         <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
//           <div className="bg-primary/10 border-b px-4 py-3 flex items-center gap-2">
//             <MessageCircle className="h-4 w-4 text-primary" />
//             <span className="font-bold text-sm">تواصل مع فريق سفريات</span>
//             {!chatReady && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground mr-auto" />}
//           </div>

//           {/* Messages */}
//           <div className="h-72 overflow-y-auto p-4 space-y-3">
//             {messages.length === 0 && chatReady && (
//               <div className="text-center text-muted-foreground text-xs py-8">
//                 ابدأ المحادثة — فريقنا سيرد عليك قريباً
//               </div>
//             )}
//             {messages.map((msg) => {
//               if (msg.type === 'system') {
//                 return (
//                   <div key={msg.id} className="flex justify-center">
//                     <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2.5 max-w-[85%] text-center">
//                       <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{msg.content}</p>
//                     </div>
//                   </div>
//                 );
//               }
//               const isMe = msg.senderId === user?.uid;
//               return (
//                 <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
//                   <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
//                       ? 'bg-primary text-primary-foreground'
//                       : 'bg-muted text-foreground border'
//                     }`}>
//                     {!isMe && (
//                       <p className="text-[10px] font-bold text-primary mb-1">{msg.senderName}</p>
//                     )}
//                     <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={bottomRef} />
//           </div>

//           {/* Input */}
//           <div className="border-t p-3 flex gap-2">
//             <Input
//               value={text}
//               onChange={e => setText(e.target.value)}
//               placeholder="اكتب رسالتك..."
//               className="flex-1 rounded-xl"
//               onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
//               disabled={sending || !chatReady}
//             />
//             <Button
//               size="icon"
//               onClick={sendMessage}
//               disabled={sending || !text.trim() || !chatReady}
//               className="rounded-xl"
//             >
//               {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//             </Button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect, useRef } from 'react';
import { useFirestore, useUser } from '@/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  LogOut,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserProfile } from '@/lib/data';

// ─── استبدل ده بـ signOut المناسب لمشروعك ───────────────────────
// next-auth  → import { signOut } from 'next-auth/react'
// supabase   → supabase.auth.signOut()
// firebase   → import { getAuth, signOut } from 'firebase/auth'
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';
// ─────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: any;
  type?: 'text' | 'system';
}

export function AgentPendingScreen({ profile }: { profile: Partial<UserProfile> }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatId = user?.uid ?? null;

  // ── تسجيل الخروج ──────────────────────────────────────────────
  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error('Sign out error:', err);
      setSigningOut(false);
    }
  };

  // ── إنشاء / التحقق من الـ chat ────────────────────────────────
  useEffect(() => {
    if (!firestore || !user || !chatId) return;

    const initChat = async () => {
      const chatRef = doc(firestore, 'agent_approval_chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          agentUid: user.uid,
          agentName: profile.firstName || 'وكيل جديد',
          agentEmail: profile.email || '',
          agentPhone: profile.phoneNumber || '',
          status: 'pending',
          createdAt: serverTimestamp(),
          lastMessage: 'طلب انضمام جديد',
          lastMessageTimestamp: serverTimestamp(),
        });

        await addDoc(
          collection(firestore, 'agent_approval_chats', chatId, 'messages'),
          {
            content: `مرحباً ${profile.firstName || ''}! 👋\n\nتم استلام طلب انضمامك كوكيل. سيتواصل معك الفريق قريباً.\nيمكنك إرسال أي سؤال هنا.`,
            senderId: 'system',
            senderName: 'النظام',
            timestamp: serverTimestamp(),
            type: 'system',
          }
        );
      }

      setChatReady(true);
    };

    initChat();
  }, [firestore, user, chatId, profile]);

  // ── الاستماع للرسائل ──────────────────────────────────────────
  useEffect(() => {
    if (!firestore || !chatId || !chatReady) return;

    const q = query(
      collection(firestore, 'agent_approval_chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsub();
  }, [firestore, chatId, chatReady]);

  // ── إرسال رسالة ───────────────────────────────────────────────
  const sendMessage = async () => {
    if (!text.trim() || !firestore || !chatId || !user) return;
    setSending(true);
    const content = text.trim();
    setText('');
    try {
      await addDoc(
        collection(firestore, 'agent_approval_chats', chatId, 'messages'),
        {
          content,
          senderId: user.uid,
          senderName: profile.firstName || 'وكيل',
          timestamp: serverTimestamp(),
          type: 'text',
        }
      );

      await updateDoc(doc(firestore, 'agent_approval_chats', chatId), {
        lastMessage: content,
        lastMessageTimestamp: serverTimestamp(),
        lastSenderId: user.uid,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md space-y-6">

        {/* ── الهيدر ── */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto">
            <Clock className="h-10 w-10 text-amber-500 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-foreground">بانتظار الموافقة</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            تم إنشاء حسابك بنجاح كوكيل. يراجع فريقنا طلبك حالياً.
            يمكنك التواصل معنا مباشرة من هنا.
          </p>

          {/* شريط الخطوات */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-green-500 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>تم التسجيل</span>
            </div>
            <div className="h-px w-6 bg-border" />
            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
              <Clock className="h-3.5 w-3.5 animate-pulse" />
              <span>انتظار الموافقة</span>
            </div>
            <div className="h-px w-6 bg-border" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="h-3.5 w-3.5 rounded-full border-2 border-muted" />
              <span>التفعيل</span>
            </div>
          </div>
        </div>

        {/* ── صندوق المحادثة ── */}
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
          {/* رأس الشات */}
          <div className="bg-primary/10 border-b px-4 py-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="font-bold text-sm">تواصل مع فريق سفريات</span>
            {!chatReady && (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground mr-auto" />
            )}
          </div>

          {/* الرسائل */}
          <div className="h-72 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && chatReady && (
              <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
                <Sparkles className="h-5 w-5 text-primary opacity-40" />
                <p className="text-center text-muted-foreground text-xs">
                  ابدأ المحادثة — فريقنا سيرد عليك قريباً
                </p>
              </div>
            )}

            {messages.map((msg) => {
              if (msg.type === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2.5 max-w-[85%] text-center">
                      <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                );
              }

              const isMe = msg.senderId === user?.uid;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground border'
                      }`}
                  >
                    {!isMe && (
                      <p className="text-[10px] font-bold text-primary mb-1">{msg.senderName}</p>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* حقل الإدخال */}
          <div className="border-t p-3 flex gap-2">
            <Input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="اكتب رسالتك..."
              className="flex-1 rounded-xl"
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={sending || !chatReady}
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={sending || !text.trim() || !chatReady}
              className="rounded-xl"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* ── زرار تسجيل الخروج ── */}
        <Button
          variant="outline"
          className="w-full gap-2 rounded-2xl h-12 font-black text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 transition-all"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          {signingOut ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
        </Button>

      </div>
    </div>
  );
}