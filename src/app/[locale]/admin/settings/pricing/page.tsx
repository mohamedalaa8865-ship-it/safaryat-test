'use client';

import { useEffect, useState, useCallback } from 'react';
import { useFirestore, useAuth } from '@/firebase';
import { collection, getDocs, doc, writeBatch, serverTimestamp, setDoc } from 'firebase/firestore';
import { PricingRule } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Globe, Coins, ShieldCheck, Save, RefreshCw, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { SovereignVaultDialog } from '@/components/admin/vault/sovereign-vault-dialog';
import { SOVEREIGN_GEO_REGISTRY } from '@/lib/constants';

/**
 * @page PricingSettingsPage
 * @description THE DIAMOND FINANCIAL VAULT (STERILIZED - SCR-2026-012-REV)
 * [SCR-2026-012-REV]: Root Path Realignment for Tabs import fixed.
 * [SCR-2026-011]: Temporal Alignment - Injected updatedAt and missing fields.
 */
export default function PricingSettingsPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const tError = useTranslations('errorDictionary');
  const tCommon = useTranslations('common');
  const { toast } = useToast();

  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [isOpeningMarket, setIsOpeningMarket] = useState(false);
  
  const [selectedRegistryCode, setSelectedRegistryCode] = useState<string>('');
  const [manualCurrency, setManualCurrency] = useState<string>('');

  const [vaultOpen, setVaultOpen] = useState(false);
  const [activeRuleForVault, setActiveRuleForVault] = useState<PricingRule | null>(null);

  const fetchRules = useCallback(async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(firestore, 'pricing_rules'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as PricingRule));
      data.sort((a, b) => a.id.localeCompare(b.id));
      setRules(data);
    } catch (e) {
      console.error("[Sovereign Pricing] Pulse Lost:", e);
    } finally {
      setLoading(false);
    }
  }, [firestore]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleUpdateField = useCallback((id: string, field: keyof PricingRule, value: any) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }, []);

  const handleOpenNewMarket = useCallback(async () => {
    if (!firestore || !auth.currentUser || !selectedRegistryCode) return;
    
    const registryInfo = SOVEREIGN_GEO_REGISTRY[selectedRegistryCode];
    if (!registryInfo) return;

    if (rules.some(r => r.id === selectedRegistryCode)) {
        toast({ variant: 'destructive', title: 'السوق موجود مسبقاً' });
        return;
    }

    setIsOpeningMarket(true);
    try {
        // [SCR-2026-011]: Temporal Alignment & Genome Consistency
        const newRule: PricingRule = {
            id: selectedRegistryCode,
            name: registryInfo.name,
            countryName: registryInfo.name,
            currency: manualCurrency.toUpperCase() || registryInfo.defaultCurrency,
            baseFare: 0,
            perKmRate: 0,
            commissionPercentage: 0,
            minDistance: 0,
            carrierSubscriptionFee: 0,
            travelerCommissionFee: 0,
            travelerDiscount: 0,
            trialOverrideDays: 90,
            isActive: false,
            updatedAt: serverTimestamp()
        };

        const ruleRef = doc(firestore, 'pricing_rules', selectedRegistryCode);
        await setDoc(ruleRef, newRule);

        setRules(prev => [...prev, newRule].sort((a, b) => a.id.localeCompare(b.id)));
        setSelectedRegistryCode('');
        toast({ title: 'تم افتتاح السوق ✅' });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'فشل التأسيس', description: error.message });
    } finally {
        setIsOpeningMarket(false);
    }
  }, [firestore, auth.currentUser, selectedRegistryCode, manualCurrency, rules, toast]);

  const executeSaveBatch = useCallback(async (reason: string) => {
    if (!firestore || !auth.currentUser || !activeRuleForVault) return;
    
    const rule = activeRuleForVault;
    setIsSaving(rule.id);
    try {
      const batch = writeBatch(firestore);
      const ruleRef = doc(firestore, 'pricing_rules', rule.id);
      
      batch.set(ruleRef, { ...rule, updatedAt: serverTimestamp() }, { merge: true });

      const logRef = doc(collection(firestore, 'admin_logs'));
      batch.set(logRef, {
          action: 'PRICING_UPDATE',
          targetUserId: rule.id,
          adminId: auth.currentUser.uid,
          reason: reason,
          timestamp: serverTimestamp(),
          snapshot: rule
      });

      await batch.commit();
      toast({ title: tCommon('success') });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'فشل الإنفاذ', description: tError(error.message || 'DEFAULT') });
    } finally {
      setIsSaving(null);
      setActiveRuleForVault(null);
    }
  }, [firestore, auth.currentUser, activeRuleForVault, tCommon, tError, toast]);

  const handleAttemptSave = useCallback((rule: PricingRule) => {
      setActiveRuleForVault(rule);
      setVaultOpen(true);
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center opacity-30"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;

  return (
    <div className="p-2 md:p-8 space-y-8 animate-in fade-in duration-700" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-foreground flex items-center gap-3">
            <Globe className="w-10 h-10 text-primary animate-pulse" />
            غرفة التسعير السيادية
        </h1>
        <Button variant="outline" size="sm" onClick={fetchRules} className="gap-2 font-bold"><RefreshCw className="h-4 w-4" /> تحديث</Button>
      </div>

      <div className="p-6 border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5 space-y-6">
          <div className="flex items-center gap-3">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-black">افتتاح سوق إقليمي جديد</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">اختر الدولة</Label>
                  <Select value={selectedRegistryCode} onValueChange={setSelectedRegistryCode}>
                      <SelectTrigger className="h-12 bg-background font-bold">
                          <SelectValue placeholder="قائمة الدول المتاحة..." />
                      </SelectTrigger>
                      <SelectContent>
                          {Object.entries(SOVEREIGN_GEO_REGISTRY).map(([code, data]) => (
                              <SelectItem key={code} value={code} className="font-bold">{data.name} ({code})</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">العملة السيادية</Label>
                  <Input 
                    value={manualCurrency} 
                    onChange={(e) => setManualCurrency(e.target.value.toUpperCase())} 
                    placeholder="JOD, SAR, USD..."
                    className="h-12 bg-background font-black text-center ltr"
                  />
              </div>
              <Button onClick={handleOpenNewMarket} disabled={!selectedRegistryCode || isOpeningMarket} className="h-12 font-black gap-2">
                  {isOpeningMarket ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                  تأسيس وافتتاح السوق
              </Button>
          </div>
      </div>

      {rules.length > 0 && (
        <Tabs defaultValue={rules[0]?.id} className="w-full">
            <TabsList className="bg-card border p-1 flex flex-wrap h-auto gap-2 rounded-xl mb-8">
                {rules.map(rule => (
                    <TabsTrigger key={rule.id} value={rule.id} className="font-black px-8 py-3 rounded-lg data-[state=active]:bg-primary transition-all">
                        {rule.countryName}
                    </TabsTrigger>
                ))}
            </TabsList>

            {rules.map(rule => (
                <TabsContent key={rule.id} value={rule.id} className="animate-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-primary/10 shadow-2xl bg-card/50 backdrop-blur-md relative overflow-hidden rounded-2xl">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                        <CardHeader className="bg-muted/30 border-b">
                            <CardTitle className="flex items-center gap-2 text-xl font-black">موازين قطاع {rule.countryName}</CardTitle>
                            <CardDescription>التحكم في الرسوم والعملة لقطاع {rule.id}.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2"><Coins className="h-4 w-4" /> اشتراك الناقل الشهري ({rule.currency})</Label>
                                    <Input type="number" value={rule.carrierSubscriptionFee} onChange={e => handleUpdateField(rule.id, 'carrierSubscriptionFee', parseFloat(e.target.value))} className="text-2xl font-black h-16 bg-muted/20 border-primary/10" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2"><Coins className="h-4 w-4" /> رسوم حجز المسافر ({rule.currency})</Label>
                                    <Input type="number" value={rule.travelerCommissionFee} onChange={e => handleUpdateField(rule.id, 'travelerCommissionFee', parseFloat(e.target.value))} className="text-2xl font-black h-16 bg-muted/20 border-primary/10" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-5 bg-muted/30 rounded-2xl border border-primary/5">
                                <div className="flex items-center gap-4">
                                    <Switch checked={rule.isActive} onCheckedChange={c => handleUpdateField(rule.id, 'isActive', c)} />
                                    <div><p className="text-sm font-bold">تفعيل السوق رسمياً</p></div>
                                </div>
                                <Badge variant={rule.isActive ? 'default' : 'destructive'} className="font-black px-4 py-1">{rule.isActive ? 'سوق نشط' : 'سوق مجمد'}</Badge>
                            </div>
                        </CardContent>
                        <div className="p-6 bg-muted/10 border-t border-primary/10">
                            <Button onClick={() => handleAttemptSave(rule)} disabled={isSaving === rule.id} className="w-full h-16 text-xl font-black gap-3 shadow-2xl">
                                {isSaving === rule.id ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                                إنفاذ الموازين المالية لـ {rule.countryName}
                            </Button>
                        </div>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
      )}

      {activeRuleForVault && (
          <SovereignVaultDialog 
            isOpen={vaultOpen} 
            onOpenChange={setVaultOpen} 
            title="تأمين موازين القطاع" 
            description={`أنت على وشك تعديل القوانين المالية لقطاع ${activeRuleForVault.countryName}.`}
            onVerified={executeSaveBatch} 
          />
      )}
    </div>
  );
}
