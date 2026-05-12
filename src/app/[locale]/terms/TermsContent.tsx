'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShieldCheck, Scale, FileText, AlertTriangle, Gavel, Fingerprint } from 'lucide-react';
import { triggerHaptic } from '@/lib/utils';

/**
 * @page TermsAndConditions
 * @description THE SOVEREIGN CONSTITUTION (MITHAQ V1.5 - REINFORCED)
 * [SCR-952]: Neural Sync - Enforced logical binding with the external Checkbox.
 */
export default function TermsContent() {
  const router = useRouter();

  const handleAgree = () => {
    // [SCR-952] THE ATOMIC BINDING
    triggerHaptic('success');
    localStorage.setItem('termsAgreed', 'true');

    // الانتقال للوراء لاستئناف عملية التسجيل مع تفعيل النبض العصبي
    router.back();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background flex flex-col items-center" dir="rtl">
      <Card className="w-full max-w-4xl border-2 border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-xl">
        {/* الهيدر السيادي */}
        <CardHeader className="bg-primary/10 border-b border-primary/20 p-8 text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 shadow-inner">
            <ShieldCheck className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-3xl font-black tracking-tighter text-foreground italic uppercase">الميثاق القانوني والسيادي</CardTitle>
            <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
              منصة سفريات (Safaryat) • الإصدار 1.5 (الموحد)
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[60vh] p-8">
            <div className="space-y-10 text-right leading-relaxed">

              {/* الباب الأول */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-xl font-black text-primary border-b border-primary/10 pb-2">
                  <FileText className="h-5 w-5" /> الباب الأول: الهوية والأسس السيادية (مبدأ الورقة البيضاء)
                </h3>
                <div className="space-y-4 pr-4 border-r-2 border-primary/5">
                  <div className="space-y-2">
                    <p className="font-bold text-foreground">المادة (1): الهوية الوسيطة والتوصيف القانوني</p>
                    <p className="text-sm text-muted-foreground">تُعد منصة "سفريات" وسيطاً تقنياً ذكياً (Digital Broker) ومحض وعاء برمجياً يربط بين الأطراف، وهي ليست شركة نقل ولا تملك أسطولاً ولا تتدخل في التنفيذ المادي للرحلات. وبناءً عليه، تُعتبر المنصة في كافة عملياتها وتحتكم في سياستها الى مبدأ "براء الورقة بيضاء" تقنية محايدة؛ فالمنصة (الورقة) ومبرمجيها (صانعو الورقة) وأدواتها (القلم) هي وسائل مجردة، والمسؤولية القانونية والجنائية تقع حصراً على "العقل واليد" (المستخدم) الذي يدوّن البيانات أو يؤسس الرحلات عبرها.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-foreground">المادة (2): المرجعية السيادية في التفسير</p>
                    <p className="text-sm text-muted-foreground">تملك إدارة المنصة الحق المنفرد والحصري في تفسير "مبدأ براءة الورقة البيضاء" وكافة بنود هذا الميثاق. ويُعتبر رأي المنصة وتفسيرها هو "الرأي الغالب" والقطعي فيما يتعلق بالمقصود من النصوص وغاياتها، ولا يجوز لأي طرف فرض تفسير بديل يتناقض مع الغاية الجوهرية للوساطة التقنية المحايدة.</p>
                  </div>
                </div>
              </section>

              {/* الباب الثاني */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-xl font-black text-primary border-b border-primary/10 pb-2">
                  <Scale className="h-5 w-5" /> الباب الثاني: براءة الذمة المالية والتشغيلية المطلقة
                </h3>
                <div className="space-y-4 pr-4 border-r-2 border-primary/5">
                  <div className="space-y-2">
                    <p className="font-bold text-foreground">المادة (3): انعدام الشراكة والتبعية المالية</p>
                    <p className="text-sm text-muted-foreground">يقر المستخدم بأن دور المنصة في العمليات المالية هو "التوثيق الرقمي السلبي" فقط لما تمليه إرادة الأطراف. وبناءً عليه، فإن براءة ذمة المنصة شاملة ونهائية من أي نزاعات مالية (عربون، أجور، تعويضات) مهما بلغت قيمتها. أي نص أو رقم مالي أو وسيلة دفع تُعتمد بين الطرفين تقع تحت طائلة "براءة الورقة البيضاء"، ولا يترتب على المنصة أي عبء قانوني أو حقوق مالية تضامنية.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-foreground">المادة (4): إخلاء المسؤولية الميداني والجنائي</p>
                    <p className="text-sm text-muted-foreground">تنتهي مسؤولية المنصة عند حدود "الربط التقني"؛ فلا تتحمل أدنى مسؤولية عن حوادث السير، التلفيات، السلوكيات الشخصية، أو المخالفات القانونية التي تقع أثناء الرحلة. تُعتبر العلاقة التعاقدية في النقل "مباشرة وحصرية" بين الناقل والمسافر، والمنصة خالية الطرف تماماً من أي تبعات ناتجة عن إخلال أي طرف بالتزاماته الميدانية أو الأخلاقية والتعاقدية.</p>
                  </div>
                </div>
              </section>

              {/* الباب الثالث */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-xl font-black text-primary border-b border-primary/10 pb-2">
                  <Fingerprint className="h-5 w-5" /> الباب الثالث: سيادة البيانات والمسؤولية الجنائية
                </h3>
                <div className="space-y-4 pr-4 border-r-2 border-primary/5">
                  <div className="space-y-2">
                    <p className="font-bold text-foreground">المادة (5): مسؤولية التأسيس ومشروعية البيانات</p>
                    <p className="text-sm text-muted-foreground">يضمن المستخدم امتلاكه الحق الحصري أو التفويض القانوني المطلق لكافة البيانات والوثائق المدخلة (وثائق، وتعريفات، تفويضات، انتدابات او توكيلات). إن فعل "تأسيس طلب حجز" أو "تأسيس رحلة" هو إجراء نابع عن إرادة المستخدم المنفردة، والمنصة خالية الطرف من تبعات عدم صحة أو شرعية هذه العمليات، ويقع عبء الإثبات الجنائي على مدخل البيانات وحده.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-foreground">المادة (6): بروتوكول التقييم والأثر الرقمي</p>
                    <p className="text-sm text-muted-foreground">تُعد التقييمات والتعليقات المنشورة "شهادات شخصية" تعبر عن رأي أصحابها؛ ويتحمل المستخدم (المقيم) وحده المسؤولية الجنائية عن تقييمه في حال ادعاء الطرف الآخر بالتشهير. وموافقة المستخدم تمنح المنصة حق استضافة هذه البيانات كجزء من "سجل العمليات" (Audit Log) التاريخي الذي لا يحق للمستخدم المطالبة بحذفه لتعلقه بحقوق أطراف أخرى في توثيق الحقيقة.</p>
                  </div>
                </div>
              </section>

              {/* الباب الرابع */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-xl font-black text-primary border-b border-primary/10 pb-2">
                  <AlertTriangle className="h-5 w-5" /> الباب الرابع: بروتوكولات التشغيل والحق في التعديل
                </h3>
                <div className="space-y-4 pr-4 border-r-2 border-primary/5">
                  <div className="space-y-2">
                    <p className="font-bold text-foreground">المادة (7): معايير الاستخدام والنزاهة التقنية</p>
                    <p className="text-sm text-muted-foreground">لضمان سلامة البيئة الرقمية، يلتزم المستخدم ببروتوكولات النظام التقنية، وأهمها "العملية النشطة الواحدة" (رحلة واحدة للناقل أو حجز واحد للمسافر). كما يُعتبر السعر الموثق عند "تأسيس العرض" هو نقطة البيانات المرجعية الملزمة التي يوثقها الوسيط.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-foreground">المادة (8): السيادة في التحديث والامتثال</p>
                    <p className="text-sm text-muted-foreground">تملك المنصة الحق في تحديث أو تعديل بنود هذا الميثاق في أي وقت. ويلتزم النظام برمجياً بإخطار المستخدم بكل تعديل، حيث يُعد استمرار الاستخدام أو إعادة الإقرار بالموافقة التزاماً نهائياً بالصيغة المحدثة، والتي ستظهر فيها التعديلات الجوهرية بوضوح لضمان المصداقية والشفافية.</p>
                  </div>
                </div>
              </section>

              {/* الباب الخامس */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-xl font-black text-primary border-b border-primary/10 pb-2">
                  <Gavel className="h-5 w-5" /> الباب الخامس: الأحكام الختامية والنزاعات
                </h3>
                <div className="space-y-4 pr-4 border-r-2 border-primary/5">
                  <div className="space-y-2">
                    <p className="font-bold text-foreground">المادة (9) سجل العمليات (Audit Log)</p>
                    <p className="text-sm text-muted-foreground">يعتبر السجل البرمجي المخزن في قواعد بيانات "سفريات" هو المرجع الوحيد والقطعي لفض النزاعات (التوقيت، المضمون، الأفعال) ولا يُفصح عنها إلا بأمر يحمل الصفة الرسمية أو القانونية.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-foreground">المادة (10): الاختصاص القضائي</p>
                    <p className="text-sm text-muted-foreground">تُعتبر اللغة العربية هي المرجع الوحيد لتفسير نصوص هذا الميثاق، وتختص محاكم عمان (المملكة الأردنية الهاشمية) حصرياً بالنظر في أي نزاع قانوني ينشأ عن استخدام المنصة.</p>
                  </div>
                </div>
              </section>

              {/* 🛡️ الملحق التقني السيادي */}
              <section className="mt-12 p-6 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/30">
                <h4 className="font-black text-primary mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> ملحق النزاهة التقنية (Sovereign Technical Addendum)
                </h4>
                <ul className="list-disc pr-5 space-y-3 text-xs font-bold text-muted-foreground">
                  <li>يُقر المستخدم بأن المعرف الذري (Atomic ID) هو "التوقيع الرقمي" المعتمد والملزم قانوناً لكافة معاملاته.</li>
                  <li>يُعتبر توقيت النخاع السحابي (Server Timestamp) هو الحقيقة الزمنية المطلقة التي تُبنى عليها الاستحقاقات المالية.</li>
                  <li>أي محاولة تلاعب بالجينوم البرمجي للنظام أو خرق بروتوكول الرحلة الواحدة تُعد خرقاً للميثاق وتستوجب الطرد الأمني الفوري.</li>
                </ul>
              </section>

            </div>
          </ScrollArea>
        </CardContent>

        {/* زر الموافقة المشمع */}
        <div className="p-8 border-t bg-muted/20">
          <Button
            className="w-full h-16 text-xl font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all gap-3"
            onClick={handleAgree}
          >
            <ShieldCheck className="h-6 w-6" />
            أوافق على الميثاق السيادي وألتزم بما ورد فيه
          </Button>
          <p className="text-center text-[10px] text-muted-foreground mt-4 font-mono uppercase tracking-widest">
            Sovereign Digital Contract • Endorsed & Sealed v1.5
          </p>
        </div>
      </Card>
    </div>
  );
}
