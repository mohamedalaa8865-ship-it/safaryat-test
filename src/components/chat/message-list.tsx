// 'use client';
// import type { Message } from '@/lib/data';
// import { cn } from '@/lib/utils';
// import { Skeleton } from '../ui/skeleton';
// import { format } from 'date-fns';
// import { arSA } from 'date-fns/locale';
// import { useRef, useEffect } from 'react';
// import { useTranslations } from 'next-intl';

// const safeFormat = (timestamp: any) => {
//   try {
//     const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
//     return format(date, 'p', { locale: arSA });
//   } catch (e) {
//     return '';
//   }
// }

// interface MessageListProps {
//   messages: Message[];
//   isLoading: boolean;
//   currentUserId: string;
// }

// export function MessageList({ messages, isLoading, currentUserId }: MessageListProps) {
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const t = useTranslations('chat')
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   if (isLoading) {
//     return (
//       <div className="flex-1 p-4 space-y-3">
//         <div className="flex justify-start"><Skeleton className="h-10 w-2/3 rounded-2xl rounded-bl-none" /></div>
//         <div className="flex justify-end"><Skeleton className="h-10 w-1/2 rounded-2xl rounded-br-none" /></div>
//         <div className="flex justify-start"><Skeleton className="h-14 w-3/4 rounded-2xl rounded-bl-none" /></div>
//       </div>
//     );
//   }

//   if (messages.length === 0) {
//     return (
//       <div className="flex-1 p-4 flex items-center justify-center">
//         <p className="text-sm text-muted-foreground text-center">{t('emtymess')}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-2 p-3" dir="rtl">
//       {messages.map((message, index) => {
//         const isSender = message.senderId === currentUserId;
//         const isSystem = message.type === 'system' || message.senderId === 'system';
//         const prevMessage = index > 0 ? messages[index - 1] : null;
//         const showSenderName = !isSender && !isSystem && message.senderName &&
//           prevMessage?.senderId !== message.senderId;

//         if (isSystem) {
//           return (
//             <div key={message.id} className="flex justify-center my-1">
//               <span className="text-[11px] text-muted-foreground bg-muted px-3 py-1 rounded-full">
//                 {message.content}
//               </span>
//             </div>
//           );
//         }

//         return (
//           <div
//             key={message.id}
//             className={cn(
//               'flex flex-col max-w-[78%]',
//               isSender ? 'self-end items-end' : 'self-start items-start'
//             )}
//           >
//             {showSenderName && (
//               <span className="text-[11px] text-muted-foreground mb-1 px-1">
//                 {message.senderName}
//               </span>
//             )}
//             <div
//               className={cn(
//                 'px-3 py-2 text-sm break-words',
//                 isSender
//                   ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-none'
//                   : 'bg-card text-card-foreground border rounded-2xl rounded-bl-none shadow-sm'
//               )}
//             >
//               {message.content}
//             </div>
//             <span className="text-[11px] text-muted-foreground mt-0.5 px-1">
//               {safeFormat(message.timestamp)}
//             </span>
//           </div>
//         );
//       })}
//       <div ref={bottomRef} />
//     </div>
//   );
// }
'use client';
import type { Message } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const safeFormat = (timestamp: any) => {
  try {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'p', { locale: arSA });
  } catch (e) {
    return '';
  }
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  currentUserId: string;
}

export function MessageList({ messages, isLoading, currentUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('chat')
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-3">
        <div className="flex justify-start"><Skeleton className="h-10 w-2/3 rounded-2xl rounded-bl-none" /></div>
        <div className="flex justify-end"><Skeleton className="h-10 w-1/2 rounded-2xl rounded-br-none" /></div>
        <div className="flex justify-start"><Skeleton className="h-14 w-3/4 rounded-2xl rounded-bl-none" /></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">{t('emtymess')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3" dir="rtl">
      {messages.map((message, index) => {
        const isSender = message.senderId === currentUserId;
        const isSystem = message.type === 'system' || message.senderId === 'system';
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const showSenderName = !isSender && !isSystem && message.senderName &&
          prevMessage?.senderId !== message.senderId;

        if (isSystem) {
          return (
            <div key={message.id} className="flex justify-center my-1">
              <span className="text-[11px] text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {message.content}
              </span>
            </div>
          );
        }

        return (
          <div
            key={message.id}
            className={cn(
              'flex flex-col max-w-[78%]',
              isSender ? 'self-end items-end' : 'self-start items-start'
            )}
          >
            {showSenderName && (
              <span className="text-[11px] text-muted-foreground mb-1 px-1">
                {message.senderName}
              </span>
            )}
            <div
              className={cn(
                'px-3 py-2 text-sm break-words',
                isSender
                  ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-none'
                  : 'bg-card text-card-foreground border rounded-2xl rounded-bl-none shadow-sm'
              )}
            >
              {/* صورة إيصال الدفع */}
              {(message as any).imageUrl && (message as any).type === 'receipt' && (
                <div className="mb-2 space-y-1">
                  <a href={(message as any).imageUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={(message as any).imageUrl}
                      alt="إيصال الدفع"
                      className="rounded-xl max-w-[220px] border cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </a>
                </div>
              )}
              {/* رسالة تأكيد الاستلام */}
              {(message as any).type === 'receipt_ack' && (
                <span className="text-green-500 font-bold">✅ </span>
              )}
              {message.content}
            </div>
            <span className="text-[11px] text-muted-foreground mt-0.5 px-1">
              {safeFormat(message.timestamp)}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}