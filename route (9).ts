import { NextResponse } from "next/server";
import { db } from "@/db";
import { appSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  try {
    let settings = await db.select().from(appSettings).limit(1);
    if (settings.length === 0) {
      await seedDatabase();
      settings = await db.select().from(appSettings).limit(1);
    }
    return NextResponse.json(settings[0]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let settings = await db.select().from(appSettings).limit(1);
    if (settings.length === 0) {
      await seedDatabase();
      settings = await db.select().from(appSettings).limit(1);
    }

    const currentId = settings[0].id;

    const updated = await db
      .update(appSettings)
      .set({
        voiceAnalysisEnabled: body.voiceAnalysisEnabled ?? settings[0].voiceAnalysisEnabled,
        voiceAnalysisScope: body.voiceAnalysisScope ?? settings[0].voiceAnalysisScope,
        maxVoiceSeconds: Number(body.maxVoiceSeconds ?? settings[0].maxVoiceSeconds),
        phraseHints: body.phraseHints ?? settings[0].phraseHints,
        modelName: body.modelName ?? settings[0].modelName,
        languageCode: body.languageCode ?? settings[0].languageCode,
        autoPunctuation: body.autoPunctuation ?? settings[0].autoPunctuation,
        profanityFilter: body.profanityFilter ?? settings[0].profanityFilter,
        providerOptionsJson: body.providerOptionsJson ?? settings[0].providerOptionsJson,
        aiActive: body.aiActive ?? settings[0].aiActive,
        aiAutoReply: body.aiAutoReply ?? settings[0].aiAutoReply,
        aiSystemPrompt: body.aiSystemPrompt ?? settings[0].aiSystemPrompt,
        apiKey: body.apiKey ?? settings[0].apiKey,
        serverStatus: body.serverStatus ?? settings[0].serverStatus,
        whatsappPhone: body.whatsappPhone ?? settings[0].whatsappPhone,
        whatsappStatus: body.whatsappStatus ?? settings[0].whatsappStatus,
        darkMode: body.darkMode ?? settings[0].darkMode,
        shopLocation: body.shopLocation ?? settings[0].shopLocation,
        updatedAt: new Date(),
      })
      .where(eq(appSettings.id, currentId))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
