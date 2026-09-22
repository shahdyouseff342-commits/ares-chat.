export interface AppSettingsType {
  id: number;
  voiceAnalysisEnabled: boolean;
  voiceAnalysisScope: string;
  maxVoiceSeconds: number;
  phraseHints: string;
  modelName: string;
  languageCode: string;
  autoPunctuation: boolean;
  profanityFilter: boolean;
  providerOptionsJson: string;
  aiActive: boolean;
  aiAutoReply: boolean;
  aiSystemPrompt: string;
  apiKey: string;
  serverStatus: string;
  darkMode: boolean;
  shopLocation: string;
  whatsappPhone?: string;
  whatsappStatus?: string;
}

export interface LabelType {
  id: number;
  name: string;
  color: string;
  badgeBg: string;
  orderIndex: number;
}

export interface TemplateType {
  id: number;
  rowIndex: number;
  title: string;
  content: string;
  isManagerOnly: boolean;
  isHiddenInChat: boolean;
  isUploaded: boolean;
  orderIndex: number;
}

export interface EmployeeType {
  id: number;
  name: string;
  username: string;
  role: string;
  phone: string;
  status: string;
  avatarColor: string;
}

export interface ConversationType {
  id: number;
  customerName: string;
  customerPhone: string;
  avatarColor: string;
  isPinned: boolean;
  isRead: boolean;
  assignedEmployeeId: number | null;
  labels: string[];
  lastMessage: string;
  lastMessageType: string;
  lastMessageTime: string;
  voiceAnalysisStatus: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: string;
  paymentPlanNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageType {
  id: number;
  conversationId: number;
  sender: "customer" | "agent" | "bot";
  text: string;
  type: "text" | "voice" | "image" | "video" | "file";
  mediaUrl?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  durationSec?: number | null;
  transcription?: string | null;
  isProfaneFiltered?: boolean;
  createdAt: string;
}

export interface PaymentType {
  id: number;
  conversationId: number;
  amount: number;
  paymentDate: string;
  method: string;
  note: string;
  recordedBy: string;
}

export interface AiDecisionType {
  id: number;
  conversationId: number | null;
  customerPhone: string;
  detectedIntent: string;
  suggestedReply: string;
  confidence: string;
  status: string;
  createdAt: string;
}
