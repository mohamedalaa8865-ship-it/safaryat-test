'use client';

/**
 * @page AgentChatPage
 * @description صفحة شات الوكيل مع فريق الإدارة عبر agent_approval_chats
 */

import { useState, useEffect, useRef } from 'react';
import { useFirestore, useUser } from '@/firebase';
import {
    collection, addDoc, query, orderBy,
    onSnapshot, serverTimestamp, doc, getDoc,
    setDoc, updateDoc,
} from 'firebase/firestore';
import { Send, Loader2, MessageSquare, Sparkles, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/use-user-profile';

interface Message {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    timestamp: any;
    type?: 'text' | 'system';
}

export default function AgentChatPage() {
    const firestore = useFirestore();
    const { user } = useUser();
    const { profile } = useUserProfile();
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [chatReady, setChatReady] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const chatId = user?.uid ?? null;

    // ── إنشاء / التحقق من الـ chat ──
    useEffect(() => {
        if (!firestore || !user || !chatId) return;

        const initChat = async () => {
            const chatRef = doc(firestore, 'agent_approval_chats', chatId);
            const chatSnap = await getDoc(chatRef);

            if (!chatSnap.exists()) {
                await setDoc(chatRef, {
                    agentUid: user.uid,
                    agentName: profile?.firstName || 'وكيل',
                    agentEmail: profile?.email || '',
                    status: 'active',
                    createdAt: serverTimestamp(),
                    lastMessage: '',
                    lastMessageTimestamp: serverTimestamp(),
                });
            }
            setChatReady(true);
        };

        initChat();
    }, [firestore, user, chatId, profile]);

    // ── الاستماع للرسائل ──
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

    // ── إرسال رسالة ──
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
                    senderName: profile?.firstName || 'وكيل',
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
        <div className="flex flex-col h-[100dvh] bg-background" dir="rtl">

            {/* ── الهيدر ── */}
            <div className="flex items-center gap-3 px-4 py-4 border-b bg-card shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="font-black text-sm text-foreground">فريق سفريات</p>
                    <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" /> متاح على مدار اليوم
                    </p>
                </div>
            </div>

            {/* ── الرسائل ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-6">
                {messages.length === 0 && chatReady && (
                    <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
                        <Sparkles className="h-8 w-8 text-primary opacity-30" />
                        <p className="text-xs text-muted-foreground text-center font-bold">
                            ابدأ المحادثة مع فريقنا
                            <br />سنرد عليك في أقرب وقت
                        </p>
                    </div>
                )}

                {messages.map((msg) => {
                    if (msg.type === 'system') {
                        return (
                            <div key={msg.id} className="flex justify-center">
                                <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2.5 max-w-[85%] text-center">
                                    <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{msg.content}</p>
                                </div>
                            </div>
                        );
                    }

                    const isMe = msg.senderId === user?.uid;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${isMe
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-foreground border'
                                }`}>
                                {!isMe && (
                                    <p className="text-[10px] font-black text-primary mb-1">{msg.senderName}</p>
                                )}
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* ── حقل الإدخال — فوق الناف بار بـ pb-20 ── */}
            <div className="shrink-0 border-t p-3 pb-20 flex gap-2 bg-background">
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
                    className="rounded-xl shrink-0"
                >
                    {sending
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Send className="h-4 w-4" />
                    }
                </Button>
            </div>
        </div>
    );
}