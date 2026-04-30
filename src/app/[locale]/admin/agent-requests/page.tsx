// // 'use client';

// // /**
// //  * @page AdminAgentRequestsPage
// //  * @description صفحة إدارة طلبات الوكلاء في لوحة الأدمن
// //  * [SCR-1001]: عرض طلبات الوكلاء الجدد + شات مباشر + منح/رفض التصريح
// //  */

// // import { useState, useEffect, useRef, useCallback } from 'react';
// // import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// // import {
// //   collection,
// //   query,
// //   orderBy,
// //   serverTimestamp,
// //   doc,
// //   addDoc,
// //   updateDoc,
// //   onSnapshot,
// //   limit,
// // } from 'firebase/firestore';
// // import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// // import { Button } from '@/components/ui/button';
// // import { Textarea } from '@/components/ui/textarea';
// // import { Badge } from '@/components/ui/badge';
// // import { Separator } from '@/components/ui/separator';
// // import {
// //   CheckCircle2,
// //   XCircle,
// //   MessageSquare,
// //   Loader2,
// //   Send,
// //   Clock,
// //   Users,
// //   ShieldCheck,
// //   Phone,
// //   Mail,
// //   User,
// //   RefreshCw,
// // } from 'lucide-react';
// // import { useToast } from '@/hooks/use-toast';
// // import { formatDate } from '@/lib/formatters';
// // import { useLocale } from 'next-intl';

// // // ───────────────────────────────────────────────
// // // Types
// // // ───────────────────────────────────────────────
// // interface AgentChat {
// //   id: string;
// //   agentUid: string;
// //   agentName: string;
// //   agentEmail: string;
// //   agentPhone: string;
// //   status: 'pending' | 'approved' | 'rejected';
// //   createdAt: any;
// //   lastMessage: string;
// //   lastMessageTimestamp: any;
// //   lastSenderId?: string;
// // }

// // interface Message {
// //   id: string;
// //   content: string;
// //   senderId: string;
// //   senderName: string;
// //   timestamp: any;
// //   type?: 'text' | 'system';
// // }

// // // ───────────────────────────────────────────────
// // // Sub-component: Chat Panel
// // // ───────────────────────────────────────────────
// // function ChatPanel({
// //   chat,
// //   onApprove,
// //   onReject,
// //   isActioning,
// // }: {
// //   chat: AgentChat;
// //   onApprove: () => void;
// //   onReject: () => void;
// //   isActioning: boolean;
// // }) {
// //   const firestore = useFirestore();
// //   const { user } = useUser();
// //   const { toast } = useToast();
// //   const locale = useLocale();
// //   const [messages, setMessages] = useState<Message[]>([]);
// //   const [isLoadingMsgs, setIsLoadingMsgs] = useState(true);
// //   const [newMessage, setNewMessage] = useState('');
// //   const [isSending, setIsSending] = useState(false);
// //   const messagesEndRef = useRef<HTMLDivElement>(null);

// //   // Real-time messages listener
// //   useEffect(() => {
// //     if (!firestore || !chat.id) return;
// //     setIsLoadingMsgs(true);

// //     const q = query(
// //       collection(firestore, 'agent_approval_chats', chat.id, 'messages'),
// //       orderBy('timestamp', 'asc')
// //     );

// //     const unsub = onSnapshot(q, (snap) => {
// //       setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message)));
// //       setIsLoadingMsgs(false);
// //     });

// //     return () => unsub();
// //   }, [firestore, chat.id]);

// //   // Auto scroll to bottom
// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   }, [messages]);

// //   const handleSend = async () => {
// //     if (!newMessage.trim() || !firestore || !user || !chat.id) return;
// //     setIsSending(true);
// //     try {
// //       const content = newMessage.trim();
// //       setNewMessage('');

// //       await addDoc(
// //         collection(firestore, 'agent_approval_chats', chat.id, 'messages'),
// //         {
// //           content,
// //           senderId: user.uid,
// //           senderName: 'الأدمن',
// //           timestamp: serverTimestamp(),
// //           type: 'text',
// //         }
// //       );

// //       await updateDoc(doc(firestore, 'agent_approval_chats', chat.id), {
// //         lastMessage: content,
// //         lastMessageTimestamp: serverTimestamp(),
// //         lastSenderId: user.uid,
// //       });
// //     } catch {
// //       toast({ variant: 'destructive', title: 'فشل الإرسال' });
// //     } finally {
// //       setIsSending(false);
// //     }
// //   };

// //   const handleKeyDown = (e: React.KeyboardEvent) => {
// //     if (e.key === 'Enter' && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSend();
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col h-full">
// //       {/* Agent Info */}
// //       <div className="p-4 bg-muted/30 border-b space-y-2">
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-2">
// //             <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
// //               <User className="h-5 w-5 text-primary" />
// //             </div>
// //             <div>
// //               <p className="font-black text-sm">{chat.agentName}</p>
// //               <p className="text-xs text-muted-foreground">
// //                 {chat.createdAt?.toDate ?
// //                   // formatDate(chat.createdAt.toDate()) : 'حديث'
// //                   formatDate(chat.createdAt.toDate(), 'd MMMM yyyy', locale) : 'حديث'
// //                 }
// //               </p>
// //             </div>
// //           </div>
// //           <StatusBadge status={chat.status} />
// //         </div>
// //         <div className="flex gap-4 text-xs text-muted-foreground">
// //           {chat.agentEmail && (
// //             <span className="flex items-center gap-1">
// //               <Mail className="h-3 w-3" /> {chat.agentEmail}
// //             </span>
// //           )}
// //           {chat.agentPhone && (
// //             <span className="flex items-center gap-1">
// //               <Phone className="h-3 w-3" /> {chat.agentPhone}
// //             </span>
// //           )}
// //         </div>

// //         {/* Action Buttons */}
// //         {chat.status === 'pending' && (
// //           <div className="flex gap-2 pt-1">
// //             <Button
// //               size="sm"
// //               className="flex-1 h-9 font-black gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl"
// //               onClick={onApprove}
// //               disabled={isActioning}
// //             >
// //               {isActioning ? (
// //                 <Loader2 className="h-3.5 w-3.5 animate-spin" />
// //               ) : (
// //                 <CheckCircle2 className="h-3.5 w-3.5" />
// //               )}
// //               منح التصريح
// //             </Button>
// //             <Button
// //               size="sm"
// //               variant="outline"
// //               className="flex-1 h-9 font-black gap-1.5 border-red-500/30 text-red-600 hover:bg-red-50 rounded-xl"
// //               onClick={onReject}
// //               disabled={isActioning}
// //             >
// //               {isActioning ? (
// //                 <Loader2 className="h-3.5 w-3.5 animate-spin" />
// //               ) : (
// //                 <XCircle className="h-3.5 w-3.5" />
// //               )}
// //               رفض الطلب
// //             </Button>
// //           </div>
// //         )}
// //       </div>

// //       {/* Messages */}
// //       <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
// //         {isLoadingMsgs ? (
// //           <div className="flex justify-center py-8">
// //             <Loader2 className="h-6 w-6 animate-spin text-primary" />
// //           </div>
// //         ) : messages.length === 0 ? (
// //           <div className="text-center text-sm text-muted-foreground py-8">
// //             لا توجد رسائل
// //           </div>
// //         ) : (
// //           messages.map((msg) => {
// //             const isSystem = msg.senderId === 'system';
// //             const isAdmin = msg.senderId === 'admin' || (msg.senderName === 'الأدمن' && msg.senderId !== chat.agentUid);
// //             const isMe = isAdmin; // from admin's perspective

// //             if (isSystem) {
// //               return (
// //                 <div key={msg.id} className="flex justify-center">
// //                   <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2.5 max-w-sm text-center">
// //                     <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
// //                       {msg.content}
// //                     </p>
// //                   </div>
// //                 </div>
// //               );
// //             }

// //             return (
// //               <div
// //                 key={msg.id}
// //                 className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}
// //               >
// //                 <div
// //                   className={`rounded-2xl px-4 py-2.5 max-w-[75%] shadow-sm ${isMe
// //                     ? 'bg-primary text-primary-foreground'
// //                     : 'bg-muted text-foreground border'
// //                     }`}
// //                 >
// //                   <p className="text-[10px] font-black mb-1 opacity-70">{msg.senderName}</p>
// //                   <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
// //                 </div>
// //               </div>
// //             );
// //           })
// //         )}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Input */}
// //       <div className="border-t p-3 flex gap-2 items-end bg-background">
// //         <Textarea
// //           placeholder="اكتب رسالة للوكيل..."
// //           value={newMessage}
// //           onChange={(e) => setNewMessage(e.target.value)}
// //           onKeyDown={handleKeyDown}
// //           rows={2}
// //           className="resize-none rounded-xl text-sm flex-1"
// //           disabled={isSending}
// //         />
// //         <Button
// //           size="icon"
// //           className="h-10 w-10 rounded-xl shrink-0"
// //           onClick={handleSend}
// //           disabled={isSending || !newMessage.trim()}
// //         >
// //           {isSending ? (
// //             <Loader2 className="h-4 w-4 animate-spin" />
// //           ) : (
// //             <Send className="h-4 w-4" />
// //           )}
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }

// // // ───────────────────────────────────────────────
// // // Sub-component: Status Badge
// // // ───────────────────────────────────────────────
// // function StatusBadge({ status }: { status: AgentChat['status'] }) {
// //   if (status === 'approved') {
// //     return (
// //       <Badge className="bg-green-500/10 text-green-600 border-green-500/30 font-black text-[10px] gap-1">
// //         <CheckCircle2 className="h-3 w-3" /> معتمد
// //       </Badge>
// //     );
// //   }
// //   if (status === 'rejected') {
// //     return (
// //       <Badge className="bg-red-500/10 text-red-600 border-red-500/30 font-black text-[10px] gap-1">
// //         <XCircle className="h-3 w-3" /> مرفوض
// //       </Badge>
// //     );
// //   }
// //   return (
// //     <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 font-black text-[10px] gap-1">
// //       <Clock className="h-3 w-3 animate-pulse" /> بانتظار التصريح
// //     </Badge>
// //   );
// // }

// // // ───────────────────────────────────────────────
// // // Main Page
// // // ───────────────────────────────────────────────
// // export default function AdminAgentRequestsPage() {
// //   const firestore = useFirestore();
// //   const { toast } = useToast();
// //   const locale = useLocale();

// //   const [selectedChat, setSelectedChat] = useState<AgentChat | null>(null);
// //   const [isActioning, setIsActioning] = useState(false);
// //   const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

// //   // Load agent chats
// //   const chatsQuery = useMemoFirebase(() => {
// //     if (!firestore) return null;
// //     return query(
// //       collection(firestore, 'agent_approval_chats'),
// //       orderBy('lastMessageTimestamp', 'desc'),
// //       limit(50)
// //     );
// //   }, [firestore]);

// //   const { data: allChats, isLoading } = useCollection<AgentChat>(chatsQuery);

// //   const chats = (allChats || []).filter((c) =>
// //     filter === 'all' ? true : c.status === filter
// //   );

// //   const counts = {
// //     pending: (allChats || []).filter((c) => c.status === 'pending').length,
// //     approved: (allChats || []).filter((c) => c.status === 'approved').length,
// //     rejected: (allChats || []).filter((c) => c.status === 'rejected').length,
// //   };

// //   // Select first chat by default
// //   useEffect(() => {
// //     if (!selectedChat && chats.length > 0) {
// //       setSelectedChat(chats[0]);
// //     }
// //   }, [chats, selectedChat]);

// //   // Update selectedChat when data refreshes
// //   useEffect(() => {
// //     if (selectedChat && allChats) {
// //       const updated = allChats.find((c) => c.id === selectedChat.id);
// //       if (updated) setSelectedChat(updated);
// //     }
// //   }, [allChats]);

// //   const handleApprove = useCallback(async () => {
// //     if (!selectedChat || !firestore) return;
// //     setIsActioning(true);
// //     try {
// //       // 1. Update approval chat status
// //       await updateDoc(doc(firestore, 'agent_approval_chats', selectedChat.id), {
// //         status: 'approved',
// //       });

// //       // 2. Update user profile in Firestore
// //       await updateDoc(doc(firestore, 'users', selectedChat.agentUid), {
// //         agentApprovalStatus: 'approved',
// //         approvedAt: serverTimestamp(),
// //       });

// //       // 3. Send approval message in chat
// //       await addDoc(
// //         collection(firestore, 'agent_approval_chats', selectedChat.id, 'messages'),
// //         {
// //           content:
// //             '🎉 تهانينا! تم اعتماد حسابك كوكيل.\n\nيمكنك الآن الدخول إلى لوحة الوكيل والبدء في العمل.\nمرحباً بك في الفريق!',
// //           senderId: 'system',
// //           senderName: 'النظام',
// //           timestamp: serverTimestamp(),
// //           type: 'system',
// //         }
// //       );

// //       // 4. Update chat last message
// //       await updateDoc(doc(firestore, 'agent_approval_chats', selectedChat.id), {
// //         lastMessage: 'تم اعتماد الحساب ✅',
// //         lastMessageTimestamp: serverTimestamp(),
// //       });

// //       toast({
// //         title: '✅ تم منح التصريح',
// //         description: `تم اعتماد ${selectedChat.agentName} كوكيل بنجاح`,
// //       });
// //     } catch (err) {
// //       toast({ variant: 'destructive', title: 'فشلت العملية', description: 'حاول مرة أخرى' });
// //     } finally {
// //       setIsActioning(false);
// //     }
// //   }, [selectedChat, firestore, toast]);

// //   const handleReject = useCallback(async () => {
// //     if (!selectedChat || !firestore) return;
// //     setIsActioning(true);
// //     try {
// //       await updateDoc(doc(firestore, 'agent_approval_chats', selectedChat.id), {
// //         status: 'rejected',
// //       });

// //       await updateDoc(doc(firestore, 'users', selectedChat.agentUid), {
// //         agentApprovalStatus: 'rejected',
// //         rejectedAt: serverTimestamp(),
// //       });

// //       await addDoc(
// //         collection(firestore, 'agent_approval_chats', selectedChat.id, 'messages'),
// //         {
// //           content:
// //             'نأسف، لم يتم قبول طلب انضمامك في الوقت الحالي.\nيمكنك التواصل مع الأدمن لمعرفة التفاصيل.',
// //           senderId: 'system',
// //           senderName: 'النظام',
// //           timestamp: serverTimestamp(),
// //           type: 'system',
// //         }
// //       );

// //       await updateDoc(doc(firestore, 'agent_approval_chats', selectedChat.id), {
// //         lastMessage: 'تم رفض الطلب',
// //         lastMessageTimestamp: serverTimestamp(),
// //       });

// //       toast({
// //         title: 'تم رفض الطلب',
// //         description: `تم رفض طلب ${selectedChat.agentName}`,
// //       });
// //     } catch {
// //       toast({ variant: 'destructive', title: 'فشلت العملية' });
// //     } finally {
// //       setIsActioning(false);
// //     }
// //   }, [selectedChat, firestore, toast]);

// //   return (
// //     <div className="h-screen flex flex-col" dir="rtl">
// //       {/* Page Header */}
// //       <div className="shrink-0 px-6 py-4 border-b bg-card flex items-center justify-between">
// //         <div className="flex items-center gap-3">
// //           <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
// //             <ShieldCheck className="h-5 w-5 text-primary" />
// //           </div>
// //           <div>
// //             <h1 className="font-black text-lg tracking-tight">طلبات الوكلاء</h1>
// //             <p className="text-xs text-muted-foreground font-mono">
// //               Agent Approval Center
// //             </p>
// //           </div>
// //         </div>
// //         <div className="flex items-center gap-2">
// //           {counts.pending > 0 && (
// //             <Badge className="bg-amber-500 text-white font-black border-0">
// //               {counts.pending} بانتظار التصريح
// //             </Badge>
// //           )}
// //         </div>
// //       </div>

// //       {/* Filter Tabs */}
// //       <div className="shrink-0 px-6 py-2 border-b bg-muted/20 flex items-center gap-2">
// //         {(
// //           [
// //             { key: 'pending', label: 'بانتظار التصريح', count: counts.pending },
// //             { key: 'approved', label: 'معتمدون', count: counts.approved },
// //             { key: 'rejected', label: 'مرفوضون', count: counts.rejected },
// //             { key: 'all', label: 'الكل', count: (allChats || []).length },
// //           ] as const
// //         ).map((tab) => (
// //           <button
// //             key={tab.key}
// //             onClick={() => setFilter(tab.key)}
// //             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${filter === tab.key
// //               ? 'bg-primary text-primary-foreground shadow'
// //               : 'text-muted-foreground hover:text-foreground hover:bg-muted'
// //               }`}
// //           >
// //             {tab.label}
// //             {tab.count > 0 && (
// //               <span
// //                 className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${filter === tab.key ? 'bg-white/20' : 'bg-muted text-foreground'
// //                   }`}
// //               >
// //                 {tab.count}
// //               </span>
// //             )}
// //           </button>
// //         ))}
// //       </div>

// //       {/* Main Content: Split Panel */}
// //       <div className="flex-1 flex min-h-0">
// //         {/* Left: Chat List */}
// //         <div className="w-72 shrink-0 border-l flex flex-col min-h-0 bg-card">
// //           <div className="flex-1 overflow-y-auto">
// //             {isLoading ? (
// //               <div className="flex justify-center py-8">
// //                 <Loader2 className="h-6 w-6 animate-spin text-primary" />
// //               </div>
// //             ) : chats.length === 0 ? (
// //               <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-3">
// //                 <Users className="h-10 w-10 text-muted-foreground/30" />
// //                 <p className="text-sm font-bold text-muted-foreground">
// //                   {filter === 'pending'
// //                     ? 'لا توجد طلبات بانتظار التصريح'
// //                     : 'لا توجد طلبات'}
// //                 </p>
// //               </div>
// //             ) : (
// //               chats.map((chat) => (
// //                 <button
// //                   key={chat.id}
// //                   onClick={() => setSelectedChat(chat)}
// //                   className={`w-full text-right px-4 py-3 border-b transition-all hover:bg-muted/50 ${selectedChat?.id === chat.id ? 'bg-primary/5 border-r-2 border-r-primary' : ''
// //                     }`}
// //                 >
// //                   <div className="flex items-center justify-between mb-1">
// //                     <span className="font-black text-sm truncate">{chat.agentName}</span>
// //                     <StatusBadge status={chat.status} />
// //                   </div>
// //                   <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
// //                   {chat.lastMessageTimestamp?.toDate && (
// //                     <p className="text-[10px] text-muted-foreground/60 mt-1">
// //                       {/* {formatDate(chat.lastMessageTimestamp.toDate())} */}
// //                       {formatDate(chat.lastMessageTimestamp.toDate(), 'd MMM - HH:mm', locale)}
// //                     </p>
// //                   )}
// //                 </button>
// //               ))
// //             )}
// //           </div>
// //         </div>

// //         {/* Right: Chat Panel */}
// //         <div className="flex-1 flex flex-col min-h-0">
// //           {selectedChat ? (
// //             <ChatPanel
// //               key={selectedChat.id}
// //               chat={selectedChat}
// //               onApprove={handleApprove}
// //               onReject={handleReject}
// //               isActioning={isActioning}
// //             />
// //           ) : (
// //             <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
// //               <MessageSquare className="h-16 w-16 opacity-20" />
// //               <p className="font-bold">اختر طلباً من القائمة لعرض التفاصيل</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// 'use client';

// /**
//  * @page AdminAgentRequestsPage
//  * @description صفحة إدارة طلبات الوكلاء في لوحة الأدمن
//  * [SCR-1001]: عرض طلبات الوكلاء الجدد + شات مباشر + منح/رفض التصريح
//  */

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
// import {
//   collection,
//   query,
//   orderBy,
//   serverTimestamp,
//   doc,
//   addDoc,
//   updateDoc,
//   onSnapshot,
//   limit,
// } from 'firebase/firestore';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import {
//   CheckCircle2,
//   XCircle,
//   MessageSquare,
//   Loader2,
//   Send,
//   Clock,
//   Users,
//   ShieldCheck,
//   Phone,
//   Mail,
//   User,
//   RefreshCw,
// } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { formatDate } from '@/lib/formatters';
// import { useLocale } from 'next-intl';

// // ───────────────────────────────────────────────
// // Types
// // ───────────────────────────────────────────────
// interface AgentChat {
//   id: string;
//   agentUid: string;
//   agentName: string;
//   agentEmail: string;
//   agentPhone: string;
//   status: 'pending' | 'approved' | 'rejected';
//   createdAt: any;
//   lastMessage: string;
//   lastMessageTimestamp: any;
//   lastSenderId?: string;
// }

// interface Message {
//   id: string;
//   content: string;
//   senderId: string;
//   senderName: string;
//   timestamp: any;
//   type?: 'text' | 'system';
// }

// // ───────────────────────────────────────────────
// // Sub-component: Chat Panel
// // ───────────────────────────────────────────────
// function ChatPanel({
//   chat,
//   onApprove,
//   onReject,
//   isActioning,
// }: {
//   chat: AgentChat;
//   onApprove: () => void;
//   onReject: () => void;
//   isActioning: boolean;
// }) {
//   const firestore = useFirestore();
//   const { user } = useUser();
//   const { toast } = useToast();
//   const locale = useLocale();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoadingMsgs, setIsLoadingMsgs] = useState(true);
//   const [newMessage, setNewMessage] = useState('');
//   const [isSending, setIsSending] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Real-time messages listener
//   useEffect(() => {
//     if (!firestore || !chat.id) return;
//     setIsLoadingMsgs(true);

//     const q = query(
//       collection(firestore, 'agent_approval_chats', chat.id, 'messages'),
//       orderBy('timestamp', 'asc')
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message)));
//       setIsLoadingMsgs(false);
//     });

//     return () => unsub();
//   }, [firestore, chat.id]);

//   // Auto scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSend = async () => {
//     if (!newMessage.trim() || !firestore || !user || !chat.id) return;
//     setIsSending(true);
//     try {
//       const content = newMessage.trim();
//       setNewMessage('');

//       await addDoc(
//         collection(firestore, 'agent_approval_chats', chat.id, 'messages'),
//         {
//           content,
//           senderId: user.uid,
//           senderName: 'الأدمن',
//           timestamp: serverTimestamp(),
//           type: 'text',
//         }
//       );

//       await updateDoc(doc(firestore, 'agent_approval_chats', chat.id), {
//         lastMessage: content,
//         lastMessageTimestamp: serverTimestamp(),
//         lastSenderId: user.uid,
//       });
//     } catch {
//       toast({ variant: 'destructive', title: 'فشل الإرسال' });
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Agent Info */}
//       <div className="p-4 bg-muted/30 border-b space-y-2">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
//               <User className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <p className="font-black text-sm">{chat.agentName}</p>
//               <p className="text-xs text-muted-foreground">
//                 {chat.createdAt?.toDate ?
//                   // formatDate(chat.createdAt.toDate()) : 'حديث'
//                   formatDate(chat.createdAt.toDate(), 'd MMMM yyyy', locale) : 'حديث'
//                 }
//               </p>
//             </div>
//           </div>
//           <StatusBadge status={chat.status} />
//         </div>
//         <div className="flex gap-4 text-xs text-muted-foreground">
//           {chat.agentEmail && (
//             <span className="flex items-center gap-1">
//               <Mail className="h-3 w-3" /> {chat.agentEmail}
//             </span>
//           )}
//           {chat.agentPhone && (
//             <span className="flex items-center gap-1">
//               <Phone className="h-3 w-3" /> {chat.agentPhone}
//             </span>
//           )}
//         </div>

//         {/* Action Buttons */}
//         {chat.status === 'pending' && (
//           <div className="flex gap-2 pt-1">
//             <Button
//               size="sm"
//               className="flex-1 h-9 font-black gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl"
//               onClick={onApprove}
//               disabled={isActioning}
//             >
//               {isActioning ? (
//                 <Loader2 className="h-3.5 w-3.5 animate-spin" />
//               ) : (
//                 <CheckCircle2 className="h-3.5 w-3.5" />
//               )}
//               منح التصريح
//             </Button>
//             <Button
//               size="sm"
//               variant="outline"
//               className="flex-1 h-9 font-black gap-1.5 border-red-500/30 text-red-600 hover:bg-red-50 rounded-xl"
//               onClick={onReject}
//               disabled={isActioning}
//             >
//               {isActioning ? (
//                 <Loader2 className="h-3.5 w-3.5 animate-spin" />
//               ) : (
//                 <XCircle className="h-3.5 w-3.5" />
//               )}
//               رفض الطلب
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
//         {isLoadingMsgs ? (
//           <div className="flex justify-center py-8">
//             <Loader2 className="h-6 w-6 animate-spin text-primary" />
//           </div>
//         ) : messages.length === 0 ? (
//           <div className="text-center text-sm text-muted-foreground py-8">
//             لا توجد رسائل
//           </div>
//         ) : (
//           messages.map((msg) => {
//             const isSystem = msg.senderId === 'system';
//             const isAdmin = msg.senderId === 'admin' || (msg.senderName === 'الأدمن' && msg.senderId !== chat.agentUid);
//             const isMe = isAdmin; // from admin's perspective

//             if (isSystem) {
//               return (
//                 <div key={msg.id} className="flex justify-center">
//                   <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2.5 max-w-sm text-center">
//                     <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
//                       {msg.content}
//                     </p>
//                   </div>
//                 </div>
//               );
//             }

//             return (
//               <div
//                 key={msg.id}
//                 className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}
//               >
//                 <div
//                   className={`rounded-2xl px-4 py-2.5 max-w-[75%] shadow-sm ${isMe
//                     ? 'bg-primary text-primary-foreground'
//                     : 'bg-muted text-foreground border'
//                     }`}
//                 >
//                   <p className="text-[10px] font-black mb-1 opacity-70">{msg.senderName}</p>
//                   <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
//                 </div>
//               </div>
//             );
//           })
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="border-t p-3 flex gap-2 items-end bg-background">
//         <Textarea
//           placeholder="اكتب رسالة للوكيل..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={handleKeyDown}
//           rows={2}
//           className="resize-none rounded-xl text-sm flex-1"
//           disabled={isSending}
//         />
//         <Button
//           size="icon"
//           className="h-10 w-10 rounded-xl shrink-0"
//           onClick={handleSend}
//           disabled={isSending || !newMessage.trim()}
//         >
//           {isSending ? (
//             <Loader2 className="h-4 w-4 animate-spin" />
//           ) : (
//             <Send className="h-4 w-4" />
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// }

// // ───────────────────────────────────────────────
// // Sub-component: Status Badge
// // ───────────────────────────────────────────────
// function StatusBadge({ status }: { status: AgentChat['status'] }) {
//   if (status === 'approved') {
//     return (
//       <Badge className="bg-green-500/10 text-green-600 border-green-500/30 font-black text-[10px] gap-1">
//         <CheckCircle2 className="h-3 w-3" /> معتمد
//       </Badge>
//     );
//   }
//   if (status === 'rejected') {
//     return (
//       <Badge className="bg-red-500/10 text-red-600 border-red-500/30 font-black text-[10px] gap-1">
//         <XCircle className="h-3 w-3" /> مرفوض
//       </Badge>
//     );
//   }
//   return (
//     <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 font-black text-[10px] gap-1">
//       <Clock className="h-3 w-3 animate-pulse" /> بانتظار التصريح
//     </Badge>
//   );
// }

// // ───────────────────────────────────────────────
// // Main Page
// // ───────────────────────────────────────────────
// export default function AdminAgentRequestsPage() {
//   const firestore = useFirestore();
//   const { toast } = useToast();
//   const locale = useLocale();

//   const [selectedChat, setSelectedChat] = useState<AgentChat | null>(null);
//   const [isActioning, setIsActioning] = useState(false);
//   const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

//   // Load agent chats
//   const chatsQuery = useMemoFirebase(() => {
//     if (!firestore) return null;
//     return query(
//       collection(firestore, 'agent_approval_chats'),
//       orderBy('lastMessageTimestamp', 'desc'),
//       limit(50)
//     );
//   }, [firestore]);

//   const { data: allChats, isLoading } = useCollection<AgentChat>(chatsQuery);

//   const chats = (allChats || []).filter((c) =>
//     filter === 'all' ? true : c.status === filter
//   );

//   const counts = {
//     pending: (allChats || []).filter((c) => c.status === 'pending').length,
//     approved: (allChats || []).filter((c) => c.status === 'approved').length,
//     rejected: (allChats || []).filter((c) => c.status === 'rejected').length,
//   };

//   // Select first chat by default
//   useEffect(() => {
//     if (!selectedChat && chats.length > 0) {
//       setSelectedChat(chats[0]);
//     }
//   }, [chats, selectedChat]);

//   // Update selectedChat when data refreshes
//   useEffect(() => {
//     if (selectedChat && allChats) {
//       const updated = allChats.find((c) => c.id === selectedChat.id);
//       if (updated) setSelectedChat(updated);
//     }
//   }, [allChats]);

//   const handleApprove = useCallback(async () => {
//     if (!selectedChat || !firestore) return;
//     setIsActioning(true);
//     try {
//       // 1. Update approval chat status
//       await updateDoc(doc(firestore, 'agent_approval_chats', selectedChat.id), {
//         status: 'approved',
//       });

//       // 2. Update user profile in Firestore
//       await updateDoc(doc(firestore, 'users', selectedChat.agentUid), {
//         agentStatus: 'approved',
//         agentApprovalStatus: 'approved',
//         approvedAt: serverTimestamp(),
//       });

//       // 3. Send approval message in chat
//       await addDoc(
//         collection(firestore, 'agent_approval_chats', selectedChat.id, 'messages'),
//         {
//           content:
//             '🎉 تهانينا! تم اعتماد حسابك كوكيل.\n\nيمكنك الآن الدخول إلى لوحة الوكيل والبدء في العمل.\nمرحباً بك في الفريق!',
//           senderId: 'system',
//           senderName: 'النظام',
//           timestamp: serverTimestamp(),
//           type: 'system',
//         }
//       );

//       // 4. Update chat last message
//       await updateDoc(doc(firestore, 'agent_approval_chats', selectedChat.id), {
//         lastMessage: 'تم اعتماد الحساب ✅',
//         lastMessageTimestamp: serverTimestamp(),
//       });

//       toast({
//         title: '✅ تم منح التصريح',
//         description: `تم اعتماد ${selectedChat.agentName} كوكيل بنجاح`,
//       });
//     } catch (err) {
//       toast({ variant: 'destructive', title: 'فشلت العملية', description: 'حاول مرة أخرى' });
//     } finally {
//       setIsActioning(false);
//     }
//   }, [selectedChat, firestore, toast]);

//   const handleReject = useCallback(async () => {
//     if (!selectedChat || !firestore) return;
//     setIsActioning(true);
//     try {
//       await updateDoc(doc(firestore, 'agent_approval_chats', selectedChat.id), {
//         status: 'rejected',
//       });

//       await updateDoc(doc(firestore, 'users', selectedChat.agentUid), {
//         agentStatus: 'rejected',
//         agentApprovalStatus: 'rejected',
//         rejectedAt: serverTimestamp(),
//       });

//       await addDoc(
//         collection(firestore, 'agent_approval_chats', selectedChat.id, 'messages'),
//         {
//           content:
//             'نأسف، لم يتم قبول طلب انضمامك في الوقت الحالي.\nيمكنك التواصل مع الأدمن لمعرفة التفاصيل.',
//           senderId: 'system',
//           senderName: 'النظام',
//           timestamp: serverTimestamp(),
//           type: 'system',
//         }
//       );

//       await updateDoc(doc(firestore, 'agent_approval_chats', selectedChat.id), {
//         lastMessage: 'تم رفض الطلب',
//         lastMessageTimestamp: serverTimestamp(),
//       });

//       toast({
//         title: 'تم رفض الطلب',
//         description: `تم رفض طلب ${selectedChat.agentName}`,
//       });
//     } catch {
//       toast({ variant: 'destructive', title: 'فشلت العملية' });
//     } finally {
//       setIsActioning(false);
//     }
//   }, [selectedChat, firestore, toast]);

//   return (
//     <div className="h-screen flex flex-col" dir="rtl">
//       {/* Page Header */}
//       <div className="shrink-0 px-6 py-4 border-b bg-card flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
//             <ShieldCheck className="h-5 w-5 text-primary" />
//           </div>
//           <div>
//             <h1 className="font-black text-lg tracking-tight">طلبات الوكلاء</h1>
//             <p className="text-xs text-muted-foreground font-mono">
//               Agent Approval Center
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           {counts.pending > 0 && (
//             <Badge className="bg-amber-500 text-white font-black border-0">
//               {counts.pending} بانتظار التصريح
//             </Badge>
//           )}
//         </div>
//       </div>

//       {/* Filter Tabs */}
//       <div className="shrink-0 px-6 py-2 border-b bg-muted/20 flex items-center gap-2">
//         {(
//           [
//             { key: 'pending', label: 'بانتظار التصريح', count: counts.pending },
//             { key: 'approved', label: 'معتمدون', count: counts.approved },
//             { key: 'rejected', label: 'مرفوضون', count: counts.rejected },
//             { key: 'all', label: 'الكل', count: (allChats || []).length },
//           ] as const
//         ).map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setFilter(tab.key)}
//             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${filter === tab.key
//               ? 'bg-primary text-primary-foreground shadow'
//               : 'text-muted-foreground hover:text-foreground hover:bg-muted'
//               }`}
//           >
//             {tab.label}
//             {tab.count > 0 && (
//               <span
//                 className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${filter === tab.key ? 'bg-white/20' : 'bg-muted text-foreground'
//                   }`}
//               >
//                 {tab.count}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Main Content: Split Panel */}
//       <div className="flex-1 flex min-h-0">
//         {/* Left: Chat List */}
//         <div className="w-72 shrink-0 border-l flex flex-col min-h-0 bg-card">
//           <div className="flex-1 overflow-y-auto">
//             {isLoading ? (
//               <div className="flex justify-center py-8">
//                 <Loader2 className="h-6 w-6 animate-spin text-primary" />
//               </div>
//             ) : chats.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-3">
//                 <Users className="h-10 w-10 text-muted-foreground/30" />
//                 <p className="text-sm font-bold text-muted-foreground">
//                   {filter === 'pending'
//                     ? 'لا توجد طلبات بانتظار التصريح'
//                     : 'لا توجد طلبات'}
//                 </p>
//               </div>
//             ) : (
//               chats.map((chat) => (
//                 <button
//                   key={chat.id}
//                   onClick={() => setSelectedChat(chat)}
//                   className={`w-full text-right px-4 py-3 border-b transition-all hover:bg-muted/50 ${selectedChat?.id === chat.id ? 'bg-primary/5 border-r-2 border-r-primary' : ''
//                     }`}
//                 >
//                   <div className="flex items-center justify-between mb-1">
//                     <span className="font-black text-sm truncate">{chat.agentName}</span>
//                     <StatusBadge status={chat.status} />
//                   </div>
//                   <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
//                   {chat.lastMessageTimestamp?.toDate && (
//                     <p className="text-[10px] text-muted-foreground/60 mt-1">
//                       {/* {formatDate(chat.lastMessageTimestamp.toDate())} */}
//                       {formatDate(chat.lastMessageTimestamp.toDate(), 'd MMM - HH:mm', locale)}
//                     </p>
//                   )}
//                 </button>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Right: Chat Panel */}
//         <div className="flex-1 flex flex-col min-h-0">
//           {selectedChat ? (
//             <ChatPanel
//               key={selectedChat.id}
//               chat={selectedChat}
//               onApprove={handleApprove}
//               onReject={handleReject}
//               isActioning={isActioning}
//             />
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
//               <MessageSquare className="h-16 w-16 opacity-20" />
//               <p className="font-bold">اختر طلباً من القائمة لعرض التفاصيل</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import {
  collection, query, orderBy, serverTimestamp,
  doc, addDoc, updateDoc, onSnapshot, limit,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2, XCircle, MessageSquare, Loader2, Send, Clock,
  Users, ShieldCheck, Phone, Mail, User, Briefcase, DollarSign,
  Target, Gift, Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/formatters';
import { useLocale } from 'next-intl';

interface AgentChat {
  id: string; agentUid: string; agentName: string;
  agentEmail: string; agentPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any; lastMessage: string;
  lastMessageTimestamp: any; lastSenderId?: string;
}
interface Message {
  id: string; content: string; senderId: string;
  senderName: string; timestamp: any; type?: 'text' | 'system';
}
interface ApprovalFormData {
  workType: 'office' | 'remote' | 'hybrid';
  paymentSystem: 'monthly' | 'hourly' | 'commission';
  baseSalary: number; agentTarget: number;
  agentBonus: number; commissionRate: number; currency: string;
}

function ApprovalDialog({ open, onClose, onConfirm, agentName, isLoading }: {
  open: boolean; onClose: () => void;
  onConfirm: (data: ApprovalFormData) => void;
  agentName: string; isLoading: boolean;
}) {
  const [form, setForm] = useState<ApprovalFormData>({
    workType: 'office', paymentSystem: 'monthly',
    baseSalary: 0, agentTarget: 50, agentBonus: 100,
    commissionRate: 2, currency: 'JOD',
  });
  const update = (key: keyof ApprovalFormData, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="flex items-center gap-2 text-lg font-black text-primary">
            <ShieldCheck className="h-5 w-5" /> تفاصيل اعتماد الوكيل
          </DialogTitle>
          <DialogDescription className="text-xs">
            حدد بيانات العمل للوكيل <span className="font-bold text-foreground">{agentName}</span> قبل منح التصريح
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-1">
                <Briefcase className="h-3 w-3" /> طبيعة العمل
              </label>
              <Select value={form.workType} onValueChange={(v) => update('workType', v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">مكتبي</SelectItem>
                  <SelectItem value="remote">عن بعد</SelectItem>
                  <SelectItem value="hybrid">هجين</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> نظام الأجور
              </label>
              <Select value={form.paymentSystem} onValueChange={(v) => update('paymentSystem', v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">راتب شهري</SelectItem>
                  <SelectItem value="hourly">نظام المياومة</SelectItem>
                  <SelectItem value="commission">نظام العمولات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.paymentSystem === 'monthly' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> الراتب الأساسي (JOD)
              </label>
              <Input type="number" min={0} value={form.baseSalary}
                onChange={(e) => update('baseSalary', Number(e.target.value))}
                className="font-mono font-bold" />
            </div>
          )}

          <div className="border rounded-xl p-4 space-y-3 bg-blue-50/50 border-blue-100">
            <p className="text-xs font-black text-blue-700">📊 مؤشرات الأداء والعمولة</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-blue-700 flex items-center gap-1">
                  <Target className="h-3 w-3" /> هدف الرحلات
                </label>
                <Input type="number" min={0} value={form.agentTarget}
                  onChange={(e) => update('agentTarget', Number(e.target.value))}
                  className="font-bold border-blue-200 text-center" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Gift className="h-3 w-3" /> مكافأة (JOD)
                </label>
                <Input type="number" min={0} value={form.agentBonus}
                  onChange={(e) => update('agentBonus', Number(e.target.value))}
                  className="font-bold border-emerald-200 text-center" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-orange-700 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> عمولة (%)
                </label>
                <Input type="number" min={0} max={100} value={form.commissionRate}
                  onChange={(e) => update('commissionRate', Number(e.target.value))}
                  className="font-bold border-orange-200 text-center" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">إلغاء</Button>
          <Button onClick={() => onConfirm(form)} disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black gap-1.5">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            اعتماد ومنح التصريح
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatusBadge({ status }: { status: AgentChat['status'] }) {
  if (status === 'approved') return (
    <Badge className="bg-green-500/10 text-green-600 border-green-500/30 font-black text-[10px] gap-1">
      <CheckCircle2 className="h-3 w-3" /> معتمد
    </Badge>
  );
  if (status === 'rejected') return (
    <Badge className="bg-red-500/10 text-red-600 border-red-500/30 font-black text-[10px] gap-1">
      <XCircle className="h-3 w-3" /> مرفوض
    </Badge>
  );
  return (
    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 font-black text-[10px] gap-1">
      <Clock className="h-3 w-3 animate-pulse" /> بانتظار التصريح
    </Badge>
  );
}

function ChatPanel({ chat, onApprove, onReject, isActioning }: {
  chat: AgentChat; onApprove: () => void;
  onReject: () => void; isActioning: boolean;
}) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const locale = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!firestore || !chat.id) return;
    setIsLoadingMsgs(true);
    const q = query(collection(firestore, 'agent_approval_chats', chat.id, 'messages'), orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message)));
      setIsLoadingMsgs(false);
    });
    return () => unsub();
  }, [firestore, chat.id]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !firestore || !user || !chat.id) return;
    setIsSending(true);
    try {
      const content = newMessage.trim();
      setNewMessage('');
      await addDoc(collection(firestore, 'agent_approval_chats', chat.id, 'messages'), {
        content, senderId: user.uid, senderName: 'الأدمن',
        timestamp: serverTimestamp(), type: 'text',
      });
      await updateDoc(doc(firestore, 'agent_approval_chats', chat.id), {
        lastMessage: content, lastMessageTimestamp: serverTimestamp(), lastSenderId: user.uid,
      });
    } catch { toast({ variant: 'destructive', title: 'فشل الإرسال' }); }
    finally { setIsSending(false); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-muted/30 border-b space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-black text-sm">{chat.agentName}</p>
              <p className="text-xs text-muted-foreground">
                {chat.createdAt?.toDate ? formatDate(chat.createdAt.toDate(), 'd MMMM yyyy', locale) : 'حديث'}
              </p>
            </div>
          </div>
          <StatusBadge status={chat.status} />
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          {chat.agentEmail && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {chat.agentEmail}</span>}
          {chat.agentPhone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {chat.agentPhone}</span>}
        </div>
        {chat.status === 'pending' && (
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={onApprove} disabled={isActioning}
              className="flex-1 h-9 font-black gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl">
              {isActioning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              منح التصريح
            </Button>
            <Button size="sm" variant="outline" onClick={onReject} disabled={isActioning}
              className="flex-1 h-9 font-black gap-1.5 border-red-500/30 text-red-600 hover:bg-red-50 rounded-xl">
              {isActioning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
              رفض الطلب
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {isLoadingMsgs ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">لا توجد رسائل</div>
        ) : messages.map((msg) => {
          const isSystem = msg.senderId === 'system';
          const isAdmin = msg.senderId === 'admin' || (msg.senderName === 'الأدمن' && msg.senderId !== chat.agentUid);
          if (isSystem) return (
            <div key={msg.id} className="flex justify-center">
              <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2.5 max-w-sm text-center">
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          );
          return (
            <div key={msg.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
              <div className={`rounded-2xl px-4 py-2.5 max-w-[75%] shadow-sm ${isAdmin ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground border'}`}>
                <p className="text-[10px] font-black mb-1 opacity-70">{msg.senderName}</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3 flex gap-2 items-end bg-background">
        <Textarea placeholder="اكتب رسالة للوكيل..." value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          rows={2} className="resize-none rounded-xl text-sm flex-1" disabled={isSending} />
        <Button size="icon" className="h-10 w-10 rounded-xl shrink-0" onClick={handleSend} disabled={isSending || !newMessage.trim()}>
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

export default function AdminAgentRequestsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const locale = useLocale();
  const [selectedChat, setSelectedChat] = useState<AgentChat | null>(null);
  const [isActioning, setIsActioning] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);

  const chatsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'agent_approval_chats'), orderBy('lastMessageTimestamp', 'desc'), limit(50));
  }, [firestore]);

  const { data: allChats, isLoading } = useCollection<AgentChat>(chatsQuery);
  const chats = (allChats || []).filter((c) => filter === 'all' ? true : c.status === filter);
  const counts = {
    pending: (allChats || []).filter((c) => c.status === 'pending').length,
    approved: (allChats || []).filter((c) => c.status === 'approved').length,
    rejected: (allChats || []).filter((c) => c.status === 'rejected').length,
  };

  useEffect(() => { if (!selectedChat && chats.length > 0) setSelectedChat(chats[0]); }, [chats, selectedChat]);
  useEffect(() => {
    if (selectedChat && allChats) {
      const updated = allChats.find((c) => c.id === selectedChat.id);
      if (updated) setSelectedChat(updated);
    }
  }, [allChats]);

  const handleApproveClick = useCallback(() => setApprovalDialogOpen(true), []);

  const handleApproveConfirm = useCallback(async (formData: ApprovalFormData) => {
    if (!selectedChat || !firestore) return;
    setIsActioning(true);
    try {
      await updateDoc(doc(firestore, 'agent_approval_chats', selectedChat.id), { status: 'approved' });

      // ✅ نفس fields الـ Add Staff + بيانات العمل المحددة من الأدمن
      await updateDoc(doc(firestore, 'users', selectedChat.agentUid), {
        agentStatus: 'active',
        agentApprovalStatus: 'approved',
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        workType: formData.workType,
        paymentSystem: formData.paymentSystem,
        baseSalary: formData.baseSalary,
        agentTarget: formData.agentTarget,
        agentBonus: formData.agentBonus,
        commissionRate: formData.commissionRate,
        currency: formData.currency,
        isActive: true,
        isFirstLogin: true,
        currentBalance: 0,
        lifetimeEarnings: 0,
        permissions: {},
      });

      await addDoc(collection(firestore, 'agent_approval_chats', selectedChat.id, 'messages'), {
        content: '🎉 تهانينا! تم اعتماد حسابك كوكيل.\n\nيمكنك الآن الدخول إلى لوحة الوكيل والبدء في العمل.\nمرحباً بك في الفريق!',
        senderId: 'system', senderName: 'النظام', timestamp: serverTimestamp(), type: 'system',
      });

      await updateDoc(doc(firestore, 'agent_approval_chats', selectedChat.id), {
        lastMessage: 'تم اعتماد الحساب ✅', lastMessageTimestamp: serverTimestamp(),
      });

      setApprovalDialogOpen(false);
      toast({ title: '✅ تم منح التصريح', description: `تم اعتماد ${selectedChat.agentName} مع تحديد بيانات العمل` });
    } catch {
      toast({ variant: 'destructive', title: 'فشلت العملية', description: 'حاول مرة أخرى' });
    } finally { setIsActioning(false); }
  }, [selectedChat, firestore, toast]);

  const handleReject = useCallback(async () => {
    if (!selectedChat || !firestore) return;
    setIsActioning(true);
    try {
      await updateDoc(doc(firestore, 'agent_approval_chats', selectedChat.id), { status: 'rejected' });
      await updateDoc(doc(firestore, 'users', selectedChat.agentUid), {
        agentStatus: 'rejected', agentApprovalStatus: 'rejected', rejectedAt: serverTimestamp(),
      });
      await addDoc(collection(firestore, 'agent_approval_chats', selectedChat.id, 'messages'), {
        content: 'نأسف، لم يتم قبول طلب انضمامك في الوقت الحالي.\nيمكنك التواصل مع الأدمن لمعرفة التفاصيل.',
        senderId: 'system', senderName: 'النظام', timestamp: serverTimestamp(), type: 'system',
      });
      await updateDoc(doc(firestore, 'agent_approval_chats', selectedChat.id), {
        lastMessage: 'تم رفض الطلب', lastMessageTimestamp: serverTimestamp(),
      });
      toast({ title: 'تم رفض الطلب', description: `تم رفض طلب ${selectedChat.agentName}` });
    } catch { toast({ variant: 'destructive', title: 'فشلت العملية' }); }
    finally { setIsActioning(false); }
  }, [selectedChat, firestore, toast]);

  return (
    <div className="h-screen flex flex-col" dir="rtl">
      <ApprovalDialog
        open={approvalDialogOpen}
        onClose={() => setApprovalDialogOpen(false)}
        onConfirm={handleApproveConfirm}
        agentName={selectedChat?.agentName ?? ''}
        isLoading={isActioning}
      />

      <div className="shrink-0 px-6 py-4 border-b bg-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight">طلبات الوكلاء</h1>
            <p className="text-xs text-muted-foreground font-mono">Agent Approval Center</p>
          </div>
        </div>
        {counts.pending > 0 && (
          <Badge className="bg-amber-500 text-white font-black border-0">{counts.pending} بانتظار التصريح</Badge>
        )}
      </div>

      <div className="shrink-0 px-6 py-2 border-b bg-muted/20 flex items-center gap-2">
        {([
          { key: 'pending', label: 'بانتظار التصريح', count: counts.pending },
          { key: 'approved', label: 'معتمدون', count: counts.approved },
          { key: 'rejected', label: 'مرفوضون', count: counts.rejected },
          { key: 'all', label: 'الكل', count: (allChats || []).length },
        ] as const).map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${filter === tab.key ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
            {tab.label}
            {tab.count > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${filter === tab.key ? 'bg-white/20' : 'bg-muted text-foreground'}`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 flex min-h-0">
        <div className="w-72 shrink-0 border-l flex flex-col min-h-0 bg-card">
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-3">
                <Users className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm font-bold text-muted-foreground">
                  {filter === 'pending' ? 'لا توجد طلبات بانتظار التصريح' : 'لا توجد طلبات'}
                </p>
              </div>
            ) : chats.map((chat) => (
              <button key={chat.id} onClick={() => setSelectedChat(chat)}
                className={`w-full text-right px-4 py-3 border-b transition-all hover:bg-muted/50 ${selectedChat?.id === chat.id ? 'bg-primary/5 border-r-2 border-r-primary' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm truncate">{chat.agentName}</span>
                  <StatusBadge status={chat.status} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                {chat.lastMessageTimestamp?.toDate && (
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {formatDate(chat.lastMessageTimestamp.toDate(), 'd MMM - HH:mm', locale)}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {selectedChat ? (
            <ChatPanel key={selectedChat.id} chat={selectedChat}
              onApprove={handleApproveClick} onReject={handleReject} isActioning={isActioning} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <MessageSquare className="h-16 w-16 opacity-20" />
              <p className="font-bold">اختر طلباً من القائمة لعرض التفاصيل</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}