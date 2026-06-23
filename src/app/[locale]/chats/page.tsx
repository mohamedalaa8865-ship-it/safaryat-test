
// 'use client';

// import { useState, useMemo, useEffect } from 'react';
// import { AppLayout } from '@/components/app-layout';
// import CarrierLayout from '@/app/[locale]/carrier/layout';
// import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
// import { collection, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
// import type { Chat, Trip } from '@/lib/data';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { formatDistanceToNow } from 'date-fns';
// import { arSA } from 'date-fns/locale';
// import { MessageSquare, Users, User } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { ChatDialog } from '@/components/chat/chat-dialog';
// import { useRouter } from 'next/navigation';
// import { useTranslations } from 'next-intl';
// import { useUserProfile } from '@/hooks/use-user-profile';

// const ChatListItem = ({ chat, onClick }: { chat: Chat, onClick: () => void }) => {
//   const t = useTranslations('chatsPage');
//   const { user } = useUser();
//   const unreadCount = chat.unreadCounts?.[user?.uid || ''] || 0;

//   const safeFormatDistance = (timestamp: any) => {
//     if (!timestamp) return '';
//     try {
//       const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
//       return formatDistanceToNow(date, { addSuffix: true, locale: arSA });
//     } catch {
//       return '';
//     }
//   };

//   return (
//     <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
//       <CardContent className="p-4 flex items-center gap-4">
//         <Avatar className="h-12 w-12 border">
//           <AvatarFallback>
//             {chat.isGroupChat ? <Users /> : <User />}
//           </AvatarFallback>
//         </Avatar>
//         <div className="flex-1">
//           <div className="flex justify-between items-center">
//             <p className="font-bold">{chat.isGroupChat ? t('groupChat') : t('privateChat')}</p>
//             {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
//           </div>
//           <p className="text-sm text-muted-foreground truncate">{chat.lastMessage || t('noMessages')}</p>
//         </div>
//         <div className="text-xs text-muted-foreground self-start">
//           {safeFormatDistance(chat.lastMessageTimestamp)}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// /**
//  * @page ChatsPage
//  * @description THE REINFORCED CHAT HUB (SC-806 V2.6)
//  * Enforced useMemoFirebase for queries to ensure zero redundant reads.
//  */

// // function ConditionalLayout({ children, profile, user, isEngaged, engagementType }: any) {
// //   if (profile?.role === 'carrier') {
// //     return <CarrierLayout>{children}</CarrierLayout>;
// //   }
// //   return <AppLayout profile={profile} user={user} isEngaged={isEngaged} engagementType={engagementType}>{children}</AppLayout>;
// // }
// function ConditionalLayout({ children, profile, user, isEngaged, engagementType }: any) {
//   // احذف الـ carrier check خالص
//   return <AppLayout profile={profile} user={user} isEngaged={isEngaged} engagementType={engagementType}>{children}</AppLayout>;
// }
// export default function ChatsPage() {
//   const t = useTranslations('chatsPage');
//   const { user, isUserLoading } = useUser();
//   const { profile, isEngaged, engagementType, isLoading: isProfileLoading } = useUserProfile();
//   const firestore = useFirestore();
//   const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const router = useRouter();

//   const chatsQuery = useMemoFirebase(() => {
//     if (!firestore || !user) return null;
//     return query(
//       collection(firestore, 'chats'),
//       where('participants', 'array-contains', user.uid),
//       orderBy('lastMessageTimestamp', 'desc'),
//       orderBy('__name__', 'desc')
//     );
//   }, [firestore, user]);

//   const { data: chats, isLoading: isLoadingChats } = useCollection<Chat>(chatsQuery);
//   const isLoading = isUserLoading || isProfileLoading || isLoadingChats;

//   useEffect(() => {
//     if (!isLoading && !user) {
//       router.push('/login');
//     }
//   }, [user, isLoading, router]);

//   const handleChatClick = (chat: Chat) => {
//     if (firestore && user && (chat.unreadCounts?.[user.uid] ?? 0) > 0) {
//       const chatRef = doc(firestore, 'chats', chat.id);
//       updateDoc(chatRef, {
//         [`unreadCounts.${user.uid}`]: 0
//       });
//     }
//     setSelectedChat(chat);
//     setIsChatOpen(true);
//   };

//   const renderContent = () => {
//     if (isLoading) {
//       return (
//         <div className="space-y-4">
//           {[...Array(3)].map((_, i) => (
//             <Skeleton key={i} className="h-20 w-full" />
//           ))}
//         </div>
//       );
//     }

//     if (!chats || chats.length === 0) {
//       return (
//         <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
//           <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
//           <p className="font-bold">{t('noChatsTitle')}</p>
//           <p className="text-sm mt-1">{t('noChatsDescription')}</p>
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-3">
//         {chats.map(chat => (
//           <ChatListItem key={chat.id} chat={chat} onClick={() => handleChatClick(chat)} />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <ConditionalLayout profile={profile} user={user} isEngaged={isEngaged} engagementType={engagementType}>
//       <div className="container mx-auto max-w-3xl p-4 space-y-6 pt-16">
//         <Card className="bg-card border-primary/50">
//           <CardHeader>
//             <h1 className="text-2xl font-bold">{t('headerTitle')}</h1>
//             <p className="text-muted-foreground">{t('headerDescription')}</p>
//           </CardHeader>
//         </Card>
//         {renderContent()}
//       </div>
//       {/* {selectedChat && (
//         <ChatDialog
//           isOpen={isChatOpen}
//           onOpenChange={setIsChatOpen}
//           trip={selectedChat.isGroupChat ? { id: selectedChat.id } as Trip : undefined}
//           bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
//           otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
//           chatType={selectedChat.isGroupChat ? "group" : "private"}
//         />
//       )} */}
//       {/* دردشة خاصة
//       {selectedChat && (
//         <ChatDialog
//           isOpen={isChatOpen}
//           onOpenChange={setIsChatOpen}
//           bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
//           otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
//           chatType='private' />
//       )}

//       {/* ✅ دردشة الرحلة الجماعية */}
//       {/* {selectedChat && (
//         <ChatDialog
//           isOpen={isChatOpen}
//           onOpenChange={setIsChatOpen}
//           bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
//           otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
//           chatType='group' />
//       )} */}
//       {selectedChat && (
//         <ChatDialog
//           isOpen={isChatOpen}
//           onOpenChange={setIsChatOpen}
//           trip={selectedChat.isGroupChat ? { id: selectedChat.id } as Trip : undefined}
//           bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
//           otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
//         // chatType={selectedChat.isGroupChat ? "group" : "private"}

//         />
//       )}

//     </ConditionalLayout>
//   );
// }
'use client';

/**
 * @file src/app/[locale]/chats/page.tsx
 * @description مركز اتصالات المسافر — 3 تابات:
 *   1. المجموعات → دردشة المسافر مع الناقل وبقية مسافري الرحلة (isGroupChat=true)
 *   2. الخاصة    → محادثة 1:1 بين المسافر والناقل (isGroupChat=false)
 *   3. الأرشيف   → محادثات انتهت رحلتها (isClosed=true) — تُحذف بعد 10 أيام
 */

import { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import type { Chat, Trip } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { MessageSquare, Users, User, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ChatDialog } from '@/components/chat/chat-dialog';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useUserProfile } from '@/hooks/use-user-profile';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
type TabKey = 'group' | 'private' | 'archive';

// ─── Classifier ──────────────────────────────────────────────────────────────
function classifyChat(chat: Chat): TabKey {
  if (chat.isClosed) return 'archive';
  if (chat.isGroupChat) return 'group';
  return 'private';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function safeFormatDistance(ts: any): string {
  if (!ts) return '';
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return formatDistanceToNow(d, { addSuffix: true, locale: arSA });
  } catch { return ''; }
}

// ─── ChatListItem ─────────────────────────────────────────────────────────────
const ChatListItem = ({ chat, onClick }: { chat: Chat; onClick: () => void }) => {
  const t = useTranslations('chatsPage');
  const { user } = useUser();
  const unreadCount = chat.unreadCounts?.[user?.uid || ''] || 0;
  const tab = classifyChat(chat);

  return (
    <Card
      className={cn(
        'cursor-pointer hover:bg-muted/50 transition-colors',
        chat.isClosed && 'opacity-70',
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar className="h-12 w-12 border">
          <AvatarFallback>
            {tab === 'archive' ? (
              <Archive className="h-5 w-5" />
            ) : chat.isGroupChat ? (
              <Users className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
            )}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center gap-2">
            <p className="font-bold truncate">
              {chat.isGroupChat ? t('groupChat') : t('privateChat')}
            </p>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="shrink-0">{unreadCount}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {chat.lastMessage || t('noMessages')}
          </p>

          {/* عداد الحذف في الأرشيف */}
          {tab === 'archive' && chat.archivedAt && (
            <p className="text-[11px] text-destructive/70 mt-0.5">
              {(() => {
                try {
                  const archived = chat.archivedAt?.toDate
                    ? chat.archivedAt.toDate()
                    : new Date(chat.archivedAt);
                  const deleteAt = new Date(archived.getTime() + 10 * 24 * 60 * 60 * 1000);
                  const daysLeft = Math.ceil(
                    (deleteAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                  );
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

// ─── Empty State ─────────────────────────────────────────────────────────────
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
export default function ChatsPage() {
  const t = useTranslations('chatsPage');
  const { user, isUserLoading } = useUser();
  const { profile, isEngaged, engagementType, isLoading: isProfileLoading } = useUserProfile();
  const firestore = useFirestore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>('group');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // ── كل الـ chats بتاعت المسافر ──
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
  const isLoading = isUserLoading || isProfileLoading || isLoadingChats;

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  // ── فرز المحادثات في التابات ──
  const tabChats = useMemo<Record<TabKey, Chat[]>>(() => {
    if (!chats) return { group: [], private: [], archive: [] };
    const result: Record<TabKey, Chat[]> = { group: [], private: [], archive: [] };
    for (const chat of chats) {
      result[classifyChat(chat)].push(chat);
    }
    return result;
  }, [chats]);

  // ── عداد الرسائل غير المقروءة لكل تاب ──
  const unreadPerTab = useMemo<Record<TabKey, number>>(() => {
    if (!chats || !user) return { group: 0, private: 0, archive: 0 };
    const result: Record<TabKey, number> = { group: 0, private: 0, archive: 0 };
    for (const chat of chats) {
      result[classifyChat(chat)] += chat.unreadCounts?.[user.uid] || 0;
    }
    return result;
  }, [chats, user]);

  const tabs = [
    { key: 'group' as TabKey, label: 'المجموعات', icon: <Users className="h-4 w-4" /> },
    { key: 'private' as TabKey, label: 'الخاصة', icon: <User className="h-4 w-4" /> },
    { key: 'archive' as TabKey, label: 'الأرشيف', icon: <Archive className="h-4 w-4" /> },
  ];

  const handleChatClick = (chat: Chat) => {
    if (firestore && user && (chat.unreadCounts?.[user.uid] ?? 0) > 0) {
      updateDoc(doc(firestore, 'chats', chat.id), {
        [`unreadCounts.${user.uid}`]: 0,
      });
    }
    setSelectedChat(chat);
    setIsChatOpen(true);
  };

  const currentChats = tabChats[activeTab];

  return (
    <AppLayout profile={profile} user={user} isEngaged={isEngaged} engagementType={engagementType}>
      <div className="container mx-auto max-w-3xl p-4 space-y-4 pt-16">

        {/* Header */}
        <Card className="bg-card border-primary/50">
          <CardHeader>
            <h1 className="text-2xl font-bold">{t('headerTitle')}</h1>
            <p className="text-muted-foreground">{t('headerDescription')}</p>
          </CardHeader>
        </Card>

        {/* Tabs — 3 تابات */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted/50 border p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-[12px] font-bold transition-all',
                activeTab === tab.key
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
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
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : activeTab === 'archive' ? (
          currentChats.length === 0 ? (
            <EmptyState
              label="محادثات مؤرشفة"
              description="المحادثات المنتهية تظهر هنا وتُحذف تلقائياً بعد 10 أيام"
            />
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground px-1">
                محادثات رحلاتك المنتهية — تُحذف تلقائياً بعد 10 أيام
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

      {/* Chat Dialog */}
      {selectedChat && (
        <ChatDialog
          isOpen={isChatOpen}
          onOpenChange={(open) => {
            setIsChatOpen(open);
            if (!open) setSelectedChat(null);
          }}
          trip={selectedChat.isGroupChat ? ({ id: selectedChat.id } as Trip) : undefined}
          bookingId={!selectedChat.isGroupChat ? selectedChat.id : undefined}
          otherPartyName={!selectedChat.isGroupChat ? t('carrier') : undefined}
          chatType={selectedChat.isGroupChat ? 'group' : 'private'}
        />
      )}
    </AppLayout>
  );
}