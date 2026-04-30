'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

/**
 * @file src/hooks/use-unread-chats.ts
 * @description SOVEREIGN HOOK (SC-806 V2.6)
 * Enforced useMemoFirebase for queries to ensure zero redundant reads.
 */
export function useUnreadChats() {
  const { user } = useUser();
  const firestore = useFirestore();

  const chatsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'chats'),
      where('participants', 'array-contains', user.uid)
    );
  }, [firestore, user]);

  const { data: userChats } = useCollection(chatsQuery);

  const unreadCount = useMemo(() => {
    if (!userChats || !user?.uid) return 0;
    return userChats.reduce((acc, chat) => {
      return acc + (chat.unreadCounts?.[user.uid] || 0);
    }, 0);
  }, [userChats, user]);

  return unreadCount;
}
