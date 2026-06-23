// 'use client';

// import QRCode from "react-qr-code";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { MapPin, User, Hash } from "lucide-react";

// interface QRDialogProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   data: {
//     tripId: string;
//     bookingId: string;
//     passengerName: string;
//     seats: number;
//     pickup: string;
//   };
// }

// export function QRDialog({ isOpen, onOpenChange, data }: QRDialogProps) {
//   // Protocol 88: Minimal payload for visual verification
//   const qrPayload = JSON.stringify({
//     bid: data.bookingId,
//     tid: data.tripId,
//     pax: data.passengerName
//   });

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md mx-auto rounded-xl border-2 border-primary/20">
//         <DialogHeader className="text-center space-y-2">
//           <DialogTitle className="text-2xl font-bold text-center text-primary">ختم العبور الرقمي</DialogTitle>
//           <DialogDescription className="text-center text-muted-foreground">
//             أبرز هذا الرمز للكابتن للمسح أو المطابقة
//           </DialogDescription>
//         </DialogHeader>

//         <div className="flex flex-col items-center justify-center py-6 space-y-6">
//           {/* The Digital Seal */}
//           <div className="p-6 bg-white rounded-2xl shadow-inner border-4 border-dashed border-gray-200">
//             <QRCode
//               value={qrPayload}
//               size={180}
//               level="M"
//               fgColor="#000000"
//               bgColor="#FFFFFF"
//             />
//           </div>

//           {/* Human Readable Manifest (Visual Handshake) */}
//           <div className="w-full space-y-4 bg-muted/40 p-5 rounded-xl border text-center">

//             <div className="flex flex-col items-center gap-1">
//               <span className="text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" /> المسافر</span>
//               <span className="text-xl font-bold text-foreground">{data.passengerName}</span>
//             </div>

//             <div className="grid grid-cols-2 gap-4 border-t border-gray-200/50 pt-4">
//               <div className="flex flex-col items-center gap-1">
//                 <span className="text-xs text-muted-foreground">المقاعد</span>
//                 <Badge variant="secondary" className="text-lg px-4 py-1 font-mono">{data.seats}</Badge>
//               </div>
//               <div className="flex flex-col items-center gap-1">
//                 <span className="text-xs text-muted-foreground flex items-center gap-1"><Hash className="h-3 w-3" /> رقم الحجز</span>
//                 <span className="font-mono text-sm font-bold tracking-wider">{data.bookingId.slice(-6).toUpperCase()}</span>
//               </div>
//             </div>

//             <div className="pt-2 border-t border-gray-200/50 mt-2">
//               <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1"><MapPin className="h-3 w-3" /> نقطة الانطلاق</p>
//               <p className="text-sm font-medium leading-tight">{data.pickup}</p>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

'use client';

import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Hash, Phone, Bus, Calendar, Clock, FileText } from "lucide-react";

interface QRDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    tripId: string;
    bookingId: string;
    passengerName: string;
    documentNumber?: string;
    seats: number;
    pickup: string;
    carrierName?: string;
    carrierPhone?: string;
    departureDate?: string;
    departureTime?: string;
  };
}

export function QRDialog({ isOpen, onOpenChange, data }: QRDialogProps) {
  // QR يفتح صفحة التذكرة مباشرة عند السكان
  const ticketUrl = `https://safaryat-test.vercel.app/ar/ticket-scan/${data.bookingId}`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-auto rounded-xl border-2 border-primary/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl font-bold text-center text-primary">ختم العبور الرقمي</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            أبرز هذا الرمز للكابتن للمسح أو المطابقة
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4 space-y-5">
          {/* The Digital Seal */}
          <div className="p-5 bg-white rounded-2xl shadow-inner border-4 border-dashed border-gray-200">
            <QRCode
              value={ticketUrl}
              size={160}
              level="M"
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </div>

          {/* Full Ticket Details */}
          <div className="w-full space-y-3 text-right" dir="rtl">

            {/* رقم الرحلة ورقم الحجز */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 p-3 rounded-xl border text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1">
                  <Hash className="h-3 w-3" /> رقم الرحلة
                </p>
                <span className="font-mono text-sm font-black tracking-wider text-primary">
                  {data.tripId.slice(-6).toUpperCase()}
                </span>
              </div>
              <div className="bg-muted/50 p-3 rounded-xl border text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1">
                  <FileText className="h-3 w-3" /> رقم الحجز
                </p>
                <span className="font-mono text-sm font-black tracking-wider text-primary">
                  {data.bookingId.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>

            {/* بيانات المسافر */}
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-2">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                <User className="h-3 w-3 text-primary" /> بيانات المسافر
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-60">الاسم</span>
                <span className="font-bold text-base">{data.passengerName}</span>
              </div>
              {data.documentNumber && (
                <div className="flex justify-between items-center pt-1 border-t border-primary/10">
                  <span className="text-xs opacity-60">رقم وثيقة المسافر</span>
                  <Badge variant="outline" className="font-mono text-sm bg-[#A18E64] text-black">
                    {data.documentNumber}
                  </Badge>
                </div>
              )}
              <div className="flex justify-between items-center pt-1 border-t border-primary/10">
                <span className="text-xs opacity-60">عدد المقاعد</span>
                <Badge variant="secondary" className="font-mono font-bold">{data.seats}</Badge>
              </div>
            </div>

            {/* بيانات الناقل */}
            <div className="bg-muted/40 p-4 rounded-xl border space-y-2">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                <Bus className="h-3 w-3 text-primary" /> الناقل
              </p>
              {data.carrierName && (
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-60">اسم الناقل</span>
                  <span className="font-bold text-primary">{data.carrierName}</span>
                </div>
              )}
              {data.carrierPhone && (
                <div className="flex justify-between items-center pt-1 border-t border-gray-200/50">
                  <span className="text-xs opacity-60 flex items-center gap-1"><Phone className="h-3 w-3" /> رقم التلفون</span>
                  <a
                    href={`tel:${data.carrierPhone}`}
                    className="font-black text-sm text-black bg-[#A18E64] hover:bg-[#a18e64b1] px-2 py-1 rounded-lg ltr"
                  >
                    {data.carrierPhone}
                  </a>
                </div>
              )}
            </div>

            {/* وقت وتاريخ الرحلة */}
            <div className="grid grid-cols-2 gap-3">
              {data.departureDate && (
                <div className="bg-muted/40 p-3 rounded-xl border text-center">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1">
                    <Calendar className="h-3 w-3" /> تاريخ الرحلة
                  </p>
                  <span className="font-bold text-sm">{data.departureDate}</span>
                </div>
              )}
              {data.departureTime && (
                <div className="bg-muted/40 p-3 rounded-xl border text-center">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-3 w-3" /> وقت الرحلة
                  </p>
                  <span className="font-bold text-sm">{data.departureTime}</span>
                </div>
              )}
            </div>

            {/* نقطة الانطلاق */}
            <div className="bg-muted/40 p-3 rounded-xl border text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1">
                <MapPin className="h-3 w-3" /> نقطة الانطلاق
              </p>
              <p className="text-sm font-medium leading-tight">{data.pickup}</p>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}