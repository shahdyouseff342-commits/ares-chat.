import { NextResponse } from "next/server";
import { db } from "@/db";
import { employees } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  try {
    let allEmployees = await db.select().from(employees).orderBy(asc(employees.id));
    if (allEmployees.length === 0) {
      await seedDatabase();
      allEmployees = await db.select().from(employees).orderBy(asc(employees.id));
    }
    return NextResponse.json(allEmployees);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching employees";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.role) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
    }

    const created = await db
      .insert(employees)
      .values({
        name: body.name,
        username: body.username || body.name.toLowerCase().replace(/\s+/g, "_"),
        role: body.role, // 'مدير' | 'مبيعات' | 'محاسب دفعات' | 'دعم فني'
        phone: body.phone || "0770-000-0000",
        status: body.status || "نشط",
        avatarColor: body.avatarColor || "#6366f1",
      })
      .returning();

    return NextResponse.json(created[0]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating employee";
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
      .update(employees)
      .set({
        name: body.name,
        role: body.role,
        phone: body.phone,
        status: body.status,
      })
      .where(eq(employees.id, Number(body.id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating employee";
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

    await db.delete(employees).where(eq(employees.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting employee";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
