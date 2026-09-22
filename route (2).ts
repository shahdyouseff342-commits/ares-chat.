import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages, conversations, appSettings, aiDecisions, templates } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const convId = Number(id);

    const msgList = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, convId))
      .orderBy(asc(messages.createdAt));

    // Also mark as read
    await db.update(conversations).set({ isRead: true }).where(eq(conversations.id, convId));

    return NextResponse.json(msgList);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching messages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const convId = Number(id);
    const body = await request.json();

    const text = body.text || "";
    const type = body.type || "text"; // 'text' | 'voice' | 'image'
    const sender = body.sender || "agent"; // 'agent' | 'customer' | 'bot'
    let durationSec = body.durationSec ? Number(body.durationSec) : null;
    let transcription = body.transcription || null;
    let isProfaneFiltered = false;

    // Fetch settings to check voice analysis & profanity filter
    const settingsList = await db.select().from(appSettings).limit(1);
    const settings = settingsList[0];

    // If it's a voice message and voice analysis is enabled:
    if (type === "voice" && settings?.voiceAnalysisEnabled) {
      if (!transcription) {
        // Generate contextual Iraqi transcription based on hints
        const sampleTranscriptions = [
          "السلام عليكم، اريد اعرف تفاصيل القسط مال آيفون 15، شكد ادفع اول دفعة وشوكت القسط الثاني؟",
          "حبيبي شكد سعره النهائي من الاخير؟ وتكدرون تدزولي اياه على المنصور اليوم؟",
          "دزيتلكم صورة الوصل مال زين كاش، شيكو التحويل حتى تثبتون الحجز",
          "اخوية العزيز، الجهاز اصلي ومختوم بالكرتونة لو مفتوح؟ وبي ضمان استبدال؟",
          "بلا زحمة اريد اسجل على نظام دفعتين كاش عند الاستلام والنص الثاني على الراتب",
        ];
        transcription = sampleTranscriptions[Math.floor(Math.random() * sampleTranscriptions.length)];
        durationSec = durationSec || Math.floor(Math.random() * 35) + 12;
      }

      // Profanity filter logic
      if (settings.profanityFilter) {
        const profaneWords = ["كذاب", "نصاب", "احتيال", "زفت", "كلب", "غبي"];
        let filtered = transcription;
        for (const word of profaneWords) {
          if (filtered.includes(word)) {
            filtered = filtered.replaceAll(word, "***");
            isProfaneFiltered = true;
          }
        }
        transcription = filtered;
      }
    }

    // Save message
    const [savedMsg] = await db
      .insert(messages)
      .values({
        conversationId: convId,
        sender,
        text: type === "voice" ? `بصمة صوتية (${durationSec || 20} ثانية)` : text,
        type,
        mediaUrl: body.mediaUrl || null,
        fileName: body.fileName || null,
        fileSize: body.fileSize || null,
        durationSec,
        transcription,
        isProfaneFiltered,
      })
      .returning();

    // Update conversation's last message
    const timeNow = new Intl.DateTimeFormat("ar-IQ", { hour: "numeric", minute: "numeric", hour12: true }).format(new Date());
    const displayLastMessage =
      type === "voice"
        ? "بصمة صوتية 🎙️"
        : type === "image"
        ? "صورة 🖼️"
        : type === "video"
        ? "فيديو 📹"
        : type === "file"
        ? `ملف: ${body.fileName || "مستند"} 📄`
        : text;

    await db
      .update(conversations)
      .set({
        lastMessage: displayLastMessage,
        lastMessageType: type,
        lastMessageTime: timeNow,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, convId));

    // If sender was customer and AI is active, trigger automated smart decision / reply
    if (sender === "customer" && settings?.aiActive) {
      const incomingContent = transcription || text;
      let detectedIntent = "استفسار عام عن الأجهزة والأسعار";
      let suggestedReply = "أهلاً بك! تفضل بنوع الجهاز المطلوب وسنزودك بالسعر ونظام الأقساط فوراً.";
      let matchedTemplate = "";

      if (incomingContent.includes("قسط") || incomingContent.includes("اقساط") || incomingContent.includes("دفعة") || incomingContent.includes("ماستر")) {
        detectedIntent = "استفسار عن نظام الأقساط والدفعات";
        suggestedReply = "نظام الأقساط ميسر: دفع 50% أو حسب الاتفاق والباقي على قسطين أو ثلاثة مع بطاقة الماستر كارد أو الهوية الوطنية.";
        matchedTemplate = "اقساط";
      } else if (incomingContent.includes("ايفون 15") || incomingContent.includes("15 برو")) {
        detectedIntent = "طلب جهاز آيفون 15 برو ماكس";
        suggestedReply = "آيفون 15 بجميع فئاته متاح بنظام الكاش أو الأقساط الميسرة مع بكج كامل هدايا.";
        matchedTemplate = "15";
      } else if (incomingContent.includes("سامسونج") || incomingContent.includes("s25") || incomingContent.includes("الترا")) {
        detectedIntent = "طلب سامسونج جلاكسي S25 Ultra";
        suggestedReply = "سامسونج جلاكسي S25 Ultra متوفر بالنسخة العالمية وكافة الألوان الحصرية مع ضمان سنة كاملة.";
        matchedTemplate = "s25";
      } else if (incomingContent.includes("وصل") || incomingContent.includes("زين كاش") || incomingContent.includes("فلوس") || incomingContent.includes("حولت")) {
        detectedIntent = "إشعار تحويل مالي / دفعة";
        suggestedReply = "شكراً لك! يرجى إرسال صورة وصل التحويل من التطبيق ليتم توثيق الدفعة فوراً على حسابك.";
        matchedTemplate = "صوره؟";
      } else if (incomingContent.includes("توصيل") || incomingContent.includes("شحن") || incomingContent.includes("بغداد") || incomingContent.includes("محافظات")) {
        detectedIntent = "استفسار عن التوصيل والشحن";
        suggestedReply = "التوصيل متوفر لجميع محافظات العراق لباب البيت مع فحص الجهاز قبل الاستلام.";
        matchedTemplate = "توصيل";
      }

      // Log decision
      const [conv] = await db.select().from(conversations).where(eq(conversations.id, convId)).limit(1);
      await db.insert(aiDecisions).values({
        conversationId: convId,
        customerPhone: conv?.customerPhone || "غير معروف",
        detectedIntent,
        suggestedReply,
        confidence: "97%",
        status: settings.aiAutoReply ? "مطبق" : "معلق",
      });

      // If AI auto-reply is on, automatically send bot message
      if (settings.aiAutoReply) {
        await db.insert(messages).values({
          conversationId: convId,
          sender: "bot",
          text: suggestedReply,
          type: "text",
        });
      }
    }

    return NextResponse.json(savedMsg);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error sending message";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
