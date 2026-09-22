import { NextResponse } from "next/server";
import { db } from "@/db";
import { templates } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const row = searchParams.get("row");

    let allTemplates = await db.select().from(templates).orderBy(asc(templates.rowIndex), asc(templates.orderIndex));
    if (allTemplates.length === 0) {
      await seedDatabase();
      allTemplates = await db.select().from(templates).orderBy(asc(templates.rowIndex), asc(templates.orderIndex));
    }

    if (row) {
      allTemplates = allTemplates.filter((t) => t.rowIndex === Number(row));
    }

    return NextResponse.json(allTemplates);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching templates";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const created = await db
      .insert(templates)
      .values({
        rowIndex: Number(body.rowIndex || 1),
        title: body.title,
        content: body.content,
        isManagerOnly: !!body.isManagerOnly,
        isHiddenInChat: !!body.isHiddenInChat,
        isUploaded: true,
        orderIndex: Number(body.orderIndex || 99),
      })
      .returning();

    return NextResponse.json(created[0]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating template";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const updated = await db
      .update(templates)
      .set({
        rowIndex: body.rowIndex !== undefined ? Number(body.rowIndex) : undefined,
        title: body.title,
        content: body.content,
        isManagerOnly: body.isManagerOnly !== undefined ? !!body.isManagerOnly : undefined,
        isHiddenInChat: body.isHiddenInChat !== undefined ? !!body.isHiddenInChat : undefined,
        isUploaded: body.isUploaded !== undefined ? !!body.isUploaded : undefined,
        orderIndex: body.orderIndex !== undefined ? Number(body.orderIndex) : undefined,
      })
      .where(eq(templates.id, Number(body.id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating template";
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

    await db.delete(templates).where(eq(templates.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting template";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
