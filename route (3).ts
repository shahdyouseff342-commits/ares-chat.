import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments, conversations, messages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const convId = Number(id);

    const paymentList = await db
      .select()
      .from(payments)
      .where(eq(payments.conversationId, convId))
      .orderBy(desc(payments.paymentDate));

    return NextResponse.json(paymentList);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching payments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const convId = Number(id);
    const body = await request.json();

    const amount = Number(body.amount);
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    // Insert payment record
    const [newPayment] = await db
      .insert(payments)
      .values({
        conversationId: convId,
        amount,
        method: body.method || "زين كاش",
        note: body.note || "تسجيل دفعة قسط",
        recordedBy: body.recordedBy || "salih 2",
      })
      .returning();

    // Recalculate conversation paid and remaining amounts
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, convId)).limit(1);
    if (conv) {
      const newPaid = conv.paidAmount + amount;
      const newRemaining = Math.max(0, conv.totalAmount - newPaid);

      await db
        .update(conversations)
        .set({
          paidAmount: newPaid,
          remainingAmount: newRemaining,
          updatedAt: new Date(),
        })
        .where(eq(conversations.id, convId));

      // Also post a payment receipt message in chat
      await db.insert(messages).values({
        conversationId: convId,
        sender: "agent",
        text: `💰 تم تسجيل دفعة رسمية بمبلغ ${amount.toLocaleString()} ${conv.currency} عبر [${body.method || "زين كاش"}]. المتبقي في الحساب: ${newRemaining.toLocaleString()} ${conv.currency}.`,
        type: "text",
      });
    }

    return NextResponse.json(newPayment);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Clear or change total amount
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const convId = Number(id);
    const body = await request.json();

    const action = body.action; // 'clear_amount' | 'update_plan' | 'reset_all'

    if (action === "clear_amount") {
      // Clear total amount and remaining
      await db
        .update(conversations)
        .set({
          totalAmount: 0,
          paidAmount: 0,
          remainingAmount: 0,
          paymentPlanNotes: "تم تصفير المبلغ والحساب",
          updatedAt: new Date(),
        })
        .where(eq(conversations.id, convId));

      await db.insert(messages).values({
        conversationId: convId,
        sender: "agent",
        text: "ℹ️ تم مسح وتصفير كافة المبالغ والأقساط المسجلة لهذا الحساب.",
        type: "text",
      });

      return NextResponse.json({ success: true, message: "Amount cleared" });
    }

    if (action === "update_plan") {
      const totalAmount = Number(body.totalAmount || 0);
      const paidAmount = Number(body.paidAmount || 0);
      const remainingAmount = Math.max(0, totalAmount - paidAmount);

      await db
        .update(conversations)
        .set({
          totalAmount,
          paidAmount,
          remainingAmount,
          paymentPlanNotes: body.paymentPlanNotes || "",
          currency: body.currency || "د.ع",
          updatedAt: new Date(),
        })
        .where(eq(conversations.id, convId));

      await db.insert(messages).values({
        conversationId: convId,
        sender: "agent",
        text: `📝 تم تحديث الخطة المالية: إجمالي المبلغ: ${totalAmount.toLocaleString()} د.ع، المسدد: ${paidAmount.toLocaleString()} د.ع، المتبقي: ${remainingAmount.toLocaleString()} د.ع.`,
        type: "text",
      });

      return NextResponse.json({ success: true, message: "Plan updated" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error modifying payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
