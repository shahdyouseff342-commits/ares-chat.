import { NextResponse } from "next/server";
import { db } from "@/db";
import { aiDecisions, conversations, messages, templates } from "@/db/schema";
import { desc, eq, ilike } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone")?.trim();

    let list = await db.select().from(aiDecisions).orderBy(desc(aiDecisions.createdAt));

    if (phone) {
      list = list.filter((d) => d.customerPhone.replace(/[-\s]/g, "").includes(phone.replace(/[-\s]/g, "")));
    }

    return NextResponse.json(list);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching AI decisions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = body.phone?.trim();

    if (!phone) {
      return NextResponse.json({ error: "Customer phone required" }, { status: 400 });
    }

    // Find conversation matching phone
    const convList = await db.select().from(conversations);
    const matchedConv = convList.find((c) =>
      c.customerPhone.replace(/[-\s]/g, "").includes(phone.replace(/[-\s]/g, ""))
    );

    let detectedIntent = "تحليل عام لاهتمام الزبون";
    let suggestedReply = "أهلاً بك عزيزي، كيف نقدر نساعدك اليوم بخصوص أجهزة الموبايل أو أنظمة الأقساط؟";
    let confidence = "96%";

    if (matchedConv) {
      if (matchedConv.remainingAmount > 0) {
        detectedIntent = `متابعة قسط مستحق بقيمة ${matchedConv.remainingAmount.toLocaleString()} ${matchedConv.currency}`;
        suggestedReply = `مرحباً أخي ${matchedConv.customerName}، نود تذكيرك بموعد القسط القادم ومتاح السداد عبر زين كاش أو الماستر.`;
        confidence = "99%";
      } else if (matchedConv.lastMessage.includes("ايفون") || matchedConv.lastMessage.includes("سعر")) {
        detectedIntent = "اهتمام بشراء فئة هواتف آيفون الحديثة بنظام الكاش أو التقسيط";
        suggestedReply = "متوفر آيفون 15 و 16 بكافة الألوان، مع عروض تقسيط ميسرة وهدايا شاحن وكفر أصلي.";
        confidence = "98%";
      } else {
        detectedIntent = "استفسار ومتابعة خدمة الزبائن";
        suggestedReply = "أهلاً وسهلاً بك، تفضل باستفسارك وسيقوم أحد ممثلي الخدمة أو الذكاء بالرد فوراً.";
        confidence = "94%";
      }
    }

    const [created] = await db
      .insert(aiDecisions)
      .values({
        conversationId: matchedConv?.id || null,
        customerPhone: phone,
        detectedIntent,
        suggestedReply,
        confidence,
        status: "معلق",
      })
      .returning();

    return NextResponse.json(created);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error running AI check";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id === "all") {
      await db.delete(aiDecisions);
      return NextResponse.json({ success: true, message: "All decisions cleared" });
    }

    if (id) {
      await db.delete(aiDecisions).where(eq(aiDecisions.id, Number(id)));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "ID or all required" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting decision";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
