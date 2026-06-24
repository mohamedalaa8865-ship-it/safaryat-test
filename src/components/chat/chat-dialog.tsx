// // // // // 'use client';

// // // // // import { useState, useEffect } from 'react';
// // // // // import {
// // // // //   Dialog,
// // // // //   DialogContent,
// // // // //   DialogHeader,
// // // // //   DialogTitle,
// // // // //   DialogFooter,
// // // // //   DialogDescription,
// // // // // } from '@/components/ui/dialog';
// // // // // import { Button } from '@/components/ui/button';
// // // // // import { Input } from '@/components/ui/input';
// // // // // import { useUser, useFirestore, useCollection, updateDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
// // // // // import { collection, query, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';
// // // // // import type { Message, Trip } from '@/lib/data';
// // // // // import { MessageList } from './message-list';
// // // // // import { Loader2, Send, PowerOff, AlertTriangle, X } from 'lucide-react';
// // // // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // // // import { useToast } from '@/hooks/use-toast';
// // // // // import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
// // // // // import { useTranslations } from 'next-intl';

// // // // // interface ChatDialogProps {
// // // // //   isOpen: boolean;
// // // // //   onOpenChange: (isOpen: boolean) => void;
// // // // //   trip?: Trip | null;
// // // // //   bookingId?: string | null;
// // // // //   otherPartyName?: string;
// // // // //   otherPartyId?: string;
// // // // //   chatType?: "group" | "private";
// // // // // }

// // // // // /**
// // // // //  * @component ChatDialog
// // // // //  * @description THE REINFORCED CHAT HUB (STERILIZED - V3.0 - GHOST PURGE)
// // // // //  * [SCR-988]: Eradicated AI Suggestion Ghost logic to ensure build success.
// // // // //  * Protocol 16: Sterilized UI Logic.
// // // // //  */
// // // // // export function ChatDialog({ isOpen, onOpenChange, trip, bookingId, otherPartyName, otherPartyId, isGroupChat: _ignored }: ChatDialogProps & { isGroupChat?: boolean }) {
// // // // //   const { user } = useUser();
// // // // //   const { profile } = useUserProfile();
// // // // //   const firestore = useFirestore();
// // // // //   const [newMessage, setNewMessage] = useState('');
// // // // //   const { toast } = useToast();
// // // // //   const [isClosingChat, setIsClosingChat] = useState(false);
// // // // //   const t = useTranslations('chat')
// // // // //   const isGroupChat = !!trip;
// // // // //   const chatId = isGroupChat ? trip?.id : bookingId;

// // // // //   const messagesQuery = useMemoFirebase(() => {
// // // // //     if (!firestore || !chatId) return null;
// // // // //     return query(
// // // // //       collection(firestore, 'chats', chatId, 'messages'),
// // // // //       orderBy('timestamp', 'asc')
// // // // //     );
// // // // //   }, [firestore, chatId]);

// // // // //   const { data: messages, isLoading } = useCollection<Message>(messagesQuery);

// // // // //   const chatDocRef = useMemoFirebase(() => {
// // // // //     if (!firestore || !chatId) return null;
// // // // //     return doc(firestore, 'chats', chatId);
// // // // //   }, [firestore, chatId]);
// // // // //   const { data: chatDoc } = useDoc(chatDocRef);

// // // // //   useEffect(() => {
// // // // //     const ensureChatExists = async () => {
// // // // //       if (firestore && user && !isGroupChat && bookingId && otherPartyId && !(chatDoc as any)?.id) {
// // // // //         const chatDocRef = doc(firestore, 'chats', bookingId);
// // // // //         const chatData = {
// // // // //           id: bookingId,
// // // // //           isGroupChat: false,
// // // // //           participants: [user.uid, otherPartyId],
// // // // //           unreadCounts: { [user.uid]: 0, [otherPartyId]: 0 },
// // // // //           isClosed: false,
// // // // //           lastMessage: t('created'),
// // // // //           lastMessageSenderId: 'system',
// // // // //           lastMessageTimestamp: serverTimestamp(),
// // // // //         };
// // // // //         await setDoc(chatDocRef, chatData, { merge: true });
// // // // //       }
// // // // //     };
// // // // //     if (isOpen) {
// // // // //       ensureChatExists();
// // // // //     }
// // // // //   }, [isOpen, firestore, user, isGroupChat, bookingId, otherPartyId, chatDoc]);

// // // // //   const handleSendMessage = async (content?: string) => {
// // // // //     const messageContent = content || newMessage;
// // // // //     if (!firestore || !user || !profile || !messageContent.trim() || !chatId) return;

// // // // //     const messagesCollection = collection(firestore, 'chats', chatId, 'messages');
// // // // //     const chatDocRef = doc(firestore, 'chats', chatId);

// // // // //     const messageData = {
// // // // //       content: messageContent,
// // // // //       senderId: user.uid,
// // // // //       senderName: profile.firstName,
// // // // //       timestamp: serverTimestamp(),
// // // // //     };

// // // // //     const { addDoc } = await import('firebase/firestore');
// // // // //     await addDoc(messagesCollection, messageData);

// // // // //     const chatUpdateData = {
// // // // //       lastMessage: messageContent,
// // // // //       lastMessageSenderId: user.uid,
// // // // //       lastMessageTimestamp: serverTimestamp(),
// // // // //     };
// // // // //     updateDocumentNonBlocking(chatDocRef, chatUpdateData);

// // // // //     setNewMessage('');
// // // // //   };

// // // // //   const handleCloseChat = async () => {
// // // // //     if (!firestore || !chatId) return;
// // // // //     setIsClosingChat(true);
// // // // //     const chatDocRef = doc(firestore, 'chats', chatId);
// // // // //     try {
// // // // //       await updateDocumentNonBlocking(chatDocRef, { isClosed: true });
// // // // //       toast({ title: t('closedSuccess'), description: t('closedSuccessDesc') });
// // // // //       onOpenChange(false);
// // // // //     } catch (error) {
// // // // //       toast({ variant: 'destructive', title: t('closedFail') });
// // // // //     } finally {
// // // // //       setIsClosingChat(false);
// // // // //     }
// // // // //   }

// // // // //   const isChatClosed = (chatDoc as any)?.isClosed;

// // // // //   return (
// // // // //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // // // //       <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
// // // // //         <DialogHeader className="p-4 border-b">
// // // // //           <DialogTitle>{isGroupChat ? t('chatGroup') : `${t('chatPrivate')} ${otherPartyName}`}</DialogTitle>
// // // // //           {trip && (
// // // // //             <DialogDescription>
// // // // //               {t('tripRoute')} {trip.origin} - {trip.destination}
// // // // //             </DialogDescription>
// // // // //           )}
// // // // //         </DialogHeader>

// // // // //         <div className="flex-1 overflow-y-auto bg-muted/20">
// // // // //           <MessageList messages={messages || []} isLoading={isLoading} currentUserId={user?.uid || ""} />
// // // // //         </div>

// // // // //         <DialogFooter className="p-4 border-t bg-background flex-col gap-2">
// // // // //           <div className="flex w-full items-center space-x-2 rtl:space-x-reverse">
// // // // //             {profile?.role === 'carrier' && !isChatClosed && (
// // // // //               <AlertDialog>
// // // // //                 <AlertDialogTrigger asChild>
// // // // //                   <Button variant="destructive" size="icon">
// // // // //                     <PowerOff className="h-4 w-4" />
// // // // //                   </Button>
// // // // //                 </AlertDialogTrigger>
// // // // //                 <AlertDialogContent>
// // // // //                   <AlertDialogHeader>
// // // // //                     <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle />{t('confirmClose')}</AlertDialogTitle>
// // // // //                     <AlertDialogDescription>
// // // // //                       {t('confirmCloseDesc')}                    </AlertDialogDescription>
// // // // //                   </AlertDialogHeader>
// // // // //                   <AlertDialogFooter>
// // // // //                     <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
// // // // //                     <AlertDialogAction onClick={handleCloseChat} disabled={isClosingChat}>
// // // // //                       {isClosingChat ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : t('confirmYes')}
// // // // //                     </AlertDialogAction>
// // // // //                   </AlertDialogFooter>
// // // // //                 </AlertDialogContent>
// // // // //               </AlertDialog>
// // // // //             )}
// // // // //             {isChatClosed ? (
// // // // //               <div className="flex-1 text-center text-sm text-muted-foreground font-semibold">    {t('closedByCarrier')}</div>
// // // // //             ) : (
// // // // //               <>
// // // // //                 <Input
// // // // //                   id="message-input"
// // // // //                   placeholder={t('messHere')}
// // // // //                   value={newMessage}
// // // // //                   onChange={(e) => setNewMessage(e.target.value)}
// // // // //                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
// // // // //                   disabled={isLoading}
// // // // //                   className="flex-1"
// // // // //                 />
// // // // //                 <Button type="submit" size="icon" onClick={() => handleSendMessage()} disabled={!newMessage.trim()}>
// // // // //                   <Send className="h-4 w-4" />
// // // // //                   <span className="sr-only">{t('send')}</span>
// // // // //                 </Button>
// // // // //               </>
// // // // //             )}
// // // // //           </div>
// // // // //           {profile?.role === 'carrier' && (
// // // // //             <Button variant="ghost" className="w-fit self-end text-xs h-auto p-1" onClick={() => onOpenChange(false)}>
// // // // //               <X className="ml-1 h-3 w-3" />
// // // // //               {t('close')}
// // // // //             </Button>
// // // // //           )}
// // // // //         </DialogFooter>
// // // // //       </DialogContent>
// // // // //     </Dialog>
// // // // //   );
// // // // // }


// // // // 'use client';

// // // // import { useState, useEffect } from 'react';
// // // // import {
// // // //   Dialog,
// // // //   DialogContent,
// // // //   DialogHeader,
// // // //   DialogTitle,
// // // //   DialogFooter,
// // // //   DialogDescription,
// // // // } from '@/components/ui/dialog';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Input } from '@/components/ui/input';
// // // // import { useUser, useFirestore, useCollection, updateDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
// // // // import { collection, query, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';
// // // // import type { Message, Trip } from '@/lib/data';
// // // // import { MessageList } from './message-list';
// // // // import { Loader2, Send, PowerOff, AlertTriangle, X } from 'lucide-react';
// // // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // // import { useToast } from '@/hooks/use-toast';
// // // // import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
// // // // import { useTranslations } from 'next-intl';

// // // // interface ChatDialogProps {
// // // //   isOpen: boolean;
// // // //   onOpenChange: (isOpen: boolean) => void;
// // // //   trip?: Trip | null;
// // // //   bookingId?: string | null;
// // // //   otherPartyName?: string;
// // // //   otherPartyId?: string;
// // // //   chatType?: "group" | "private";
// // // // }

// // // // /**
// // // //  * @component ChatDialog
// // // //  * @description THE REINFORCED CHAT HUB (STERILIZED - V3.0 - GHOST PURGE)
// // // //  * [SCR-988]: Eradicated AI Suggestion Ghost logic to ensure build success.
// // // //  * Protocol 16: Sterilized UI Logic.
// // // //  */
// // // // export function ChatDialog({ isOpen, onOpenChange, trip, bookingId, otherPartyName, otherPartyId, isGroupChat: _ignored }: ChatDialogProps & { isGroupChat?: boolean }) {
// // // //   const { user } = useUser();
// // // //   const { profile } = useUserProfile();
// // // //   const firestore = useFirestore();
// // // //   const [newMessage, setNewMessage] = useState('');
// // // //   const { toast } = useToast();
// // // //   const [isClosingChat, setIsClosingChat] = useState(false);
// // // //   const t = useTranslations('chat')
// // // //   const isGroupChat = !!trip;
// // // //   const chatId = isGroupChat ? trip?.id : bookingId;

// // // //   const messagesQuery = useMemoFirebase(() => {
// // // //     if (!firestore || !chatId) return null;
// // // //     return query(
// // // //       collection(firestore, 'chats', chatId, 'messages'),
// // // //       orderBy('timestamp', 'asc')
// // // //     );
// // // //   }, [firestore, chatId]);

// // // //   const { data: messages, isLoading } = useCollection<Message>(messagesQuery);

// // // //   const chatDocRef = useMemoFirebase(() => {
// // // //     if (!firestore || !chatId) return null;
// // // //     return doc(firestore, 'chats', chatId);
// // // //   }, [firestore, chatId]);
// // // //   const { data: chatDoc } = useDoc(chatDocRef);

// // // //   useEffect(() => {
// // // //     const ensureChatExists = async () => {
// // // //       if (firestore && !isGroupChat && bookingId && otherPartyId && !(chatDoc as any)?.id) {
// // // //         const chatDocRef = doc(firestore, 'chats', bookingId);
// // // //         const guestId = `guest_${bookingId}`;
// // // //         const participantId = user?.uid || guestId;
// // // //         const chatData = {
// // // //           id: bookingId,
// // // //           isGroupChat: false,
// // // //           participants: [participantId, otherPartyId],
// // // //           unreadCounts: { [participantId]: 0, [otherPartyId]: 0 },
// // // //           isClosed: false,
// // // //           lastMessage: t('created'),
// // // //           lastMessageSenderId: 'system',
// // // //           lastMessageTimestamp: serverTimestamp(),
// // // //         };
// // // //         await setDoc(chatDocRef, chatData, { merge: true });
// // // //       }
// // // //     };
// // // //     if (isOpen) {
// // // //       ensureChatExists();
// // // //     }
// // // //   }, [isOpen, firestore, user, isGroupChat, bookingId, otherPartyId, chatDoc]);

// // // //   const handleSendMessage = async (content?: string) => {
// // // //     const messageContent = content || newMessage;
// // // //     if (!firestore || !messageContent.trim() || !chatId) return;

// // // //     // المسافر ممكن يكون مش logged in — نستخدم uid لو موجود وإلا anonymous
// // // //     const senderId = user?.uid || `guest_${bookingId}`;
// // // //     const senderName = profile?.firstName || otherPartyName || 'مسافر';

// // // //     const messagesCollection = collection(firestore, 'chats', chatId, 'messages');
// // // //     const chatDocRef = doc(firestore, 'chats', chatId);

// // // //     const messageData = {
// // // //       content: messageContent,
// // // //       senderId,
// // // //       senderName,
// // // //       timestamp: serverTimestamp(),
// // // //     };

// // // //     const { addDoc } = await import('firebase/firestore');
// // // //     await addDoc(messagesCollection, messageData);

// // // //     const chatUpdateData = {
// // // //       lastMessage: messageContent,
// // // //       lastMessageSenderId: senderId,
// // // //       lastMessageTimestamp: serverTimestamp(),
// // // //     };
// // // //     updateDocumentNonBlocking(chatDocRef, chatUpdateData);

// // // //     setNewMessage('');
// // // //   };

// // // //   const handleCloseChat = async () => {
// // // //     if (!firestore || !chatId) return;
// // // //     setIsClosingChat(true);
// // // //     const chatDocRef = doc(firestore, 'chats', chatId);
// // // //     try {
// // // //       await updateDocumentNonBlocking(chatDocRef, { isClosed: true });
// // // //       toast({ title: t('closedSuccess'), description: t('closedSuccessDesc') });
// // // //       onOpenChange(false);
// // // //     } catch (error) {
// // // //       toast({ variant: 'destructive', title: t('closedFail') });
// // // //     } finally {
// // // //       setIsClosingChat(false);
// // // //     }
// // // //   }

// // // //   const isChatClosed = (chatDoc as any)?.isClosed;

// // // //   return (
// // // //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // // //       <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
// // // //         <DialogHeader className="p-4 border-b">
// // // //           <DialogTitle>{isGroupChat ? t('chatGroup') : `${t('chatPrivate')} ${otherPartyName}`}</DialogTitle>
// // // //           {trip && (
// // // //             <DialogDescription>
// // // //               {t('tripRoute')} {trip.origin} - {trip.destination}
// // // //             </DialogDescription>
// // // //           )}
// // // //         </DialogHeader>

// // // //         <div className="flex-1 overflow-y-auto bg-muted/20">
// // // //           <MessageList messages={messages || []} isLoading={isLoading} currentUserId={user?.uid || `guest_${bookingId}`} />
// // // //         </div>

// // // //         <DialogFooter className="p-4 border-t bg-background flex-col gap-2">
// // // //           <div className="flex w-full items-center space-x-2 rtl:space-x-reverse">
// // // //             {profile?.role === 'carrier' && !isChatClosed && (
// // // //               <AlertDialog>
// // // //                 <AlertDialogTrigger asChild>
// // // //                   <Button variant="destructive" size="icon">
// // // //                     <PowerOff className="h-4 w-4" />
// // // //                   </Button>
// // // //                 </AlertDialogTrigger>
// // // //                 <AlertDialogContent>
// // // //                   <AlertDialogHeader>
// // // //                     <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle />{t('confirmClose')}</AlertDialogTitle>
// // // //                     <AlertDialogDescription>
// // // //                       {t('confirmCloseDesc')}                    </AlertDialogDescription>
// // // //                   </AlertDialogHeader>
// // // //                   <AlertDialogFooter>
// // // //                     <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
// // // //                     <AlertDialogAction onClick={handleCloseChat} disabled={isClosingChat}>
// // // //                       {isClosingChat ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : t('confirmYes')}
// // // //                     </AlertDialogAction>
// // // //                   </AlertDialogFooter>
// // // //                 </AlertDialogContent>
// // // //               </AlertDialog>
// // // //             )}
// // // //             {isChatClosed ? (
// // // //               <div className="flex-1 text-center text-sm text-muted-foreground font-semibold">    {t('closedByCarrier')}</div>
// // // //             ) : (
// // // //               <>
// // // //                 <Input
// // // //                   id="message-input"
// // // //                   placeholder={t('messHere')}
// // // //                   value={newMessage}
// // // //                   onChange={(e) => setNewMessage(e.target.value)}
// // // //                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
// // // //                   disabled={isLoading}
// // // //                   className="flex-1"
// // // //                 />
// // // //                 <Button type="submit" size="icon" onClick={() => handleSendMessage()} disabled={!newMessage.trim()}>
// // // //                   <Send className="h-4 w-4" />
// // // //                   <span className="sr-only">{t('send')}</span>
// // // //                 </Button>
// // // //               </>
// // // //             )}
// // // //           </div>
// // // //           {profile?.role === 'carrier' && (
// // // //             <Button variant="ghost" className="w-fit self-end text-xs h-auto p-1" onClick={() => onOpenChange(false)}>
// // // //               <X className="ml-1 h-3 w-3" />
// // // //               {t('close')}
// // // //             </Button>
// // // //           )}
// // // //         </DialogFooter>
// // // //       </DialogContent>
// // // //     </Dialog>
// // // //   );
// // // // }

// // // // 'use client';

// // // // import { useState, useEffect } from 'react';
// // // // import {
// // // //   Dialog,
// // // //   DialogContent,
// // // //   DialogHeader,
// // // //   DialogTitle,
// // // //   DialogFooter,
// // // //   DialogDescription,
// // // // } from '@/components/ui/dialog';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Input } from '@/components/ui/input';
// // // // import { useUser, useFirestore, useCollection, updateDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
// // // // import { collection, query, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';
// // // // import type { Message, Trip } from '@/lib/data';
// // // // import { MessageList } from './message-list';
// // // // import { Loader2, Send, PowerOff, AlertTriangle, X } from 'lucide-react';
// // // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // // import { useToast } from '@/hooks/use-toast';
// // // // import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
// // // // import { useTranslations } from 'next-intl';

// // // // interface ChatDialogProps {
// // // //   isOpen: boolean;
// // // //   onOpenChange: (isOpen: boolean) => void;
// // // //   trip?: Trip | null;
// // // //   bookingId?: string | null;
// // // //   otherPartyName?: string;
// // // //   otherPartyId?: string;
// // // //   chatType?: "group" | "private";
// // // // }

// // // // /**
// // // //  * @component ChatDialog
// // // //  * @description THE REINFORCED CHAT HUB (STERILIZED - V3.0 - GHOST PURGE)
// // // //  * [SCR-988]: Eradicated AI Suggestion Ghost logic to ensure build success.
// // // //  * Protocol 16: Sterilized UI Logic.
// // // //  */
// // // // export function ChatDialog({ isOpen, onOpenChange, trip, bookingId, otherPartyName, otherPartyId, isGroupChat: _ignored }: ChatDialogProps & { isGroupChat?: boolean }) {
// // // //   const { user } = useUser();
// // // //   const { profile } = useUserProfile();
// // // //   const firestore = useFirestore();
// // // //   const [newMessage, setNewMessage] = useState('');
// // // //   const { toast } = useToast();
// // // //   const [isClosingChat, setIsClosingChat] = useState(false);
// // // //   const t = useTranslations('chat')
// // // //   const isGroupChat = !!trip;
// // // //   const chatId = isGroupChat ? trip?.id : bookingId;

// // // //   const messagesQuery = useMemoFirebase(() => {
// // // //     if (!firestore || !chatId) return null;
// // // //     return query(
// // // //       collection(firestore, 'chats', chatId, 'messages'),
// // // //       orderBy('timestamp', 'asc')
// // // //     );
// // // //   }, [firestore, chatId]);

// // // //   const { data: messages, isLoading } = useCollection<Message>(messagesQuery);

// // // //   const chatDocRef = useMemoFirebase(() => {
// // // //     if (!firestore || !chatId) return null;
// // // //     return doc(firestore, 'chats', chatId);
// // // //   }, [firestore, chatId]);
// // // //   const { data: chatDoc } = useDoc(chatDocRef);

// // // //   useEffect(() => {
// // // //     const ensureChatExists = async () => {
// // // //       if (firestore && user && !isGroupChat && bookingId && otherPartyId && !(chatDoc as any)?.id) {
// // // //         const chatDocRef = doc(firestore, 'chats', bookingId);
// // // //         const chatData = {
// // // //           id: bookingId,
// // // //           isGroupChat: false,
// // // //           participants: [user.uid, otherPartyId],
// // // //           unreadCounts: { [user.uid]: 0, [otherPartyId]: 0 },
// // // //           isClosed: false,
// // // //           lastMessage: t('created'),
// // // //           lastMessageSenderId: 'system',
// // // //           lastMessageTimestamp: serverTimestamp(),
// // // //         };
// // // //         await setDoc(chatDocRef, chatData, { merge: true });
// // // //       }
// // // //     };
// // // //     if (isOpen) {
// // // //       ensureChatExists();
// // // //     }
// // // //   }, [isOpen, firestore, user, isGroupChat, bookingId, otherPartyId, chatDoc]);

// // // //   const handleSendMessage = async (content?: string) => {
// // // //     const messageContent = content || newMessage;
// // // //     if (!firestore || !user || !profile || !messageContent.trim() || !chatId) return;

// // // //     const messagesCollection = collection(firestore, 'chats', chatId, 'messages');
// // // //     const chatDocRef = doc(firestore, 'chats', chatId);

// // // //     const messageData = {
// // // //       content: messageContent,
// // // //       senderId: user.uid,
// // // //       senderName: profile.firstName,
// // // //       timestamp: serverTimestamp(),
// // // //     };

// // // //     const { addDoc } = await import('firebase/firestore');
// // // //     await addDoc(messagesCollection, messageData);

// // // //     const chatUpdateData = {
// // // //       lastMessage: messageContent,
// // // //       lastMessageSenderId: user.uid,
// // // //       lastMessageTimestamp: serverTimestamp(),
// // // //     };
// // // //     updateDocumentNonBlocking(chatDocRef, chatUpdateData);

// // // //     setNewMessage('');
// // // //   };

// // // //   const handleCloseChat = async () => {
// // // //     if (!firestore || !chatId) return;
// // // //     setIsClosingChat(true);
// // // //     const chatDocRef = doc(firestore, 'chats', chatId);
// // // //     try {
// // // //       await updateDocumentNonBlocking(chatDocRef, { isClosed: true });
// // // //       toast({ title: t('closedSuccess'), description: t('closedSuccessDesc') });
// // // //       onOpenChange(false);
// // // //     } catch (error) {
// // // //       toast({ variant: 'destructive', title: t('closedFail') });
// // // //     } finally {
// // // //       setIsClosingChat(false);
// // // //     }
// // // //   }

// // // //   const isChatClosed = (chatDoc as any)?.isClosed;

// // // //   return (
// // // //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // // //       <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
// // // //         <DialogHeader className="p-4 border-b">
// // // //           <DialogTitle>{isGroupChat ? t('chatGroup') : `${t('chatPrivate')} ${otherPartyName}`}</DialogTitle>
// // // //           {trip && (
// // // //             <DialogDescription>
// // // //               {t('tripRoute')} {trip.origin} - {trip.destination}
// // // //             </DialogDescription>
// // // //           )}
// // // //         </DialogHeader>

// // // //         <div className="flex-1 overflow-y-auto bg-muted/20">
// // // //           <MessageList messages={messages || []} isLoading={isLoading} currentUserId={user?.uid || ""} />
// // // //         </div>

// // // //         <DialogFooter className="p-4 border-t bg-background flex-col gap-2">
// // // //           <div className="flex w-full items-center space-x-2 rtl:space-x-reverse">
// // // //             {profile?.role === 'carrier' && !isChatClosed && (
// // // //               <AlertDialog>
// // // //                 <AlertDialogTrigger asChild>
// // // //                   <Button variant="destructive" size="icon">
// // // //                     <PowerOff className="h-4 w-4" />
// // // //                   </Button>
// // // //                 </AlertDialogTrigger>
// // // //                 <AlertDialogContent>
// // // //                   <AlertDialogHeader>
// // // //                     <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle />{t('confirmClose')}</AlertDialogTitle>
// // // //                     <AlertDialogDescription>
// // // //                       {t('confirmCloseDesc')}                    </AlertDialogDescription>
// // // //                   </AlertDialogHeader>
// // // //                   <AlertDialogFooter>
// // // //                     <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
// // // //                     <AlertDialogAction onClick={handleCloseChat} disabled={isClosingChat}>
// // // //                       {isClosingChat ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : t('confirmYes')}
// // // //                     </AlertDialogAction>
// // // //                   </AlertDialogFooter>
// // // //                 </AlertDialogContent>
// // // //               </AlertDialog>
// // // //             )}
// // // //             {isChatClosed ? (
// // // //               <div className="flex-1 text-center text-sm text-muted-foreground font-semibold">    {t('closedByCarrier')}</div>
// // // //             ) : (
// // // //               <>
// // // //                 <Input
// // // //                   id="message-input"
// // // //                   placeholder={t('messHere')}
// // // //                   value={newMessage}
// // // //                   onChange={(e) => setNewMessage(e.target.value)}
// // // //                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
// // // //                   disabled={isLoading}
// // // //                   className="flex-1"
// // // //                 />
// // // //                 <Button type="submit" size="icon" onClick={() => handleSendMessage()} disabled={!newMessage.trim()}>
// // // //                   <Send className="h-4 w-4" />
// // // //                   <span className="sr-only">{t('send')}</span>
// // // //                 </Button>
// // // //               </>
// // // //             )}
// // // //           </div>
// // // //           {profile?.role === 'carrier' && (
// // // //             <Button variant="ghost" className="w-fit self-end text-xs h-auto p-1" onClick={() => onOpenChange(false)}>
// // // //               <X className="ml-1 h-3 w-3" />
// // // //               {t('close')}
// // // //             </Button>
// // // //           )}
// // // //         </DialogFooter>
// // // //       </DialogContent>
// // // //     </Dialog>
// // // //   );
// // // // }


// // // 'use client';

// // // import { useState, useEffect } from 'react';
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogHeader,
// // //   DialogTitle,
// // //   DialogFooter,
// // //   DialogDescription,
// // // } from '@/components/ui/dialog';
// // // import { Button } from '@/components/ui/button';
// // // import { Input } from '@/components/ui/input';
// // // import { useUser, useFirestore, useCollection, updateDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
// // // import { collection, query, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';
// // // import type { Message, Trip } from '@/lib/data';
// // // import { MessageList } from './message-list';
// // // import { Loader2, Send, PowerOff, AlertTriangle, X } from 'lucide-react';
// // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // import { useToast } from '@/hooks/use-toast';
// // // import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
// // // import { useTranslations } from 'next-intl';

// // // interface ChatDialogProps {
// // //   isOpen: boolean;
// // //   onOpenChange: (isOpen: boolean) => void;
// // //   trip?: Trip | null;
// // //   bookingId?: string | null;
// // //   otherPartyName?: string;
// // //   otherPartyId?: string;
// // //   chatType?: "group" | "private";
// // // }

// // // /**
// // //  * @component ChatDialog
// // //  * @description THE REINFORCED CHAT HUB (STERILIZED - V3.0 - GHOST PURGE)
// // //  * [SCR-988]: Eradicated AI Suggestion Ghost logic to ensure build success.
// // //  * Protocol 16: Sterilized UI Logic.
// // //  */
// // // export function ChatDialog({ isOpen, onOpenChange, trip, bookingId, otherPartyName, otherPartyId, isGroupChat: _ignored }: ChatDialogProps & { isGroupChat?: boolean }) {
// // //   const { user } = useUser();
// // //   const { profile } = useUserProfile();
// // //   const firestore = useFirestore();
// // //   const [newMessage, setNewMessage] = useState('');
// // //   const { toast } = useToast();
// // //   const [isClosingChat, setIsClosingChat] = useState(false);
// // //   const t = useTranslations('chat')
// // //   const isGroupChat = !!trip;
// // //   const chatId = isGroupChat ? trip?.id : bookingId;

// // //   const messagesQuery = useMemoFirebase(() => {
// // //     if (!firestore || !chatId) return null;
// // //     return query(
// // //       collection(firestore, 'chats', chatId, 'messages'),
// // //       orderBy('timestamp', 'asc')
// // //     );
// // //   }, [firestore, chatId]);

// // //   const { data: messages, isLoading } = useCollection<Message>(messagesQuery);

// // //   const chatDocRef = useMemoFirebase(() => {
// // //     if (!firestore || !chatId) return null;
// // //     return doc(firestore, 'chats', chatId);
// // //   }, [firestore, chatId]);
// // //   const { data: chatDoc } = useDoc(chatDocRef);

// // //   useEffect(() => {
// // //     const ensureChatExists = async () => {
// // //       if (firestore && !isGroupChat && bookingId && otherPartyId && !(chatDoc as any)?.id) {
// // //         const chatDocRef = doc(firestore, 'chats', bookingId);
// // //         const guestId = `guest_${bookingId}`;
// // //         const participantId = user?.uid || guestId;
// // //         const chatData = {
// // //           id: bookingId,
// // //           isGroupChat: false,
// // //           participants: [participantId, otherPartyId],
// // //           unreadCounts: { [participantId]: 0, [otherPartyId]: 0 },
// // //           isClosed: false,
// // //           lastMessage: t('created'),
// // //           lastMessageSenderId: 'system',
// // //           lastMessageTimestamp: serverTimestamp(),
// // //         };
// // //         await setDoc(chatDocRef, chatData, { merge: true });
// // //       }
// // //     };
// // //     if (isOpen) {
// // //       ensureChatExists();
// // //     }
// // //   }, [isOpen, firestore, user, isGroupChat, bookingId, otherPartyId, chatDoc]);

// // //   const handleSendMessage = async (content?: string) => {
// // //     const messageContent = content || newMessage;
// // //     if (!firestore || !messageContent.trim() || !chatId) return;

// // //     // المسافر ممكن يكون مش logged in — نستخدم uid لو موجود وإلا anonymous
// // //     const senderId = user?.uid || `guest_${bookingId}`;
// // //     const senderName = profile?.firstName || otherPartyName || 'مسافر';

// // //     const messagesCollection = collection(firestore, 'chats', chatId, 'messages');
// // //     const chatDocRef = doc(firestore, 'chats', chatId);

// // //     const messageData = {
// // //       content: messageContent,
// // //       senderId,
// // //       senderName,
// // //       timestamp: serverTimestamp(),
// // //       clientTimestamp: new Date().toISOString(), // fallback لما النت قاطع
// // //     };

// // //     const { addDoc } = await import('firebase/firestore');
// // //     await addDoc(messagesCollection, messageData);

// // //     const chatUpdateData = {
// // //       lastMessage: messageContent,
// // //       lastMessageSenderId: senderId,
// // //       lastMessageTimestamp: serverTimestamp(),
// // //     };
// // //     updateDocumentNonBlocking(chatDocRef, chatUpdateData);

// // //     setNewMessage('');
// // //   };

// // //   const handleCloseChat = async () => {
// // //     if (!firestore || !chatId) return;
// // //     setIsClosingChat(true);
// // //     const chatDocRef = doc(firestore, 'chats', chatId);
// // //     try {
// // //       await updateDocumentNonBlocking(chatDocRef, { isClosed: true });
// // //       toast({ title: t('closedSuccess'), description: t('closedSuccessDesc') });
// // //       onOpenChange(false);
// // //     } catch (error) {
// // //       toast({ variant: 'destructive', title: t('closedFail') });
// // //     } finally {
// // //       setIsClosingChat(false);
// // //     }
// // //   }

// // //   const isChatClosed = (chatDoc as any)?.isClosed;

// // //   return (
// // //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // //       <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
// // //         <DialogHeader className="p-4 border-b">
// // //           <DialogTitle>{isGroupChat ? t('chatGroup') : `${t('chatPrivate')} ${otherPartyName}`}</DialogTitle>
// // //           {trip && (
// // //             <DialogDescription>
// // //               {t('tripRoute')} {trip.origin} - {trip.destination}
// // //             </DialogDescription>
// // //           )}
// // //         </DialogHeader>

// // //         <div className="flex-1 overflow-y-auto bg-muted/20">
// // //           <MessageList messages={messages || []} isLoading={isLoading} currentUserId={user?.uid || `guest_${bookingId}`} />
// // //         </div>

// // //         <DialogFooter className="p-4 border-t bg-background flex-col gap-2">
// // //           <div className="flex w-full items-center space-x-2 rtl:space-x-reverse">
// // //             {profile?.role === 'carrier' && !isChatClosed && (
// // //               <AlertDialog>
// // //                 <AlertDialogTrigger asChild>
// // //                   <Button variant="destructive" size="icon">
// // //                     <PowerOff className="h-4 w-4" />
// // //                   </Button>
// // //                 </AlertDialogTrigger>
// // //                 <AlertDialogContent>
// // //                   <AlertDialogHeader>
// // //                     <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle />{t('confirmClose')}</AlertDialogTitle>
// // //                     <AlertDialogDescription>
// // //                       {t('confirmCloseDesc')}                    </AlertDialogDescription>
// // //                   </AlertDialogHeader>
// // //                   <AlertDialogFooter>
// // //                     <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
// // //                     <AlertDialogAction onClick={handleCloseChat} disabled={isClosingChat}>
// // //                       {isClosingChat ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : t('confirmYes')}
// // //                     </AlertDialogAction>
// // //                   </AlertDialogFooter>
// // //                 </AlertDialogContent>
// // //               </AlertDialog>
// // //             )}
// // //             {isChatClosed ? (
// // //               <div className="flex-1 text-center text-sm text-muted-foreground font-semibold">    {t('closedByCarrier')}</div>
// // //             ) : (
// // //               <>
// // //                 <Input
// // //                   id="message-input"
// // //                   placeholder={t('messHere')}
// // //                   value={newMessage}
// // //                   onChange={(e) => setNewMessage(e.target.value)}
// // //                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
// // //                   disabled={isLoading}
// // //                   className="flex-1"
// // //                 />
// // //                 <Button type="submit" size="icon" onClick={() => handleSendMessage()} disabled={!newMessage.trim()}>
// // //                   <Send className="h-4 w-4" />
// // //                   <span className="sr-only">{t('send')}</span>
// // //                 </Button>
// // //               </>
// // //             )}
// // //           </div>
// // //           {profile?.role === 'carrier' && (
// // //             <Button variant="ghost" className="w-fit self-end text-xs h-auto p-1" onClick={() => onOpenChange(false)}>
// // //               <X className="ml-1 h-3 w-3" />
// // //               {t('close')}
// // //             </Button>
// // //           )}
// // //         </DialogFooter>
// // //       </DialogContent>
// // //     </Dialog>
// // //   );
// // // }


// // 'use client';

// // import { useState, useEffect } from 'react';
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogFooter,
// //   DialogDescription,
// // } from '@/components/ui/dialog';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { useUser, useFirestore, useCollection, updateDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
// // import { collection, query, orderBy, serverTimestamp, doc, setDoc, increment } from 'firebase/firestore';
// // import type { Message, Trip } from '@/lib/data';
// // import { MessageList } from './message-list';
// // import { Loader2, Send, PowerOff, AlertTriangle, X } from 'lucide-react';
// // import { useUserProfile } from '@/hooks/use-user-profile';
// // import { useToast } from '@/hooks/use-toast';
// // import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
// // import { useTranslations } from 'next-intl';

// // interface ChatDialogProps {
// //   isOpen: boolean;
// //   onOpenChange: (isOpen: boolean) => void;
// //   trip?: Trip | null;
// //   bookingId?: string | null;
// //   otherPartyName?: string;
// //   otherPartyId?: string;
// //   chatType?: "group" | "private";
// // }

// // /**
// //  * @component ChatDialog
// //  * @description THE REINFORCED CHAT HUB (STERILIZED - V3.0 - GHOST PURGE)
// //  * [SCR-988]: Eradicated AI Suggestion Ghost logic to ensure build success.
// //  * Protocol 16: Sterilized UI Logic.
// //  */
// // export function ChatDialog({ isOpen, onOpenChange, trip, bookingId, otherPartyName, otherPartyId, isGroupChat: _ignored }: ChatDialogProps & { isGroupChat?: boolean }) {
// //   const { user } = useUser();
// //   const { profile } = useUserProfile();
// //   const firestore = useFirestore();
// //   const [newMessage, setNewMessage] = useState('');
// //   const { toast } = useToast();
// //   const [isClosingChat, setIsClosingChat] = useState(false);
// //   const t = useTranslations('chat')
// //   const isGroupChat = !!trip;
// //   const chatId = isGroupChat ? trip?.id : bookingId;

// //   const messagesQuery = useMemoFirebase(() => {
// //     if (!firestore || !chatId) return null;
// //     return query(
// //       collection(firestore, 'chats', chatId, 'messages'),
// //       orderBy('timestamp', 'asc')
// //     );
// //   }, [firestore, chatId]);

// //   const { data: messages, isLoading } = useCollection<Message>(messagesQuery);

// //   const chatDocRef = useMemoFirebase(() => {
// //     if (!firestore || !chatId) return null;
// //     return doc(firestore, 'chats', chatId);
// //   }, [firestore, chatId]);
// //   const { data: chatDoc } = useDoc(chatDocRef);

// //   useEffect(() => {
// //     const ensureChatExists = async () => {
// //       if (firestore && !isGroupChat && bookingId && otherPartyId && !(chatDoc as any)?.id) {
// //         const chatDocRef = doc(firestore, 'chats', bookingId);
// //         const guestId = `guest_${bookingId}`;
// //         const participantId = user?.uid || guestId;
// //         const chatData = {
// //           id: bookingId,
// //           isGroupChat: false,
// //           participants: [participantId, otherPartyId],
// //           unreadCounts: { [participantId]: 0, [otherPartyId]: 0 },
// //           isClosed: false,
// //           lastMessage: t('created'),
// //           lastMessageSenderId: 'system',
// //           lastMessageTimestamp: serverTimestamp(),
// //         };
// //         await setDoc(chatDocRef, chatData, { merge: true });
// //       }
// //     };
// //     if (isOpen) {
// //       ensureChatExists();
// //     }
// //   }, [isOpen, firestore, user, isGroupChat, bookingId, otherPartyId, chatDoc]);

// //   const handleSendMessage = async (content?: string) => {
// //     const messageContent = content || newMessage;
// //     if (!firestore || !messageContent.trim() || !chatId) return;

// //     // المسافر ممكن يكون مش logged in — نستخدم uid لو موجود وإلا anonymous
// //     const senderId = user?.uid || `guest_${bookingId}`;
// //     const senderName = profile?.firstName || otherPartyName || 'مسافر';

// //     const messagesCollection = collection(firestore, 'chats', chatId, 'messages');
// //     const chatDocRef = doc(firestore, 'chats', chatId);

// //     const messageData = {
// //       content: messageContent,
// //       senderId,
// //       senderName,
// //       timestamp: serverTimestamp(),
// //       clientTimestamp: new Date().toISOString(), // fallback لما النت قاطع
// //     };

// //     const { addDoc } = await import('firebase/firestore');
// //     await addDoc(messagesCollection, messageData);

// //     // احسب الطرف التاني عشان تزود الـ unreadCounts بتاعته
// //     const participants: string[] = (chatDoc as any)?.participants || [];
// //     const otherParticipants = participants.filter((p: string) => p !== senderId);

// //     const unreadIncrement: Record<string, any> = {};
// //     otherParticipants.forEach((pid: string) => {
// //       unreadIncrement[`unreadCounts.${pid}`] = increment(1);
// //     });

// //     const chatUpdateData = {
// //       lastMessage: messageContent,
// //       lastMessageSenderId: senderId,
// //       lastMessageTimestamp: serverTimestamp(),
// //       ...unreadIncrement,
// //     };
// //     updateDocumentNonBlocking(chatDocRef, chatUpdateData);

// //     setNewMessage('');
// //   };

// //   const handleCloseChat = async () => {
// //     if (!firestore || !chatId) return;
// //     setIsClosingChat(true);
// //     const chatDocRef = doc(firestore, 'chats', chatId);
// //     try {
// //       await updateDocumentNonBlocking(chatDocRef, { isClosed: true });
// //       toast({ title: t('closedSuccess'), description: t('closedSuccessDesc') });
// //       onOpenChange(false);
// //     } catch (error) {
// //       toast({ variant: 'destructive', title: t('closedFail') });
// //     } finally {
// //       setIsClosingChat(false);
// //     }
// //   }

// //   const isChatClosed = (chatDoc as any)?.isClosed;

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
// //       <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
// //         <DialogHeader className="p-4 border-b">
// //           <DialogTitle>{isGroupChat ? t('chatGroup') : `${t('chatPrivate')} ${otherPartyName}`}</DialogTitle>
// //           {trip && (
// //             <DialogDescription>
// //               {t('tripRoute')} {trip.origin} - {trip.destination}
// //             </DialogDescription>
// //           )}
// //         </DialogHeader>

// //         <div className="flex-1 overflow-y-auto bg-muted/20">
// //           <MessageList messages={messages || []} isLoading={isLoading} currentUserId={user?.uid || `guest_${bookingId}`} />
// //         </div>

// //         <DialogFooter className="p-4 border-t bg-background flex-col gap-2">
// //           <div className="flex w-full items-center space-x-2 rtl:space-x-reverse">
// //             {profile?.role === 'carrier' && !isChatClosed && (
// //               <AlertDialog>
// //                 <AlertDialogTrigger asChild>
// //                   <Button variant="destructive" size="icon">
// //                     <PowerOff className="h-4 w-4" />
// //                   </Button>
// //                 </AlertDialogTrigger>
// //                 <AlertDialogContent>
// //                   <AlertDialogHeader>
// //                     <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle />{t('confirmClose')}</AlertDialogTitle>
// //                     <AlertDialogDescription>
// //                       {t('confirmCloseDesc')}                    </AlertDialogDescription>
// //                   </AlertDialogHeader>
// //                   <AlertDialogFooter>
// //                     <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
// //                     <AlertDialogAction onClick={handleCloseChat} disabled={isClosingChat}>
// //                       {isClosingChat ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : t('confirmYes')}
// //                     </AlertDialogAction>
// //                   </AlertDialogFooter>
// //                 </AlertDialogContent>
// //               </AlertDialog>
// //             )}
// //             {isChatClosed ? (
// //               <div className="flex-1 text-center text-sm text-muted-foreground font-semibold">    {t('closedByCarrier')}</div>
// //             ) : (
// //               <>
// //                 <Input
// //                   id="message-input"
// //                   placeholder={t('messHere')}
// //                   value={newMessage}
// //                   onChange={(e) => setNewMessage(e.target.value)}
// //                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
// //                   disabled={isLoading}
// //                   className="flex-1"
// //                 />
// //                 <Button type="submit" size="icon" onClick={() => handleSendMessage()} disabled={!newMessage.trim()}>
// //                   <Send className="h-4 w-4" />
// //                   <span className="sr-only">{t('send')}</span>
// //                 </Button>
// //               </>
// //             )}
// //           </div>
// //           {/* {profile?.role === 'carrier' && (
// //             <Button variant="ghost" className="w-fit self-end text-xs h-auto p-1" onClick={() => onOpenChange(false)}>
// //               <X className="ml-1 h-3 w-3" />
// //               {t('close')}
// //             </Button>
// //           )} */}
// //         </DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useUser, useFirestore, useCollection, updateDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
// import { collection, query, orderBy, serverTimestamp, doc, setDoc, increment } from 'firebase/firestore';
// import type { Message, Trip } from '@/lib/data';
// import { MessageList } from './message-list';
// import { Loader2, Send, PowerOff, AlertTriangle, X } from 'lucide-react';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { useToast } from '@/hooks/use-toast';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
// import { useTranslations } from 'next-intl';

// interface ChatDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
//   trip?: Trip | null;
//   bookingId?: string | null;
//   otherPartyName?: string;
//   otherPartyId?: string;
//   chatType?: "group" | "private";
// }

// /**
//  * @component ChatDialog
//  * @description THE REINFORCED CHAT HUB (STERILIZED - V3.0 - GHOST PURGE)
//  * [SCR-988]: Eradicated AI Suggestion Ghost logic to ensure build success.
//  * Protocol 16: Sterilized UI Logic.
//  */
// export function ChatDialog({ isOpen, onOpenChange, trip, bookingId, otherPartyName, otherPartyId, isGroupChat: _ignored }: ChatDialogProps & { isGroupChat?: boolean }) {
//   const { user } = useUser();
//   const { profile } = useUserProfile();
//   const firestore = useFirestore();
//   const [newMessage, setNewMessage] = useState('');
//   const { toast } = useToast();
//   const [isClosingChat, setIsClosingChat] = useState(false);
//   const t = useTranslations('chat')
//   const isGroupChat = !!trip;
//   const chatId = isGroupChat ? trip?.id : bookingId;

//   const messagesQuery = useMemoFirebase(() => {
//     if (!firestore || !chatId) return null;
//     return query(
//       collection(firestore, 'chats', chatId, 'messages'),
//       orderBy('timestamp', 'asc')
//     );
//   }, [firestore, chatId]);

//   const { data: messages, isLoading } = useCollection<Message>(messagesQuery);

//   const chatDocRef = useMemoFirebase(() => {
//     if (!firestore || !chatId) return null;
//     return doc(firestore, 'chats', chatId);
//   }, [firestore, chatId]);
//   const { data: chatDoc } = useDoc(chatDocRef);

//   useEffect(() => {
//     const ensureChatExists = async () => {
//       if (firestore && !isGroupChat && bookingId && otherPartyId && !(chatDoc as any)?.id) {
//         const chatDocRef = doc(firestore, 'chats', bookingId);
//         const guestId = `guest_${bookingId}`;
//         const participantId = user?.uid || guestId;
//         const chatData = {
//           id: bookingId,
//           isGroupChat: false,
//           participants: [participantId, otherPartyId],
//           unreadCounts: { [participantId]: 0, [otherPartyId]: 0 },
//           isClosed: false,
//           lastMessage: t('created'),
//           lastMessageSenderId: 'system',
//           lastMessageTimestamp: serverTimestamp(),
//         };
//         await setDoc(chatDocRef, chatData, { merge: true });
//       }
//     };
//     if (isOpen) {
//       ensureChatExists();
//     }
//   }, [isOpen, firestore, user, isGroupChat, bookingId, otherPartyId, chatDoc]);

//   const handleSendMessage = async (content?: string) => {
//     const messageContent = content || newMessage;
//     if (!firestore || !messageContent.trim() || !chatId) return;

//     // المسافر ممكن يكون مش logged in — نستخدم uid لو موجود وإلا anonymous
//     const senderId = user?.uid || `guest_${bookingId}`;
//     const senderName = profile?.firstName || otherPartyName || 'مسافر';

//     const messagesCollection = collection(firestore, 'chats', chatId, 'messages');
//     const chatDocRef = doc(firestore, 'chats', chatId);

//     const messageData = {
//       content: messageContent,
//       senderId,
//       senderName,
//       timestamp: serverTimestamp(),
//       clientTimestamp: new Date().toISOString(), // fallback لما النت قاطع
//     };

//     const { addDoc } = await import('firebase/firestore');
//     await addDoc(messagesCollection, messageData);

//     // احسب الطرف التاني عشان تزود الـ unreadCounts بتاعته
//     const participants: string[] = (chatDoc as any)?.participants || [];
//     const otherParticipants = participants.filter((p: string) => p !== senderId);

//     const unreadIncrement: Record<string, any> = {};
//     otherParticipants.forEach((pid: string) => {
//       unreadIncrement[`unreadCounts.${pid}`] = increment(1);
//     });

//     const chatUpdateData = {
//       lastMessage: messageContent,
//       lastMessageSenderId: senderId,
//       lastMessageTimestamp: serverTimestamp(),
//       ...unreadIncrement,
//     };
//     updateDocumentNonBlocking(chatDocRef, chatUpdateData);

//     // [NEW]: لو المرسل ناقل → ابعت notification لكل مسافر في الشات
//     if (profile?.role === 'carrier' && otherParticipants.length > 0 && firestore) {
//       const { addDoc: fsAdd, collection: fsCol, doc: fsDoc, serverTimestamp: fsST } = await import('firebase/firestore');
//       const senderDisplayName = profile?.firstName
//         ? `${profile.firstName} ${profile.lastName || ''}`.trim()
//         : 'الناقل';

//       await Promise.allSettled(
//         otherParticipants.map((userId: string) =>
//           fsAdd(
//             fsCol(fsDoc(firestore, 'users', userId), 'notifications'),
//             {
//               userId,
//               title: `رسالة جديدة من الناقل 💬`,
//               message: messageContent.slice(0, 80),
//               type: 'carrier_chat_message',
//               tripId: chatId,
//               isRead: false,
//               // link يوصل المسافر للتذكرة اللي فيها الشات
//               link: `/chats/${chatId}`,
//               createdAt: fsST(),
//             }
//           )
//         )
//       );

//       // Push notification كمان
//       await Promise.allSettled(
//         otherParticipants.map((userId: string) =>
//           fetch('/api/notify', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               userId,
//               title: `رسالة من الناقل ${senderDisplayName} 💬`,
//               body: messageContent.slice(0, 80),
//               data: { type: 'carrier_chat_message', tripId: chatId },
//             }),
//           })
//         )
//       );
//     }

//     setNewMessage('');
//   };

//   const handleCloseChat = async () => {
//     if (!firestore || !chatId) return;
//     setIsClosingChat(true);
//     const chatDocRef = doc(firestore, 'chats', chatId);
//     try {
//       await updateDocumentNonBlocking(chatDocRef, { isClosed: true });
//       toast({ title: t('closedSuccess'), description: t('closedSuccessDesc') });
//       onOpenChange(false);
//     } catch (error) {
//       toast({ variant: 'destructive', title: t('closedFail') });
//     } finally {
//       setIsClosingChat(false);
//     }
//   }

//   const isChatClosed = (chatDoc as any)?.isClosed;

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
//         <DialogHeader className="p-4 border-b">
//           <DialogTitle>{isGroupChat ? t('chatGroup') : `${t('chatPrivate')} ${otherPartyName}`}</DialogTitle>
//           {trip && (
//             <DialogDescription>
//               {t('tripRoute')} {trip.origin} - {trip.destination}
//             </DialogDescription>
//           )}
//         </DialogHeader>

//         <div className="flex-1 overflow-y-auto bg-muted/20">
//           <MessageList messages={messages || []} isLoading={isLoading} currentUserId={user?.uid || `guest_${bookingId}`} />
//         </div>

//         <DialogFooter className="p-4 border-t bg-background flex-col gap-2">
//           <div className="flex w-full items-center space-x-2 rtl:space-x-reverse">
//             {profile?.role === 'carrier' && !isChatClosed && (
//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Button variant="destructive" size="icon">
//                     <PowerOff className="h-4 w-4" />
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle />{t('confirmClose')}</AlertDialogTitle>
//                     <AlertDialogDescription>
//                       {t('confirmCloseDesc')}                    </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
//                     <AlertDialogAction onClick={handleCloseChat} disabled={isClosingChat}>
//                       {isClosingChat ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : t('confirmYes')}
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             )}
//             {isChatClosed ? (
//               <div className="flex-1 text-center text-sm text-muted-foreground font-semibold">    {t('closedByCarrier')}</div>
//             ) : (
//               <>
//                 <Input
//                   id="message-input"
//                   placeholder={t('messHere')}
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                   disabled={isLoading}
//                   className="flex-1"
//                 />
//                 <Button type="submit" size="icon" onClick={() => handleSendMessage()} disabled={!newMessage.trim()}>
//                   <Send className="h-4 w-4" />
//                   <span className="sr-only">{t('send')}</span>
//                 </Button>
//               </>
//             )}
//           </div>
//           {/* {profile?.role === 'carrier' && (
//             <Button variant="ghost" className="w-fit self-end text-xs h-auto p-1" onClick={() => onOpenChange(false)}>
//               <X className="ml-1 h-3 w-3" />
//               {t('close')}
//             </Button>
//           )} */}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
'use client';

/**
 * @file src/components/chat/chat-dialog.tsx
 * @description ChatDialog المحدّث — مع منطق الأرشفة التلقائية:
 *
 * ✅ لما الرحلة تنتهي (يُغلق الشات):
 *    → isClosed = true
 *    → archivedAt = serverTimestamp()   ← [NEW]
 *    → بعد 10 أيام من archivedAt تتحذف المحادثة (عبر Cloud Function)
 *
 * ✅ تصنيف المحادثات:
 *    - المجموعات  → isGroupChat=true + chatType='group'
 *    - الخاصة     → isGroupChat=false + chatType='private'
 *    - بين الناقلين → isCarrierRouteGroup=true + chatType='carrier_route'
 *
 * ✅ الأرشيف:
 *    - isClosed=true → ينتقل للأرشيف في صفحة الشاتات
 *    - بعد 10 أيام → cloud function تحذفه
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useUser, useFirestore, useCollection,
  updateDocumentNonBlocking, useDoc, useMemoFirebase,
} from '@/firebase';
import {
  collection, query, orderBy, serverTimestamp,
  doc, setDoc, increment,
} from 'firebase/firestore';
import type { Message, Trip } from '@/lib/data';
import { MessageList } from './message-list';
import { Loader2, Send, PowerOff, AlertTriangle } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { useTranslations } from 'next-intl';

interface ChatDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  trip?: Trip | null;
  bookingId?: string | null;
  otherPartyName?: string;
  otherPartyId?: string;
  chatType?: 'group' | 'private' | 'carrier_route';
}

export function ChatDialog({
  isOpen,
  onOpenChange,
  trip,
  bookingId,
  otherPartyName,
  otherPartyId,
  isGroupChat: _ignored,
  chatType,
}: ChatDialogProps & { isGroupChat?: boolean }) {
  const { user } = useUser();
  const { profile } = useUserProfile();
  const firestore = useFirestore();
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  const [isClosingChat, setIsClosingChat] = useState(false);
  const t = useTranslations('chat');

  const isGroupChat = !!trip;
  const chatId = isGroupChat ? trip?.id : bookingId;

  // ── الرسائل ──
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !chatId) return null;
    return query(
      collection(firestore, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc'),
    );
  }, [firestore, chatId]);

  const { data: messages, isLoading } = useCollection<Message>(messagesQuery);

  // ── بيانات الشات ──
  const chatDocRef = useMemoFirebase(() => {
    if (!firestore || !chatId) return null;
    return doc(firestore, 'chats', chatId);
  }, [firestore, chatId]);

  const { data: chatDoc } = useDoc(chatDocRef);

  // ── أنشئ الشات الخاص لو مش موجود ──
  useEffect(() => {
    const ensureChatExists = async () => {
      if (firestore && !isGroupChat && bookingId && otherPartyId && !(chatDoc as any)?.id) {
        const ref = doc(firestore, 'chats', bookingId);
        const guestId = `guest_${bookingId}`;
        const participantId = user?.uid || guestId;
        await setDoc(ref, {
          id: bookingId,
          isGroupChat: false,
          chatType: 'private',
          participants: [participantId, otherPartyId],
          unreadCounts: { [participantId]: 0, [otherPartyId]: 0 },
          isClosed: false,
          archivedAt: null,
          lastMessage: t('created'),
          lastMessageSenderId: 'system',
          lastMessageTimestamp: serverTimestamp(),
        }, { merge: true });
      }
    };
    if (isOpen) ensureChatExists();
  }, [isOpen, firestore, user, isGroupChat, bookingId, otherPartyId, chatDoc]);

  // ── إرسال رسالة ──
  const handleSendMessage = async (content?: string) => {
    const messageContent = content || newMessage;
    if (!firestore || !messageContent.trim() || !chatId) return;

    const senderId = user?.uid || `guest_${bookingId}`;
    const senderName = profile?.firstName || otherPartyName || 'مسافر';

    const messagesCollection = collection(firestore, 'chats', chatId, 'messages');
    const ref = doc(firestore, 'chats', chatId);

    const { addDoc } = await import('firebase/firestore');
    await addDoc(messagesCollection, {
      content: messageContent,
      senderId,
      senderName,
      timestamp: serverTimestamp(),
      clientTimestamp: new Date().toISOString(),
    });

    // زوّد عداد القراءة للمشاركين الآخرين
    const participants: string[] = (chatDoc as any)?.participants || [];
    const others = participants.filter((p: string) => p !== senderId);
    const unreadIncrement: Record<string, any> = {};
    others.forEach((pid: string) => {
      unreadIncrement[`unreadCounts.${pid}`] = increment(1);
    });

    updateDocumentNonBlocking(ref, {
      lastMessage: messageContent,
      lastMessageSenderId: senderId,
      lastMessageTimestamp: serverTimestamp(),
      ...unreadIncrement,
    });

    // أرسل notification للمسافرين لو المرسل ناقل
    if (profile?.role === 'carrier' && others.length > 0 && firestore) {
      const { addDoc: fsAdd, collection: fsCol, doc: fsDoc, serverTimestamp: fsST } = await import('firebase/firestore');
      const senderDisplayName = profile?.firstName
        ? `${profile.firstName} ${profile.lastName || ''}`.trim()
        : 'الناقل';

      await Promise.allSettled([
        ...others.map((userId: string) =>
          fsAdd(
            fsCol(fsDoc(firestore, 'users', userId), 'notifications'),
            {
              userId,
              title: `رسالة جديدة من الناقل 💬`,
              message: messageContent.slice(0, 80),
              type: 'carrier_chat_message',
              tripId: chatId,
              isRead: false,
              link: `/chats/${chatId}`,
              createdAt: fsST(),
            },
          )
        ),
        ...others.map((userId: string) =>
          fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              title: `رسالة من الناقل ${senderDisplayName} 💬`,
              body: messageContent.slice(0, 80),
              data: { type: 'carrier_chat_message', tripId: chatId },
            }),
          })
        ),
      ]);
    }

    setNewMessage('');
  };

  // ── إغلاق الشات (عند انتهاء الرحلة) → ينتقل للأرشيف ──
  const handleCloseChat = async () => {
    if (!firestore || !chatId) return;
    setIsClosingChat(true);
    const ref = doc(firestore, 'chats', chatId);
    try {
      // [KEY]: isClosed=true + archivedAt → ينتقل للأرشيف
      // بعد 10 أيام من archivedAt → cloud function تحذفه
      await updateDocumentNonBlocking(ref, {
        isClosed: true,
        archivedAt: serverTimestamp(),   // ← [NEW] وقت الأرشفة
      });
      toast({ title: t('closedSuccess'), description: t('closedSuccessDesc') });
      onOpenChange(false);
    } catch (error) {
      toast({ variant: 'destructive', title: t('closedFail') });
    } finally {
      setIsClosingChat(false);
    }
  };

  const isChatClosed = (chatDoc as any)?.isClosed;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>
            {isGroupChat ? t('chatGroup') : `${t('chatPrivate')} ${otherPartyName}`}
          </DialogTitle>
          {trip && trip.origin && (
            <DialogDescription>
              {t('tripRoute')} {trip.origin} - {trip.destination}
            </DialogDescription>
          )}
          {isChatClosed && (
            <p className="text-xs text-muted-foreground mt-1">
              📦 هذه المحادثة في الأرشيف — ستُحذف تلقائياً بعد 10 أيام من انتهاء الرحلة
            </p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-muted/20">
          <MessageList
            messages={messages || []}
            isLoading={isLoading}
            currentUserId={user?.uid || `guest_${bookingId}`}
          />
        </div>

        <DialogFooter className="p-4 border-t bg-background flex-col gap-2">
          <div className="flex w-full items-center space-x-2 rtl:space-x-reverse">
            {/* زر إغلاق الشات — للناقل فقط + الشات مش مغلق */}
            {profile?.role === 'carrier' && !isChatClosed && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" title="إنهاء المحادثة وأرشفتها">
                    <PowerOff className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle />
                      {t('confirmClose')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('confirmCloseDesc')}
                      {' '}ستنتقل المحادثة للأرشيف وتُحذف نهائياً بعد 10 أيام.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCloseChat} disabled={isClosingChat}>
                      {isClosingChat
                        ? <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        : t('confirmYes')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {isChatClosed ? (
              <div className="flex-1 text-center text-sm text-muted-foreground font-semibold">
                {t('closedByCarrier')}
              </div>
            ) : (
              <>
                <Input
                  id="message-input"
                  placeholder={t('messHere')}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  onClick={() => handleSendMessage()}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">{t('send')}</span>
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}