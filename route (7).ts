import { NextResponse } from "next/server";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  try {
    const res = await seedDatabase();
    return NextResponse.json(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const res = await seedDatabase();
    return NextResponse.json(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
