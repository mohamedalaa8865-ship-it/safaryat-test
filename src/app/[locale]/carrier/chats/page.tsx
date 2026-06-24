
// // // // // 'use client';

// // // // // import { useState, useMemo, useEffect } from 'react';
// // // // // import { AppLayout } from '@/components/app-layout';
// // // // // import CarrierLayout from '@/app/[locale]/carrier/layout';
// // // // // import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// // // // // import { collection, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
// // // // // import type { Chat, Trip } from '@/lib/data';
// // // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // // import { Card, CardContent, CardHeader } from '@/components/ui/card';
// // // // // import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// // // // // import { formatDistanceToNow } from 'date-fns';
// // // // // import { arSA } from 'date-fns/locale';
// // // // // import { MessageSquare, Users, User } from 'lucide-react';
// // // // // import { Badge } from '@/components/ui/badge';
// // // // // import { ChatDialog } from '@/components/chat/chat-dialog';
// // // // // import { useRouter } from 'next/navigation';
// // // // // import { useTranslations } from 'next-intl';
// // // // // import { useUserProfile } from '@/hooks/use-user-profile';

// // // // // const ChatListItem = ({ chat, onClick }: { chat: Chat, onClick: () => void }) => {
// // // // //   const t = useTranslations('chatsPage');
// // // // //   const { user } = useUser();
// // // // //   const unreadCount = chat.unreadCounts?.[user?.uid || ''] || 0;

// // // // //   const safeFormatDistance = (timestamp: any) => {
// // // // //     if (!timestamp) return '';
// // // // //     try {
// // // // //       const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
// // // // //       return formatDistanceToNow(date, { addSuffix: true, locale: arSA });
// // // // //     } catch {
// // // // //       return '';
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
// // // // //       <CardContent className="p-4 flex items-center gap-4">
// // // // //         <Avatar className="h-12 w-12 border">
// // // // //           <AvatarFallback>
// // // // //             {chat.isGroupChat ? <Users /> : <User />}
// // // // //           </AvatarFallback>
// // // // //         </Avatar>
// // // // //         <div className="flex-1">
// // // // //           <div className="flex justify-between items-center">
// // // // //             <p className="font-bold">{chat.isGroupChat ? t('groupChat') : t('privateChat')}</p>
// // // // //             {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
// // // // //           </div>
// // // // //           <p className="text-sm text-muted-foreground truncate">{chat.lastMessage || t('noMessages')}</p>
// // // // //         </div>
// // // // //         <div className="text-xs text-muted-foreground self-start">
// // // // //           {safeFormatDistance(chat.lastMessageTimestamp)}
// // // // //         </div>
// // // // //       </CardContent>
// // // // //     </Card>
// // // // //   );
// // // // // };

// // // // // /**
// // // // //  * @page ChatsPage
// // // // //  * @description THE REINFORCED CHAT HUB (SC-806 V2.6)
// // // // //  * Enforced useMemoFirebase for queries to ensure zero redundant reads.
// // // // //  */

// // // // // function ConditionalLayout({ children, profile, user, isEngaged, engagementType }: any) {
// // // // //   if (profile?.role === 'carrier') {
// // // // //     return <CarrierLayout>{children}</CarrierLayout>;
// // // // //   }
// // // // //   return <AppLayout profile={profile} user={user} isEngaged={isEngaged} engagementType={engagementType}>{children}</AppLayout>;
// // // // // }

// // // // // export default function ChatsPage() {
// // // // //   const t = useTranslations('chatsPage');
// // // // //   const { user, isUserLoading } = useUser();
// // // // //   const { profile, isEngaged, engagementType, isLoading: isProfileLoading } = useUserProfile();
// // // // //   const firestore = useFirestore();
// // // // //   const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
// // // // //   const [isChatOpen, setIsChatOpen] = useState(false);
// // // // //   const router = useRouter();

// // // // //   const chatsQuery = useMemoFirebase(() => {
// // // // //     if (!firestore || !user) return null;
// // // // //     return query(
// // // // //       collection(firestore, 'chats'),
// // // // //       where('participants', 'array-contains', user.uid),
// // // // //       orderBy('lastMessageTimestamp', 'desc'),
// // // // //       orderBy('__name__', 'desc')
// // // // //     );
// // // // //   }, [firestore, user]);

// // // // //   const { data: chats, isLoading: isLoadingChats } = useCollection<Chat>(chatsQuery);
// // // // //   const isLoading = isUserLoading || isProfileLoading || isLoadingChats;

// // // // //   useEffect(() => {
// // // // //     if (!isLoading && !user) {
// // // // //       router.push('/login');
// // // // //     }
// // // // //   }, [user, isLoading, router]);

// // // // //   const handleChatClick = (chat: Chat) => {
// // // // //     if (firestore && user && (chat.unreadCounts?.[user.uid] ?? 0) > 0) {
// // // // //       const chatRef = doc(firestore, 'chats', chat.id);
// // // // //       updateDoc(chatRef, {
// // // // //         [`unreadCounts.${user.uid}`]: 0
// // // // //       });
// // // // //     }
// // // // //     setSelectedChat(chat);
// // // // //     setIsChatOpen(true);
// // // // //   };

// // // // //   const renderContent = () => {
// // // // //     if (isLoading) {
// // // // //       return (
// // // // //         <div className="space-y-4">
// // // // //           {[...Array(3)].map((_, i) => (
// // // // //             <Skeleton key={i} className="h-20 w-full" />
// // // // //           ))}
// // // // //         </div>
// // // // //       );
// // // // //     }

// // // // //     if (!chats || chats.length === 0) {
// // // // //       return (
// // // // //         <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
// // // // //           <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
// // // // //           <p className="font-bold">{t('noChatsTitle')}</p>
// // // // //           <p className="text-sm mt-1">{t('noChatsDescription')}</p>
// // // // //         </div>
// // // // //       );
// // // // //     }

// // // // //     return (
// // // // //       <div className="space-y-3">
// // // // //         {chats.map(chat => (
// // // // //           <ChatListItem key={chat.id} chat={chat} onClick={() => handleChatClick(chat)} />
// // // // //         ))}
// // // // //       </div>
// // // // //     );
// // // // //   };

// // // // //   return (
// // // // //     <>
// // // // //       <div className="container mx-auto max-w-3xl p-4 space-y-6 pt-16">
// // // // //         <Card className="bg-card border-primary/50">
// // // // //           <CardHeader>
// // // // //             <h1 className="text-2xl font-bold">{t('headerTitle')}</h1>
// // // // //             <p className="text-muted-foreground">{t('headerDescription')}</p>
// // // // //           </CardHeader>
// // // // //         </Card>
// // // // //         {renderContent()}
// // // // //       </div>
// // // // //       {/* {selectedChat && (
// // // // //         <ChatDialog
// // // // //           isOpen={isChatOpen}
// // // // //           onOpenChange={setIsChatOpen}
// // // // //           trip={selectedChat.isGroupChat ? { id: selectedChat.id } as Trip : undefined}
// // // // //           bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
// // // // //           otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
// // // // //           chatType={selectedChat.isGroupChat ? "group" : "private"}
// // // // //         />
// // // // //       )} */}
// // // // //       {/* دردشة خاصة
// // // // //       {selectedChat && (
// // // // //         <ChatDialog
// // // // //           isOpen={isChatOpen}
// // // // //           onOpenChange={setIsChatOpen}
// // // // //           bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
// // // // //           otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
// // // // //           chatType='private' />
// // // // //       )}

// // // // //       {/* ✅ دردشة الرحلة الجماعية */}
// // // // //       {/* {selectedChat && (
// // // // //         <ChatDialog
// // // // //           isOpen={isChatOpen}
// // // // //           onOpenChange={setIsChatOpen}
// // // // //           bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
// // // // //           otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
// // // // //           chatType='group' />
// // // // //       )} */}
// // // // //       {selectedChat && (
// // // // //         <ChatDialog
// // // // //           isOpen={isChatOpen}
// // // // //           onOpenChange={setIsChatOpen}
// // // // //           trip={selectedChat.isGroupChat ? { id: selectedChat.id } as Trip : undefined}
// // // // //           bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
// // // // //           otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
// // // // //         // chatType={selectedChat.isGroupChat ? "group" : "private"}

// // // // //         />
// // // // //       )}
// // // // //     </>
// // // // //   );
// // // // // }
// // // // 'use client';

// // // // import { useState, useEffect } from 'react';
// // // // import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// // // // import { collection, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
// // // // import type { Chat, Trip } from '@/lib/data';
// // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // import { Card, CardContent, CardHeader } from '@/components/ui/card';
// // // // import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// // // // import { formatDistanceToNow } from 'date-fns';
// // // // import { arSA } from 'date-fns/locale';
// // // // import { MessageSquare, Users, User } from 'lucide-react';
// // // // import { Badge } from '@/components/ui/badge';
// // // // import { ChatDialog } from '@/components/chat/chat-dialog';
// // // // import { useRouter } from 'next/navigation';
// // // // import { useTranslations } from 'next-intl';

// // // // // نفس الـ ChatListItem بالظبط
// // // // const ChatListItem = ({ chat, onClick }: { chat: Chat; onClick: () => void }) => {
// // // //   const t = useTranslations('chatsPage');
// // // //   const { user } = useUser();
// // // //   const unreadCount = chat.unreadCounts?.[user?.uid || ''] || 0;
// // // //   const safeFormatDistance = (timestamp: any) => {
// // // //     if (!timestamp) return '';
// // // //     try {
// // // //       const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
// // // //       return formatDistanceToNow(date, { addSuffix: true, locale: arSA });
// // // //     } catch { return ''; }
// // // //   };
// // // //   return (
// // // //     <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
// // // //       <CardContent className="p-4 flex items-center gap-4">
// // // //         <Avatar className="h-12 w-12 border">
// // // //           <AvatarFallback>{chat.isGroupChat ? <Users /> : <User />}</AvatarFallback>
// // // //         </Avatar>
// // // //         <div className="flex-1">
// // // //           <div className="flex justify-between items-center">
// // // //             <p className="font-bold">{chat.isGroupChat ? t('groupChat') : t('privateChat')}</p>
// // // //             {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
// // // //           </div>
// // // //           <p className="text-sm text-muted-foreground truncate">{chat.lastMessage || t('noMessages')}</p>
// // // //         </div>
// // // //         <div className="text-xs text-muted-foreground self-start">
// // // //           {safeFormatDistance(chat.lastMessageTimestamp)}
// // // //         </div>
// // // //       </CardContent>
// // // //     </Card>
// // // //   );
// // // // };

// // // // export default function CarrierChatsPage() {
// // // //   const t = useTranslations('chatsPage');
// // // //   const { user, isUserLoading } = useUser();
// // // //   const firestore = useFirestore();
// // // //   const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
// // // //   const [isChatOpen, setIsChatOpen] = useState(false);
// // // //   const router = useRouter();

// // // //   const chatsQuery = useMemoFirebase(() => {
// // // //     if (!firestore || !user) return null;
// // // //     return query(
// // // //       collection(firestore, 'chats'),
// // // //       where('participants', 'array-contains', user.uid),
// // // //       orderBy('lastMessageTimestamp', 'desc'),
// // // //       orderBy('__name__', 'desc')
// // // //     );
// // // //   }, [firestore, user]);

// // // //   const { data: chats, isLoading: isLoadingChats } = useCollection<Chat>(chatsQuery);
// // // //   const isLoading = isUserLoading || isLoadingChats;

// // // //   useEffect(() => {
// // // //     if (!isLoading && !user) router.push('/login');
// // // //   }, [user, isLoading, router]);

// // // //   const handleChatClick = (chat: Chat) => {
// // // //     if (firestore && user && (chat.unreadCounts?.[user.uid] ?? 0) > 0) {
// // // //       updateDoc(doc(firestore, 'chats', chat.id), {
// // // //         [`unreadCounts.${user.uid}`]: 0
// // // //       });
// // // //     }
// // // //     setSelectedChat(chat);
// // // //     setIsChatOpen(true);
// // // //   };

// // // //   return (
// // // //     // ❌ مفيش CarrierLayout هنا — carrier/layout.tsx بيشتغل تلقائياً
// // // //     <>
// // // //       <div className="container mx-auto max-w-3xl p-4 space-y-6 pt-6">
// // // //         <Card className="bg-card border-primary/50">
// // // //           <CardHeader>
// // // //             <h1 className="text-2xl font-bold">{t('headerTitle')}</h1>
// // // //             <p className="text-muted-foreground">{t('headerDescription')}</p>
// // // //           </CardHeader>
// // // //         </Card>
// // // //         {isLoading ? (
// // // //           <div className="space-y-4">
// // // //             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
// // // //           </div>
// // // //         ) : !chats || chats.length === 0 ? (
// // // //           <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
// // // //             <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
// // // //             <p className="font-bold">{t('noChatsTitle')}</p>
// // // //             <p className="text-sm mt-1">{t('noChatsDescription')}</p>
// // // //           </div>
// // // //         ) : (
// // // //           <div className="space-y-3">
// // // //             {chats.map(chat => (
// // // //               <ChatListItem key={chat.id} chat={chat} onClick={() => handleChatClick(chat)} />
// // // //             ))}
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //       {selectedChat && (
// // // //         <ChatDialog
// // // //           isOpen={isChatOpen}
// // // //           onOpenChange={setIsChatOpen}
// // // //           trip={selectedChat.isGroupChat ? { id: selectedChat.id } as Trip : undefined}
// // // //           bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
// // // //           otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
// // // //         />
// // // //       )}
// // // //     </>
// // // //   );
// // // // }
// // // 'use client';

// // // import { useState, useEffect, useMemo } from 'react';
// // // import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
// // // import { collection, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
// // // import type { Chat, Trip, UserProfile } from '@/lib/data';
// // // import { Skeleton } from '@/components/ui/skeleton';
// // // import { Card, CardContent, CardHeader } from '@/components/ui/card';
// // // import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// // // import { formatDistanceToNow } from 'date-fns';
// // // import { arSA } from 'date-fns/locale';
// // // import { MessageSquare, Users, User, Archive, ArrowLeftRight } from 'lucide-react';
// // // import { Badge } from '@/components/ui/badge';
// // // import { ChatDialog } from '@/components/chat/chat-dialog';
// // // import { useRouter } from 'next/navigation';
// // // import { useTranslations } from 'next-intl';
// // // import { cn } from '@/lib/utils';

// // // // ─── Tab types ───────────────────────────────────────────────────────────────
// // // type TabKey = 'group' | 'private' | 'carrier' | 'archive';

// // // interface TabDef {
// // //   key: TabKey;
// // //   label: string;
// // //   icon: React.ReactNode;
// // // }

// // // // ─── Chat classifier ──────────────────────────────────────────────────────────
// // // function classifyChat(chat: Chat): TabKey {
// // //   if (chat.isClosed) return 'archive';
// // //   if (chat.isGroupChat) return 'group';
// // //   if (
// // //     chat.id.startsWith('carrier_') ||
// // //     chat.id.startsWith('transfer_') ||
// // //     chat.id.includes('_carrier_')
// // //   ) return 'carrier';
// // //   return 'private';
// // // }

// // // // ─── helpers ──────────────────────────────────────────────────────────────────
// // // function safeFormatDistance(timestamp: any): string {
// // //   if (!timestamp) return '';
// // //   try {
// // //     const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
// // //     return formatDistanceToNow(date, { addSuffix: true, locale: arSA });
// // //   } catch { return ''; }
// // // }

// // // // ─── Hook: جيب اسم الطرف الثاني من الـ participants ─────────────────────────
// // // function useOtherPartyName(chat: Chat, myUid: string | undefined): string {
// // //   const firestore = useFirestore();

// // //   // استخرج الـ uid الثاني
// // //   const otherUid = useMemo(() => {
// // //     if (!myUid || !chat.participants) return null;
// // //     return chat.participants.find(p => p !== myUid) ?? null;
// // //   }, [chat.participants, myUid]);

// // //   const profileRef = useMemoFirebase(() => {
// // //     if (!firestore || !otherUid) return null;
// // //     return doc(firestore, 'users', otherUid);
// // //   }, [firestore, otherUid]);

// // //   const { data: profile } = useDoc<UserProfile>(profileRef);

// // //   if (!profile) return '';
// // //   return (
// // //     [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim() ||
// // //     profile.fullName ||
// // //     profile.displayName ||
// // //     profile.email ||
// // //     ''
// // //   );
// // // }

// // // // ─── ChatListItem ─────────────────────────────────────────────────────────────
// // // const ChatListItem = ({ chat, onClick }: { chat: Chat; onClick: () => void }) => {
// // //   const t = useTranslations('chatsPage');
// // //   const { user } = useUser();
// // //   const unreadCount = chat.unreadCounts?.[user?.uid || ''] || 0;
// // //   const tabType = classifyChat(chat);

// // //   // اسم الطرف الثاني (للمحادثات الخاصة وبين الناقلين)
// // //   const otherName = useOtherPartyName(chat, user?.uid);

// // //   const title = (() => {
// // //     if (tabType === 'group') return t('groupChat');
// // //     if (tabType === 'archive') return chat.isGroupChat ? t('groupChat') : (otherName || t('privateChat'));
// // //     if (tabType === 'carrier') return otherName || 'ناقل آخر';
// // //     // private
// // //     return otherName || t('privateChat');
// // //   })();

// // //   // الحرف الأول للـ avatar
// // //   const avatarLetter = otherName?.charAt(0)?.toUpperCase() || null;

// // //   return (
// // //     <Card
// // //       className={cn(
// // //         'cursor-pointer hover:bg-muted/50 transition-colors',
// // //         chat.isClosed && 'opacity-70',
// // //       )}
// // //       onClick={onClick}
// // //     >
// // //       <CardContent className="p-4 flex items-center gap-4">
// // //         <Avatar className="h-12 w-12 border">
// // //           <AvatarFallback className="font-bold text-sm">
// // //             {tabType === 'group' ? (
// // //               <Users className="h-5 w-5" />
// // //             ) : tabType === 'archive' && chat.isGroupChat ? (
// // //               <Archive className="h-5 w-5" />
// // //             ) : avatarLetter ? (
// // //               avatarLetter
// // //             ) : tabType === 'carrier' ? (
// // //               <ArrowLeftRight className="h-5 w-5" />
// // //             ) : (
// // //               <User className="h-5 w-5" />
// // //             )}
// // //           </AvatarFallback>
// // //         </Avatar>
// // //         <div className="flex-1 min-w-0">
// // //           <div className="flex justify-between items-center gap-2">
// // //             <p className="font-bold truncate">{title}</p>
// // //             {unreadCount > 0 && (
// // //               <Badge variant="destructive" className="shrink-0">{unreadCount}</Badge>
// // //             )}
// // //           </div>
// // //           <p className="text-sm text-muted-foreground truncate">
// // //             {chat.lastMessage || t('noMessages')}
// // //           </p>
// // //         </div>
// // //         <div className="text-xs text-muted-foreground self-start shrink-0">
// // //           {safeFormatDistance(chat.lastMessageTimestamp)}
// // //         </div>
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // };

// // // // ─── Empty state ──────────────────────────────────────────────────────────────
// // // function EmptyState({ label }: { label: string }) {
// // //   return (
// // //     <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
// // //       <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
// // //       <p className="font-bold">لا توجد {label}</p>
// // //       <p className="text-sm mt-1">ستظهر هنا عند وجودها</p>
// // //     </div>
// // //   );
// // // }

// // // // ─── Page ─────────────────────────────────────────────────────────────────────
// // // export default function CarrierChatsPage() {
// // //   const t = useTranslations('chatsPage');
// // //   const { user, isUserLoading } = useUser();
// // //   const firestore = useFirestore();
// // //   const router = useRouter();

// // //   const [activeTab, setActiveTab] = useState<TabKey>('group');
// // //   const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
// // //   const [isChatOpen, setIsChatOpen] = useState(false);

// // //   const chatsQuery = useMemoFirebase(() => {
// // //     if (!firestore || !user) return null;
// // //     return query(
// // //       collection(firestore, 'chats'),
// // //       where('participants', 'array-contains', user.uid),
// // //       orderBy('lastMessageTimestamp', 'desc'),
// // //       orderBy('__name__', 'desc'),
// // //     );
// // //   }, [firestore, user]);

// // //   const { data: chats, isLoading: isLoadingChats } = useCollection<Chat>(chatsQuery);
// // //   const isLoading = isUserLoading || isLoadingChats;

// // //   useEffect(() => {
// // //     if (!isLoading && !user) router.push('/login');
// // //   }, [user, isLoading, router]);

// // //   // ── فرز الرسائل حسب التابات ──
// // //   const tabChats = useMemo<Record<TabKey, Chat[]>>(() => {
// // //     if (!chats) return { group: [], private: [], carrier: [], archive: [] };
// // //     const result: Record<TabKey, Chat[]> = { group: [], private: [], carrier: [], archive: [] };
// // //     for (const chat of chats) result[classifyChat(chat)].push(chat);
// // //     return result;
// // //   }, [chats]);

// // //   // ── إجمالي الـ unread لكل تاب ──
// // //   const unreadPerTab = useMemo<Record<TabKey, number>>(() => {
// // //     if (!chats || !user) return { group: 0, private: 0, carrier: 0, archive: 0 };
// // //     const result: Record<TabKey, number> = { group: 0, private: 0, carrier: 0, archive: 0 };
// // //     for (const chat of chats) result[classifyChat(chat)] += chat.unreadCounts?.[user.uid] || 0;
// // //     return result;
// // //   }, [chats, user]);

// // //   const tabs: TabDef[] = [
// // //     { key: 'group', label: 'المجموعات', icon: <Users className="h-4 w-4" /> },
// // //     { key: 'private', label: 'الخاصة', icon: <User className="h-4 w-4" /> },
// // //     { key: 'carrier', label: 'بين الناقلين', icon: <ArrowLeftRight className="h-4 w-4" /> },
// // //     { key: 'archive', label: 'الأرشيف', icon: <Archive className="h-4 w-4" /> },
// // //   ];

// // //   const handleChatClick = (chat: Chat) => {
// // //     if (firestore && user && (chat.unreadCounts?.[user.uid] ?? 0) > 0) {
// // //       updateDoc(doc(firestore, 'chats', chat.id), {
// // //         [`unreadCounts.${user.uid}`]: 0,
// // //       });
// // //     }
// // //     setSelectedChat(chat);
// // //     setIsChatOpen(true);
// // //   };

// // //   const currentChats = tabChats[activeTab];

// // //   return (
// // //     <>
// // //       <div className="container mx-auto max-w-3xl p-4 space-y-4 pt-6">

// // //         {/* Header */}
// // //         <Card className="bg-card border-primary/50">
// // //           <CardHeader>
// // //             <h1 className="text-2xl font-bold">{t('headerTitle')}</h1>
// // //             <p className="text-muted-foreground">{t('headerDescription')}</p>
// // //           </CardHeader>
// // //         </Card>

// // //         {/* Tabs */}
// // //         <div className="grid grid-cols-4 gap-1 rounded-xl bg-muted/50 border p-1">
// // //           {tabs.map(tab => (
// // //             <button
// // //               key={tab.key}
// // //               onClick={() => setActiveTab(tab.key)}
// // //               className={cn(
// // //                 'relative flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-[11px] font-bold transition-all',
// // //                 activeTab === tab.key
// // //                   ? 'bg-background text-primary shadow-sm'
// // //                   : 'text-muted-foreground hover:text-foreground',
// // //               )}
// // //             >
// // //               {tab.icon}
// // //               <span className="leading-tight text-center">{tab.label}</span>
// // //               {unreadPerTab[tab.key] > 0 && (
// // //                 <span className="absolute top-1 end-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-black flex items-center justify-center">
// // //                   {unreadPerTab[tab.key] > 9 ? '9+' : unreadPerTab[tab.key]}
// // //                 </span>
// // //               )}
// // //             </button>
// // //           ))}
// // //         </div>

// // //         {/* Content */}
// // //         {isLoading ? (
// // //           <div className="space-y-3">
// // //             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
// // //           </div>
// // //         ) : currentChats.length === 0 ? (
// // //           <EmptyState label={tabs.find(tb => tb.key === activeTab)?.label ?? 'رسائل'} />
// // //         ) : (
// // //           <div className="space-y-3">
// // //             {currentChats.map(chat => (
// // //               <ChatListItem key={chat.id} chat={chat} onClick={() => handleChatClick(chat)} />
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Chat Dialog */}
// // //       {selectedChat && (
// // //         <ChatDialog
// // //           isOpen={isChatOpen}
// // //           onOpenChange={setIsChatOpen}
// // //           trip={selectedChat.isGroupChat ? { id: selectedChat.id } as Trip : undefined}
// // //           bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
// // //           otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
// // //           chatType={selectedChat.isGroupChat ? 'group' : 'private'}
// // //         />
// // //       )}
// // //     </>
// // //   );
// // // }
// // 'use client';

// // import { useState, useEffect, useMemo } from 'react';
// // import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
// // import {
// //   collection, query, where, orderBy, doc, updateDoc,
// //   setDoc, serverTimestamp, getDoc,
// // } from 'firebase/firestore';
// // import type { Chat, Trip, UserProfile } from '@/lib/data';
// // import { Skeleton } from '@/components/ui/skeleton';
// // import { Card, CardContent, CardHeader } from '@/components/ui/card';
// // import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// // import { formatDistanceToNow } from 'date-fns';
// // import { arSA } from 'date-fns/locale';
// // import { MessageSquare, Users, User, Archive, ArrowLeftRight, MapPin, ArrowRight } from 'lucide-react';
// // import { Badge } from '@/components/ui/badge';
// // import { ChatDialog } from '@/components/chat/chat-dialog';
// // import { useRouter } from 'next/navigation';
// // import { useTranslations } from 'next-intl';
// // import { cn } from '@/lib/utils';

// // // ─── Types ────────────────────────────────────────────────────────────────────
// // type TabKey = 'group' | 'private' | 'carrier' | 'archive';

// // interface TabDef { key: TabKey; label: string; icon: React.ReactNode; }

// // // ─── Classifier ───────────────────────────────────────────────────────────────
// // function classifyChat(chat: Chat): TabKey {
// //   if (chat.isClosed) return 'archive';
// //   if (chat.isGroupChat) return 'group';
// //   if (chat.id.startsWith('route_') || chat.id.startsWith('carrier_') || chat.id.startsWith('transfer_'))
// //     return 'carrier';
// //   return 'private';
// // }

// // // ─── helpers ──────────────────────────────────────────────────────────────────
// // function safeFormatDistance(ts: any): string {
// //   if (!ts) return '';
// //   try {
// //     const d = ts?.toDate ? ts.toDate() : new Date(ts);
// //     return formatDistanceToNow(d, { addSuffix: true, locale: arSA });
// //   } catch { return ''; }
// // }

// // // جلب اسم الطرف الثاني من الـ participants
// // function useOtherPartyName(chat: Chat, myUid?: string): string {
// //   const firestore = useFirestore();
// //   const otherUid = useMemo(() => {
// //     if (!myUid || !chat.participants) return null;
// //     return chat.participants.find(p => p !== myUid) ?? null;
// //   }, [chat.participants, myUid]);

// //   const profileRef = useMemoFirebase(() => {
// //     if (!firestore || !otherUid) return null;
// //     return doc(firestore, 'users', otherUid);
// //   }, [firestore, otherUid]);

// //   const { data: profile } = useDoc<UserProfile>(profileRef);
// //   if (!profile) return '';
// //   return (
// //     [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim() ||
// //     profile.fullName || profile.displayName || profile.email || ''
// //   );
// // }

// // // ─── Route group ID ───────────────────────────────────────────────────────────
// // function routeChatId(origin: string, destination: string) {
// //   // نرتّب أبجدياً عشان نضمن نفس الـ id بصرف النظر عن الاتجاه
// //   const [a, b] = [origin, destination].map(s => s.toLowerCase().replace(/\s+/g, '_'));
// //   return `route_${a}_${b}`;
// // }

// // // ─── Route Chat Card (جروب المسار بين الناقلين) ──────────────────────────────
// // interface RouteChatCardProps {
// //   origin: string;
// //   destination: string;
// //   myUid: string;
// //   myName: string;
// //   onClick: (chatId: string) => void;
// // }

// // function RouteChatCard({ origin, destination, myUid, myName, onClick }: RouteChatCardProps) {
// //   const firestore = useFirestore();
// //   const chatId = routeChatId(origin, destination);
// //   const [loading, setLoading] = useState(false);

// //   const chatRef = useMemoFirebase(() => {
// //     if (!firestore) return null;
// //     return doc(firestore, 'chats', chatId);
// //   }, [firestore, chatId]);

// //   const { data: chatDoc } = useDoc<any>(chatRef);
// //   const unread = chatDoc?.unreadCounts?.[myUid] || 0;
// //   const lastMsg = chatDoc?.lastMessage || 'لم تبدأ المحادثة بعد';
// //   const lastTs = chatDoc?.lastMessageTimestamp;

// //   const handleClick = async () => {
// //     if (!firestore) return;
// //     setLoading(true);
// //     try {
// //       // أنشئ/حدّث الجروب لو مش موجود أو الناقل ده مش في الـ participants
// //       const snap = await getDoc(doc(firestore, 'chats', chatId));
// //       if (!snap.exists()) {
// //         await setDoc(doc(firestore, 'chats', chatId), {
// //           id: chatId,
// //           isGroupChat: true,
// //           isCarrierRouteGroup: true,
// //           routeOrigin: origin,
// //           routeDestination: destination,
// //           participants: [myUid],
// //           unreadCounts: { [myUid]: 0 },
// //           isClosed: false,
// //           lastMessage: `${myName} انضم لجروب المسار`,
// //           lastMessageSenderId: 'system',
// //           lastMessageTimestamp: serverTimestamp(),
// //         });
// //       } else {
// //         const data = snap.data();
// //         if (!data?.participants?.includes(myUid)) {
// //           await updateDoc(doc(firestore, 'chats', chatId), {
// //             participants: [...(data.participants || []), myUid],
// //             [`unreadCounts.${myUid}`]: 0,
// //             lastMessage: `${myName} انضم لجروب المسار`,
// //             lastMessageTimestamp: serverTimestamp(),
// //           });
// //         } else if (unread > 0) {
// //           await updateDoc(doc(firestore, 'chats', chatId), {
// //             [`unreadCounts.${myUid}`]: 0,
// //           });
// //         }
// //       }
// //       onClick(chatId);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Card
// //       className="cursor-pointer hover:bg-muted/50 transition-colors"
// //       onClick={handleClick}
// //     >
// //       <CardContent className="p-4 flex items-center gap-4">
// //         <Avatar className="h-12 w-12 border bg-primary/10">
// //           <AvatarFallback>
// //             <MapPin className="h-5 w-5 text-primary" />
// //           </AvatarFallback>
// //         </Avatar>
// //         <div className="flex-1 min-w-0">
// //           <div className="flex justify-between items-center gap-2">
// //             <p className="font-bold flex items-center gap-1 text-sm">
// //               {origin}
// //               <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
// //               {destination}
// //             </p>
// //             {unread > 0 && (
// //               <Badge variant="destructive" className="shrink-0">{unread}</Badge>
// //             )}
// //           </div>
// //           <p className="text-sm text-muted-foreground truncate">{lastMsg}</p>
// //         </div>
// //         <div className="text-xs text-muted-foreground self-start shrink-0">
// //           {safeFormatDistance(lastTs)}
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // }

// // // ─── ChatListItem ─────────────────────────────────────────────────────────────
// // const ChatListItem = ({ chat, onClick }: { chat: Chat; onClick: () => void }) => {
// //   const t = useTranslations('chatsPage');
// //   const { user } = useUser();
// //   const unreadCount = chat.unreadCounts?.[user?.uid || ''] || 0;
// //   const tabType = classifyChat(chat);
// //   const otherName = useOtherPartyName(chat, user?.uid);

// //   const title = (() => {
// //     if (tabType === 'group') return t('groupChat');
// //     if (tabType === 'archive') return chat.isGroupChat ? t('groupChat') : (otherName || t('privateChat'));
// //     if (tabType === 'carrier') return otherName || 'ناقل آخر';
// //     return otherName || t('privateChat');
// //   })();

// //   const avatarLetter = otherName?.charAt(0)?.toUpperCase() || null;

// //   return (
// //     <Card className={cn('cursor-pointer hover:bg-muted/50 transition-colors', chat.isClosed && 'opacity-70')} onClick={onClick}>
// //       <CardContent className="p-4 flex items-center gap-4">
// //         <Avatar className="h-12 w-12 border">
// //           <AvatarFallback className="font-bold text-sm">
// //             {tabType === 'group' ? <Users className="h-5 w-5" /> :
// //               tabType === 'archive' && chat.isGroupChat ? <Archive className="h-5 w-5" /> :
// //                 avatarLetter ? avatarLetter :
// //                   tabType === 'carrier' ? <ArrowLeftRight className="h-5 w-5" /> :
// //                     <User className="h-5 w-5" />}
// //           </AvatarFallback>
// //         </Avatar>
// //         <div className="flex-1 min-w-0">
// //           <div className="flex justify-between items-center gap-2">
// //             <p className="font-bold truncate">{title}</p>
// //             {unreadCount > 0 && <Badge variant="destructive" className="shrink-0">{unreadCount}</Badge>}
// //           </div>
// //           <p className="text-sm text-muted-foreground truncate">
// //             {chat.lastMessage || t('noMessages')}
// //           </p>
// //         </div>
// //         <div className="text-xs text-muted-foreground self-start shrink-0">
// //           {safeFormatDistance(chat.lastMessageTimestamp)}
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // // ─── Empty state ──────────────────────────────────────────────────────────────
// // function EmptyState({ label }: { label: string }) {
// //   return (
// //     <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
// //       <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
// //       <p className="font-bold">لا توجد {label}</p>
// //       <p className="text-sm mt-1">ستظهر هنا عند وجودها</p>
// //     </div>
// //   );
// // }

// // // ─── Page ─────────────────────────────────────────────────────────────────────
// // export default function CarrierChatsPage() {
// //   const t = useTranslations('chatsPage');
// //   const { user, isUserLoading } = useUser();
// //   const firestore = useFirestore();
// //   const router = useRouter();

// //   const [activeTab, setActiveTab] = useState<TabKey>('group');
// //   const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
// //   const [selectedRouteChatId, setSelectedRouteChatId] = useState<string | null>(null);
// //   const [isChatOpen, setIsChatOpen] = useState(false);

// //   // ── كل الـ chats بتاعت الناقل ──
// //   const chatsQuery = useMemoFirebase(() => {
// //     if (!firestore || !user) return null;
// //     return query(
// //       collection(firestore, 'chats'),
// //       where('participants', 'array-contains', user.uid),
// //       orderBy('lastMessageTimestamp', 'desc'),
// //       orderBy('__name__', 'desc'),
// //     );
// //   }, [firestore, user]);

// //   const { data: chats, isLoading: isLoadingChats } = useCollection<Chat>(chatsQuery);

// //   // ── رحلات الناقل النشطة (للمسارات) ──
// //   const myTripsQuery = useMemoFirebase(() => {
// //     if (!firestore || !user?.uid) return null;
// //     return query(
// //       collection(firestore, 'trips'),
// //       where('carrierId', '==', user.uid),
// //       where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation']),
// //     );
// //   }, [firestore, user]);

// //   const { data: myTrips, isLoading: isLoadingTrips } = useCollection<Trip>(myTripsQuery);

// //   const isLoading = isUserLoading || isLoadingChats || isLoadingTrips;

// //   useEffect(() => {
// //     if (!isLoading && !user) router.push('/login');
// //   }, [user, isLoading, router]);

// //   // ── استخراج المسارات الفريدة من رحلاتي ──
// //   const myRoutes = useMemo(() => {
// //     if (!myTrips) return [];
// //     const seen = new Set<string>();
// //     const result: { origin: string; destination: string }[] = [];
// //     for (const t of myTrips) {
// //       const key = `${t.origin}__${t.destination}`;
// //       if (!seen.has(key)) {
// //         seen.add(key);
// //         result.push({ origin: t.origin, destination: t.destination });
// //       }
// //     }
// //     return result;
// //   }, [myTrips]);

// //   // ── فرز الرسائل ──
// //   const tabChats = useMemo<Record<TabKey, Chat[]>>(() => {
// //     if (!chats) return { group: [], private: [], carrier: [], archive: [] };
// //     const result: Record<TabKey, Chat[]> = { group: [], private: [], carrier: [], archive: [] };
// //     for (const chat of chats) result[classifyChat(chat)].push(chat);
// //     return result;
// //   }, [chats]);

// //   // ── unread لكل تاب ──
// //   const unreadPerTab = useMemo<Record<TabKey, number>>(() => {
// //     if (!chats || !user) return { group: 0, private: 0, carrier: 0, archive: 0 };
// //     const result: Record<TabKey, number> = { group: 0, private: 0, carrier: 0, archive: 0 };
// //     for (const chat of chats) result[classifyChat(chat)] += chat.unreadCounts?.[user.uid] || 0;
// //     return result;
// //   }, [chats, user]);

// //   const tabs: TabDef[] = [
// //     { key: 'group', label: 'المجموعات', icon: <Users className="h-4 w-4" /> },
// //     { key: 'private', label: 'الخاصة', icon: <User className="h-4 w-4" /> },
// //     { key: 'carrier', label: 'بين الناقلين', icon: <ArrowLeftRight className="h-4 w-4" /> },
// //     { key: 'archive', label: 'الأرشيف', icon: <Archive className="h-4 w-4" /> },
// //   ];

// //   const handleChatClick = (chat: Chat) => {
// //     if (firestore && user && (chat.unreadCounts?.[user.uid] ?? 0) > 0) {
// //       updateDoc(doc(firestore, 'chats', chat.id), { [`unreadCounts.${user.uid}`]: 0 });
// //     }
// //     setSelectedChat(chat);
// //     setSelectedRouteChatId(null);
// //     setIsChatOpen(true);
// //   };

// //   const handleRouteChatOpen = (chatId: string) => {
// //     setSelectedRouteChatId(chatId);
// //     setSelectedChat(null);
// //     setIsChatOpen(true);
// //   };

// //   // اسم الناقل
// //   const myName = useMemo(() => {
// //     // سنجيبه من الـ profile لو احتجناه — fallback بسيط
// //     return user?.displayName || user?.email?.split('@')[0] || 'ناقل';
// //   }, [user]);

// //   const currentChats = tabChats[activeTab];

// //   return (
// //     <>
// //       <div className="container mx-auto max-w-3xl p-4 space-y-4 pt-6">
// //         {/* Header */}
// //         <Card className="bg-card border-primary/50">
// //           <CardHeader>
// //             <h1 className="text-2xl font-bold">{t('headerTitle')}</h1>
// //             <p className="text-muted-foreground">{t('headerDescription')}</p>
// //           </CardHeader>
// //         </Card>

// //         {/* Tabs */}
// //         <div className="grid grid-cols-4 gap-1 rounded-xl bg-muted/50 border p-1">
// //           {tabs.map(tab => (
// //             <button
// //               key={tab.key}
// //               onClick={() => setActiveTab(tab.key)}
// //               className={cn(
// //                 'relative flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-[11px] font-bold transition-all',
// //                 activeTab === tab.key
// //                   ? 'bg-background text-primary shadow-sm'
// //                   : 'text-muted-foreground hover:text-foreground',
// //               )}
// //             >
// //               {tab.icon}
// //               <span className="leading-tight text-center">{tab.label}</span>
// //               {unreadPerTab[tab.key] > 0 && (
// //                 <span className="absolute top-1 end-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-black flex items-center justify-center">
// //                   {unreadPerTab[tab.key] > 9 ? '9+' : unreadPerTab[tab.key]}
// //                 </span>
// //               )}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Content */}
// //         {isLoading ? (
// //           <div className="space-y-3">
// //             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
// //           </div>
// //         ) : activeTab === 'carrier' ? (
// //           // ── تاب "بين الناقلين": جروب لكل مسار ──
// //           myRoutes.length === 0 ? (
// //             <EmptyState label="مسارات نشطة — أنشئ رحلة أولاً لتظهر جروبات المسارات" />
// //           ) : (
// //             <div className="space-y-3">
// //               <p className="text-xs text-muted-foreground px-1">
// //                 جروب منفصل لكل مسار تعمل عليه — بيضم كل الناقلين في نفس الخط
// //               </p>
// //               {myRoutes.map(route => (
// //                 <RouteChatCard
// //                   key={`${route.origin}__${route.destination}`}
// //                   origin={route.origin}
// //                   destination={route.destination}
// //                   myUid={user!.uid}
// //                   myName={myName}
// //                   onClick={handleRouteChatOpen}
// //                 />
// //               ))}
// //             </div>
// //           )
// //         ) : currentChats.length === 0 ? (
// //           <EmptyState label={tabs.find(tb => tb.key === activeTab)?.label ?? 'رسائل'} />
// //         ) : (
// //           <div className="space-y-3">
// //             {currentChats.map(chat => (
// //               <ChatListItem key={chat.id} chat={chat} onClick={() => handleChatClick(chat)} />
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* Chat Dialog — جروب مسار */}
// //       {selectedRouteChatId && (
// //         <ChatDialog
// //           isOpen={isChatOpen}
// //           onOpenChange={(open) => { setIsChatOpen(open); if (!open) setSelectedRouteChatId(null); }}
// //           trip={{ id: selectedRouteChatId } as Trip}
// //           chatType="group"
// //         />
// //       )}

// //       {/* Chat Dialog — باقي الرسائل */}
// //       {selectedChat && (
// //         <ChatDialog
// //           isOpen={isChatOpen}
// //           onOpenChange={(open) => { setIsChatOpen(open); if (!open) setSelectedChat(null); }}
// //           trip={selectedChat.isGroupChat ? { id: selectedChat.id } as Trip : undefined}
// //           bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
// //           otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
// //           chatType={selectedChat.isGroupChat ? 'group' : 'private'}
// //         />
// //       )}
// //     </>
// //   );
// // }
// 'use client';

// /**
//  * @file src/app/[locale]/carrier/chats/page.tsx
//  * @description مركز اتصالات الناقل — 4 تابات:
//  *   1. المجموعات   → دردشة الناقل مع مسافرين نفس الرحلة (isGroupChat=true, chatType=group)
//  *   2. الخاصة      → محادثة 1:1 بين الناقل ومسافر واحد (isGroupChat=false, chatType=private)
//  *   3. بين الناقلين → جروب مسار تلقائي (isCarrierRouteGroup=true)
//  *   4. الأرشيف     → كل المحادثات المغلقة — تُحذف تلقائياً بعد 10 أيام من archivedAt
//  *
//  * قواعد دورة حياة المحادثات:
//  *  - لما الرحلة تنتهي (status = Completed | Cancelled):
//  *      → isClosed = true
//  *      → archivedAt = serverTimestamp()
//  *      → تنتقل للأرشيف وتختفي من تابها الأصلي
//  *  - بعد 10 أيام من archivedAt → تُحذف من Firestore (عبر Cloud Function أو cron)
//  */

// import { useState, useEffect, useMemo } from 'react';
// import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
// import {
//   collection, query, where, orderBy, doc, updateDoc,
//   setDoc, serverTimestamp, getDoc, Timestamp,
// } from 'firebase/firestore';
// import type { Chat, Trip, UserProfile } from '@/lib/data';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { formatDistanceToNow } from 'date-fns';
// import { arSA } from 'date-fns/locale';
// import {
//   MessageSquare, Users, User, Archive, ArrowLeftRight, MapPin, ArrowRight,
// } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { ChatDialog } from '@/components/chat/chat-dialog';
// import { useRouter } from 'next/navigation';
// import { useTranslations } from 'next-intl';
// import { cn } from '@/lib/utils';

// // ─── Types ────────────────────────────────────────────────────────────────────
// type TabKey = 'group' | 'private' | 'carrier' | 'archive';
// interface TabDef { key: TabKey; label: string; icon: React.ReactNode; }

// // ─── Classifier ───────────────────────────────────────────────────────────────
// /**
//  * يصنّف كل محادثة لتابها الصحيح:
//  *  - isClosed=true  → archive (بصرف النظر عن نوعها)
//  *  - isCarrierRouteGroup → carrier  (لكن دي بتتعامل بشكل مختلف كـ RouteChatCard)
//  *  - isGroupChat=true → group      (دردشة الناقل مع مسافري الرحلة)
//  *  - غير كده         → private     (محادثة خاصة مع مسافر واحد)
//  */
// function classifyChat(chat: Chat): TabKey {
//   if (chat.isClosed) return 'archive';
//   if (chat.isCarrierRouteGroup) return 'carrier';
//   if (chat.isGroupChat) return 'group';
//   return 'private';
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function safeFormatDistance(ts: any): string {
//   if (!ts) return '';
//   try {
//     const d = ts?.toDate ? ts.toDate() : new Date(ts);
//     return formatDistanceToNow(d, { addSuffix: true, locale: arSA });
//   } catch { return ''; }
// }

// /** جلب اسم الطرف الثاني من المحادثات الخاصة */
// function useOtherPartyName(chat: Chat, myUid?: string): string {
//   const firestore = useFirestore();
//   const otherUid = useMemo(() => {
//     if (!myUid || !chat.participants) return null;
//     return chat.participants.find(p => p !== myUid) ?? null;
//   }, [chat.participants, myUid]);

//   const profileRef = useMemoFirebase(() => {
//     if (!firestore || !otherUid) return null;
//     return doc(firestore, 'users', otherUid);
//   }, [firestore, otherUid]);

//   const { data: profile } = useDoc<UserProfile>(profileRef);
//   if (!profile) return '';
//   return (
//     [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim() ||
//     profile.fullName || profile.displayName || profile.email || ''
//   );
// }

// // ─── Route Chat ID (ثابت بصرف النظر عن الاتجاه) ─────────────────────────────
// function routeChatId(origin: string, destination: string): string {
//   const [a, b] = [origin, destination].map(s => s.toLowerCase().replace(/\s+/g, '_'));
//   return `route_${a}_${b}`;
// }

// // ─── RouteChatCard (جروب المسار بين الناقلين) ─────────────────────────────────
// interface RouteChatCardProps {
//   origin: string;
//   destination: string;
//   myUid: string;
//   myName: string;
//   onClick: (chatId: string) => void;
// }

// function RouteChatCard({ origin, destination, myUid, myName, onClick }: RouteChatCardProps) {
//   const firestore = useFirestore();
//   const chatId = routeChatId(origin, destination);
//   const [loading, setLoading] = useState(false);

//   const chatRef = useMemoFirebase(() => {
//     if (!firestore) return null;
//     return doc(firestore, 'chats', chatId);
//   }, [firestore, chatId]);

//   const { data: chatDoc } = useDoc<any>(chatRef);
//   const unread = chatDoc?.unreadCounts?.[myUid] || 0;
//   const lastMsg = chatDoc?.lastMessage || 'لم تبدأ المحادثة بعد';
//   const lastTs = chatDoc?.lastMessageTimestamp;

//   const handleClick = async () => {
//     if (!firestore || loading) return;
//     setLoading(true);
//     try {
//       const snap = await getDoc(doc(firestore, 'chats', chatId));
//       if (!snap.exists()) {
//         // أنشئ الجروب لأول مرة
//         await setDoc(doc(firestore, 'chats', chatId), {
//           id: chatId,
//           isGroupChat: true,
//           isCarrierRouteGroup: true,
//           chatType: 'carrier_route',
//           routeOrigin: origin,
//           routeDestination: destination,
//           participants: [myUid],
//           unreadCounts: { [myUid]: 0 },
//           isClosed: false,
//           lastMessage: `${myName} انضم لجروب المسار`,
//           lastMessageSenderId: 'system',
//           lastMessageTimestamp: serverTimestamp(),
//         });
//       } else {
//         const data = snap.data();
//         if (!data?.participants?.includes(myUid)) {
//           // أضف الناقل للمشاركين
//           await updateDoc(doc(firestore, 'chats', chatId), {
//             participants: [...(data.participants || []), myUid],
//             [`unreadCounts.${myUid}`]: 0,
//             lastMessage: `${myName} انضم لجروب المسار`,
//             lastMessageTimestamp: serverTimestamp(),
//           });
//         } else if (unread > 0) {
//           // صفّر العداد بس
//           await updateDoc(doc(firestore, 'chats', chatId), {
//             [`unreadCounts.${myUid}`]: 0,
//           });
//         }
//       }
//       onClick(chatId);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card
//       className={cn('cursor-pointer hover:bg-muted/50 transition-colors', loading && 'opacity-60 pointer-events-none')}
//       onClick={handleClick}
//     >
//       <CardContent className="p-4 flex items-center gap-4">
//         <Avatar className="h-12 w-12 border bg-primary/10">
//           <AvatarFallback>
//             <MapPin className="h-5 w-5 text-primary" />
//           </AvatarFallback>
//         </Avatar>
//         <div className="flex-1 min-w-0">
//           <div className="flex justify-between items-center gap-2">
//             <p className="font-bold flex items-center gap-1 text-sm">
//               {origin}
//               <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
//               {destination}
//             </p>
//             {unread > 0 && (
//               <Badge variant="destructive" className="shrink-0">{unread}</Badge>
//             )}
//           </div>
//           <p className="text-sm text-muted-foreground truncate">{lastMsg}</p>
//         </div>
//         <div className="text-xs text-muted-foreground self-start shrink-0">
//           {safeFormatDistance(lastTs)}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // ─── ChatListItem ─────────────────────────────────────────────────────────────
// const ChatListItem = ({ chat, onClick }: { chat: Chat; onClick: () => void }) => {
//   const t = useTranslations('chatsPage');
//   const { user } = useUser();
//   const unreadCount = chat.unreadCounts?.[user?.uid || ''] || 0;
//   const tabType = classifyChat(chat);
//   const otherName = useOtherPartyName(chat, user?.uid);

//   const title = (() => {
//     if (tabType === 'group') return t('groupChat');
//     if (tabType === 'archive') {
//       if (chat.isCarrierRouteGroup) return `${chat.routeOrigin} → ${chat.routeDestination}`;
//       return chat.isGroupChat ? t('groupChat') : (otherName || t('privateChat'));
//     }
//     if (tabType === 'carrier') return `${chat.routeOrigin} → ${chat.routeDestination}`;
//     return otherName || t('privateChat');
//   })();

//   const avatarLetter = otherName?.charAt(0)?.toUpperCase() || null;

//   return (
//     <Card
//       className={cn('cursor-pointer hover:bg-muted/50 transition-colors', chat.isClosed && 'opacity-70')}
//       onClick={onClick}
//     >
//       <CardContent className="p-4 flex items-center gap-4">
//         <Avatar className="h-12 w-12 border">
//           <AvatarFallback className="font-bold text-sm">
//             {tabType === 'group' ? <Users className="h-5 w-5" /> :
//               tabType === 'archive' ? <Archive className="h-5 w-5" /> :
//                 tabType === 'carrier' ? <ArrowLeftRight className="h-5 w-5" /> :
//                   avatarLetter ? avatarLetter :
//                     <User className="h-5 w-5" />}
//           </AvatarFallback>
//         </Avatar>
//         <div className="flex-1 min-w-0">
//           <div className="flex justify-between items-center gap-2">
//             <p className="font-bold truncate">{title}</p>
//             {unreadCount > 0 && (
//               <Badge variant="destructive" className="shrink-0">{unreadCount}</Badge>
//             )}
//           </div>
//           <p className="text-sm text-muted-foreground truncate">
//             {chat.lastMessage || t('noMessages')}
//           </p>
//           {/* عرض كم باقي للحذف في الأرشيف */}
//           {tabType === 'archive' && chat.archivedAt && (
//             <p className="text-[11px] text-destructive/70 mt-0.5">
//               {(() => {
//                 try {
//                   const archived = chat.archivedAt?.toDate ? chat.archivedAt.toDate() : new Date(chat.archivedAt);
//                   const deleteAt = new Date(archived.getTime() + 10 * 24 * 60 * 60 * 1000);
//                   const now = new Date();
//                   const daysLeft = Math.ceil((deleteAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
//                   if (daysLeft <= 0) return 'ستُحذف قريباً';
//                   return `تُحذف بعد ${daysLeft} ${daysLeft === 1 ? 'يوم' : 'أيام'}`;
//                 } catch { return ''; }
//               })()}
//             </p>
//           )}
//         </div>
//         <div className="text-xs text-muted-foreground self-start shrink-0">
//           {safeFormatDistance(chat.lastMessageTimestamp)}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// // ─── Empty state ──────────────────────────────────────────────────────────────
// function EmptyState({ label, description }: { label: string; description?: string }) {
//   return (
//     <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
//       <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
//       <p className="font-bold">لا توجد {label}</p>
//       <p className="text-sm mt-1">{description || 'ستظهر هنا عند وجودها'}</p>
//     </div>
//   );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────
// export default function CarrierChatsPage() {
//   const t = useTranslations('chatsPage');
//   const { user, isUserLoading } = useUser();
//   const firestore = useFirestore();
//   const router = useRouter();

//   const [activeTab, setActiveTab] = useState<TabKey>('group');
//   const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
//   const [selectedRouteChatId, setSelectedRouteChatId] = useState<string | null>(null);
//   const [isChatOpen, setIsChatOpen] = useState(false);

//   // ── كل الـ chats بتاعت الناقل ──
//   const chatsQuery = useMemoFirebase(() => {
//     if (!firestore || !user) return null;
//     return query(
//       collection(firestore, 'chats'),
//       where('participants', 'array-contains', user.uid),
//       orderBy('lastMessageTimestamp', 'desc'),
//       orderBy('__name__', 'desc'),
//     );
//   }, [firestore, user]);

//   const { data: chats, isLoading: isLoadingChats } = useCollection<Chat>(chatsQuery);

//   // ── رحلات الناقل النشطة (عشان تبان جروبات المسارات) ──
//   const myTripsQuery = useMemoFirebase(() => {
//     if (!firestore || !user?.uid) return null;
//     return query(
//       collection(firestore, 'trips'),
//       where('carrierId', '==', user.uid),
//       where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation']),
//     );
//   }, [firestore, user]);

//   const { data: myTrips, isLoading: isLoadingTrips } = useCollection<Trip>(myTripsQuery);
//   const isLoading = isUserLoading || isLoadingChats || isLoadingTrips;

//   useEffect(() => {
//     if (!isLoading && !user) router.push('/login');
//   }, [user, isLoading, router]);

//   // ── المسارات الفريدة من رحلاتي النشطة ──
//   const myRoutes = useMemo(() => {
//     if (!myTrips) return [];
//     const seen = new Set<string>();
//     const result: { origin: string; destination: string }[] = [];
//     for (const trip of myTrips) {
//       const key = `${trip.origin}__${trip.destination}`;
//       if (!seen.has(key) && trip.origin && trip.destination) {
//         seen.add(key);
//         result.push({ origin: trip.origin, destination: trip.destination });
//       }
//     }
//     return result;
//   }, [myTrips]);

//   // ── فرز المحادثات في التابات ──
//   const tabChats = useMemo<Record<TabKey, Chat[]>>(() => {
//     if (!chats) return { group: [], private: [], carrier: [], archive: [] };
//     const result: Record<TabKey, Chat[]> = { group: [], private: [], carrier: [], archive: [] };
//     for (const chat of chats) {
//       // الـ carrier route groups بتظهر كـ RouteChatCard مش ChatListItem
//       // لكن لو اتأرشفت تظهر في الأرشيف كـ ChatListItem عادي
//       const tab = classifyChat(chat);
//       if (tab !== 'carrier') {
//         result[tab].push(chat);
//       }
//       // الـ carrier route groups النشطة بتتعامل بشكل مستقل عبر myRoutes
//     }
//     return result;
//   }, [chats]);

//   // ── عداد الرسائل غير المقروءة لكل تاب ──
//   const unreadPerTab = useMemo<Record<TabKey, number>>(() => {
//     if (!chats || !user) return { group: 0, private: 0, carrier: 0, archive: 0 };
//     const result: Record<TabKey, number> = { group: 0, private: 0, carrier: 0, archive: 0 };
//     for (const chat of chats) {
//       const tab = classifyChat(chat);
//       result[tab] += chat.unreadCounts?.[user.uid] || 0;
//     }
//     return result;
//   }, [chats, user]);

//   const tabs: TabDef[] = [
//     { key: 'group', label: 'المجموعات', icon: <Users className="h-4 w-4" /> },
//     { key: 'private', label: 'الخاصة', icon: <User className="h-4 w-4" /> },
//     { key: 'carrier', label: 'بين الناقلين', icon: <ArrowLeftRight className="h-4 w-4" /> },
//     { key: 'archive', label: 'الأرشيف', icon: <Archive className="h-4 w-4" /> },
//   ];

//   const handleChatClick = (chat: Chat) => {
//     // صفّر عداد القراءة
//     if (firestore && user && (chat.unreadCounts?.[user.uid] ?? 0) > 0) {
//       updateDoc(doc(firestore, 'chats', chat.id), {
//         [`unreadCounts.${user.uid}`]: 0,
//       });
//     }
//     setSelectedChat(chat);
//     setSelectedRouteChatId(null);
//     setIsChatOpen(true);
//   };

//   const handleRouteChatOpen = (chatId: string) => {
//     setSelectedRouteChatId(chatId);
//     setSelectedChat(null);
//     setIsChatOpen(true);
//   };

//   const myName = useMemo(
//     () => user?.displayName || user?.email?.split('@')[0] || 'ناقل',
//     [user],
//   );

//   const currentChats = tabChats[activeTab];

//   return (
//     <>
//       <div className="container mx-auto max-w-3xl p-4 space-y-4 pt-6">
//         {/* Header */}
//         <Card className="bg-card border-primary/50">
//           <CardHeader>
//             <h1 className="text-2xl font-bold">{t('headerTitle')}</h1>
//             <p className="text-muted-foreground">{t('headerDescription')}</p>
//           </CardHeader>
//         </Card>

//         {/* Tabs */}
//         <div className="grid grid-cols-4 gap-1 rounded-xl bg-muted/50 border p-1">
//           {tabs.map(tab => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className={cn(
//                 'relative flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-[11px] font-bold transition-all',
//                 activeTab === tab.key
//                   ? 'bg-background text-primary shadow-sm'
//                   : 'text-muted-foreground hover:text-foreground',
//               )}
//             >
//               {tab.icon}
//               <span className="leading-tight text-center">{tab.label}</span>
//               {unreadPerTab[tab.key] > 0 && (
//                 <span className="absolute top-1 end-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-black flex items-center justify-center">
//                   {unreadPerTab[tab.key] > 9 ? '9+' : unreadPerTab[tab.key]}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         {isLoading ? (
//           <div className="space-y-3">
//             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
//           </div>

//         ) : activeTab === 'carrier' ? (
//           // ── تاب "بين الناقلين": جروب لكل مسار نشط ──
//           myRoutes.length === 0 ? (
//             <EmptyState
//               label="مسارات نشطة"
//               description="أنشئ رحلة أولاً لتظهر جروبات التواصل مع الناقلين على نفس المسار"
//             />
//           ) : (
//             <div className="space-y-3">
//               <p className="text-xs text-muted-foreground px-1">
//                 جروب منفصل لكل مسار تعمل عليه — يضم كل الناقلين على نفس الخط
//               </p>
//               {myRoutes.map(route => (
//                 <RouteChatCard
//                   key={`${route.origin}__${route.destination}`}
//                   origin={route.origin}
//                   destination={route.destination}
//                   myUid={user!.uid}
//                   myName={myName}
//                   onClick={handleRouteChatOpen}
//                 />
//               ))}
//             </div>
//           )

//         ) : activeTab === 'archive' ? (
//           // ── تاب الأرشيف ──
//           currentChats.length === 0 ? (
//             <EmptyState
//               label="محادثات مؤرشفة"
//               description="المحادثات المنتهية تظهر هنا وتُحذف تلقائياً بعد 10 أيام"
//             />
//           ) : (
//             <div className="space-y-3">
//               <p className="text-xs text-muted-foreground px-1">
//                 المحادثات المنتهية — تُحذف تلقائياً بعد 10 أيام من انتهاء الرحلة
//               </p>
//               {currentChats.map(chat => (
//                 <ChatListItem key={chat.id} chat={chat} onClick={() => handleChatClick(chat)} />
//               ))}
//             </div>
//           )

//         ) : currentChats.length === 0 ? (
//           <EmptyState label={tabs.find(tb => tb.key === activeTab)?.label ?? 'رسائل'} />
//         ) : (
//           <div className="space-y-3">
//             {currentChats.map(chat => (
//               <ChatListItem key={chat.id} chat={chat} onClick={() => handleChatClick(chat)} />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Chat Dialog — جروب المسار بين الناقلين */}
//       {selectedRouteChatId && (
//         <ChatDialog
//           isOpen={isChatOpen}
//           onOpenChange={(open) => { setIsChatOpen(open); if (!open) setSelectedRouteChatId(null); }}
//           trip={{ id: selectedRouteChatId } as Trip}
//           chatType="group"
//         />
//       )}

//       {/* Chat Dialog — المجموعات والخاصة والأرشيف */}
//       {selectedChat && (
//         <ChatDialog
//           isOpen={isChatOpen}
//           onOpenChange={(open) => { setIsChatOpen(open); if (!open) setSelectedChat(null); }}
//           trip={selectedChat.isGroupChat ? { id: selectedChat.id } as Trip : undefined}
//           bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
//           otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
//           chatType={selectedChat.isGroupChat ? 'group' : 'private'}
//         />
//       )}
//     </>
//   );
// }

'use client';

/**
 * @file src/app/[locale]/carrier/chats/page.tsx
 * @description مركز اتصالات الناقل — 4 تابات:
 *   1. المجموعات   → دردشة الناقل مع مسافرين نفس الرحلة (isGroupChat=true, chatType=group)
 *   2. الخاصة      → محادثة 1:1 بين الناقل ومسافر واحد (isGroupChat=false, chatType=private)
 *   3. بين الناقلين → جروب مسار تلقائي (isCarrierRouteGroup=true)
 *   4. الأرشيف     → كل المحادثات المغلقة — تُحذف تلقائياً بعد 10 أيام من archivedAt
 *
 * قواعد دورة حياة المحادثات:
 *  - لما الرحلة تنتهي (status = Completed | Cancelled):
 *      → isClosed = true
 *      → archivedAt = serverTimestamp()
 *      → تنتقل للأرشيف وتختفي من تابها الأصلي
 *  - بعد 10 أيام من archivedAt → تُحذف من Firestore (عبر Cloud Function أو cron)
 */

import { useState, useEffect, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import {
  collection, query, where, orderBy, doc, updateDoc,
  setDoc, serverTimestamp, getDoc, Timestamp,
} from 'firebase/firestore';
import type { Chat, Trip, UserProfile } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import {
  MessageSquare, Users, User, Archive, ArrowLeftRight, MapPin, ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ChatDialog } from '@/components/chat/chat-dialog';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
type TabKey = 'group' | 'private' | 'carrier' | 'archive';
interface TabDef { key: TabKey; label: string; icon: React.ReactNode; }

// ─── Classifier ───────────────────────────────────────────────────────────────
/**
 * يصنّف كل محادثة لتابها الصحيح:
 *  - isClosed=true  → archive (بصرف النظر عن نوعها)
 *  - isCarrierRouteGroup → carrier  (لكن دي بتتعامل بشكل مختلف كـ RouteChatCard)
 *  - isGroupChat=true → group      (دردشة الناقل مع مسافري الرحلة)
 *  - غير كده         → private     (محادثة خاصة مع مسافر واحد)
 */
function classifyChat(chat: Chat): TabKey {
  // [FIX] بعض شاتات "بين الناقلين" القديمة (قبل إضافة isCarrierRouteGroup)
  // مفيهاش الفلاج ده، فكانت بتتصنّف غلط كـ 'group' وتظهر في تاب "المجموعات".
  // هنا بنتأكد كمان من chatType ومن وجود routeOrigin/routeDestination كـ fallback.
  const isRouteChat =
    chat.isCarrierRouteGroup ||
    chat.chatType === 'carrier_route' ||
    !!(chat.routeOrigin && chat.routeDestination);

  if (chat.isClosed) return 'archive';
  if (isRouteChat) return 'carrier';
  if (chat.isGroupChat) return 'group';
  return 'private';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function safeFormatDistance(ts: any): string {
  if (!ts) return '';
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return formatDistanceToNow(d, { addSuffix: true, locale: arSA });
  } catch { return ''; }
}

/** جلب اسم الطرف الثاني من المحادثات الخاصة */
function useOtherPartyName(chat: Chat, myUid?: string): string {
  const firestore = useFirestore();
  const otherUid = useMemo(() => {
    if (!myUid || !chat.participants) return null;
    return chat.participants.find(p => p !== myUid) ?? null;
  }, [chat.participants, myUid]);

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !otherUid) return null;
    return doc(firestore, 'users', otherUid);
  }, [firestore, otherUid]);

  const { data: profile } = useDoc<UserProfile>(profileRef);
  if (!profile) return '';
  return (
    [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim() ||
    profile.fullName || profile.displayName || profile.email || ''
  );
}

// ─── Route Chat ID (ثابت بصرف النظر عن الاتجاه) ─────────────────────────────
function routeChatId(origin: string, destination: string): string {
  const [a, b] = [origin, destination].map(s => s.toLowerCase().replace(/\s+/g, '_'));
  return `route_${a}_${b}`;
}

// ─── RouteChatCard (جروب المسار بين الناقلين) ─────────────────────────────────
interface RouteChatCardProps {
  origin: string;
  destination: string;
  myUid: string;
  myName: string;
  onClick: (chatId: string) => void;
}

function RouteChatCard({ origin, destination, myUid, myName, onClick }: RouteChatCardProps) {
  const firestore = useFirestore();
  const chatId = routeChatId(origin, destination);
  const [loading, setLoading] = useState(false);

  const chatRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'chats', chatId);
  }, [firestore, chatId]);

  const { data: chatDoc } = useDoc<any>(chatRef);
  const unread = chatDoc?.unreadCounts?.[myUid] || 0;
  const lastMsg = chatDoc?.lastMessage || 'لم تبدأ المحادثة بعد';
  const lastTs = chatDoc?.lastMessageTimestamp;

  const handleClick = async () => {
    if (!firestore || loading) return;
    setLoading(true);
    try {
      const snap = await getDoc(doc(firestore, 'chats', chatId));
      if (!snap.exists()) {
        // أنشئ الجروب لأول مرة
        await setDoc(doc(firestore, 'chats', chatId), {
          id: chatId,
          isGroupChat: true,
          isCarrierRouteGroup: true,
          chatType: 'carrier_route',
          routeOrigin: origin,
          routeDestination: destination,
          participants: [myUid],
          unreadCounts: { [myUid]: 0 },
          isClosed: false,
          lastMessage: `${myName} انضم لجروب المسار`,
          lastMessageSenderId: 'system',
          lastMessageTimestamp: serverTimestamp(),
        });
      } else {
        const data = snap.data();
        if (!data?.participants?.includes(myUid)) {
          // أضف الناقل للمشاركين
          await updateDoc(doc(firestore, 'chats', chatId), {
            participants: [...(data.participants || []), myUid],
            [`unreadCounts.${myUid}`]: 0,
            lastMessage: `${myName} انضم لجروب المسار`,
            lastMessageTimestamp: serverTimestamp(),
          });
        } else if (unread > 0) {
          // صفّر العداد بس
          await updateDoc(doc(firestore, 'chats', chatId), {
            [`unreadCounts.${myUid}`]: 0,
          });
        }
      }
      onClick(chatId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={cn('cursor-pointer hover:bg-muted/50 transition-colors', loading && 'opacity-60 pointer-events-none')}
      onClick={handleClick}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar className="h-12 w-12 border bg-primary/10">
          <AvatarFallback>
            <MapPin className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center gap-2">
            <p className="font-bold flex items-center gap-1 text-sm">
              {origin}
              <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
              {destination}
            </p>
            {unread > 0 && (
              <Badge variant="destructive" className="shrink-0">{unread}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{lastMsg}</p>
        </div>
        <div className="text-xs text-muted-foreground self-start shrink-0">
          {safeFormatDistance(lastTs)}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── ChatListItem ─────────────────────────────────────────────────────────────
const ChatListItem = ({ chat, onClick }: { chat: Chat; onClick: () => void }) => {
  const t = useTranslations('chatsPage');
  const { user } = useUser();
  const unreadCount = chat.unreadCounts?.[user?.uid || ''] || 0;
  const tabType = classifyChat(chat);
  const otherName = useOtherPartyName(chat, user?.uid);

  const title = (() => {
    if (tabType === 'group') return t('groupChat');
    if (tabType === 'archive') {
      if (chat.isCarrierRouteGroup) return `${chat.routeOrigin} → ${chat.routeDestination}`;
      return chat.isGroupChat ? t('groupChat') : (otherName || t('privateChat'));
    }
    if (tabType === 'carrier') return `${chat.routeOrigin} → ${chat.routeDestination}`;
    return otherName || t('privateChat');
  })();

  const avatarLetter = otherName?.charAt(0)?.toUpperCase() || null;

  return (
    <Card
      className={cn('cursor-pointer hover:bg-muted/50 transition-colors', chat.isClosed && 'opacity-70')}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar className="h-12 w-12 border">
          <AvatarFallback className="font-bold text-sm">
            {tabType === 'group' ? <Users className="h-5 w-5" /> :
              tabType === 'archive' ? <Archive className="h-5 w-5" /> :
                tabType === 'carrier' ? <ArrowLeftRight className="h-5 w-5" /> :
                  avatarLetter ? avatarLetter :
                    <User className="h-5 w-5" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center gap-2">
            <p className="font-bold truncate">{title}</p>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="shrink-0">{unreadCount}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {chat.lastMessage || t('noMessages')}
          </p>
          {/* عرض كم باقي للحذف في الأرشيف */}
          {tabType === 'archive' && chat.archivedAt && (
            <p className="text-[11px] text-destructive/70 mt-0.5">
              {(() => {
                try {
                  const archived = chat.archivedAt?.toDate ? chat.archivedAt.toDate() : new Date(chat.archivedAt);
                  const deleteAt = new Date(archived.getTime() + 10 * 24 * 60 * 60 * 1000);
                  const now = new Date();
                  const daysLeft = Math.ceil((deleteAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  if (daysLeft <= 0) return 'ستُحذف قريباً';
                  return `تُحذف بعد ${daysLeft} ${daysLeft === 1 ? 'يوم' : 'أيام'}`;
                } catch { return ''; }
              })()}
            </p>
          )}
        </div>
        <div className="text-xs text-muted-foreground self-start shrink-0">
          {safeFormatDistance(chat.lastMessageTimestamp)}
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ label, description }: { label: string; description?: string }) {
  return (
    <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
      <p className="font-bold">لا توجد {label}</p>
      <p className="text-sm mt-1">{description || 'ستظهر هنا عند وجودها'}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CarrierChatsPage() {
  const t = useTranslations('chatsPage');
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>('group');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedRouteChatId, setSelectedRouteChatId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // ── كل الـ chats بتاعت الناقل ──
  const chatsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageTimestamp', 'desc'),
      orderBy('__name__', 'desc'),
    );
  }, [firestore, user]);

  const { data: chats, isLoading: isLoadingChats } = useCollection<Chat>(chatsQuery);

  // ── رحلات الناقل النشطة (عشان تبان جروبات المسارات) ──
  const myTripsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'trips'),
      where('carrierId', '==', user.uid),
      where('status', 'in', ['Planned', 'In-Transit', 'Has_Offers', 'Negotiating', 'Pending-Carrier-Confirmation']),
    );
  }, [firestore, user]);

  const { data: myTrips, isLoading: isLoadingTrips } = useCollection<Trip>(myTripsQuery);
  const isLoading = isUserLoading || isLoadingChats || isLoadingTrips;

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  // ── المسارات الفريدة من رحلاتي النشطة ──
  const myRoutes = useMemo(() => {
    if (!myTrips) return [];
    const seen = new Set<string>();
    const result: { origin: string; destination: string }[] = [];
    for (const trip of myTrips) {
      const key = `${trip.origin}__${trip.destination}`;
      if (!seen.has(key) && trip.origin && trip.destination) {
        seen.add(key);
        result.push({ origin: trip.origin, destination: trip.destination });
      }
    }
    return result;
  }, [myTrips]);

  // ── فرز المحادثات في التابات ──
  const tabChats = useMemo<Record<TabKey, Chat[]>>(() => {
    if (!chats) return { group: [], private: [], carrier: [], archive: [] };
    const result: Record<TabKey, Chat[]> = { group: [], private: [], carrier: [], archive: [] };
    for (const chat of chats) {
      // الـ carrier route groups بتظهر كـ RouteChatCard مش ChatListItem
      // لكن لو اتأرشفت تظهر في الأرشيف كـ ChatListItem عادي
      const tab = classifyChat(chat);
      if (tab !== 'carrier') {
        result[tab].push(chat);
      }
      // الـ carrier route groups النشطة بتتعامل بشكل مستقل عبر myRoutes
    }
    return result;
  }, [chats]);

  // ── عداد الرسائل غير المقروءة لكل تاب ──
  const unreadPerTab = useMemo<Record<TabKey, number>>(() => {
    if (!chats || !user) return { group: 0, private: 0, carrier: 0, archive: 0 };
    const result: Record<TabKey, number> = { group: 0, private: 0, carrier: 0, archive: 0 };
    for (const chat of chats) {
      const tab = classifyChat(chat);
      result[tab] += chat.unreadCounts?.[user.uid] || 0;
    }
    return result;
  }, [chats, user]);

  const tabs: TabDef[] = [
    { key: 'group', label: 'المجموعات', icon: <Users className="h-4 w-4" /> },
    { key: 'private', label: 'الخاصة', icon: <User className="h-4 w-4" /> },
    { key: 'carrier', label: 'بين الناقلين', icon: <ArrowLeftRight className="h-4 w-4" /> },
    { key: 'archive', label: 'الأرشيف', icon: <Archive className="h-4 w-4" /> },
  ];

  const handleChatClick = (chat: Chat) => {
    // صفّر عداد القراءة
    if (firestore && user && (chat.unreadCounts?.[user.uid] ?? 0) > 0) {
      updateDoc(doc(firestore, 'chats', chat.id), {
        [`unreadCounts.${user.uid}`]: 0,
      });
    }
    setSelectedChat(chat);
    setSelectedRouteChatId(null);
    setIsChatOpen(true);
  };

  const handleRouteChatOpen = (chatId: string) => {
    setSelectedRouteChatId(chatId);
    setSelectedChat(null);
    setIsChatOpen(true);
  };

  const myName = useMemo(
    () => user?.displayName || user?.email?.split('@')[0] || 'ناقل',
    [user],
  );

  const currentChats = tabChats[activeTab];

  return (
    <>
      <div className="container mx-auto max-w-3xl p-4 space-y-4 pt-6">
        {/* Header */}
        <Card className="bg-card border-primary/50">
          <CardHeader>
            <h1 className="text-2xl font-bold">{t('headerTitle')}</h1>
            <p className="text-muted-foreground">{t('headerDescription')}</p>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-muted/50 border p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-[11px] font-bold transition-all',
                activeTab === tab.key
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.icon}
              <span className="leading-tight text-center">{tab.label}</span>
              {unreadPerTab[tab.key] > 0 && (
                <span className="absolute top-1 end-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-black flex items-center justify-center">
                  {unreadPerTab[tab.key] > 9 ? '9+' : unreadPerTab[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>

        ) : activeTab === 'carrier' ? (
          // ── تاب "بين الناقلين": جروب لكل مسار نشط ──
          myRoutes.length === 0 ? (
            <EmptyState
              label="مسارات نشطة"
              description="أنشئ رحلة أولاً لتظهر جروبات التواصل مع الناقلين على نفس المسار"
            />
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground px-1">
                جروب منفصل لكل مسار تعمل عليه — يضم كل الناقلين على نفس الخط
              </p>
              {myRoutes.map(route => (
                <RouteChatCard
                  key={`${route.origin}__${route.destination}`}
                  origin={route.origin}
                  destination={route.destination}
                  myUid={user!.uid}
                  myName={myName}
                  onClick={handleRouteChatOpen}
                />
              ))}
            </div>
          )

        ) : activeTab === 'archive' ? (
          // ── تاب الأرشيف ──
          currentChats.length === 0 ? (
            <EmptyState
              label="محادثات مؤرشفة"
              description="المحادثات المنتهية تظهر هنا وتُحذف تلقائياً بعد 10 أيام"
            />
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground px-1">
                المحادثات المنتهية — تُحذف تلقائياً بعد 10 أيام من انتهاء الرحلة
              </p>
              {currentChats.map(chat => (
                <ChatListItem key={chat.id} chat={chat} onClick={() => handleChatClick(chat)} />
              ))}
            </div>
          )

        ) : currentChats.length === 0 ? (
          <EmptyState label={tabs.find(tb => tb.key === activeTab)?.label ?? 'رسائل'} />
        ) : (
          <div className="space-y-3">
            {currentChats.map(chat => (
              <ChatListItem key={chat.id} chat={chat} onClick={() => handleChatClick(chat)} />
            ))}
          </div>
        )}
      </div>

      {/* Chat Dialog — جروب المسار بين الناقلين */}
      {selectedRouteChatId && (
        <ChatDialog
          isOpen={isChatOpen}
          onOpenChange={(open) => { setIsChatOpen(open); if (!open) setSelectedRouteChatId(null); }}
          trip={{ id: selectedRouteChatId } as Trip}
          chatType="group"
        />
      )}

      {/* Chat Dialog — المجموعات والخاصة والأرشيف */}
      {selectedChat && (
        <ChatDialog
          isOpen={isChatOpen}
          onOpenChange={(open) => { setIsChatOpen(open); if (!open) setSelectedChat(null); }}
          trip={selectedChat.isGroupChat ? { id: selectedChat.id } as Trip : undefined}
          bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
          otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
          chatType={selectedChat.isGroupChat ? 'group' : 'private'}
        />
      )}
    </>
  );
}