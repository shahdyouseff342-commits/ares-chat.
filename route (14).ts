import { NextResponse } from "next/server";
import { db } from "@/db";
import { conversations, messages, appSettings, aiDecisions } from "@/db/schema";
import { eq } from "drizzle-orm";

// Incoming Webhook for WhatsApp / Gateway / External API
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, senderName, text, type, mediaUrl, durationSec, apiKey } = body;

    // Check API Key
    const settingsList = await db.select().from(appSettings).limit(1);
    const settings = settingsList[0];

    if (apiKey && settings?.apiKey && apiKey !== settings.apiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const customerPhone = from || "0770-000-0000";
    const name = senderName || `زبون ${customerPhone.slice(-4)}`;
    const msgText = text || "رسالة واردة";
    const msgType = type || "text";

    // Find or create conversation
    const allConvs = await db.select().from(conversations);
    let conv = allConvs.find((c) => c.customerPhone.replace(/[-\s]/g, "") === customerPhone.replace(/[-\s]/g, ""));

    if (!conv) {
      const [newConv] = await db
        .insert(conversations)
        .values({
          customerName: name,
          customerPhone,
          avatarColor: "#0284c7",
          isPinned: false,
          isRead: false,
          labels: ["الرسائل", "غير مقروء"],
          lastMessage: msgText,
          lastMessageType: msgType,
          lastMessageTime: "الآن",
          totalAmount: 0,
          paidAmount: 0,
          remainingAmount: 0,
        })
        .returning();
      conv = newConv;
    } else {
      await db
        .update(conversations)
        .set({
          isRead: false,
          lastMessage: msgText,
          lastMessageType: msgType,
          lastMessageTime: "الآن",
          updatedAt: new Date(),
        })
        .where(eq(conversations.id, conv.id));
    }

    // Insert message
    const [savedMsg] = await db
      .insert(messages)
      .values({
        conversationId: conv.id,
        sender: "customer",
        text: msgText,
        type: msgType,
        mediaUrl: mediaUrl || null,
        durationSec: durationSec ? Number(durationSec) : null,
      })
      .returning();

    // AI processing if enabled
    let aiResponse = null;
    if (settings?.aiActive) {
      let suggestedReply = "أهلاً بك! تم استلام رسالتك وسنرد عليك بأقرب وقت.";
      if (msgText.includes("سعر") || msgText.includes("قسط")) {
        suggestedReply = "أهلاً بك! تفضل بنوع الجهاز المطلوب لمشاركتك الأسعار وأنظمة الأقساط مع الهدايا.";
      }

      await db.insert(aiDecisions).values({
        conversationId: conv.id,
        customerPhone,
        detectedIntent: "رسالة واردة عبر API / Webhook",
        suggestedReply,
        confidence: "95%",
        status: settings.aiAutoReply ? "مطبق" : "معلق",
      });

      if (settings.aiAutoReply) {
        await db.insert(messages).values({
          conversationId: conv.id,
          sender: "bot",
          text: suggestedReply,
          type: "text",
        });
        aiResponse = suggestedReply;
      }
    }

    return NextResponse.json({
      success: true,
      conversationId: conv.id,
      messageId: savedMsg.id,
      aiAutoReplied: !!aiResponse,
      reply: aiResponse,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error processing webhook";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "/api/webhook",
    description: "ARES Chat Incoming Webhook API",
    instructions: "Send POST JSON with { from, senderName, text, type, apiKey }",
  });
}
