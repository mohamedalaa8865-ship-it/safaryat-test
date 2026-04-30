// 'use client';

// import { useState, useEffect, useRef } from "react";
// import { useUserProfile } from "@/hooks/use-user-profile";
// import { updateDoc, serverTimestamp } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { initializeFirebase } from "@/firebase";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// import { Loader2, Save, User, Camera } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { useTranslations } from "next-intl";
// import { useLocale } from 'next-intl';

// /**
//  * @page CarrierProfilePage
//  * @description THE REINFORCED STABILITY PROFILE (SC-620-STABILITY)
//  * [SC-620]: Prevented form resets during background reactive updates.
//  */
// export default function CarrierProfilePage() {
//   const t = useTranslations("carrierProfile");
//   const { user, profile, isLoading, userProfileRef } = useUserProfile();
//   const { toast } = useToast();
//   const locale = useLocale();
//   const { storage } = initializeFirebase();
//   const isInitialized = useRef(false);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // 🛡️ [SC-620] Sovereign Stability: Initialization guard
//   useEffect(() => {
//     if (profile && !isInitialized.current) {
//       setFormData({
//         fullName: profile.fullName || profile.firstName || user?.displayName || "",
//         email: profile.email || user?.email || "",
//         phoneNumber: profile.phoneNumber || user?.phoneNumber || "",
//       });
//       setImagePreview(profile.photoURL || null);
//       isInitialized.current = true;
//     }
//   }, [profile?.id, user]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setSelectedFile(file);
//     const reader = new FileReader();
//     reader.onloadend = () => setImagePreview(reader.result as string);
//     reader.readAsDataURL(file);
//   };

//   const handleSave = async () => {
//     if (!user || !userProfileRef) return;
//     setIsSaving(true);
//     try {
//       let photoURL = profile?.photoURL || null;

//       if (selectedFile) {
//         const imageRef = ref(
//           storage,
//           `profile-images/${user.uid}/${Date.now()}-${selectedFile.name}`
//         );
//         await uploadBytes(imageRef, selectedFile);
//         photoURL = await getDownloadURL(imageRef);
//       }

//       await updateDoc(userProfileRef, {
//         ...formData,
//         firstName: formData.fullName.split(' ')[0] || formData.fullName,
//         photoURL,
//         updatedAt: serverTimestamp(),
//       });

//       setSelectedFile(null);
//       setImagePreview(photoURL);
//       toast({ title: t("saveSuccess") });
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: t("saveErrorTitle"),
//         description: t("saveErrorDescription"),
//         variant: "destructive",
//       });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center p-10">
//         <Loader2 className="animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="container max-w-2xl mx-auto p-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
//       <Card>
//         <CardHeader>
//           <CardTitle>{t("profileTitle")}</CardTitle>
//           <CardDescription>{t("profileDescription")}</CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           <div className="relative w-fit mx-auto">
//             <Avatar className="h-24 w-24 border-2 border-primary overflow-hidden">
//               {imagePreview ? (
//                 <img src={imagePreview} alt="profile" className="h-full w-full object-cover" />
//               ) : (
//                 <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
//               )}
//             </Avatar>
//             <Button
//               type="button"
//               size="icon"
//               variant="outline"
//               className="absolute bottom-0 right-0 rounded-full"
//               onClick={() => fileInputRef.current?.click()}
//             >
//               <Camera className="h-4 w-4" />
//             </Button>
//             <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
//           </div>

//           <div className="space-y-2">
//             <Label>{t("fullName")}</Label>
//             <Input
//               value={formData.fullName}
//               onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label>{t("phoneNumber")}</Label>
//             <Input
//               value={formData.phoneNumber}
//               onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label>{t("email")}</Label>
//             <Input
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             />
//           </div>

//           <Button className="w-full" onClick={handleSave} disabled={isSaving}>
//             {isSaving ? <Loader2 className="ml-2 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
//             {t("saveButton")}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef } from "react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "@/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, User, Camera, Car, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslations, useLocale } from "next-intl";
import { useActiveMarkets } from "@/hooks/use-active-markets";
import { getCityName } from "@/lib/constants";
import { getStorage } from 'firebase/storage';
import { useFirebaseApp } from '@/firebase';
import { useRouter } from "next/navigation";
export default function CarrierProfilePage() {
  const t = useTranslations("carrierProfile");
  const { user, profile, isLoading, userProfileRef } = useUserProfile();
  const { toast } = useToast();
  const locale = useLocale();
  const firebaseApp = useFirebaseApp();
  const storage = getStorage(firebaseApp);
  const { activeMarkets } = useActiveMarkets();
  const isInitialized = useRef(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    phoneCountryCode: "962", // ✅
    phoneCountry: "JO",      // ✅
    // 🚗 بيانات المركبة
    vehicleType: "",
    vehicleModel: "",
    vehicleYear: "",
    plateNumber: "",
    vehicleCapacity: "",
    // 🗺️ المسار
    originCountry: "",
    origin: "",
    destinationCountry: "",
    destination: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (profile && !isInitialized.current) {
      setFormData({
        fullName: profile.fullName || profile.firstName || user?.displayName || "",
        email: profile.email || user?.email || localStorage.getItem("tempEmail") || "", // ✅
        phoneNumber: profile.phoneNumber || localStorage.getItem("tempPhone") || "",    // ✅
        phoneCountryCode: profile.phoneCountryCode || localStorage.getItem("tempCallingCode") || "962",
        phoneCountry: profile.phoneCountry || localStorage.getItem("tempCountryCode") || "JO",
        vehicleType: profile.vehicleType || "",
        vehicleModel: profile.vehicleModel || "",
        vehicleYear: profile.vehicleYear || "",
        plateNumber: profile.plateNumber || "",
        vehicleCapacity: profile.vehicleCapacity ? String(profile.vehicleCapacity) : "",
        originCountry: profile.jurisdiction?.origin || "",
        origin: "",
        destinationCountry: profile.jurisdiction?.destination || "",
        destination: "",
      });
      setImagePreview(profile.photoURL || null);
      isInitialized.current = true;
    }
  }, [profile?.id, user]);

  const originCities = activeMarkets.find(m => m.id === formData.originCountry)?.cities || [];
  const destinationCities = activeMarkets.find(m => m.id === formData.destinationCountry)?.cities || [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user || !userProfileRef) return;

    // ✅ تحقق من الحقول المطلوبة
    if (!formData.vehicleType || !formData.vehicleCapacity || !formData.plateNumber) {
      toast({
        variant: "destructive",
        title: "بيانات ناقصة",
        description: "يجب إدخال نوع المركبة ورقم اللوحة وعدد المقاعد على الأقل.",
      });
      return;
    }

    setIsSaving(true);
    try {
      let photoURL = profile?.photoURL || null;

      if (selectedFile) {
        const imageRef = ref(storage, `profile-images/${user.uid}/${Date.now()}-${selectedFile.name}`);
        await uploadBytes(imageRef, selectedFile);
        photoURL = await getDownloadURL(imageRef);
      }

      const capacity = parseInt(formData.vehicleCapacity);

      await updateDoc(userProfileRef, {
        fullName: formData.fullName,
        firstName: formData.fullName.split(' ')[0] || formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        phoneCountryCode: formData.phoneCountryCode, // ✅
        phoneCountry: formData.phoneCountry,         // ✅
        // 🚗 المركبة
        vehicleType: formData.vehicleType,
        vehicleModel: formData.vehicleModel || null,
        vehicleYear: formData.vehicleYear || null,
        plateNumber: formData.plateNumber || null,
        vehicleCapacity: capacity || null,
        vehicleCategory: capacity > 7 ? 'bus' : 'small',
        // 🗺️ المسار
        jurisdiction: {
          origin: formData.originCountry,
          destination: formData.destinationCountry,
        },
        // ✅ إزالة isPartial لو البيانات مكتملة
        isPartial: !formData.vehicleType || !formData.vehicleCapacity,
        photoURL,
        updatedAt: serverTimestamp(),
      });

      setSelectedFile(null);
      toast({ title: "تم الحفظ بنجاح ✅" });
      router.push('/carrier');
    } catch (err) {
      console.error(err);
      toast({ title: "فشل الحفظ", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>

      {/* البيانات الشخصية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> البيانات الشخصية</CardTitle>
          <CardDescription>معلوماتك الأساسية الظاهرة للمسافرين</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-fit mx-auto">
            <Avatar className="h-24 w-24 border-2 border-primary overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="profile" className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
              )}
            </Avatar>
            <Button type="button" size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full" onClick={() => fileInputRef.current?.click()}>
              <Camera className="h-4 w-4" />
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
          </div>

          <div className="space-y-2">
            <Label>الاسم الكامل</Label>
            <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
          </div>
          {/* <div className="space-y-2">
            <Label>رقم الهاتف</Label>
            <Input value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
          </div> */}
          <div className="space-y-2">
            <Label>رقم الهاتف</Label>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
              <Input
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="border-0 focus-visible:ring-0 text-left ltr"
                placeholder="رقم الهاتف"
              />
              <span className="font-mono text-sm text-primary font-bold">
                +{formData.phoneCountryCode}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>البريد الإلكتروني</Label>
            <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* بيانات المركبة */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Car className="h-5 w-5 text-primary" /> بيانات المركبة <span className="text-red-500 text-sm">*مطلوب</span></CardTitle>
          <CardDescription>يجب إكمال هذه البيانات لتتمكن من نشر الرحلات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نوع المركبة <span className="text-red-500">*</span></Label>
              <Input
                placeholder="مثال: GMC Yukon"
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>موديل المركبة </Label>
              <Input
                placeholder="مثال: Denali"
                value={formData.vehicleModel}
                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>سنة الصنع</Label>
              <Input
                placeholder="مثال: 2022"
                type="number"
                value={formData.vehicleYear}
                onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>رقم اللوحة <span className="text-red-500">*</span></Label>
              <Input
                placeholder="مثال: 12-345"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>عدد المقاعد <span className="text-red-500">*</span></Label>
              <Select
                value={formData.vehicleCapacity}
                onValueChange={(v) => setFormData({ ...formData, vehicleCapacity: v })}
              >
                <SelectTrigger><SelectValue placeholder="اختر عدد المقاعد" /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 20, 25, 30, 40, 50].map(n => (
                    <SelectItem key={n} value={String(n)}>{n} مقاعد {n >= 7 ? '(حافلة)' : '(سيارة)'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* المسار */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-500" /> مسار التشغيل</CardTitle>
          <CardDescription>الدولة والمسار الذي تعمل فيه بشكل أساسي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>دولة الانطلاق</Label>
              <Select value={formData.originCountry} onValueChange={(v) => setFormData({ ...formData, originCountry: v })}>
                <SelectTrigger><SelectValue placeholder="اختر الدولة" /></SelectTrigger>
                <SelectContent>
                  {activeMarkets.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>دولة الوصول</Label>
              <Select value={formData.destinationCountry} onValueChange={(v) => setFormData({ ...formData, destinationCountry: v })}>
                <SelectTrigger><SelectValue placeholder="اختر الدولة" /></SelectTrigger>
                <SelectContent>
                  {activeMarkets.filter(m => m.id !== formData.originCountry).map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full h-12 text-base font-bold" onClick={handleSave} disabled={isSaving}>
        {isSaving ? <><Loader2 className="ml-2 animate-spin h-4 w-4" /> جاري الحفظ...</> : <><Save className="ml-2 h-4 w-4" /> حفظ جميع البيانات</>}
      </Button>
    </div>
  );
}