import { NextResponse } from "next/server";
import { db } from "@/db";
import { labels } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  try {
    let allLabels = await db.select().from(labels).orderBy(asc(labels.orderIndex));
    if (allLabels.length === 0) {
      await seedDatabase();
      allLabels = await db.select().from(labels).orderBy(asc(labels.orderIndex));
    }
    return NextResponse.json(allLabels);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching labels";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const created = await db
      .insert(labels)
      .values({
        name: body.name,
        color: body.color || "#3b82f6",
        badgeBg: body.badgeBg || "bg-blue-950 text-blue-300 border-blue-800",
        orderIndex: body.orderIndex || 99,
      })
      .returning();

    return NextResponse.json(created[0]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating label";
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

    await db.delete(labels).where(eq(labels.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting label";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
