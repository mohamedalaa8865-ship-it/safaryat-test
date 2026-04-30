// 'use client';

// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useChatPulse } from '@/hooks/use-chat-pulse';
// import { cn, triggerHaptic } from '@/lib/utils';
// import { Card } from '@/components/ui/card';
// import { useTranslations } from 'next-intl';
// /**
//  * @component FloatingChatBubble
//  * @description THE STERILIZED PRESENTATION ISLAND (V2.0 - SCR-917-STERILIZED)
//  * Protocol 16: Dumb UI Component. Zero logic bleed.
//  * Protocol 13: High-contrast PWA interface. CSS Freeze compliant.
//  */
// export function FloatingChatBubble({ tripId }: { tripId: string }) {
//     const [isOpen, setIsOpen] = useState(false);
//     const [newMessage, setNewMessage] = useState('');
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const t = useTranslations('traveler');
//     // [PROTOCOL 88]: Logic encapsulated in the hook artery
//     const { messages, sendMessage, isSending, currentGuestId } = useChatPulse(tripId, isOpen);

//     const scrollToBottom = useCallback(() => {
//         if (messagesEndRef.current) {
//             messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//         }
//     }, []);

//     useEffect(() => {
//         if (isOpen && messages.length > 0) {
//             scrollToBottom();
//         }
//     }, [messages, isOpen, scrollToBottom]);

//     const handleToggle = useCallback(() => {
//         triggerHaptic('light');
//         setIsOpen(prev => !prev);
//     }, []);

//     const handleSend = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const text = newMessage.trim();
//         if (!text || isSending) return;

//         triggerHaptic('success');
//         await sendMessage(text, t('travelerSender'), 'traveler');
//         setNewMessage('');
//     };

//     return (
//         <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-end gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             {isOpen && (
//                 <Card className="w-[calc(100vw-3rem)] sm:w-80 h-[450px] flex flex-col bg-background border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden border-2 animate-in zoom-in-95">
//                     {/* Header */}
//                     <div className="bg-primary/10 p-4 flex justify-between items-center border-b border-primary/10 backdrop-blur-md">
//                         <div className="flex items-center gap-2">
//                             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//                             <span className="text-xs font-black text-foreground uppercase tracking-tight">{t('directContact')}</span>
//                         </div>
//                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10 text-muted-foreground" onClick={handleToggle}>
//                             <X className="h-4 w-4" />
//                         </Button>
//                     </div>

//                     {/* Chat Area */}
//                     <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5 no-scrollbar">
//                         {messages.length === 0 ? (
//                             <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-40">
//                                 <MessageCircle className="h-10 w-10 text-primary" />
//                                 <p className="text-[10px] font-bold text-foreground">{t('chatDesc')}</p>
//                             </div>
//                         ) : (
//                             messages.map((msg) => {
//                                 const isMe = msg.senderId === currentGuestId;
//                                 return (
//                                     <div key={msg.id} className={cn("flex flex-col max-w-[85%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}>
//                                         <span className="text-[8px] font-black text-muted-foreground mb-1 px-1 uppercase">{isMe ? t('you') : msg.senderName}</span>
//                                         <div className={cn(
//                                             "px-4 py-2.5 rounded-2xl text-xs font-medium shadow-sm leading-relaxed",
//                                             isMe ? "bg-primary text-black rounded-br-none" : "bg-card text-foreground border border-primary/10 rounded-bl-none"
//                                         )}>
//                                             {msg.text}
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         )}
//                         <div ref={messagesEndRef} />
//                     </div>

//                     {/* Input Area */}
//                     <form onSubmit={handleSend} className="p-3 bg-card border-t border-primary/10 flex gap-2">
//                         <Input
//                             value={newMessage}
//                             onChange={(e) => setNewMessage(e.target.value)}
//                             placeholder={t('messagePlaceholder')}
//                             className="h-11 rounded-2xl bg-muted/20 border-primary/5 text-xs font-bold focus-visible:ring-primary/30"
//                             disabled={isSending}
//                         />
//                         <Button type="submit" size="icon" className="h-11 w-11 rounded-2xl shadow-lg shrink-0" disabled={isSending || !newMessage.trim()}>
//                             {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//                         </Button>
//                     </form>
//                 </Card>
//             )}

//             <Button
//                 onClick={handleToggle}
//                 className={cn(
//                     "h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-90",
//                     isOpen ? "bg-destructive text-white" : "bg-primary text-black hover:bg-primary/90 animate-bounce"
//                 )}
//             >
//                 {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
//             </Button>
//         </div>
//     );
// }


'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatPulse } from '@/hooks/use-chat-pulse';
import { cn, triggerHaptic } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

/**
 * @component FloatingChatBubble
 * @description THE STERILIZED PRESENTATION ISLAND (V3.0 - SCR-917-PHONE-VERIFIED)
 * [V3.0]: Added phone verification gate before chat access.
 * Passenger enters their phone → verified against passengersDetails from parent → identity locked.
 * Protocol 16: Dumb UI Component. Zero logic bleed.
 */

interface FloatingChatBubbleProps {
    tripId: string;
    // قائمة أرقام الموبايل الموجودة في passengersDetails للرحلة/الحجز
    // الـ ticket page بيمررها — لو مش موجودة الـ gate بيفتح بدون تحقق (حالة backward compat)
    allowedPhones?: string[];
    // الاسم المقابل للرقم — لو الـ ticket page قدر يجيبه
    passengerName?: string;
}

export function FloatingChatBubble({ tripId, allowedPhones, passengerName }: FloatingChatBubbleProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [verifiedPhone, setVerifiedPhone] = useState<string>('');
    const [verifiedName, setVerifiedName] = useState<string>('');
    const [phoneInput, setPhoneInput] = useState('');
    const [verifyError, setVerifyError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('traveler');

    // [V3.0]: استرجع الهوية المتحقق منها من sessionStorage لو موجودة من جلسة سابقة في نفس التاب
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = sessionStorage.getItem(`safar_verified_id_${tripId}`);
        if (saved?.startsWith('phone_')) {
            const phone = saved.replace('phone_', '');
            setVerifiedPhone(phone);
            setVerifiedName(passengerName || 'مسافر');
        }
    }, [tripId, passengerName]);

    const { messages, sendMessage, isSending, currentGuestId } = useChatPulse(tripId, isOpen, verifiedPhone || undefined);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (isOpen && messages.length > 0) scrollToBottom();
    }, [messages, isOpen, scrollToBottom]);

    const handleToggle = useCallback(() => {
        triggerHaptic('light');
        setIsOpen(prev => !prev);
    }, []);

    // [V3.0]: التحقق من الرقم — بيقارنه مع allowedPhones
    const handleVerify = useCallback(() => {
        const raw = phoneInput.trim().replace(/\s+/g, '');
        if (!raw) {
            setVerifyError('أدخل رقم موبايلك أولاً');
            return;
        }

        // لو مفيش allowedPhones (backward compat) — نقبل أي رقم
        if (!allowedPhones || allowedPhones.length === 0) {
            setVerifiedPhone(raw);
            setVerifiedName(passengerName || 'مسافر');
            setVerifyError('');
            return;
        }

        setIsVerifying(true);
        // تطبيع الأرقام: نشيل أي +962 أو 00962 ونخلي آخر 9 أرقام للمقارنة
        const normalize = (p: string) => p.replace(/^\+|^00/, '').replace(/^962/, '').replace(/^0/, '').slice(-9);
        const normalizedInput = normalize(raw);
        const match = allowedPhones.find(p => normalize(p) === normalizedInput);

        setTimeout(() => {
            setIsVerifying(false);
            if (match) {
                setVerifiedPhone(match);
                setVerifiedName(passengerName || 'مسافر');
                setVerifyError('');
                triggerHaptic('success');
            } else {
                setVerifyError('الرقم غير مطابق لبيانات الحجز');
                triggerHaptic('light');
            }
        }, 400); // تأخير بسيط لمنع brute force وإعطاء UX feedback
    }, [phoneInput, allowedPhones, passengerName]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = newMessage.trim();
        if (!text || isSending) return;
        triggerHaptic('success');
        await sendMessage(text, verifiedName || t('travelerSender'), 'traveler');
        setNewMessage('');
    };

    // [UI]: شاشة التحقق بالرقم
    const renderVerifyGate = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-5 text-center">
            <div className="bg-primary/10 p-4 rounded-full">
                <Phone className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-black text-foreground">تحقق من هويتك</p>
                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                    أدخل رقم موبايلك المسجل في الحجز للتواصل مع الناقل
                </p>
            </div>
            <div className="w-full space-y-2">
                <Input
                    type="tel"
                    dir="ltr"
                    placeholder="07XXXXXXXX"
                    value={phoneInput}
                    onChange={e => { setPhoneInput(e.target.value); setVerifyError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleVerify()}
                    className="h-11 rounded-2xl bg-muted/20 border-primary/10 text-center text-sm font-bold tracking-widest"
                    disabled={isVerifying}
                />
                {verifyError && (
                    <p className="text-[10px] text-destructive font-bold">{verifyError}</p>
                )}
                <Button
                    onClick={handleVerify}
                    disabled={isVerifying || !phoneInput.trim()}
                    className="w-full h-11 rounded-2xl font-black text-xs gap-2"
                >
                    {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    {isVerifying ? 'جاري التحقق...' : 'تحقق ودخل'}
                </Button>
            </div>
        </div>
    );

    // [UI]: منطقة الشات بعد التحقق
    const renderChat = () => (
        <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5 no-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-40">
                        <MessageCircle className="h-10 w-10 text-primary" />
                        <p className="text-[10px] font-bold text-foreground">{t('chatDesc')}</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === currentGuestId;
                        return (
                            <div key={msg.id} className={cn('flex flex-col max-w-[85%]', isMe ? 'ml-auto items-end' : 'mr-auto items-start')}>
                                <span className="text-[8px] font-black text-muted-foreground mb-1 px-1 uppercase">
                                    {isMe ? t('you') : msg.senderName}
                                </span>
                                <div className={cn(
                                    'px-4 py-2.5 rounded-2xl text-xs font-medium shadow-sm leading-relaxed',
                                    isMe
                                        ? 'bg-primary text-black rounded-br-none'
                                        : 'bg-card text-foreground border border-primary/10 rounded-bl-none'
                                )}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-card border-t border-primary/10 flex gap-2">
                <Input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder={t('messagePlaceholder')}
                    className="h-11 rounded-2xl bg-muted/20 border-primary/5 text-xs font-bold focus-visible:ring-primary/30"
                    disabled={isSending}
                />
                <Button type="submit" size="icon" className="h-11 w-11 rounded-2xl shadow-lg shrink-0" disabled={isSending || !newMessage.trim()}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </form>
        </>
    );

    const isVerified = !!verifiedPhone;

    return (
        <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-end gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isOpen && (
                <Card className="w-[calc(100vw-3rem)] sm:w-80 h-[450px] flex flex-col bg-background border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden border-2 animate-in zoom-in-95">
                    {/* Header */}
                    <div className="bg-primary/10 p-4 flex justify-between items-center border-b border-primary/10 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <div className={cn('h-2 w-2 rounded-full', isVerified ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400')} />
                            <span className="text-xs font-black text-foreground uppercase tracking-tight">
                                {isVerified ? t('directContact') : 'التحقق من الهوية'}
                            </span>
                            {isVerified && (
                                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                            )}
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10 text-muted-foreground" onClick={handleToggle}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Content: gate أو chat */}
                    {isVerified ? renderChat() : renderVerifyGate()}
                </Card>
            )}

            <Button
                onClick={handleToggle}
                className={cn(
                    'h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-90',
                    isOpen ? 'bg-destructive text-white' : 'bg-primary text-black hover:bg-primary/90 animate-bounce'
                )}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </Button>
        </div>
    );
}