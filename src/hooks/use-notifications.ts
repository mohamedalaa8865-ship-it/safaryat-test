'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, writeBatch } from 'firebase/firestore';
import type { Notification } from '@/lib/data';

/**
 * @hook useNotifications
 * @description THE REINFORCED NOTIFICATION ENGINE (SC-806 V2.6)
 * Enforced useMemoFirebase for queries to ensure zero redundant reads.
 */
export function useNotifications() {
  const { user } = useUser();
  const firestore = useFirestore();

  const notificationsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'users', user.uid, 'notifications'),
      where('isRead', '==', false)
    );
  }, [firestore, user]);

  const { data: notifications, isLoading } = useCollection<Notification>(notificationsQuery);

  const unreadCount = notifications?.length || 0;

  const markAllAsRead = async () => {
    if (!firestore || !user?.uid || !notifications || notifications.length === 0) return;
    const batch = writeBatch(firestore);
    notifications.forEach(notif => {
      const ref = doc(firestore, 'users', user.uid, 'notifications', notif.id);
      batch.update(ref, { isRead: true });
    });
    await batch.commit();
  };

  const markOneAsRead = async (notifId: string) => {
    if (!firestore || !user?.uid) return;
    const ref = doc(firestore, 'users', user.uid, 'notifications', notifId);
    const { updateDoc } = await import('firebase/firestore');
    await updateDoc(ref, { isRead: true });
  };

  return { notifications: notifications || [], unreadCount, isLoading, markAllAsRead, markOneAsRead };
}
