import { db } from "./index";
import { appSettings, employees, labels, templates, conversations, messages, payments, aiDecisions } from "./schema";

export async function seedDatabase() {
  // Check if already seeded
  const existingSettings = await db.select().from(appSettings).limit(1);
  if (existingSettings.length > 0) {
    return { success: true, message: "Database already seeded" };
  }

  // 1. App Settings matching user instructions:
  // - فعّلي “تفعيل تحليل البصمات” — الزر اللي فوق خليه شغال.
  // - نطاق التشغيل: اختاري عام زي ما هو.
  // - Profanity filter: سيبيه مقفول (false).
  // - Automatic punctuation: شغال (true).
  await db.insert(appSettings).values({
    voiceAnalysisEnabled: true,
    voiceAnalysisScope: "عام",
    maxVoiceSeconds: 60,
    phraseHints: "ايفون\nكلكسي\nجلgeneric\nاندرويد\nاس 25 اولترا\nآيفون\niPhone\nPro Max 13\nاقساط\nدفعة\nماستر كارد\nزين كاش",
    modelName: "chirp_3",
    languageCode: "ar-IQ",
    autoPunctuation: true,
    profanityFilter: false,
    providerOptionsJson: JSON.stringify({
      sample_rate_hertz: 16000,
      encoding: "OGG_OPUS",
      enable_automatic_punctuation: true,
      diarization: false,
      filter_profanity: false
    }, null, 2),
    aiActive: true,
    aiAutoReply: true,
    aiSystemPrompt: "أنت المساعد الذكي لنظام ARES Chat لإدارة المحادثات ومتابعة مبيعات الهواتف والأقساط والدفعات في العراق. رد بلهجة عراقية محترمة وسريعة ودقيقة وقدم تفاصيل الأجهزة وأنظمة الأقساط وطرق الدفع (زين كاش، ماستر كارد، نقد).",
    apiKey: "ares_live_sec_9942a7810df",
    serverStatus: "متصل ويعمل",
    darkMode: true,
    shopLocation: "بغداد - المنصور - شارع 14 رمضان (مجمع النور)",
  });

  // 2. Employees (ربط الموظفين)
  const [emp1] = await db.insert(employees).values([
    { name: "salih 2", username: "salih2", role: "مدير", phone: "0770-112-3344", status: "نشط", avatarColor: "#6366f1" },
    { name: "علي الكرخي", username: "ali_karkh", role: "مبيعات", phone: "0771-554-9911", status: "نشط", avatarColor: "#0ea5e9" },
    { name: "زينب محمد", username: "zainab_m", role: "محاسب دفعات", phone: "0772-887-1234", status: "نشط", avatarColor: "#10b981" },
    { name: "حيدر البصري", username: "haider_b", role: "دعم فني", phone: "0773-665-4422", status: "مشغول", avatarColor: "#f59e0b" },
  ]).returning();

  // 3. Labels (Over 10 labels as requested)
  await db.insert(labels).values([
    { name: "الرسائل", color: "#94a3b8", badgeBg: "bg-slate-700/50 text-slate-200 border-slate-600", orderIndex: 1 },
    { name: "غير مقروء", color: "#64748b", badgeBg: "bg-zinc-800 text-zinc-300 border-zinc-700", orderIndex: 2 },
    { name: "بشري", color: "#ef4444", badgeBg: "bg-rose-950/70 text-rose-300 border-rose-800", orderIndex: 3 },
    { name: "VIP", color: "#3b82f6", badgeBg: "bg-blue-950/70 text-blue-300 border-blue-800", orderIndex: 4 },
    { name: "احتيال", color: "#dc2626", badgeBg: "bg-red-950 text-red-400 border-red-800", orderIndex: 5 },
    { name: "أقساط ودفعات", color: "#10b981", badgeBg: "bg-emerald-950 text-emerald-300 border-emerald-800", orderIndex: 6 },
    { name: "بانتظار التحويل", color: "#f59e0b", badgeBg: "bg-amber-950 text-amber-300 border-amber-800", orderIndex: 7 },
    { name: "تم الشحن", color: "#8b5cf6", badgeBg: "bg-purple-950 text-purple-300 border-purple-800", orderIndex: 8 },
    { name: "شكوى", color: "#ec4899", badgeBg: "bg-pink-950 text-pink-300 border-pink-800", orderIndex: 9 },
    { name: "متابعة الذكاء", color: "#06b6d4", badgeBg: "bg-cyan-950 text-cyan-300 border-cyan-800", orderIndex: 10 },
    { name: "حساب جديد", color: "#14b8a6", badgeBg: "bg-teal-950 text-teal-300 border-teal-800", orderIndex: 11 },
    { name: "مسترجع / استبدال", color: "#eab308", badgeBg: "bg-yellow-950 text-yellow-300 border-yellow-800", orderIndex: 12 },
    { name: "طلب ملغي", color: "#71717a", badgeBg: "bg-zinc-900 text-zinc-400 border-zinc-800", orderIndex: 13 },
  ]);

  // 4. Quick Templates (الكلايش الجاهزة) - Rows 1 to 6
  await db.insert(templates).values([
    // الصف 1 (الأجهزة والموديلات)
    { rowIndex: 1, title: "نوع", content: "السلام عليكم، ما هو نوع وموديل الجهاز المطلوب؟ وما هي السعة التي تفضلها؟", orderIndex: 1 },
    { rowIndex: 1, title: "13", content: "متوفر آيفون 13 عادي وبرو مع ضمان أسبوعين فحص واستبدال فوري.", orderIndex: 2 },
    { rowIndex: 1, title: "14", content: "آيفون 14 متوفر بكافة الألوان وسعات 128 و 256 جيجا مع بطارية ممتازة.", orderIndex: 3 },
    { rowIndex: 1, title: "15", content: "آيفون 15 بجميع فئاته متاح بنظام الكاش أو الأقساط الميسرة مع بكج كامل هدايا.", orderIndex: 4 },
    { rowIndex: 1, title: "16", content: "آيفون 16 الجديد متوفر مع ضمان الوكالة الرسمي ونسخة الشرق الأوسط شريحتين.", orderIndex: 5 },
    { rowIndex: 1, title: "17", content: "فئة الـ 17 متوفرة للحجز المسبق والتسليم بأول وجبة وصول.", orderIndex: 6 },
    { rowIndex: 1, title: "s25", content: "سامسونج جلاكسي S25 Ultra متوفر بالنسخة العالمية وكافة الألوان الحصرية.", orderIndex: 7 },
    { rowIndex: 1, title: "ملصق", content: "تفضل بزيارتنا في مقر المحل بالمنصور، شرفنا بأي وقت من الـ 10 صباحاً للـ 11 ليلاً.", orderIndex: 8 },

    // الصف 2 (الاتفاق والشروط)
    { rowIndex: 2, title: "بكيفك", content: "أي خيار يناسبك، نوفر لك الدفع كاش أو أقساط على الهوية المدنية بدون كفيل.", orderIndex: 1 },
    { rowIndex: 2, title: "نصف", content: "تقدر تدفع نصف المبلغ دفعة أولى والباقي يقسم على شهرين بدون فوائد.", orderIndex: 2 },
    { rowIndex: 2, title: "جزء", content: "يتم تثبيت جزء من المبلغ كعربون رسمي والباقي عند استلام وفحص الجهاز.", orderIndex: 3 },
    { rowIndex: 2, title: "توصيل", content: "التوصيل متوفر لجميع محافظات العراق لباب البيت مع فحص الجهاز قبل الاستلام.", orderIndex: 4 },
    { rowIndex: 2, title: "احساس هويه", content: "المطلوب للأقساط صورة البطاقة الوطنية وبطاقتك السكن فقط وبدون تعقيد.", orderIndex: 5 },
    { rowIndex: 2, title: "تقنيع", content: "أجهزتنا جميعها مفحوصة 100% وتقدر تفحص السيريال نمبر بموقع أبل الرسمي مباشرة.", orderIndex: 6 },

    // الصف 3 (الماليات والضمان)
    { rowIndex: 3, title: "فلوس", content: "تم تسجيل الدفعة على حسابك بنجاح، ووصلك إشعار بالرصيد المتبقي.", orderIndex: 1 },
    { rowIndex: 3, title: "اصلي", content: "ضمان أصلي حقيقي يشمل السوفت وير والقطع الأصلية غير المبدلة نهائياً.", orderIndex: 2 },
    { rowIndex: 3, title: "تفحص", content: "افحص الجهاز براحتك وشغله وجرب الكاميرا والشاشة قبل دفع أي دينار للمندوب.", orderIndex: 3 },
    { rowIndex: 3, title: "جاي", content: "المندوب استلم شحنتك وهو في الطريق إليك، سيتصل بك قريباً على رقمك.", orderIndex: 4 },
    { rowIndex: 3, title: "ميبقى", content: "القطع المتبقية قليلة جداً، يرجى تأكيد الحجز فوراً لتثبيت الجهاز باسمك.", orderIndex: 5 },
    { rowIndex: 3, title: "ملحقات", content: "الباكج يشمل رأس شحن أصلي، كفر شفاف مضاد للصدمات، ولصقة حماية شاشة.", orderIndex: 6 },
    { rowIndex: 3, title: "رقمي", content: "رقم التواصل المباشر مع المدير المسؤول: 07733926758 - متاح طيلة اليوم.", orderIndex: 7 },

    // الصف 4 (الفحص والصور)
    { rowIndex: 4, title: "70%بل", content: "نسبة نظافة الجهاز كالجديد 98% ونسبة صحة البطارية فوق 88% ممتازة.", orderIndex: 1 },
    { rowIndex: 4, title: "صوره؟", content: "يرجى تزويدنا بصورة إشعار التحويل من تطبيق زين كاش أو الماستر كارد للمطابقة.", orderIndex: 2 },
    { rowIndex: 4, title: "2 70%", content: "خيار التقسيط: 70% كدفعة أولى و 30% بعد 30 يوم من تاريخ الشراء.", orderIndex: 3 },
    { rowIndex: 4, title: "ما دزيت صورة", content: "أخي لم تصلنا صورة التحويل بعد، يرجى إعادة إرسالها لنعتمد طلبك فوراً.", orderIndex: 4 },

    // الصف 5 (العملاء والدفعات)
    { rowIndex: 5, title: "جمله", content: "لطلبات الجملة والمكاتب، يرجى إرسال الكمية المطلوبة للحصول على تخفيض خاص.", orderIndex: 1 },
    { rowIndex: 5, title: "ثابت", content: "السعر نهائي ومثبت على سيستم المبيعات مع ضمان وكامل الملحقات المجانية.", orderIndex: 2 },
    { rowIndex: 5, title: "سابقا", content: "أهلاً بك عميلنا العزيز مجدداً! لك خصم ولاء خاص على الشراء الجديد.", orderIndex: 3 },
    { rowIndex: 5, title: "مرتي", content: "تدلل عيوني، أي استفسار ثاني نجاوبك عليه بكل سرور وبخدمتكم دائماً.", orderIndex: 4 },
    { rowIndex: 5, title: "اقساط", content: "نظام الأقساط متاح لحاملي بطاقات الماستر كارد والكي كارد مع خصم شهري ميسر.", orderIndex: 5 },

    // الصف 6 (المواعيد والتأكيد)
    { rowIndex: 6, title: "بكيفك2", content: "تقدر تحدد موعد الدفعة الشهرية باليوم الذي يصادف نزول راتبك.", orderIndex: 1 },
    { rowIndex: 6, title: "الماستر", content: "تقبل بطاقات الماستر كارد والرافدين والرشيد والمصرف العراقي للتجارة TBI.", orderIndex: 2 },
    { rowIndex: 6, title: "انتضرك", content: "نحن بانتظارك، موقعنا واضح في المنصور ونسعد جداً بزيارتك وتشريفك لنا.", orderIndex: 3 },
    { rowIndex: 6, title: "بشر", content: "طمنا يا غالي، هل استلمت الجهاز وكل شيء تمام وبحسب طلبك؟", orderIndex: 4 },
    { rowIndex: 6, title: "لاتتاخر", content: "الرجاء تأكيد موقعك قبل المغرب لتسليم الشحنة لشركة التوصيل في جدول اليوم.", orderIndex: 5 },
    { rowIndex: 6, title: "باجر", content: "باجر الصبح إن شاء الله يكون جهازك مع المندوب ويوصلك للبيت.", orderIndex: 6 },
  ]);

  // 5. Conversations & Payments
  const [conv1] = await db.insert(conversations).values({
    customerName: "moahmed",
    customerPhone: "0773-392-6758",
    avatarColor: "#0284c7",
    isPinned: true,
    isRead: false,
    assignedEmployeeId: emp1?.id,
    labels: ["أقساط ودفعات", "بشري", "متابعة الذكاء"],
    lastMessage: "اريد اعرف تفاصيل اقساط الايفون 15 برو ماكس",
    lastMessageType: "voice",
    lastMessageTime: "7:30 AM",
    voiceAnalysisStatus: "نشط",
    totalAmount: 1400000,
    paidAmount: 500000,
    remainingAmount: 900000,
    currency: "د.ع",
    paymentPlanNotes: "تم الاتفاق على دفعة أولى 500,000 د.ع والباقي على قسطين (كل شهر 450,000 د.ع)",
  }).returning();

  const [conv2] = await db.insert(conversations).values({
    customerName: "Human",
    customerPhone: "0771-445-9921",
    avatarColor: "#8b5cf6",
    isPinned: false,
    isRead: true,
    assignedEmployeeId: emp1?.id,
    labels: ["بشري", "VIP"],
    lastMessage: "صورة 🖼️",
    lastMessageType: "image",
    lastMessageTime: "10:19 PM",
    voiceAnalysisStatus: "نشط",
    totalAmount: 1650000,
    paidAmount: 1650000,
    remainingAmount: 0,
    currency: "د.ع",
    paymentPlanNotes: "تم سداد كامل المبلغ نقداً عند الاستلام",
  }).returning();

  const [conv3] = await db.insert(conversations).values({
    customerName: "وسام",
    customerPhone: "0770-551-9234",
    avatarColor: "#2563eb",
    isPinned: false,
    isRead: true,
    assignedEmployeeId: emp1?.id,
    labels: ["الرسائل", "بانتظار التحويل"],
    lastMessage: "k",
    lastMessageType: "text",
    lastMessageTime: "5:03 PM",
    voiceAnalysisStatus: "نشط",
    totalAmount: 850000,
    paidAmount: 200000,
    remainingAmount: 650000,
    currency: "د.ع",
    paymentPlanNotes: "دفعة أولى 200 ألف عبر زين كاش، المتبقي قسطين",
  }).returning();

  const [conv4] = await db.insert(conversations).values({
    customerName: "علي البغدادي",
    customerPhone: "0773-112-9900",
    avatarColor: "#ec4899",
    isPinned: false,
    isRead: false,
    assignedEmployeeId: emp1?.id,
    labels: ["احتيال", "غير مقروء"],
    lastMessage: "دزلي الرابط حتى ادخل بيانات البطاقة",
    lastMessageType: "text",
    lastMessageTime: "5:57 AM",
    voiceAnalysisStatus: "متوقف",
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    currency: "د.ع",
    paymentPlanNotes: "تم وضع علامة احتيال بناء على تنبيه الذكاء الاصطناعي",
  }).returning();

  // 6. Messages for conversation 1 (moahmed)
  await db.insert(messages).values([
    {
      conversationId: conv1.id,
      sender: "customer",
      text: "السلام عليكم، شكد سعر ايفون 15 برو ماكس 256 جيجا وشلون نظام الأقساط عندكم؟",
      type: "text",
      createdAt: new Date(Date.now() - 3600000 * 5),
    },
    {
      conversationId: conv1.id,
      sender: "agent",
      text: "وعليكم السلام ورحمة الله أخي محمد، أهلاً بك في ARES Chat. متوفر بسعر 1,400,000 د.ع مع ضمان سنة. نظام الأقساط دفعة أولى 500,000 د.ع والباقي على قسطين ميسرين.",
      type: "text",
      createdAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      conversationId: conv1.id,
      sender: "customer",
      text: "بصمة صوتية (0:24 ثانية)",
      type: "voice",
      durationSec: 24,
      transcription: "حبيبي يعني تكدرون ترتبولي الدفعة الثانية بعد 40 يوم لان الراتب ينزل بنهاية الشهر؟ والجهاز يجي وياه الشاحن لو بدون ملحقات؟",
      createdAt: new Date(Date.now() - 3600000 * 2),
    },
    {
      conversationId: conv1.id,
      sender: "bot",
      text: "تحليل الذكاء الاصطناعي للبصمة: استفسار عن تأجيل القسط ومحتويات الملحقات. تم اقتراح كليشة [ملحقات] و [بكيفك 2].",
      type: "text",
      createdAt: new Date(Date.now() - 3600000 * 2 + 10000),
    },
    {
      conversationId: conv1.id,
      sender: "agent",
      text: "تدلل يا طيب، تم تأكيد تسجيل الدفعة الأولى 500,000 د.ع، والملحقات كاملة مجانية مع الجهاز (شاحن وكفر ولاصق حماية).",
      type: "text",
      createdAt: new Date(Date.now() - 3600000 * 1),
    },
    {
      conversationId: conv1.id,
      sender: "customer",
      text: "عاشت ايدكم، اليوم العصر امرلكم للمحل بالمنصور استلمه وادفع العربون كاش",
      type: "text",
      createdAt: new Date(Date.now() - 1800000),
    },
  ]);

  // Messages for conv2
  await db.insert(messages).values([
    {
      conversationId: conv2.id,
      sender: "customer",
      text: "السلام عليكم، هذا وصل تسديد كامل المبلغ كاش للمندوب.",
      type: "text",
      createdAt: new Date(Date.now() - 3600000 * 10),
    },
    {
      conversationId: conv2.id,
      sender: "customer",
      text: "صورة وصل القبض الرسمي",
      type: "image",
      mediaUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60",
      createdAt: new Date(Date.now() - 3600000 * 9),
    },
    {
      conversationId: conv2.id,
      sender: "agent",
      text: "وصلنا يا غالي وتم تدقيق الوصل وإغلاق الحساب كمدفوع بالكامل. شرفتنا وننتظر زيارتك دائماً.",
      type: "text",
      createdAt: new Date(Date.now() - 3600000 * 8),
    },
  ]);

  // Messages for conv3
  await db.insert(messages).values([
    {
      conversationId: conv3.id,
      sender: "customer",
      text: "حولت الـ 200 ألف على زين كاش مالتكم",
      type: "text",
      createdAt: new Date(Date.now() - 3600000 * 15),
    },
    {
      conversationId: conv3.id,
      sender: "customer",
      text: "k",
      type: "text",
      createdAt: new Date(Date.now() - 3600000 * 12),
    },
  ]);

  // 7. Payments records
  await db.insert(payments).values([
    {
      conversationId: conv1.id,
      amount: 500000,
      method: "زين كاش",
      note: "الدفعة الأولى لموبايل آيفون 15 برو ماكس",
      recordedBy: "salih 2",
    },
    {
      conversationId: conv2.id,
      amount: 1650000,
      method: "نقد",
      note: "تسديد كاش كامل عند استلام جهاز S25 Ultra",
      recordedBy: "زينب محمد",
    },
    {
      conversationId: conv3.id,
      amount: 200000,
      method: "زين كاش",
      note: "عربون تثبيت قسط",
      recordedBy: "علي الكرخي",
    },
  ]);

  // 8. AI Decisions records
  await db.insert(aiDecisions).values([
    {
      conversationId: conv1.id,
      customerPhone: "0773-392-6758",
      detectedIntent: "طلب تقسيط جهاز آيفون 15 برو ماكس",
      suggestedReply: "متوفر بنظام الأقساط بدفعة أولى 500 ألف وباقي على قسطين",
      confidence: "98%",
      status: "مطبق",
    },
    {
      conversationId: conv4.id,
      customerPhone: "0773-112-9900",
      detectedIntent: "محاولة طلب رابط دفع غير موثوق / اشتباه احتيال",
      suggestedReply: "تم حظر إرسال أي روابط بنكية تلقائياً وتفعيل ليبل احتيال",
      confidence: "99%",
      status: "مطبق",
    },
  ]);

  return { success: true, message: "Database seeded successfully" };
}
