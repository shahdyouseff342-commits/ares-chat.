import { pgTable, serial, text, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";

export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  voiceAnalysisEnabled: boolean("voice_analysis_enabled").default(true).notNull(),
  voiceAnalysisScope: text("voice_analysis_scope").default("عام").notNull(), // 'عام' | 'فلترة'
  maxVoiceSeconds: integer("max_voice_seconds").default(60).notNull(),
  phraseHints: text("phrase_hints").default("ايفون\nكلكسي\nجلgeneric\nاندرويد\nاس 25 اولترا\nآيفون\niPhone\nPro Max 13").notNull(),
  modelName: text("model_name").default("chirp_3").notNull(),
  languageCode: text("language_code").default("ar-IQ").notNull(),
  autoPunctuation: boolean("auto_punctuation").default(true).notNull(),
  profanityFilter: boolean("profanity_filter").default(false).notNull(),
  providerOptionsJson: text("provider_options_json").default("{\n  \"sample_rate_hertz\": 16000,\n  \"encoding\": \"OGG_OPUS\",\n  \"enable_automatic_punctuation\": true\n}").notNull(),
  aiActive: boolean("ai_active").default(true).notNull(),
  aiAutoReply: boolean("ai_auto_reply").default(false).notNull(),
  aiSystemPrompt: text("ai_system_prompt").default("أنت مساعد ذكي لنظام إدارة خدمة العملاء والأقساط ARES Chat في العراق. ساعد الزبائن بأدب ولهجة عراقية مهذبة واضحة واشرح أنظمة الدفع ومواعيد الاستلام.").notNull(),
  apiKey: text("api_key").default("ares_live_sec_9942a7810df").notNull(),
  serverStatus: text("server_status").default("متصل").notNull(),
  whatsappPhone: text("whatsapp_phone").default("+964 773 387 8591").notNull(),
  whatsappStatus: text("whatsapp_status").default("متصل ونشط").notNull(),
  darkMode: boolean("dark_mode").default(true).notNull(),
  shopLocation: text("shop_location").default("بغداد - المنصور - شارع 14 رمضان").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull(),
  email: text("email").default("admin@ares.app").notNull(),
  password: text("password").default("123456").notNull(),
  role: text("role").notNull(), // 'مدير' | 'مبيعات' | 'محاسب دفعات' | 'دعم فني'
  phone: text("phone").notNull(),
  status: text("status").default("نشط").notNull(), // 'نشط' | 'مشغول' | 'غير متصل'
  avatarColor: text("avatar_color").default("#3b82f6").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const labels = pgTable("labels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(), // hex color or badge style
  badgeBg: text("badge_bg").notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  rowIndex: integer("row_index").default(1).notNull(), // 1 to 6
  title: text("title").notNull(), // e.g. 'نوع', '13', '14', 'فلوس'
  content: text("content").notNull(),
  isManagerOnly: boolean("is_manager_only").default(false).notNull(),
  isHiddenInChat: boolean("is_hidden_in_chat").default(false).notNull(),
  isUploaded: boolean("is_uploaded").default(true).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  avatarColor: text("avatar_color").default("#e11d48").notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  isRead: boolean("is_read").default(true).notNull(),
  assignedEmployeeId: integer("assigned_employee_id"),
  labels: jsonb("labels").$type<string[]>().default([]).notNull(),
  lastMessage: text("last_message").default("").notNull(),
  lastMessageType: text("last_message_type").default("text").notNull(), // 'text' | 'voice' | 'image' | 'payment'
  lastMessageTime: text("last_message_time").default("الآن").notNull(),
  voiceAnalysisStatus: text("voice_analysis_status").default("نشط").notNull(), // 'نشط' | 'متوقف'
  // Payment tracking (تسجيل أنظمة الدفعات)
  totalAmount: integer("total_amount").default(0).notNull(),
  paidAmount: integer("paid_amount").default(0).notNull(),
  remainingAmount: integer("remaining_amount").default(0).notNull(),
  currency: text("currency").default("د.ع").notNull(),
  paymentPlanNotes: text("payment_plan_notes").default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  amount: integer("amount").notNull(),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  method: text("method").default("زين كاش").notNull(), // 'زين كاش' | 'نقد' | 'ماستر كارد' | 'كي كارد' | 'حوالة'
  note: text("note").default("").notNull(),
  recordedBy: text("recorded_by").default("salih 2").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  sender: text("sender").notNull(), // 'customer' | 'agent' | 'bot'
  text: text("text").notNull(),
  type: text("type").default("text").notNull(), // 'text' | 'voice' | 'image' | 'video' | 'file' | 'payment_notice'
  mediaUrl: text("media_url"),
  fileName: text("file_name"),
  fileSize: text("file_size"),
  durationSec: integer("duration_sec"),
  transcription: text("transcription"),
  isProfaneFiltered: boolean("is_profane_filtered").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiDecisions = pgTable("ai_decisions", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id"),
  customerPhone: text("customer_phone").notNull(),
  detectedIntent: text("detected_intent").notNull(),
  suggestedReply: text("suggested_reply").notNull(),
  confidence: text("confidence").default("95%").notNull(),
  status: text("status").default("معلق").notNull(), // 'معلق' | 'مطبق' | 'مرفوض'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
