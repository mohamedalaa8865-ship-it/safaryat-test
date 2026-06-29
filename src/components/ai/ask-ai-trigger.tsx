// // // 'use client';

// // // /**
// // //  * @component AskAiTrigger
// // //  * @description الواجهة العائمة للمساعد الذكي [SCR-943 - THE SOVEREIGN EYE]
// // //  * [PROTOCOL 16]: Sterilized UI. يعتمد كلياً على مفاعل useSovereignAI.
// // //  * [CSS FREEZE]: يلتزم بالهوية البصرية الماسية للقلعة.
// // //  */

// // // import { useState } from 'react';
// // // import { usePathname } from 'next/navigation';
// // // import { useUserProfile } from '@/hooks/use-user-profile';
// // // import { askAi } from '@/ai/flows/ask-ai-flow';
// // // import { useSovereignAI } from '@/hooks/use-sovereign-ai';
// // // import { Button } from '@/components/ui/button';
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogHeader,
// // //   DialogTitle,
// // //   DialogTrigger,
// // // } from '@/components/ui/dialog';
// // // import { Input } from '@/components/ui/input';
// // // import { Sparkles, Send, Loader2, Bot, User, ShieldCheck, X } from 'lucide-react';
// // // import { ScrollArea } from '@/components/ui/scroll-area';
// // // import { cn } from '@/lib/utils';

// // // export function AskAiTrigger() {
// // //   const pathname = usePathname();
// // //   const { profile, securityLevel } = useUserProfile();
// // //   const [open, setOpen] = useState(false);
// // //   const [question, setQuestion] = useState('');
// // //   const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);

// // //   const { isStreaming, executePrompt } = useSovereignAI(askAi);

// // //   // const handleAsk = async (e: React.FormEvent) => {
// // //   //   e.preventDefault();
// // //   //   if (!question.trim() || isStreaming) return;

// // //   //   const currentQuestion = question;
// // //   //   setQuestion('');
// // //   //   setChatHistory(prev => [...prev, { role: 'user', text: currentQuestion }]);

// // //   //   try {
// // //   //     const answer = await executePrompt({
// // //   //       question: currentQuestion,
// // //   //       context: {
// // //   //         path: pathname,
// // //   //         role: profile?.role || 'visitor'
// // //   //       }
// // //   //     });
// // //   //     setChatHistory(prev => [...prev, { role: 'ai', text: answer }]);
// // //   //   } catch (err) {
// // //   //     setChatHistory(prev => [...prev, { role: 'ai', text: 'عذراً، تعذر الاتصال بالنواة الذكية حالياً.' }]);
// // //   //   }
// // //   // };
// // //   const handleAsk = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (!question.trim() || isStreaming) return;

// // //     const currentQuestion = question;
// // //     setQuestion('');
// // //     setChatHistory(prev => [...prev, { role: 'user', text: currentQuestion }]);

// // //     try {
// // //       // 1. استدعاء الـ prompt والحصول على الكائن المسترجع
// // //       const result = await executePrompt({
// // //         question: currentQuestion,
// // //         context: {
// // //           path: pathname,
// // //           role: profile?.role || 'visitor'
// // //         }
// // //       });

// // //       // 2. قراءة الحقل answerText المتوافق مع AskAiOutputSchema
// // //       const aiResponseText = result?.answerText || 'لم أتمكن من معالجة الرد.';

// // //       setChatHistory(prev => [...prev, { role: 'ai', text: aiResponseText }]);
// // //     } catch (err) {
// // //       console.error("AI Error:", err);
// // //       setChatHistory(prev => [...prev, { role: 'ai', text: 'عذراً، تعذر الاتصال بالنواة الذكية حالياً.' }]);
// // //     }
// // //   };
// // //   return (
// // //     <Dialog open={open} onOpenChange={setOpen}>
// // //       <DialogTrigger asChild>
// // //         <Button
// // //           className="fixed bottom-24 left-6 z-[100] h-14 w-14 rounded-full shadow-2xl bg-primary text-black hover:bg-primary/90 animate-in fade-in slide-in-from-bottom-10 duration-1000 group active:scale-90 transition-all border-4 border-background"
// // //           size="icon"
// // //         >
// // //           <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
// // //           <span className="sr-only">اسأل المساعد السيادي</span>
// // //         </Button>
// // //       </DialogTrigger>

// // //       <DialogContent className="sm:max-w-[450px] h-[600px] flex flex-col p-0 overflow-hidden border-2 border-primary/20 bg-card/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_0_50px_rgba(190,174,119,0.2)]" dir="rtl">
// // //         <DialogHeader className="p-6 bg-primary/10 border-b border-primary/10 flex flex-row items-center justify-between space-y-0">
// // //           <div className="flex items-center gap-3">
// // //             <div className="p-2 bg-primary text-black rounded-xl shadow-lg">
// // //               <Bot className="h-6 w-6" />
// // //             </div>
// // //             <div>
// // //               <DialogTitle className="text-xl font-black italic uppercase tracking-tighter">مساعد سفريات</DialogTitle>
// // //               <div className="flex items-center gap-1 mt-0.5">
// // //                 <ShieldCheck className="h-3 w-3 text-primary" />
// // //                 <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Sovereign Intelligence v1.0</span>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </DialogHeader>

// // //         <ScrollArea className="flex-1 p-6">
// // //           <div className="space-y-6">
// // //             {chatHistory.length === 0 && (
// // //               <div className="text-center py-12 space-y-4 opacity-40">
// // //                 <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
// // //                 <p className="text-sm font-bold">أهلاً بك أيها القائد. كيف يمكنني دعم عملياتك السيادية اليوم؟</p>
// // //               </div>
// // //             )}

// // //             {chatHistory.map((msg, i) => (
// // //               <div key={i} className={cn(
// // //                 "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
// // //                 msg.role === 'user' ? "mr-auto items-start" : "ml-auto items-end"
// // //               )}>
// // //                 <div className="flex items-center gap-2 mb-1 px-1">
// // //                   {msg.role === 'user' ? <User className="h-3 w-3 opacity-40" /> : <Bot className="h-3 w-3 text-primary" />}
// // //                   <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
// // //                     {msg.role === 'user' ? 'أنت' : 'الذكاء السيادي'}
// // //                   </span>
// // //                 </div>
// // //                 <div className={cn(
// // //                   "px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm",
// // //                   msg.role === 'user'
// // //                     ? "bg-muted/50 text-foreground rounded-tr-none border border-white/5"
// // //                     : "bg-primary text-black font-bold rounded-tl-none"
// // //                 )}>
// // //                   {msg.text}
// // //                 </div>
// // //               </div>
// // //             ))}

// // //             {isStreaming && (
// // //               <div className="flex items-center gap-2 text-primary animate-pulse ml-auto">
// // //                 <Loader2 className="h-4 w-4 animate-spin" />
// // //                 <span className="text-[10px] font-black uppercase">جاري استحضار الحقيقة...</span>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </ScrollArea>

// // //         <div className="p-4 bg-background/50 border-t border-primary/10">
// // //           <form onSubmit={handleAsk} className="relative">
// // //             <Input
// // //               placeholder="اكتب استفسارك هنا..."
// // //               value={question}
// // //               onChange={(e) => setQuestion(e.target.value)}
// // //               disabled={isStreaming}
// // //               className="h-14 pr-4 pl-14 rounded-2xl bg-muted/20 border-primary/10 font-bold focus-visible:ring-primary/30"
// // //             />
// // //             <Button
// // //               type="submit"
// // //               size="icon"
// // //               disabled={!question.trim() || isStreaming}
// // //               className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl shadow-lg active:scale-90 transition-all"
// // //             >
// // //               {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
// // //             </Button>
// // //           </form>
// // //           <p className="text-[8px] text-center text-muted-foreground mt-3 font-medium uppercase tracking-tighter">
// // //             إجابات المساعد تخضع لبروتوكولات الأمان والنزاهة الرقمية.
// // //           </p>
// // //         </div>
// // //       </DialogContent>
// // //     </Dialog>
// // //   );
// // // }

// // 'use client';

// // /**
// //  * @component AskAiTrigger
// //  * @description الواجهة العائمة للمساعد الذكي [SCR-943 - THE SOVEREIGN EYE]
// //  * [PROTOCOL 16]: Sterilized UI. يعتمد كلياً على مفاعل useSovereignAI.
// //  * [CSS FREEZE]: يلتزم بالهوية البصرية الماسية للقلعة.
// //  */

// // import { useState } from 'react';
// // import { usePathname } from 'next/navigation';
// // import { useUserProfile } from '@/hooks/use-user-profile';
// // import { askAi } from '@/ai/flows/ask-ai-flow';
// // import { useSovereignAI } from '@/hooks/use-sovereign-ai';
// // import { Button } from '@/components/ui/button';
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from '@/components/ui/dialog';
// // import { Input } from '@/components/ui/input';
// // import { Sparkles, Send, Loader2, Bot, User, ShieldCheck, X } from 'lucide-react';
// // import { ScrollArea } from '@/components/ui/scroll-area';
// // import { cn } from '@/lib/utils';

// // export function AskAiTrigger() {
// //   const pathname = usePathname();
// //   const { profile, securityLevel } = useUserProfile();
// //   const [open, setOpen] = useState(false);
// //   const [question, setQuestion] = useState('');
// //   const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);

// //   const { isStreaming, executePrompt } = useSovereignAI(askAi);

// //   // const handleAsk = async (e: React.FormEvent) => {
// //   //   e.preventDefault();
// //   //   if (!question.trim() || isStreaming) return;

// //   //   const currentQuestion = question;
// //   //   setQuestion('');
// //   //   setChatHistory(prev => [...prev, { role: 'user', text: currentQuestion }]);

// //   //   try {
// //   //     const answer = await executePrompt({
// //   //       question: currentQuestion,
// //   //       context: {
// //   //         path: pathname,
// //   //         role: profile?.role || 'visitor'
// //   //       }
// //   //     });
// //   //     setChatHistory(prev => [...prev, { role: 'ai', text: answer }]);
// //   //   } catch (err) {
// //   //     setChatHistory(prev => [...prev, { role: 'ai', text: 'عذراً، تعذر الاتصال بالنواة الذكية حالياً.' }]);
// //   //   }
// //   // };
// //   const handleAsk = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!question.trim() || isStreaming) return;

// //     const currentQuestion = question;
// //     setQuestion('');
// //     setChatHistory(prev => [...prev, { role: 'user', text: currentQuestion }]);

// //     try {
// //       // executePrompt (في useSovereignAI) يرجّع النص النهائي مباشرة كـ string
// //       const aiResponseText = await executePrompt({
// //         question: currentQuestion,
// //         context: {
// //           path: pathname,
// //           role: profile?.role || 'visitor'
// //         }
// //       });

// //       setChatHistory(prev => [...prev, { role: 'ai', text: aiResponseText || 'لم أتمكن من معالجة الرد.' }]);
// //     } catch (err) {
// //       console.error("AI Error:", err);
// //       setChatHistory(prev => [...prev, { role: 'ai', text: 'عذراً، تعذر الاتصال بالنواة الذكية حالياً.' }]);
// //     }
// //   };
// //   return (
// //     <Dialog open={open} onOpenChange={setOpen}>
// //       <DialogTrigger asChild>
// //         <Button
// //           className="fixed bottom-24 left-6 z-[100] h-14 w-14 rounded-full shadow-2xl bg-primary text-black hover:bg-primary/90 animate-in fade-in slide-in-from-bottom-10 duration-1000 group active:scale-90 transition-all border-4 border-background"
// //           size="icon"
// //         >
// //           <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
// //           <span className="sr-only">اسأل المساعد السيادي</span>
// //         </Button>
// //       </DialogTrigger>

// //       <DialogContent className="sm:max-w-[450px] h-[600px] flex flex-col p-0 overflow-hidden border-2 border-primary/20 bg-card/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_0_50px_rgba(190,174,119,0.2)]" dir="rtl">
// //         <DialogHeader className="p-6 bg-primary/10 border-b border-primary/10 flex flex-row items-center justify-between space-y-0">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 bg-primary text-black rounded-xl shadow-lg">
// //               <Bot className="h-6 w-6" />
// //             </div>
// //             <div>
// //               <DialogTitle className="text-xl font-black italic uppercase tracking-tighter">مساعد سفريات</DialogTitle>
// //               <div className="flex items-center gap-1 mt-0.5">
// //                 <ShieldCheck className="h-3 w-3 text-primary" />
// //                 <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Sovereign Intelligence v1.0</span>
// //               </div>
// //             </div>
// //           </div>
// //         </DialogHeader>

// //         <ScrollArea className="flex-1 p-6">
// //           <div className="space-y-6">
// //             {chatHistory.length === 0 && (
// //               <div className="text-center py-12 space-y-4 opacity-40">
// //                 <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
// //                 <p className="text-sm font-bold">أهلاً بك أيها القائد. كيف يمكنني دعم عملياتك السيادية اليوم؟</p>
// //               </div>
// //             )}

// //             {chatHistory.map((msg, i) => (
// //               <div key={i} className={cn(
// //                 "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
// //                 msg.role === 'user' ? "mr-auto items-start" : "ml-auto items-end"
// //               )}>
// //                 <div className="flex items-center gap-2 mb-1 px-1">
// //                   {msg.role === 'user' ? <User className="h-3 w-3 opacity-40" /> : <Bot className="h-3 w-3 text-primary" />}
// //                   <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
// //                     {msg.role === 'user' ? 'أنت' : 'الذكاء السيادي'}
// //                   </span>
// //                 </div>
// //                 <div className={cn(
// //                   "px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm",
// //                   msg.role === 'user'
// //                     ? "bg-muted/50 text-foreground rounded-tr-none border border-white/5"
// //                     : "bg-primary text-black font-bold rounded-tl-none"
// //                 )}>
// //                   {msg.text}
// //                 </div>
// //               </div>
// //             ))}

// //             {isStreaming && (
// //               <div className="flex items-center gap-2 text-primary animate-pulse ml-auto">
// //                 <Loader2 className="h-4 w-4 animate-spin" />
// //                 <span className="text-[10px] font-black uppercase">جاري استحضار الحقيقة...</span>
// //               </div>
// //             )}
// //           </div>
// //         </ScrollArea>

// //         <div className="p-4 bg-background/50 border-t border-primary/10">
// //           <form onSubmit={handleAsk} className="relative">
// //             <Input
// //               placeholder="اكتب استفسارك هنا..."
// //               value={question}
// //               onChange={(e) => setQuestion(e.target.value)}
// //               disabled={isStreaming}
// //               className="h-14 pr-4 pl-14 rounded-2xl bg-muted/20 border-primary/10 font-bold focus-visible:ring-primary/30"
// //             />
// //             <Button
// //               type="submit"
// //               size="icon"
// //               disabled={!question.trim() || isStreaming}
// //               className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl shadow-lg active:scale-90 transition-all"
// //             >
// //               {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
// //             </Button>
// //           </form>
// //           <p className="text-[8px] text-center text-muted-foreground mt-3 font-medium uppercase tracking-tighter">
// //             إجابات المساعد تخضع لبروتوكولات الأمان والنزاهة الرقمية.
// //           </p>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }
// 'use client';

// /**
//  * @component AskAiTrigger
//  * @description الواجهة العائمة للمساعد الذكي [SCR-943 - THE SOVEREIGN EYE]
//  * [PROTOCOL 16]: Sterilized UI. يعتمد كلياً على مفاعل useSovereignAI.
//  * [CSS FREEZE]: يلتزم بالهوية البصرية الماسية للقلعة.
//  */

// import { useState } from 'react';
// import { usePathname } from 'next/navigation';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { askAi } from '@/ai/flows/ask-ai-flow';
// import { useSovereignAI } from '@/hooks/use-sovereign-ai';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Sparkles, Send, Loader2, Bot, User, ShieldCheck, X } from 'lucide-react';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { cn } from '@/lib/utils';
// import { useTranslations } from 'next-intl';

// /** طبقة حماية إضافية: لو الـ AI رجّع رموز Markdown بالغلط (مثل **نص**)
//  *  رغم تعليمات الـ prompt، نشيلها هنا قبل العرض بدل ما تظهر كرموز خام. */
// function stripMarkdown(text: string): string {
//   return text
//     .replace(/\*\*(.*?)\*\*/g, '$1') // **bold**
//     .replace(/\*(.*?)\*/g, '$1')     // *italic*
//     .replace(/^#{1,6}\s+/gm, '')     // # عناوين
//     .replace(/^[-*]\s+/gm, '• ');    // - قوائم → نقطة بسيطة
// }

// export function AskAiTrigger() {
//   const pathname = usePathname();
//   const { profile, securityLevel } = useUserProfile();
//   const [open, setOpen] = useState(false);
//   const [question, setQuestion] = useState('');
//   const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
//   const t = useTranslations("askAi");
//   const { isStreaming, executePrompt } = useSovereignAI(askAi);
//   const handleAsk = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!question.trim() || isStreaming) return;

//     const currentQuestion = question;
//     setQuestion('');
//     setChatHistory(prev => [...prev, { role: 'user', text: currentQuestion }]);

//     try {
//       // executePrompt (في useSovereignAI) يرجّع النص النهائي مباشرة كـ string
//       const aiResponseText = await executePrompt({
//         question: currentQuestion,
//         context: {
//           path: pathname,
//           role: profile?.role || 'visitor'
//         }
//       });

//       setChatHistory(prev => [...prev, { role: 'ai', text: aiResponseText || 'لم أتمكن من معالجة الرد.' }]);
//     } catch (err) {
//       console.error("AI Error:", err);
//       setChatHistory(prev => [...prev, { role: 'ai', text: 'عذراً، تعذر الاتصال بالنواة الذكية حالياً.' }]);
//     }
//   };
//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           className="fixed bottom-24 left-6 z-[100] h-14 w-14 rounded-full shadow-2xl bg-primary text-black hover:bg-primary/90 animate-in fade-in slide-in-from-bottom-10 duration-1000 group active:scale-90 transition-all border-4 border-background"
//           size="icon"
//         >
//           <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
//           <span className="sr-only">اسأل المساعد السيادي</span>
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-[450px] h-[600px] flex flex-col p-0 overflow-hidden border-2 border-[#BEAD77] bg-card/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_0_50px_rgba(190,174,119,0.2)]" dir="rtl">
//         <DialogHeader className="p-6 bg-primary/10 border-b border-primary/10 flex flex-row items-center justify-between space-y-0">
//           <div className="flex items-center gap-3 mt-3">
//             <div className="p-2 bg-primary text-black rounded-xl shadow-lg">
//               <Bot className="h-6 w-6" />
//             </div>
//             <div>
//               <DialogTitle className="text-xl font-black italic uppercase tracking-tighter">أسال _ مساعد سفريات</DialogTitle>
//               {/* <div className="flex items-center gap-1 mt-0.5">
//                 <ShieldCheck className="h-3 w-3 text-primary" />
//                 <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Sovereign Intelligence v1.0</span>
//               </div> */}
//             </div>
//           </div>
//         </DialogHeader>

//         <ScrollArea className="flex-1 p-6">
//           <div className="space-y-6">
//             {chatHistory.length === 0 && (
//               <div className="text-center py-12 space-y-4 opacity-40">
//                 <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
//                 <p className="text-sm font-bold">أهلاً بك أيها القائد. كيف يمكنني دعم عملياتك السيادية اليوم؟</p>
//               </div>
//             )}

//             {chatHistory.map((msg, i) => (
//               <div key={i} className={cn(
//                 "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
//                 msg.role === 'user' ? "mr-auto items-start" : "ml-auto items-end"
//               )}>
//                 <div className="flex items-center gap-2 mb-1 px-1">
//                   {msg.role === 'user' ? <User className="h-3 w-3 opacity-40" /> : <Bot className="h-3 w-3 text-primary" />}
//                   <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
//                     {msg.role === 'user' ? 'أنت' : 'الذكاء السيادي'}
//                   </span>
//                 </div>
//                 <div className={cn(
//                   "px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm whitespace-pre-line",
//                   msg.role === 'user'
//                     ? "bg-muted/50 text-foreground rounded-tr-none border border-white/5"
//                     : "bg-primary text-black font-bold rounded-tl-none"
//                 )}>
//                   {msg.role === 'ai' ? stripMarkdown(msg.text) : msg.text}
//                 </div>
//               </div>
//             ))}

//             {isStreaming && (
//               <div className="flex items-center gap-2 text-primary animate-pulse ml-auto">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 <span className="text-[10px] font-black uppercase">جاري استحضار الحقيقة...</span>
//               </div>
//             )}
//           </div>
//         </ScrollArea>

//         <div className="p-4 bg-background/50 border-t border-primary/10">
//           <form onSubmit={handleAsk} className="relative">
//             <Input
//               placeholder="اكتب استفسارك هنا..."
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               disabled={isStreaming}
//               className="h-14 pr-4 pl-14 rounded-2xl bg-muted/20 border-primary/10 font-bold focus-visible:ring-primary/30"
//             />
//             <Button
//               type="submit"
//               size="icon"
//               disabled={!question.trim() || isStreaming}
//               className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl shadow-lg active:scale-90 transition-all"
//             >
//               {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//             </Button>
//           </form>
//           <p className="text-[8px] text-center text-muted-foreground mt-3 font-medium uppercase tracking-tighter">
//             إجابات المساعد تخضع لبروتوكولات الأمان والنزاهة الرقمية.
//           </p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

'use client';

/**
 * @component AskAiTrigger
 * @description الواجهة العائمة للمساعد الذكي [SCR-943 - THE SOVEREIGN EYE]
 * [PROTOCOL 16]: Sterilized UI. يعتمد كلياً على مفاعل useSovereignAI.
 * [CSS FREEZE]: يلتزم بالهوية البصرية الماسية للقلعة.
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUserProfile } from '@/hooks/use-user-profile';
import { askAi } from '@/ai/flows/ask-ai-flow';
import { useSovereignAI } from '@/hooks/use-sovereign-ai';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sparkles, Send, Loader2, Bot, User, ShieldCheck, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

/** طبقة حماية إضافية: لو الـ AI رجّع رموز Markdown بالغلط (مثل **نص**)
 *  رغم تعليمات الـ prompt، نشيلها هنا قبل العرض بدل ما تظهر كرموز خام. */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // **bold**
    .replace(/\*(.*?)\*/g, '$1')     // *italic*
    .replace(/^#{1,6}\s+/gm, '')     // # عناوين
    .replace(/^[-*]\s+/gm, '• ');    // - قوائم → نقطة بسيطة
}

export function AskAiTrigger() {
  const pathname = usePathname();
  const { profile, securityLevel } = useUserProfile();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const t = useTranslations("askAi");
  const { isStreaming, executePrompt } = useSovereignAI(askAi);
  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isStreaming) return;

    const currentQuestion = question;
    setQuestion('');
    setChatHistory(prev => [...prev, { role: 'user', text: currentQuestion }]);

    try {
      // executePrompt (في useSovereignAI) يرجّع النص النهائي مباشرة كـ string
      const aiResponseText = await executePrompt({
        question: currentQuestion,
        context: {
          path: pathname,
          role: profile?.role || 'visitor'
        }
      });

      setChatHistory(prev => [...prev, { role: 'ai', text: aiResponseText || t("noResponse") }]);
    } catch (err) {
      console.error("AI Error:", err);
      setChatHistory(prev => [...prev, {
        role: 'ai', text: t("connectionError")
      }]);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-24 left-6 z-[100] h-14 w-14 rounded-full shadow-2xl bg-primary text-black hover:bg-primary/90 animate-in fade-in slide-in-from-bottom-10 duration-1000 group active:scale-90 transition-all border-4 border-background"
          size="icon"
        >
          <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
          <span className="sr-only">
            {/* اسأل المساعد السيادي */}
            {t("openSrOnly")}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] h-[600px] flex flex-col p-0 overflow-hidden border-2 border-[#BEAD77] bg-card/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_0_50px_rgba(190,174,119,0.2)]" dir="rtl">
        <DialogHeader className="p-6 bg-primary/10 border-b border-primary/10 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3 mt-3">
            <div className="p-2 bg-primary text-black rounded-xl shadow-lg">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black italic uppercase tracking-tighter">
                {/* أسال _ مساعد سفريات */}
                {t("title")}

              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {chatHistory.length === 0 && (
              <div className="text-center py-12 space-y-4 opacity-40">
                <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
                <p className="text-sm font-bold">
                  {/* أهلاً بك أيها القائد. كيف يمكنني دعم عملياتك السيادية اليوم؟ */}
                  {t("emptyState")}
                </p>
              </div>
            )}

            {chatHistory.map((msg, i) => (
              <div key={i} className={cn(
                "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === 'user' ? "mr-auto items-start" : "ml-auto items-end"
              )}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  {msg.role === 'user' ? <User className="h-3 w-3 opacity-40" /> : <Bot className="h-3 w-3 text-primary" />}
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                    {/* {msg.role === 'user' ? 'أنت' : 'الذكاء السيادي'} */}
                    {msg.role === 'user' ? t("userLabel") : t("assistantLabel")}
                  </span>
                </div>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm whitespace-pre-line",
                  msg.role === 'user'
                    ? "bg-muted/50 text-foreground rounded-tr-none border border-white/5"
                    : "bg-primary text-black font-bold rounded-tl-none"
                )}>
                  {msg.role === 'ai' ? stripMarkdown(msg.text) : msg.text}
                </div>
              </div>
            ))}

            {isStreaming && (
              <div className="flex items-center gap-2 text-primary animate-pulse ml-auto">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-[10px] font-black uppercase">
                  {/* جاري استحضار الحقيقة... */}
                  {t("thinking")}
                </span>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 bg-background/50 border-t border-primary/10">
          <form onSubmit={handleAsk} className="relative">
            <Input
              // placeholder="اكتب استفسارك هنا..."
              placeholder={t("placeholder")}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isStreaming}
              className="h-14 pr-4 pl-14 rounded-2xl bg-muted/20 border-primary/10 font-bold focus-visible:ring-primary/30"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!question.trim() || isStreaming}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl shadow-lg active:scale-90 transition-all"
            >
              {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
          <p className="text-[8px] text-center text-muted-foreground mt-3 font-medium uppercase tracking-tighter">
            {/* إجابات المساعد تخضع لبروتوكولات الأمان والنزاهة الرقمية. */}
            {t("securityNote")}

          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}