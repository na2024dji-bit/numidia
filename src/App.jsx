import { useState, useEffect, useRef } from "react";

// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
  GOOGLE_SHEET_ORDERS_URL: "https://script.google.com/macros/s/AKfycbzRYvNtrS3W_T75jfb5N1oqn6JeDbWEKIM2vKDftYfTsU563-v-NQzM7u5eYhWnZu3F/exec",
  FB_PIXEL_ID: "YOUR_FB_PIXEL_ID",
  TIKTOK_PIXEL_ID: "YOUR_TIKTOK_PIXEL_ID",
  STORE_NAME: "Numidia Algerie",
  CURRENCY: "دج",
  DELIVERY_PRICE: 600,
  FREE_DELIVERY_THRESHOLD: 10000,
};

// ============================================================
// RESPONSIVE HOOK
// ============================================================
function useIsMobile() {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  useEffect(() => {
    const handle = () => setMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return mobile;
}

// ============================================================
// ALGERIA WILAYAS
// ============================================================
const ALGERIA_WILAYAS = [
  { code: "01", name: "أدرار", communes: ["أدرار","رقان","تيميمون","بودة","شروين","أوقروت","تامنطيط","فنوغيل","تيت","كنتة","أولف","زاوية كنتة","أنزقمير","بوده","تسابيت"] },
  { code: "02", name: "الشلف", communes: ["الشلف","تنس","بني حواء","بوقدير","وادي الفضة","الهرانفة","بني بوعتاب","العطاف","أولاد فارس","سيدي عكاشة","زبوجة","بريرة","الكاريتة","بني راشد","الحجاج","حرشون","دحموني","سيدي عبدالله","ابن الحسين","واد سلي","زيتونة","أبو الحسن"] },
  { code: "03", name: "الأغواط", communes: ["الأغواط","قصر الحيران","حاسي الرمل","عين ماضي","تاجموت","بريدة","سبعة","أفلو","حاسي دلاعة","الغيشة","ثليجان","الحاج المشري","سيدي بوزيد","عين سيدي علي"] },
  { code: "04", name: "أم البواقي", communes: ["أم البواقي","عين البيضاء","عين مليلة","عين فكرون","قصبة","سوق نعمان","بلالة","مسكيانة","عين الديس","الفجوج","بريش","الزرق","آريس","سيقوس","عين قشرة","عين بابوش","كيمل","عين الزيتون"] },
  { code: "05", name: "باتنة", communes: ["باتنة","مروانة","رأس العيون","القصر","واد الشعبة","آريس","أيت المنصور","ثنية العابد","بيطام","فسديس","مداوروش","نقاوس","سرج الغول","جرمة","سلطان","إشمول","تيغانيمين","قيقبة","واد معتا","وادي الفيض"] },
  { code: "06", name: "بجاية", communes: ["بجاية","خراطة","أقبو","أميزور","الفلاي","أوقاس","الكسار","درقينة","أيت رزين","بني مليكش","شميني","تالة حمزة","فناية الماتن","تيزي نبربار","بوحمزة","أوزلاقن","طاودة","تيشي","أيت بولحال"] },
  { code: "07", name: "بسكرة", communes: ["بسكرة","طولقة","أورلال","برانيس","عين الناقة","جمورة","الفيض","المزيرعة","زريبة الواد","سيدي عقبة","كنكان","درمون","الحاجب","لشانة","ليوة","شتمة","أوماش","قرط","سيدي خالد","البسباس"] },
  { code: "08", name: "بشار", communes: ["بشار","ولاد خدير","التبلبالة","بني عباس","أبادلة","مريجة","البيضاء"] },
  { code: "09", name: "البليدة", communes: ["البليدة","الأربعاء","موزاية","بوفاريك","شفا","بن خليل","البرواقية","سيدي موسى","بو إسماعيل","الشريعة","صوهان","عين الرمانة","القليعة","بوعرفة","واد عيزي","الدامية","واد الدوس"] },
  { code: "10", name: "البويرة", communes: ["البويرة","لكبيرة","سور الغزلان","إعكورن","مشدالة","بودربالة","أيت لزيز","برج اخريص","الحجرة الزرقاء","الكمارة","ذراع القايد","أقبيل","تيزي نتيفرت","واد البردي","عين بسام","تاغزوت","الأسنام","زبربر"] },
  { code: "11", name: "تمنراست", communes: ["تمنراست","عين صالح","عين قزام","إدلس","إن گار"] },
  { code: "12", name: "تبسة", communes: ["تبسة","الشريعة","عين الزيتونة","البيضاء","تندوف","غسيرة","النقرينة","بئر العاتر","الحمامات","عيون البيضاء","بئر قرون","لعوينات","مرسط","ثليجان","واد الزيتون","قريشة"] },
  { code: "13", name: "تلمسان", communes: ["تلمسان","منصورة","سبدو","أندلسية","واد لحمر","واد سبع","بني خلاد","المغنية","سوق الثلاثاء","بني سنوس","زناتة","رمشي","الحناية","بني ونيف","سفيزف","سيدي موسى","البيض","تيغنيف","عين يوسف"] },
  { code: "14", name: "تيارت", communes: ["تيارت","سوق الجمعة","مدروسة","سبعة أولياء","رحوية","قصر شلالة","جيلالي بن عمار","سرغين","بوقرة","متلمية","واد درجين","مسبح","تغالمت","واد سرسو","القطار","الرحاحلية","سيدي خلف"] },
  { code: "15", name: "تيزي وزو", communes: ["تيزي وزو","أزفون","أقبو","عين الحمام","أيت خليلي","أيت يحيى موسى","إيلولة أومالو","واذيس","بني زمنزر","بوجيمة","الأرباء","إيفيغا","سوق الثنين","تيزي رشد","مقلع","ذراع القصبة"] },
  { code: "16", name: "الجزائر", communes: ["حيدرة","باب الجديد","باب الوادي","بلكور","بن عكنون","بوزريعة","برج الكيفان","الكاليتوس","براقي","قاسمة","حسين داي","الحراش","اولاد فايت","درارية","الجزائر الوسطى","المراد رايس","سيدي عبدالله","وادي السمار","بني مسوس","رايس حميدو"] },
  { code: "17", name: "الجلفة", communes: ["الجلفة","عين وسارة","مسعد","دار الشيوخ","سيدي بايزيد","الإدريسية","الفيض","بيرين","حاسي بحبح","عمورة","سلمانة","دلدول","أم العظام","الزكار","عين الايبل"] },
  { code: "18", name: "جيجل", communes: ["جيجل","الطاهير","واد الأجول","الميلية","الشقفة","أقيل","سيدي معروف","تكسالا","بركة الصخور","واد الشعبة","غبالة","سيدي مزغيش","الأنصار","خير الدين","جملة","الكاهنة"] },
  { code: "19", name: "سطيف", communes: ["سطيف","عين ولمان","عين التين","عين عروات","عين أزال","عين لقراش","بيضاء برج","ببار","بني عزيز","برج الغدير","عين الكبيرة","الغزالة","قجال","قصر الأبطال","خوبانة"] },
  { code: "20", name: "سعيدة", communes: ["سعيدة","عين الحجر","أولاد إبراهيم","سيدي أحمد","المعمورة","يوب","سيدي بوبكر","أولاد خالد","حوطة","التيرت","دوي ثابت"] },
  { code: "21", name: "سكيكدة", communes: ["سكيكدة","الحروش","عزابة","عين زيت","القل","تالة هاشم","بني بشير","سيدي مزغيش","رمضان جمال","الزيتونة","بوشطاطة","كركرة","بني ورنيلة"] },
  { code: "22", name: "سيدي بلعباس", communes: ["سيدي بلعباس","سفيزف","تلاغ","ضاية الرحمة","مرحوم","عين بية","تسالة لمطاعي","لمقرة","الحصاوية","مشرية","واد سباع","سيدي شعيب","واد تاورة"] },
  { code: "23", name: "عنابة", communes: ["عنابة","سيدي عمار","البوني","وادي العنب","شرفة","الحجار","العلمة","برحال","رمضان جمال","المزفران"] },
  { code: "24", name: "قالمة", communes: ["قالمة","النشمية","بوحمدان","سلاوة عنونة","خزارة","هيليوبوليس","عين الحبيب","بوعاتي محمود","بوحجار","عين بن بيضاء"] },
  { code: "25", name: "قسنطينة", communes: ["قسنطينة","زيغود يوسف","خروب","ديدوش مراد","عين ابيد","ابن زياد","بني حميدان"] },
  { code: "26", name: "المدية", communes: ["المدية","بوعيش","واد الدواو","ثنية الحد","مجبر","العزيزية","الشهبونية","حمام ريغة","بوسكن","قصر البخاري","تابلاط","أيت لزيز","سيدي نعمان","واد الحبال"] },
  { code: "27", name: "مستغانم", communes: ["مستغانم","سيق","بطيوة","أولاد مع الله","عشعاشة","حسين","صفصف","بن عبد المالك رمضان","منصورة","واد المقتع","عين بودينار","أولاد موسى"] },
  { code: "28", name: "المسيلة", communes: ["المسيلة","بوسعادة","ولتامة","سيدي عيسى","العلية","بريكة","واد الناموس","مقرة","دهاهنة","المدارس","خبانة","أولاد دراج","الحمامة"] },
  { code: "29", name: "معسكر", communes: ["معسكر","تيزي","أولاد مامي","غريس","المنصورة","سيدي قادة","سيدي بوسيف","واد الأبطال","سيدي عبدالمومن","عين فراح","فروحة"] },
  { code: "30", name: "ورقلة", communes: ["ورقلة","تقرت","تماسين","النقوسة","حاسي بن عبدالله","الرويسات","سيدي خويلد","التومات","غرداية","بلدة"] },
  { code: "31", name: "وهران", communes: ["وهران","عين الترك","بطيوة","المرسى الكبير","حاسي بونيف","الأندلس","الخروب","سيدي الشحمي","سيدي مبروك","عين البيا","الكرمة","مسرغين","سيدي بن يبقى","واد طليلات"] },
  { code: "32", name: "البيض", communes: ["البيض","القنادسة","المشرية","بوقطب","سيدي أمحمد بن بوزيان","سفيزف","أولاد بابكر","تنيرة","الأبيض سيدي الشيخ"] },
  { code: "33", name: "إليزي", communes: ["إليزي","دبدب","برج عمر إدريس","إن أميناس"] },
  { code: "34", name: "برج بوعريريج", communes: ["برج بوعريريج","بن داود","رأس الوادي","واد البردي","قصر الحيران","الأنصار","المنصورة","أولاد إبراهيم","تسمر","المدارس","موجبارة","منعة"] },
  { code: "35", name: "بومرداس", communes: ["بومرداس","ثنية الأحد","بودواو","دلس","إسحاقن","نابيلة","تاكسنة","واد الصواب","عمارة","أربع تاشت","حمادي الاول","بوغزول","بني عمران","لقاطة","كازي أموسة"] },
  { code: "36", name: "الطارف", communes: ["الطارف","بوقوس","بن مهيدي","قالة","رمل سوق","شحيمة","عين عصفور","بسباس","الشافية","الزيتونة","ذرعان","ليليات","أولاد غنام"] },
  { code: "37", name: "تندوف", communes: ["تندوف","الحمام"] },
  { code: "38", name: "تيسمسيلت", communes: ["تيسمسيلت","براهيمية","خميستي","بني شعيب","الأرواء","ثنية الأحد","سيدي بوتشنت","العماري","لزرق","الأحجاج","ذبيح الدين"] },
  { code: "39", name: "الوادي", communes: ["الوادي","حمرية","ورماس","الدبيلة","الطالب العربي","كوينين","الرقيبة","البياضة","الرباح","حساني عبدالكريم","سيدي خليل","السالهي","الملالة"] },
  { code: "40", name: "خنشلة", communes: ["خنشلة","بغاي","طزيت","الرميلة","شلية","أولاد رشاش","بابار","قايس","الحامة"] },
  { code: "41", name: "سوق أهراس", communes: ["سوق أهراس","سدراتة","واد الكبريت","خنق مايو","حنانشة","تاورة","أولاد موسى","المشروحة","أيت احمد"] },
  { code: "42", name: "تيبازة", communes: ["تيبازة","بوهارون","شرشل","بوعرفة","أحمد داودي","واد الشعبة","بني ميلك","واد زيان","سيدي راشد","قولية","سيدي عمر","أولاد يائش","بوحجر","حجوط","أفيرفيل","خميستي"] },
  { code: "43", name: "ميلة", communes: ["ميلة","تلاقمة","تسدان هاضي","أمقل","أحمد راشدي","رواشد","بني ياحيا","واد الأثمانية","شلغوم العيد","واد السقي","قنزات","السواقي","درجين","فرجيوة","بني الطاهر"] },
  { code: "44", name: "عين الدفلى", communes: ["عين الدفلى","الخميس مليانة","بربر","بومدفع","مليانة","جنداس","رحاوبة","جندل","مصفى","عين البنيان","الشومر","بنعكنون","الحجرة","عين الشموسة"] },
  { code: "45", name: "النعامة", communes: ["النعامة","عين الصفراء","مشرية","عسلة","قصبات","بكاسم","دجنة","صفيصفة","تيوت"] },
  { code: "46", name: "عين تموشنت", communes: ["عين تموشنت","أولاد كيحل","بني صاف","سيدي بن عدة","بوزدجر","تارقة","واد الصباح","سيدي سيفيان"] },
  { code: "47", name: "غرداية", communes: ["غرداية","مليكة","المنيعة","بريان","القرارة","واد النعامة","الضاية بن ضحوة","الشريعة","حاسي العكلة","متليلي"] },
  { code: "48", name: "غليزان", communes: ["غليزان","أولاد يحيى","بني سنوس","واد رهيو","قلتة بوعمامة","الرمكة","معصرة","جمعة الشبابطة","سيدي موسى","زمورة"] },
  { code: "49", name: "تيميمون", communes: ["تيميمون","متارفة","أولوف","تلمين","دلدول"] },
  { code: "50", name: "برج باجي مختار", communes: ["برج باجي مختار","تيميمون"] },
  { code: "51", name: "أولاد جلال", communes: ["أولاد جلال","سيدي خالد","الدوسن","راس الميعاد","البسباس"] },
  { code: "52", name: "بني عباس", communes: ["بني عباس","إقستن","الأبيض","القنادسة"] },
  { code: "53", name: "عين صالح", communes: ["عين صالح","عين قزام","فوقرت"] },
  { code: "54", name: "عين قزام", communes: ["عين قزام","بورج عمر إدريس"] },
  { code: "55", name: "تقرت", communes: ["تقرت","نقوسة","بلدة","تبسبست","الطيبات"] },
  { code: "56", name: "جانت", communes: ["جانت","إليزي"] },
  { code: "57", name: "المغير", communes: ["المغير","جامعة","سيدي خليل","القطارة"] },
  { code: "58", name: "المنيعة", communes: ["المنيعة","هاسي الفحل","بريان"] },
];

// ============================================================
// PRODUCTS
// ============================================================
const PRODUCTS = [
  {
    id: 1,
    name: "CASIO MTP-V002D-1B3",
    price: 5300,
    oldPrice: 6100,
    // الصورة الأولى تُستخدم في بطاقة المنتج والـ thumbnail
    image : "/mtp2.avif",
    // أضف صورك هنا — الصورة الأولى هي الرئيسية
    images: [
      "/MTP_LTP_V002D_1B3.jpg",
      "/61dIMKm80NL._AC_SY500_.jpg",
      "/images.jpeg",
      "/br-m036969-00602_jam-tangan-couple-casio-mtp-v002d-1b3udf-x-ltp-v002d-1b3udf_full02-f3f6bd82.webp",
    ],
    badge: "الأكثر مبيعاً",
    description: "ساعة جميلة و  مريح وعصرية مناسب لجميع المناسبات",
    variants: [ "أسود", ],
   
    // ── معلومات إضافية لتبويبات صفحة المنتج ──────────────────
    longDescription:
`تألق بأناقة في العمل أو أوقات فراغك مع مجموعة ساعات كاسيو  MTP-V002.

بفضل نافذة التاريخ العملية عند موضع الساعة الثالثة، والأرقام الرومانية الكلاسيكية ومؤشرات الساعات التي تُسهّل قراءة الوقت، ستكون دائمًا في المكان المناسب. تتميز هذه الساعات الأنيقة والمتعددة الاستخدامات بمقاومتها للماء، مما يجعلها مثالية للاستخدام اليومي، فلا داعي للقلق عند الخروج تحت المطر أو أثناء غسل الأطباق.

اختر الأناقة الكلاسيكية مع سوار معدني، أو اختر إطلالة أكثر عصرية .`,
    specs: [
      { label: "Band", value: "Stainless Steel BandTriple-fold Clasp" },
      { label: "Weight", value: "93 g" },
      { label: "Water resistance", value: "Water Resistant" },
      { label: "battery life", value: "1 years" },
      { label: "Glass", value: "Mineral Glass" },
    ],
    gallery: [
      "/download (1).jpeg",
      "/download (2).jpeg",
      "/download.jpeg",
       "/images.jpeg",
    ],
    videoUrl: "", // ضع رابط فيديو عرض المنتج هنا
    reviews: [
      { name: "يوسف ب.", rating: 5, date: "2026/01/12", comment: "جودة ممتازة والمقاس دقيق جداً، التوصيل كان سريعاً لولاية وهران. أنصح به بشدة." },
      { name: "حفيظ م.", rating: 4, date: "2026/01/08", comment: " مريح جداً للاستخدام اليومي، ." },
      { name: "كريم ز.", rating: 5, date: "2025/12/29", comment: "اشتريته كهدية والمستلم سعيد جداً به. التغليف كان أنيقاً أيضاً." },
    ],
  },
  {
    id: 2,
    name: "ساعة ذكية Pro",
    price: 8900,
    oldPrice: 12000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
      "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=800&q=80",
    ],
    badge: "جديد",
    description: "ساعة ذكية بمواصفات عالية ومتعددة الوظائف",
    variants: ["أسود", "فضي", "ذهبي"],
    sizes: [],
    longDescription:
`ساعة ذكية متطورة بشاشة AMOLED لمسية عالية الدقة، تجمع بين الأنيقة والوظائف الذكية في تصميم واحد.

تتيح لك متابعة معدل ضربات القلب، مستوى الأكسجين، عدد الخطوات، وجودة النوم على مدار اليوم، مع إشعارات فورية للمكالمات والرسائل من هاتفك.

بطارية تدوم حتى 7 أيام مع استخدام عادي، ومقاومة كاملة للماء والغبار IP68 — تناسب جميع الأنشطة اليومية والرياضية.`,
    specs: [
      { label: "الشاشة", value: "1.85 إنش AMOLED لمسية" },
      { label: "البطارية", value: "تدوم حتى 7 أيام" },
      { label: "مقاومة الماء والغبار", value: "IP68" },
      { label: "الاتصال", value: "Bluetooth 5.0" },
      { label: "التوافق", value: "Android و iOS" },
      { label: "المستشعرات", value: "نبض القلب، الأكسجين، النوم، الخطوات" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&q=80",
      "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=500&q=80",
    ],
    videoUrl: "", // ضع رابط فيديو عرض الساعة هنا
    reviews: [
      { name: "أمين ت.", rating: 5, date: "2026/02/02", comment: "الساعة رائعة والشاشة واضحة جداً حتى تحت الشمس. البطارية تدوم تقريباً 6 أيام." },
      { name: "نور الهدى ع.", rating: 5, date: "2026/01/20", comment: "تطبيق المزامنة سهل والإشعارات تأتي فوراً. تستحق السعر بالكامل." },
      { name: "بلال س.", rating: 4, date: "2026/01/05", comment: "ساعة جيدة جداً، فقط قياس الأكسجين يحتاج بعض الوقت ليكون دقيقاً." },
    ],
  },
  {
    id: 3,
    name: "حقيبة جلدية أصيلة",
    price: 6200,
    oldPrice: 9000,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
    ],
    badge: "خصم 31%",
    description: "حقيبة جلد طبيعي 100% بتصميم أنيق وعصري",
    variants: ["بني", "أسود", "بيج"],
    sizes: [],
    longDescription:
`حقيبة مصنوعة من جلد طبيعي 100% بخياطة يدوية متينة، تجمع بين الأناقة الكلاسيكية والعملية اليومية.

تحتوي على عدة جيوب داخلية وخارجية لتنظيم أغراضك، بما في ذلك جيب مخصص للابتوب حتى 13 إنش، وحزام كتف قابل للتعديل والإزالة.

مناسبة للعمل، الجامعة، أو كحقيبة سفر خفيفة — تزداد جمالاً مع الاستخدام كما هو حال الجلد الطبيعي الأصلي.`,
    specs: [
      { label: "المادة", value: "جلد طبيعي 100%" },
      { label: "الأبعاد", value: "30 × 22 × 12 سم" },
      { label: "السعة", value: "تتسع للابتوب حتى 13 إنش" },
      { label: "الإغلاق", value: "سحاب معدني مزدوج" },
      { label: "الحزام", value: "قابل للتعديل والإزالة" },
      { label: "بلد الصنع", value: "صناعة يدوية محلية" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&q=80",
      "https://images.unsplash.com/photo-1559563458-527698bf5295?w=500&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&q=80",
    ],
    videoUrl: "", // ضع رابط فيديو عرض الحقيبة هنا
    reviews: [
      { name: "هند ك.", rating: 5, date: "2026/01/29", comment: "الجلد فعلاً طبيعي وملمسه راقي جداً، رائحته مميزة. تستحق كل دينار." },
      { name: "عبد الرحمن ل.", rating: 5, date: "2026/01/15", comment: "حقيبة عملية جداً وتتسع للابتوب والدفاتر معاً، والخياطة محكمة." },
      { name: "ميساء ن.", rating: 4, date: "2025/12/22", comment: "جميلة جداً، التوصيل تأخر يوماً واحداً عن الموعد لكن المنتج يستحق الانتظار." },
    ],
  },
];

// ============================================================
// PIXELS
// ============================================================
const Pixels = {
  init() {
    if (typeof window === "undefined") return;
    if (CONFIG.FB_PIXEL_ID !== "YOUR_FB_PIXEL_ID") {
      window.fbq = window.fbq || function () { (window.fbq.q = window.fbq.q || []).push(arguments); };
      window.fbq("init", CONFIG.FB_PIXEL_ID);
      window.fbq("track", "PageView");
    }
    if (CONFIG.TIKTOK_PIXEL_ID !== "YOUR_TIKTOK_PIXEL_ID") {
      window.ttq = window.ttq || (() => { const q = []; const o = { track: (...a) => q.push(["track", ...a]) }; o._q = q; return o; })();
      window.ttq.track("PageView");
    }
  },
  viewContent(p) { this._fb("ViewContent", { content_ids: [p.id], content_name: p.name, value: p.price, currency: "DZD" }); this._tt("ViewContent", { content_id: p.id, content_name: p.name, value: p.price, currency: "DZD" }); },
  initiateCheckout(cart) { const t = cart.reduce((s, i) => s + i.price * i.qty, 0); this._fb("InitiateCheckout", { value: t, currency: "DZD" }); this._tt("InitiateCheckout", { value: t, currency: "DZD" }); },
  purchase(o) { this._fb("Purchase", { value: o.total, currency: "DZD", order_id: o.id }); this._tt("PlaceAnOrder", { value: o.total, currency: "DZD", order_id: o.id }); },
  _fb(e, d) { if (window.fbq) window.fbq("track", e, d); },
  _tt(e, d) { if (window.ttq) window.ttq.track(e, d); },
};

// ============================================================
// GOOGLE SHEETS
// ============================================================
const Sheets = {
  async sendOrder(data) {
    if (CONFIG.GOOGLE_SHEET_ORDERS_URL.includes("YOUR_SCRIPT_ID")) { console.log("📊 Order:", data); return true; }
    try { await fetch(CONFIG.GOOGLE_SHEET_ORDERS_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); return true; } catch (e) { return false; }
  },
  async sendAbandoned(data) { return this.sendOrder({ ...data, type: "abandoned" }); },
};

// ============================================================
// COLORS / THEME
// ============================================================
const C = {
  white: "#ffffff",
  offwhite: "#f8f8f8",
  light: "#f2f2f2",
  border: "#e0e0e0",
  black: "#111111",
  dark: "#222222",
  muted: "#888888",
  mutedLight: "#aaaaaa",
  red: "#e53935",
  green: "#2e7d32",
  greenLight: "#e8f5e9",
};

// ============================================================
// APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [notif, setNotif] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => { Pixels.init(); }, []);

  const showNotif = (msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 2800);
  };

  const addToCart = (product, variant, size, qty = 1) => {
    const key = `${product.id}-${variant}-${size}`;
    setCart(prev => {
      const ex = prev.find(i => i.key === key);
      if (ex) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { key, ...product, variant, size, qty }];
    });
    showNotif("تمت الإضافة إلى السلة ✓");
  };

  const removeFromCart = key => setCart(prev => prev.filter(i => i.key !== key));
  const updateCartQty = (key, qty) => setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ minHeight: "100vh", background: C.white, color: C.black, fontFamily: "'Tajawal','Cairo','Noto Sans Arabic',sans-serif", direction: "rtl" }}>
      <style>{globalCSS}</style>

      {/* Notification toast */}
      {notif && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: notif.type === "error" ? C.red : C.black, color: C.white, padding: "12px 28px", borderRadius: 50, fontWeight: 700, fontSize: 14, boxShadow: "0 4px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap", animation: "fadeSlide .3s ease" }}>
          {notif.msg}
        </div>
      )}

      {/* NAV */}
      <nav style={{ background: C.white, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, padding: isMobile ? "12px 16px" : "14px 5%", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
        <span style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, color: C.black, cursor: "pointer", letterSpacing: 0.5 }} onClick={() => setPage("home")}>
          {CONFIG.STORE_NAME}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {page !== "home" && (
            <button className="btn-ghost" style={{ fontSize: 13, padding: "7px 14px", display: isMobile ? "none" : "block" }} onClick={() => setPage("home")}>
              → الرئيسية
            </button>
          )}
          <button
            className="btn-black"
            style={{ padding: isMobile ? "9px 14px" : "10px 20px", fontSize: isMobile ? 13 : 14, display: "flex", alignItems: "center", gap: 6 }}
            onClick={() => { if (cart.length) { Pixels.initiateCheckout(cart); setPage("checkout"); } else showNotif("السلة فارغة", "error"); }}
          >
            🛒 <span style={{ background: C.white, color: C.black, borderRadius: "50%", width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>{cartCount}</span>
            {!isMobile && cartTotal > 0 && <span>{cartTotal.toLocaleString()} {CONFIG.CURRENCY}</span>}
          </button>
        </div>
      </nav>

      {page === "home" && <HomePage isMobile={isMobile} products={PRODUCTS} onSelect={p => { setSelectedProduct(p); Pixels.viewContent(p); setPage("product"); }} />}
      {page === "product" && selectedProduct && <ProductPage isMobile={isMobile} product={selectedProduct} onAddToCart={addToCart} onCheckout={(p, v, s) => { addToCart(p, v, s); Pixels.initiateCheckout([...cart, { ...p }]); setPage("checkout"); }} onBack={() => setPage("home")} />}
      {page === "checkout" && <CheckoutPage isMobile={isMobile} cart={cart} cartTotal={cartTotal} onRemove={removeFromCart} onUpdateQty={updateCartQty} onSuccess={order => { Pixels.purchase(order); setCompletedOrder(order); setCart([]); setPage("success"); }} />}
      {page === "success" && <SuccessPage isMobile={isMobile} order={completedOrder} onHome={() => setPage("home")} />}
    </div>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ products, onSelect, isMobile }) {
  // ── لتغيير الفيديو: ضع رابط MP4 هنا ──────────────────────
  const VIDEO_SRC = "/ner.mp4"; // مثال: "https://example.com/casio-mtp-v002.mp4"
  // ──────────────────────────────────────────────────────────

  return (
    <div>

      {/* ── VIDEO HERO ── */}
      <div style={{ position: "relative", width: "100%", height: isMobile ? 260 : 500, background: "#0a0a0a", overflow: "hidden" }}>

        {VIDEO_SRC ? (
          /* ── فيديو حقيقي ── */
          <video
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          /* ── Placeholder حتى يتم رفع الفيديو ── */
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "#111" }}>
            <div style={{ width: isMobile ? 64 : 88, height: isMobile ? 64 : 88, borderRadius: "50%", border: "2px solid #444", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: isMobile ? 28 : 40 }}>▶</span>
            </div>
            <div style={{ color: "#555", fontSize: isMobile ? 13 : 15, textAlign: "center", lineHeight: 1.7 }}>
              <div style={{ color: "#777", fontWeight: 700, marginBottom: 4 }}>Casio MTP-V002-1B3</div>
              <div>ضع رابط الفيديو في <code style={{ background: "#1a1a1a", padding: "2px 8px", borderRadius: 4, color: "#aaa", fontSize: 12 }}>VIDEO_SRC</code></div>
            </div>
          </div>
        )}

        {/* طبقة تدرّج سفلية لانتقال ناعم للـ Hero */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to bottom, transparent, #0a0a0a)", pointerEvents: "none" }} />
      </div>

      {/* Hero — كما هو بدون تغيير */}
      <div style={{ background: C.black, color: C.white, padding: isMobile ? "36px 20px 40px" : "60px 8% 70px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: C.red, color: C.white, borderRadius: 50, padding: "5px 18px", fontSize: 12, fontWeight: 700, marginBottom: 20, letterSpacing: 1 }}>
          🔥 عروض حصرية
        </div>
        <h1 style={{ fontSize: isMobile ? 32 : 54, fontWeight: 900, lineHeight: 1.25, margin: "0 0 16px", color: C.white }}>
          تسوق الأفضل<br />
          <span style={{ color: "#ccc", fontWeight: 400, fontSize: isMobile ? 22 : 36 }}>بالدفع عند الاستلام</span>
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 17, color: "#aaa", margin: "0 0 32px" }}>
          توصيل لجميع ولايات الجزائر الـ 58 · ضمان الجودة · إرجاع مجاني
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {["🚚 توصيل سريع", "💰 الدفع عند الاستلام", "🔄 إرجاع مجاني", "✅ ضمان الجودة"].map(f => (
            <span key={f} style={{ border: "1px solid #444", color: "#ccc", borderRadius: 50, padding: "7px 18px", fontSize: isMobile ? 12 : 13, fontWeight: 500 }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Products */}
      <div style={{ padding: isMobile ? "32px 16px" : "56px 5%" }}>
        <h2 style={{ fontSize: isMobile ? 22 : 30, fontWeight: 900, textAlign: "center", margin: "0 0 28px", color: C.black }}>منتجاتنا المميزة</h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: isMobile ? 12 : 24 }}>
          {products.map(p => <ProductCard key={p.id} product={p} onSelect={onSelect} isMobile={isMobile} />)}
        </div>
      </div>

      {/* Trust bar */}
      <div style={{ background: C.black, display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 0 }}>
        {[
          { icon: "🏆", t: "جودة مضمونة", s: "منتجات أصلية 100%" },
          { icon: "🚚", t: "توصيل سريع", s: "3-5 أيام عمل" },
          { icon: "💳", t: "الدفع عند الاستلام", s: "أمان تام بدون مخاطر" },
          { icon: "📞", t: "دعم 24/7", s: "نحن معك دائماً" },
        ].map((b, i) => (
          <div key={b.t} style={{ padding: isMobile ? "20px 12px" : "28px 24px", display: "flex", alignItems: "center", gap: 12, borderLeft: i > 0 ? "1px solid #333" : "none", borderTop: isMobile && i >= 2 ? "1px solid #333" : "none" }}>
            <span style={{ fontSize: isMobile ? 24 : 30 }}>{b.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: isMobile ? 13 : 15, color: C.white, marginBottom: 3 }}>{b.t}</div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: "#888" }}>{b.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, onSelect, isMobile }) {
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
  return (
    <div className="product-card" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 16, overflow: "hidden", cursor: "pointer" }} onClick={() => onSelect(product)}>
      <div style={{ position: "relative", height: isMobile ? 160 : 240, overflow: "hidden" }}>
        <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s" }} className="card-img" />
        {product.badge && <span style={{ position: "absolute", top: 8, right: 8, background: C.red, color: C.white, borderRadius: 6, padding: isMobile ? "3px 8px" : "4px 10px", fontSize: isMobile ? 10 : 11, fontWeight: 700 }}>{product.badge}</span>}
        <span style={{ position: "absolute", top: 8, left: 8, background: C.black, color: C.white, borderRadius: 6, padding: isMobile ? "3px 8px" : "4px 10px", fontSize: isMobile ? 10 : 11, fontWeight: 700 }}>-{discount}%</span>
      </div>
      <div style={{ padding: isMobile ? "12px" : "18px" }}>
        <h3 style={{ fontSize: isMobile ? 13 : 16, fontWeight: 700, margin: "0 0 6px", color: C.black }}>{product.name}</h3>
        {!isMobile && <p style={{ fontSize: 13, color: C.muted, margin: "0 0 12px", lineHeight: 1.6 }}>{product.description}</p>}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: isMobile ? 10 : 14 }}>
          <span style={{ fontSize: isMobile ? 16 : 20, fontWeight: 900, color: C.black }}>{product.price.toLocaleString()} {CONFIG.CURRENCY}</span>
          <span style={{ fontSize: isMobile ? 12 : 13, color: C.mutedLight, textDecoration: "line-through" }}>{product.oldPrice.toLocaleString()}</span>
        </div>
        <button className="btn-black" style={{ width: "100%", fontSize: isMobile ? 12 : 14, padding: isMobile ? "9px" : "11px" }}>اطلب الآن 🛒</button>
      </div>
    </div>
  );
}

// ============================================================
// QUANTITY CONTROL
// ============================================================
function QtyControl({ value, onChange, min = 1, max = 99, size = "large" }) {
  return (
    <div className={`qty-control ${size}`}>
      <button
        className="qty-btn"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="إنقاص"
      >−</button>
      <div className="qty-divider" />
      <span className="qty-display">{value}</span>
      <div className="qty-divider" />
      <button
        className="qty-btn"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="زيادة"
      >+</button>
    </div>
  );
}

// ============================================================
// IMAGE SLIDER
// ============================================================
function ImageSlider({ images = [], alt = "", discount, badge, isMobile }) {
  const [active, setActive] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const allImages = images.length > 0 ? images : [];

  const prev = () => setActive(i => (i - 1 + allImages.length) % allImages.length);
  const next = () => setActive(i => (i + 1) % allImages.length);

  // Swipe support
  const touchStart = useRef(null);
  const handleTouchStart = e => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = e => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  if (allImages.length === 0) return null;

  return (
    <div>
      {/* Main image */}
      <div
        style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, background: C.light, cursor: isZoomed ? "zoom-out" : "zoom-in" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsZoomed(z => !z)}
      >
        <img
          src={allImages[active]}
          alt={`${alt} ${active + 1}`}
          style={{
            width: "100%",
            height: isMobile ? 300 : 460,
            objectFit: isZoomed ? "contain" : "cover",
            display: "block",
            transition: "transform .3s ease, object-fit .1s",
            transform: isZoomed ? "scale(1.08)" : "scale(1)",
            background: isZoomed ? "#f0f0f0" : "transparent",
          }}
        />
        {/* Discount badge */}
        <span style={{ position: "absolute", top: 14, left: 14, background: C.black, color: C.white, borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 700, zIndex: 2 }}>
          خصم {discount}%
        </span>
        {/* Zoom hint */}
        <span style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(0,0,0,0.45)", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 11, backdropFilter: "blur(4px)", zIndex: 2 }}>
          {isZoomed ? "🔍 اضغط للتصغير" : "🔍 اضغط للتكبير"}
        </span>
        {/* Counter */}
        <span style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.45)", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 11, backdropFilter: "blur(4px)", zIndex: 2 }}>
          {active + 1} / {allImages.length}
        </span>
        {/* Arrows — only if multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              style={{ position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 16, fontWeight: 700, zIndex: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >›</button>
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              style={{ position: "absolute", top: "50%", left: 12, transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 16, fontWeight: 700, zIndex: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >‹</button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 12, overflowX: "auto", paddingBottom: 4 }}>
          {allImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                flexShrink: 0,
                width: isMobile ? 60 : 74,
                height: isMobile ? 60 : 74,
                borderRadius: 10,
                overflow: "hidden",
                border: active === i ? `2.5px solid ${C.black}` : `1.5px solid ${C.border}`,
                cursor: "pointer",
                opacity: active === i ? 1 : 0.65,
                transition: "all .2s",
                boxShadow: active === i ? "0 2px 10px rgba(0,0,0,0.15)" : "none",
              }}
            >
              <img src={img} alt={`${alt} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          ))}
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div style={{ marginTop: 10 }}>
          <span style={{ background: C.red, color: C.white, borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>{badge}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PRODUCT TABS — الوصف / المواصفات / الفيديو / المراجعات
// ============================================================
function ProductTabs({ product, isMobile }) {
  const [active, setActive] = useState("description");

  const reviews = product.reviews || [];
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const tabs = [
    { key: "description", label: "📝 الوصف" },
    { key: "specs", label: "📋 المواصفات" },
    { key: "video", label: "🎬 الفيديو" },
    { key: "reviews", label: `⭐ المراجعات (${reviews.length})` },
  ];

  const Stars = ({ count }) => (
    <span style={{ color: C.black, fontSize: 16, letterSpacing: 2 }}>
      {"★".repeat(count)}<span style={{ color: C.border }}>{"★".repeat(5 - count)}</span>
    </span>
  );

  return (
    <div style={{ marginTop: isMobile ? 36 : 60 }}>
      {/* Tabs nav */}
      <div className="tabs-nav">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`tab-btn${active === t.key ? " tab-btn-active" : ""}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: isMobile ? "22px 0 0" : "30px 0 0" }}>

        {/* ── الوصف ── */}
        {active === "description" && (
          <div style={{ maxWidth: 760 }}>
            <p style={{ fontSize: isMobile ? 14 : 15, lineHeight: 2, color: "#333", whiteSpace: "pre-line" }}>
              {product.longDescription || product.description}
            </p>
            {product.gallery?.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12, marginTop: 24 }}>
                {product.gallery.map((img, i) => (
                  <img key={i} src={img} alt={`${product.name} ${i + 1}`} style={{ width: "100%", height: isMobile ? 120 : 170, objectFit: "cover", borderRadius: 10, border: `1px solid ${C.border}` }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── المواصفات ── */}
        {active === "specs" && (
          <div style={{ maxWidth: 600 }}>
            {product.specs?.length > 0 ? (
              <table className="specs-table">
                <tbody>
                  {product.specs.map((s, i) => (
                    <tr key={i}>
                      <td className="specs-label">{s.label}</td>
                      <td className="specs-value">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: C.muted, fontSize: 14 }}>لا توجد مواصفات إضافية لهذا المنتج.</p>
            )}
          </div>
        )}

        {/* ── الفيديو ── */}
        {active === "video" && (
          <div style={{ maxWidth: 760 }}>
            {product.videoUrl ? (
              <video
                src={product.videoUrl}
                controls
                playsInline
                style={{ width: "100%", borderRadius: 12, display: "block", background: "#000" }}
              />
            ) : (
              <div style={{ width: "100%", aspectRatio: "16/9", background: "#111", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <div style={{ width: isMobile ? 56 : 68, height: isMobile ? 56 : 68, borderRadius: "50%", border: "2px solid #444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: isMobile ? 24 : 30, color: "#fff" }}>▶</span>
                </div>
                <div style={{ color: "#666", fontSize: isMobile ? 12 : 13, textAlign: "center", lineHeight: 1.8, padding: "0 20px" }}>
                  <div style={{ color: "#888", fontWeight: 700, marginBottom: 4 }}>فيديو عرض المنتج</div>
                  <div>ضع رابط الفيديو في <code style={{ background: "#1a1a1a", padding: "2px 8px", borderRadius: 4, color: "#aaa", fontSize: 11 }}>product.videoUrl</code></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── المراجعات ── */}
        {active === "reviews" && (
          <div style={{ maxWidth: 760 }}>
            {reviews.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22, padding: isMobile ? "14px 16px" : "18px 24px", background: C.offwhite, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: isMobile ? 32 : 40, fontWeight: 900, color: C.black, lineHeight: 1 }}>{avgRating}</div>
                <div>
                  <Stars count={Math.round(avgRating)} />
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>بناءً على {reviews.length} {reviews.length === 1 ? "تقييم" : "تقييمات"}</div>
                </div>
              </div>
            )}

            {reviews.length > 0 ? (
              reviews.map((r, i) => (
                <div key={i} className="review-card">
                  <div className="review-header">
                    <span className="review-name">{r.name}</span>
                    <span className="review-date">{r.date}</span>
                  </div>
                  <Stars count={r.rating} />
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ color: C.muted, fontSize: 14 }}>لا توجد مراجعات بعد لهذا المنتج.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ============================================================
// PRODUCT PAGE
// ============================================================
function ProductPage({ product, onAddToCart, onCheckout, onBack, isMobile }) {
  const [variant, setVariant] = useState(product.variants[0] || "");
  const [size, setSize] = useState(product.sizes[0] || "");
  const [qty, setQty] = useState(1);
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
  // إذا لم يوجد images[] نستخدم image الواحدة
  const images = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "48px 5%", maxWidth: 1100, margin: "0 auto" }}>
      {/* Back */}
      <button className="btn-ghost" style={{ marginBottom: 20, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }} onClick={onBack}>
        → العودة للمتجر
      </button>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 52 }}>
        {/* Slider */}
        <ImageSlider
          images={images}
          alt={product.name}
          discount={discount}
          badge={product.badge}
          isMobile={isMobile}
        />

        {/* Info */}
        <div>
          <h1 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 900, margin: "0 0 10px", color: C.black }}>{product.name}</h1>
          <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 20, fontSize: isMobile ? 14 : 15 }}>{product.description}</p>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <span style={{ fontSize: isMobile ? 28 : 36, fontWeight: 900, color: C.black }}>{product.price.toLocaleString()} {CONFIG.CURRENCY}</span>
            <span style={{ fontSize: isMobile ? 16 : 19, color: C.mutedLight, textDecoration: "line-through" }}>{product.oldPrice.toLocaleString()} {CONFIG.CURRENCY}</span>
          </div>

          {product.variants.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: C.muted, display: "block", marginBottom: 10 }}>اللون:</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {product.variants.map(v => (
                  <button key={v} className={variant === v ? "opt-btn-active" : "opt-btn"} onClick={() => setVariant(v)}>{v}</button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: C.muted, display: "block", marginBottom: 10 }}>المقاس:</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {product.sizes.map(s => (
                  <button key={s} className={size === s ? "opt-btn-active" : "opt-btn"} onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.muted, display: "block", marginBottom: 10 }}>الكمية:</label>
            <QtyControl value={qty} onChange={setQty} min={1} max={20} size="large" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button className="btn-black" style={{ padding: "16px", fontSize: 16, fontWeight: 900 }} onClick={() => onCheckout(product, variant, size)}>
              اطلب الآن — الدفع عند الاستلام
            </button>
            <button className="btn-outline" style={{ padding: "14px", fontSize: 14 }} onClick={() => onAddToCart(product, variant, size, qty)}>
              + أضف للسلة
            </button>
          </div>

          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8, borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
            {["🚚 توصيل لجميع ولايات الجزائر", "💰 الدفع عند استلام الطلب", "🔄 إرجاع مجاني خلال 7 أيام", "📦 تغليف آمن ومحكم"].map(f => (
              <div key={f} style={{ color: C.muted, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── تفاصيل إضافية: الوصف / المواصفات / الفيديو / المراجعات ── */}
      <ProductTabs product={product} isMobile={isMobile} />
    </div>
  );
}

// ============================================================
// CHECKOUT PAGE
// ============================================================
function CheckoutPage({ cart, cartTotal, onRemove, onUpdateQty, onSuccess, isMobile }) {
  const [form, setForm] = useState({ name: "", phone: "", phone2: "", wilaya: "", commune: "", address: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [communes, setCommunes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const abandonedSent = useRef(false);
  const abandonedTimer = useRef(null);

  const delivery = cartTotal >= CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : CONFIG.DELIVERY_PRICE;
  const total = cartTotal + delivery;

  useEffect(() => {
    if (form.wilaya) {
      const w = ALGERIA_WILAYAS.find(w => w.code === form.wilaya);
      setCommunes(w ? w.communes : []);
      setForm(f => ({ ...f, commune: w ? w.communes[0] : "" }));
    }
  }, [form.wilaya]);

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
    clearTimeout(abandonedTimer.current);
    abandonedTimer.current = setTimeout(() => {
      if (!abandonedSent.current && form.phone.length >= 9) {
        abandonedSent.current = true;
        Sheets.sendAbandoned({ type: "abandoned", timestamp: new Date().toISOString(), name: form.name, phone: form.phone, wilaya: ALGERIA_WILAYAS.find(w => w.code === form.wilaya)?.name || form.wilaya, commune: form.commune, cart: cart.map(i => `${i.name} x${i.qty}`).join(", "), total });
      }
    }, 120000);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.phone.match(/^(05|06|07)\d{8}$/)) e.phone = "رقم هاتف غير صحيح (05/06/07 XXXXXXXX)";
    if (!form.wilaya) e.wilaya = "اختر الولاية";
    if (!form.commune) e.commune = "اختر البلدية";
    if (!form.address.trim()) e.address = "العنوان التفصيلي مطلوب";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    clearTimeout(abandonedTimer.current);
    const orderId = `ALG-${Date.now()}`;
    const wilayaName = ALGERIA_WILAYAS.find(w => w.code === form.wilaya)?.name || form.wilaya;
    const orderData = {
      type: "order", orderId,
      timestamp: new Date().toISOString(),
      name: form.name, phone: form.phone, phone2: form.phone2,
      wilaya: wilayaName, commune: form.commune, address: form.address, notes: form.notes,
      items: cart.map(i => `${i.name} (${i.variant || ""} ${i.size || ""}) x${i.qty} = ${(i.price * i.qty).toLocaleString()} دج`).join(" | "),
      subtotal: cartTotal, delivery, total, paymentMethod: "الدفع عند الاستلام",
    };
    await Sheets.sendOrder(orderData);
    onSuccess({
      id: orderId,
      total,
      subtotal: cartTotal,
      delivery,
      name: form.name,
      phone: form.phone,
      wilaya: wilayaName,
      commune: form.commune,
      address: form.address,
      notes: form.notes,
      date: new Date().toISOString(),
      items: cart.map(i => ({ name: i.name, variant: i.variant, size: i.size, qty: i.qty, price: i.price, image: i.image })),
    });
    setSubmitting(false);
  };

  const SummaryBox = () => (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: isMobile ? 16 : 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px", color: C.black }}>🛒 ملخص الطلب</h3>
      {cart.map(item => (
        <div key={item.key} style={{ display: "flex", gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${C.light}`, position: "relative" }}>
          <img src={item.image} alt={item.name} style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", flexShrink: 0, border: `1px solid ${C.border}` }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, color: C.black, paddingLeft: 22 }}>{item.name}</div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>{item.variant && `اللون: ${item.variant}`}{item.size && ` | ${item.size}`}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <QtyControl
                value={item.qty}
                onChange={v => onUpdateQty(item.key, v)}
                min={1}
                max={20}
                size="small"
              />
              <span style={{ fontSize: 14, fontWeight: 800, color: C.black, whiteSpace: "nowrap" }}>
                {(item.price * item.qty).toLocaleString()} {CONFIG.CURRENCY}
              </span>
            </div>
          </div>
          <button onClick={() => onRemove(item.key)} style={{ position: "absolute", top: 0, left: 0, background: "none", border: "none", color: C.mutedLight, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 2 }} title="حذف">✕</button>
        </div>
      ))}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: C.muted, marginBottom: 8 }}>
          <span>المجموع الجزئي</span><span>{cartTotal.toLocaleString()} {CONFIG.CURRENCY}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: delivery === 0 ? C.green : C.muted, fontWeight: delivery === 0 ? 700 : 400, marginBottom: 8 }}>
          <span>رسوم التوصيل</span><span>{delivery === 0 ? "مجاني 🎉" : `${delivery.toLocaleString()} ${CONFIG.CURRENCY}`}</span>
        </div>
        {delivery === 0 && <div style={{ background: C.greenLight, color: C.green, borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, marginBottom: 10 }}>✓ تهانينا! طلبك يستحق التوصيل المجاني</div>}
        {delivery > 0 && <div style={{ background: C.light, color: C.muted, borderRadius: 8, padding: "7px 12px", fontSize: 12, marginBottom: 10 }}>أضف {(CONFIG.FREE_DELIVERY_THRESHOLD - cartTotal).toLocaleString()} {CONFIG.CURRENCY} للتوصيل المجاني</div>}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 900, color: C.black, borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 4 }}>
          <span>الإجمالي</span><span>{total.toLocaleString()} {CONFIG.CURRENCY}</span>
        </div>
      </div>
      {!isMobile && <SubmitArea submitting={submitting} total={total} onSubmit={handleSubmit} />}
    </div>
  );

  return (
    <div style={{ padding: isMobile ? "20px 16px 40px" : "40px 5%", maxWidth: 1160, margin: "0 auto" }}>
      <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, marginBottom: 24, color: C.black }}>إتمام الطلب</h2>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 400px", gap: isMobile ? 20 : 32 }}>
        {/* Form */}
        <div>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: isMobile ? 16 : 28, marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px", color: C.black }}>📋 معلومات التوصيل</h3>

            <FField label="الاسم الكامل *" error={errors.name}>
              <input className="form-input" style={errors.name ? { borderColor: C.red } : {}} placeholder="أدخل اسمك الكامل" value={form.name} onChange={e => handleChange("name", e.target.value)} />
            </FField>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              <FField label="رقم الهاتف الرئيسي *" error={errors.phone}>
                <input className="form-input" style={errors.phone ? { borderColor: C.red } : {}} placeholder="0X XX XX XX XX" value={form.phone} onChange={e => handleChange("phone", e.target.value)} maxLength={10} />
              </FField>
              <FField label="رقم هاتف ثانٍ (اختياري)">
                <input className="form-input" placeholder="0X XX XX XX XX" value={form.phone2} onChange={e => handleChange("phone2", e.target.value)} maxLength={10} />
              </FField>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              <FField label="الولاية *" error={errors.wilaya}>
                <select className="form-input" style={errors.wilaya ? { borderColor: C.red } : {}} value={form.wilaya} onChange={e => handleChange("wilaya", e.target.value)}>
                  <option value="">-- اختر الولاية --</option>
                  {ALGERIA_WILAYAS.map(w => <option key={w.code} value={w.code}>{w.code}. {w.name}</option>)}
                </select>
              </FField>
              <FField label="البلدية *" error={errors.commune}>
                <select className="form-input" style={errors.commune ? { borderColor: C.red } : {}} value={form.commune} onChange={e => handleChange("commune", e.target.value)} disabled={!communes.length}>
                  <option value="">-- اختر البلدية --</option>
                  {communes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </FField>
            </div>

            <FField label="العنوان التفصيلي *" error={errors.address}>
              <input className="form-input" style={errors.address ? { borderColor: C.red } : {}} placeholder="الحي، الشارع، رقم المنزل..." value={form.address} onChange={e => handleChange("address", e.target.value)} />
            </FField>

            <FField label="ملاحظات إضافية (اختياري)">
              <textarea className="form-input" style={{ height: 76, resize: "vertical" }} placeholder="أي معلومات إضافية للتوصيل..." value={form.notes} onChange={e => handleChange("notes", e.target.value)} />
            </FField>
          </div>

          {/* Payment */}
          <div style={{ background: C.greenLight, border: `1.5px solid ${C.green}`, borderRadius: 14, padding: 18, display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <span style={{ fontSize: 28 }}>💰</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: C.green, fontSize: 15 }}>الدفع عند الاستلام</div>
              <div style={{ fontSize: 12, color: "#555" }}>ادفع نقداً عند استلام طلبك — بدون أي مخاطر</div>
            </div>
            <span style={{ color: C.green, fontWeight: 900, fontSize: 22 }}>✓</span>
          </div>

          {/* Submit on mobile appears below form */}
          {isMobile && <SummaryBox />}
          {isMobile && <SubmitArea submitting={submitting} total={total} onSubmit={handleSubmit} />}
        </div>

        {/* Summary on desktop */}
        {!isMobile && <SummaryBox />}
      </div>
    </div>
  );
}

function SubmitArea({ submitting, total, onSubmit }) {
  return (
    <div style={{ marginTop: 16 }}>
      <button className="btn-black" style={{ width: "100%", padding: "17px", fontSize: 16, fontWeight: 900, opacity: submitting ? 0.7 : 1 }} onClick={onSubmit} disabled={submitting}>
        {submitting ? "⏳ جاري إرسال الطلب..." : `✅ تأكيد الطلب — ${total.toLocaleString()} ${CONFIG.CURRENCY}`}
      </button>
      <p style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: 10 }}>🔒 طلبك آمن — الدفع عند الاستلام فقط</p>
    </div>
  );
}

function FField({ label, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 12, color: C.red, display: "block", marginTop: 4 }}>{error}</span>}
    </div>
  );
}

// ============================================================
// SUCCESS PAGE — Invoice + Warranty + Buyback
// ============================================================
function SuccessPage({ onHome, order, isMobile }) {
  const invoiceRef = useRef(null);

  if (!order) return null;

  const orderDate = new Date(order.date);
  const warrantyEnd = new Date(orderDate);
  warrantyEnd.setFullYear(warrantyEnd.getFullYear() + 1);

  const fmt = d => d.toLocaleDateString("ar-DZ", { year: "numeric", month: "long", day: "numeric" });
  const fmtTime = d => d.toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" });

  // Serial: product first letter + timestamp hash
  const serial = `ALG-${order.id.replace("ALG-", "").slice(-8)}-W${String(warrantyEnd.getFullYear()).slice(-2)}`;

  const handlePrint = () => {
    const content = invoiceRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html dir="rtl"><head>
      <meta charset="UTF-8"/>
      <title>فاتورة ${order.id}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Tajawal', sans-serif; color: #111; background: #fff; padding: 20px; }
        .no-print { display: none !important; }
      </style>
      </head><body>${content}</body></html>
    `);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 400);
  };

  return (
    <div style={{ background: C.offwhite, minHeight: "100vh", padding: isMobile ? "16px 12px 40px" : "32px 5% 60px" }}>
      {/* Top action bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, maxWidth: 780, margin: "0 auto 20px" }}>
        <button className="btn-ghost" onClick={onHome} style={{ fontSize: 13 }}>→ العودة للمتجر</button>
        <button className="btn-black" onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "10px 20px" }}>
          🖨️ طباعة الفاتورة
        </button>
      </div>

      {/* INVOICE CARD */}
      <div ref={invoiceRef} style={{ maxWidth: 780, margin: "0 auto", background: C.white, borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.08)" }}>

        {/* ── Invoice Header ── */}
        <div style={{ background: C.black, color: C.white, padding: isMobile ? "24px 20px" : "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, letterSpacing: 0.5, marginBottom: 4 }}>{CONFIG.STORE_NAME}</div>
            <div style={{ fontSize: 12, color: "#aaa" }}>الجزائر — جميع الولايات الـ 58</div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, color: "#fff", marginBottom: 4 }}>فـاتـورة شراء</div>
            <div style={{ fontSize: 13, color: "#aaa" }}>رقم: <span style={{ color: "#fff", fontWeight: 700 }}>{order.id}</span></div>
            <div style={{ fontSize: 12, color: "#aaa" }}>{fmt(orderDate)} — {fmtTime(orderDate)}</div>
          </div>
        </div>

        {/* ── Success Banner ── */}
        <div style={{ background: "#f0fdf4", borderBottom: `1px solid #bbf7d0`, padding: "14px 40px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>✅</span>
          <div>
            <div style={{ fontWeight: 800, color: "#15803d", fontSize: 15 }}>تم تأكيد طلبك بنجاح!</div>
            <div style={{ fontSize: 12, color: "#16a34a" }}>سيتصل بك فريقنا خلال 24 ساعة لتأكيد موعد التسليم</div>
          </div>
        </div>

        <div style={{ padding: isMobile ? "20px 16px" : "32px 40px" }}>

          {/* ── Client & Delivery Info ── */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 28, marginBottom: 28 }}>
            <div style={{ background: C.offwhite, borderRadius: 12, padding: "18px 20px", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>معلومات العميل</div>
              <InfoRow icon="👤" label="الاسم" value={order.name} />
              <InfoRow icon="📱" label="الهاتف" value={order.phone} />
            </div>
            <div style={{ background: C.offwhite, borderRadius: 12, padding: "18px 20px", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>عنوان التوصيل</div>
              <InfoRow icon="🏙️" label="الولاية" value={order.wilaya} />
              <InfoRow icon="📍" label="البلدية" value={order.commune} />
              <InfoRow icon="🏠" label="العنوان" value={order.address} />
              {order.notes && <InfoRow icon="📝" label="ملاحظات" value={order.notes} />}
            </div>
          </div>

          {/* ── Items Table ── */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>تفاصيل الطلب</div>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", background: C.black, color: C.white, padding: "10px 16px", fontSize: 12, fontWeight: 700, gap: 8 }}>
                <span>المنتج</span>
                <span style={{ textAlign: "center" }}>الكمية</span>
                <span style={{ textAlign: "left" }}>السعر</span>
              </div>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", padding: "12px 16px", gap: 8, borderBottom: i < order.items.length - 1 ? `1px solid ${C.light}` : "none", alignItems: "center", background: i % 2 === 0 ? C.white : C.offwhite }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.black }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>
                      {item.variant && `اللون: ${item.variant}`}{item.size && ` | المقاس: ${item.size}`}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, color: C.black }}>×{item.qty}</div>
                  <div style={{ textAlign: "left", fontWeight: 700, fontSize: 14, color: C.black, whiteSpace: "nowrap" }}>{(item.price * item.qty).toLocaleString()} {CONFIG.CURRENCY}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Totals ── */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
            <div style={{ minWidth: isMobile ? "100%" : 280 }}>
              <TotalRow label="المجموع الجزئي" value={`${order.subtotal.toLocaleString()} ${CONFIG.CURRENCY}`} />
              <TotalRow label="رسوم التوصيل" value={order.delivery === 0 ? "مجاني 🎉" : `${order.delivery.toLocaleString()} ${CONFIG.CURRENCY}`} green={order.delivery === 0} />
              <TotalRow label="طريقة الدفع" value="الدفع عند الاستلام" />
              <div style={{ display: "flex", justifyContent: "space-between", background: C.black, color: C.white, borderRadius: 10, padding: "14px 18px", marginTop: 8 }}>
                <span style={{ fontWeight: 900, fontSize: 16 }}>الإجمالي</span>
                <span style={{ fontWeight: 900, fontSize: 18 }}>{order.total.toLocaleString()} {CONFIG.CURRENCY}</span>
              </div>
            </div>
          </div>

          {/* ── SERIAL NUMBER CARD ── */}
          <div style={{ background: C.black, color: C.white, borderRadius: 16, padding: isMobile ? "20px 16px" : "24px 28px", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>🔢</span>
              <div style={{ fontWeight: 900, fontSize: 16 }}>الرقم التسلسلي للمنتج</div>
            </div>
            <div style={{ background: "#1a1a1a", borderRadius: 10, padding: "14px 20px", border: "1.5px dashed #555", textAlign: "center", marginBottom: 12 }}>
              <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 900, letterSpacing: 3, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{serial}</div>
            </div>
            <div style={{ fontSize: 12, color: "#aaa", textAlign: "center" }}>
              احتفظ بهذا الرقم — يُستخدم للضمان والصيانة وإثبات الملكية
            </div>
          </div>

          {/* ── WARRANTY CARD ── */}
          <div style={{ border: `2px solid ${C.black}`, borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
            <div style={{ background: C.black, color: C.white, padding: "14px 24px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>🛡️</span>
              <span style={{ fontWeight: 900, fontSize: 16 }}>بطاقة الضمان</span>
              <span style={{ marginRight: "auto", background: "#fff", color: "#111", borderRadius: 6, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>12 شهراً</span>
            </div>
            <div style={{ padding: isMobile ? "16px" : "22px 28px" }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <WarrantyRow label="تاريخ الشراء" value={fmt(orderDate)} />
                <WarrantyRow label="انتهاء الضمان" value={fmt(warrantyEnd)} highlight />
                <WarrantyRow label="الرقم التسلسلي" value={serial} />
                <WarrantyRow label="اسم العميل" value={order.name} />
              </div>
              <div style={{ background: C.offwhite, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.black, marginBottom: 8 }}>شروط الضمان:</div>
                {[
                  "✓ يشمل الضمان عيوب التصنيع والمواد",
                  "✓ الصيانة المجانية خلال فترة الضمان",
                  "✓ استبدال المنتج في حالة العيب الجوهري",
                  "✗ لا يشمل أضرار الاستخدام الخاطئ أو الحوادث",
                  "✗ يجب الاحتفاظ بالفاتورة لإثبات الضمان",
                ].map(t => (
                  <div key={t} style={{ fontSize: 12, color: t.startsWith("✓") ? "#15803d" : C.red, marginBottom: 4 }}>{t}</div>
                ))}
              </div>
            </div>
          </div>

          {/* ── BUYBACK OFFER ── */}
          <div style={{ background: "linear-gradient(135deg, #f8f8f8 0%, #ececec 100%)", border: `1.5px solid ${C.border}`, borderRadius: 16, padding: isMobile ? "20px 16px" : "24px 28px", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 26 }}>🔄</span>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16, color: C.black }}>برنامج إعادة الشراء</div>
                <div style={{ fontSize: 12, color: C.muted }}>نشتري منتجك منك بعد الاستخدام</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
              {[
                { period: "بعد 6 أشهر", pct: "60%", color: "#15803d" },
                { period: "بعد 12 شهر", pct: "45%", color: "#0369a1" },
                { period: "بعد 24 شهر", pct: "30%", color: "#b45309" },
              ].map(b => (
                <div key={b.period} style={{ background: C.white, borderRadius: 10, padding: "14px 12px", border: `1px solid ${C.border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: b.color }}>{b.pct}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.black, marginBottom: 2 }}>من سعر الشراء</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{b.period}</div>
                </div>
              ))}
            </div>
            <div style={{ background: C.white, borderRadius: 10, padding: "12px 16px", border: `1px solid ${C.border}`, fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
              📞 للاستفادة من برنامج إعادة الشراء، تواصل معنا بالرقم التسلسلي <strong style={{ color: C.black }}>{serial}</strong> وسنقيّم المنتج ونحدد سعر الاسترداد خلال 48 ساعة.
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 20, textAlign: "center", color: C.muted, fontSize: 12, lineHeight: 1.8 }}>
            <div style={{ fontWeight: 700, color: C.black, marginBottom: 4 }}>{CONFIG.STORE_NAME}</div>
            <div>هذه الفاتورة وثيقة رسمية — رقم الطلب: {order.id}</div>
            <div>شكراً لثقتكم بنا 🙏</div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ maxWidth: 780, margin: "20px auto 0", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn-black" style={{ flex: 1, padding: "14px", fontSize: 15, fontWeight: 800 }} onClick={onHome}>
          🛍️ مواصلة التسوق
        </button>
        <button className="btn-outline" style={{ flex: 1, padding: "14px", fontSize: 14, fontWeight: 700 }} onClick={handlePrint}>
          🖨️ طباعة / حفظ الفاتورة
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 12, color: "#888", flexShrink: 0 }}>{label}:</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#111", wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}

function TotalRow({ label, value, green }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 4px", borderBottom: "1px solid #f0f0f0", fontSize: 14 }}>
      <span style={{ color: "#888" }}>{label}</span>
      <span style={{ fontWeight: 700, color: green ? "#15803d" : "#111" }}>{value}</span>
    </div>
  );
}

function WarrantyRow({ label, value, highlight }) {
  return (
    <div style={{ background: highlight ? "#f0fdf4" : "#f8f8f8", borderRadius: 8, padding: "10px 14px", border: `1px solid ${highlight ? "#bbf7d0" : "#e0e0e0"}` }}>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: highlight ? "#15803d" : "#111" }}>{value}</div>
    </div>
  );
}

// ============================================================
// GLOBAL CSS
// ============================================================
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; background: #ffffff; }

  /* Black primary button */
  .btn-black {
    background: #111111;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 11px 22px;
    font-family: 'Tajawal', sans-serif;
    font-weight: 700;
    cursor: pointer;
    transition: background .18s, transform .15s;
    display: inline-block;
  }
  .btn-black:hover { background: #333333; transform: translateY(-1px); }
  .btn-black:active { transform: translateY(0); }

  /* Outline button */
  .btn-outline {
    background: transparent;
    color: #111111;
    border: 2px solid #111111;
    border-radius: 10px;
    padding: 11px 22px;
    font-family: 'Tajawal', sans-serif;
    font-weight: 700;
    cursor: pointer;
    transition: background .18s, color .18s;
    display: inline-block;
  }
  .btn-outline:hover { background: #111111; color: #ffffff; }

  /* Ghost button */
  .btn-ghost {
    background: transparent;
    color: #888;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 8px 16px;
    font-family: 'Tajawal', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: border-color .2s, color .2s;
  }
  .btn-ghost:hover { border-color: #111; color: #111; }

  /* Option button */
  .opt-btn {
    background: #ffffff;
    color: #111111;
    border: 1.5px solid #e0e0e0;
    border-radius: 8px;
    padding: 8px 18px;
    font-family: 'Tajawal', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: border-color .15s;
  }
  .opt-btn:hover { border-color: #111; }
  .opt-btn-active {
    background: #111111;
    color: #ffffff;
    border: 1.5px solid #111111;
    border-radius: 8px;
    padding: 8px 18px;
    font-family: 'Tajawal', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  /* ── Product Tabs ── */
  .tabs-nav {
    display: flex;
    gap: 4px;
    border-bottom: 1.5px solid #e0e0e0;
    overflow-x: auto;
  }
  .tab-btn {
    background: transparent;
    border: none;
    padding: 13px 20px;
    font-size: 13px;
    font-weight: 700;
    color: #888;
    cursor: pointer;
    border-bottom: 2.5px solid transparent;
    white-space: nowrap;
    font-family: 'Tajawal', sans-serif;
    transition: color .15s, border-color .15s;
  }
  .tab-btn:hover { color: #111; }
  .tab-btn-active { color: #111; border-bottom-color: #111; }

  /* Specs table */
  .specs-table { width: 100%; border-collapse: collapse; }
  .specs-table tr { border-bottom: 1px solid #f0f0f0; }
  .specs-table tr:last-child { border-bottom: none; }
  .specs-table td { padding: 12px 4px; font-size: 13px; vertical-align: top; }
  .specs-table .specs-label { color: #888; width: 38%; font-weight: 600; }
  .specs-table .specs-value { color: #111; font-weight: 700; }

  /* Review cards */
  .review-card {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 16px 18px;
    margin-bottom: 12px;
  }
  .review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .review-name { font-weight: 700; font-size: 13px; color: #111; }
  .review-date { font-size: 11px; color: #aaa; }
  .review-comment { font-size: 13px; color: #555; line-height: 1.7; margin-top: 8px; }

  /* ── Quantity Control ── */
    display: inline-flex;
    align-items: center;
    border: 1.5px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    user-select: none;
  }
  .qty-control.large { height: 44px; }
  .qty-control.small { height: 34px; }

  .qty-btn {
    background: #f5f5f5;
    color: #111;
    border: none;
    cursor: pointer;
    font-weight: 700;
    font-family: 'Tajawal', sans-serif;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .qty-control.large .qty-btn { width: 44px; height: 44px; font-size: 20px; }
  .qty-control.small .qty-btn  { width: 34px; height: 34px; font-size: 17px; }

  .qty-btn:hover  { background: #e8e8e8; }
  .qty-btn:disabled { opacity: .3; cursor: not-allowed; }
  .qty-btn:disabled:hover { background: #f5f5f5; }

  .qty-divider { width: 1px; background: #e0e0e0; align-self: stretch; flex-shrink: 0; }

  .qty-display {
    font-family: 'Tajawal', sans-serif;
    font-weight: 800;
    color: #111;
    text-align: center;
    min-width: 40px;
  }
  .qty-control.large .qty-display { font-size: 16px; }
  .qty-control.small .qty-display  { font-size: 13px; min-width: 30px; }

  /* Form input */
  .form-input {
    width: 100%;
    background: #f8f8f8;
    border: 1.5px solid #e0e0e0;
    border-radius: 10px;
    padding: 12px 14px;
    color: #111111;
    font-size: 14px;
    font-family: 'Tajawal', sans-serif;
    box-sizing: border-box;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
    display: block;
  }
  .form-input:focus { border-color: #111111; box-shadow: 0 0 0 3px rgba(17,17,17,0.08); background: #fff; }

  /* Product card hover */
  .product-card { transition: transform .2s, box-shadow .2s; }
  .product-card:hover { transform: translateY(-4px); box-shadow: 0 10px 36px rgba(0,0,0,0.1); }
  .product-card:hover .card-img { transform: scale(1.05); }
  .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }

  /* Toast animation */
  @keyframes fadeSlide { from { opacity: 0; transform: translate(-50%, -14px); } to { opacity: 1; transform: translate(-50%, 0); } }

  /* Thumbnail scrollbar */
  .thumb-row::-webkit-scrollbar { height: 4px; }
  .thumb-row::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #f2f2f2; }
  ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
`;
