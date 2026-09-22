import { NextResponse } from "next/server";
import { db } from "@/db";
import { conversations, messages, payments } from "@/db/schema";
import { desc, eq, ilike, or } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const label = searchParams.get("label");

    let list = await db.select().from(conversations).orderBy(desc(conversations.isPinned), desc(conversations.updatedAt));

    if (list.length === 0) {
      await seedDatabase();
      list = await db.select().from(conversations).orderBy(desc(conversations.isPinned), desc(conversations.updatedAt));
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.customerName.toLowerCase().includes(q) ||
          c.customerPhone.replace(/[-\s]/g, "").includes(q.replace(/[-\s]/g, "")) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }

    if (label && label !== "الرسائل") {
      if (label === "غير مقروء") {
        list = list.filter((c) => !c.isRead);
      } else {
        list = list.filter((c) => Array.isArray(c.labels) && c.labels.includes(label));
      }
    }

    return NextResponse.json(list);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching conversations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.customerPhone) {
      return NextResponse.json({ error: "Customer name and phone required" }, { status: 400 });
    }

    const totalAmount = Number(body.totalAmount || 0);
    const paidAmount = Number(body.paidAmount || 0);
    const remainingAmount = Math.max(0, totalAmount - paidAmount);

    const colors = ["#0284c7", "#8b5cf6", "#e11d48", "#10b981", "#f59e0b", "#6366f1"];
    const avatarColor = body.avatarColor || colors[Math.floor(Math.random() * colors.length)];

    const created = await db
      .insert(conversations)
      .values({
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        avatarColor,
        isPinned: !!body.isPinned,
        isRead: true,
        assignedEmployeeId: body.assignedEmployeeId ? Number(body.assignedEmployeeId) : null,
        labels: body.labels || ["الرسائل"],
        lastMessage: body.lastMessage || "محادثة جديدة",
        lastMessageType: body.lastMessageType || "text",
        lastMessageTime: "الآن",
        voiceAnalysisStatus: body.voiceAnalysisStatus || "نشط",
        totalAmount,
        paidAmount,
        remainingAmount,
        currency: body.currency || "د.ع",
        paymentPlanNotes: body.paymentPlanNotes || "",
      })
      .returning();

    // If initial payment was made
    if (paidAmount > 0) {
      await db.insert(payments).values({
        conversationId: created[0].id,
        amount: paidAmount,
        method: body.paymentMethod || "زين كاش",
        note: "دفعة أولى عند فتح الحساب",
        recordedBy: body.recordedBy || "salih 2",
      });
    }

    return NextResponse.json(created[0]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating conversation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const convId = Number(body.id);
    const existing = await db.select().from(conversations).where(eq(conversations.id, convId)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const current = existing[0];
    const totalAmount = body.totalAmount !== undefined ? Number(body.totalAmount) : current.totalAmount;
    const paidAmount = body.paidAmount !== undefined ? Number(body.paidAmount) : current.paidAmount;
    const remainingAmount = Math.max(0, totalAmount - paidAmount);

    const updated = await db
      .update(conversations)
      .set({
        customerName: body.customerName ?? current.customerName,
        customerPhone: body.customerPhone ?? current.customerPhone,
        isPinned: body.isPinned !== undefined ? !!body.isPinned : current.isPinned,
        isRead: body.isRead !== undefined ? !!body.isRead : current.isRead,
        labels: body.labels ?? current.labels,
        voiceAnalysisStatus: body.voiceAnalysisStatus ?? current.voiceAnalysisStatus,
        totalAmount,
        paidAmount,
        remainingAmount,
        currency: body.currency ?? current.currency,
        paymentPlanNotes: body.paymentPlanNotes ?? current.paymentPlanNotes,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, convId))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating conversation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const convId = Number(id);
    await db.delete(messages).where(eq(messages.conversationId, convId));
    await db.delete(payments).where(eq(payments.conversationId, convId));
    await db.delete(conversations).where(eq(conversations.id, convId));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting conversation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
