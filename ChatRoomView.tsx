"use client";

import React, { useState, useEffect, useRef } from "react";
import { ConversationType, MessageType, TemplateType, AppSettingsType } from "@/types";
import {
  ArrowRight,
  MoreVertical,
  Phone,
  Copy,
  Check,
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Volume2,
  Mic,
  Send,
  Paperclip,
  MapPin,
  Play,
  Pause,
  Bot,
  User,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  PhoneCall,
  Video,
  FileText,
  Download,
  Image as ImageIcon,
  FileUp,
  Square,
  AlertCircle,
} from "lucide-react";
import { CallModal } from "./CallModal";

interface ChatRoomViewProps {
  conversation: ConversationType;
  settings: AppSettingsType;
  templates: TemplateType[];
  onBack: () => void;
  onRefreshConversation: () => void;
  onOpenPaymentModal: () => void;
  onOpenEditAmountModal: () => void;
  onClearAmount: () => void;
  onToggleVoiceAnalysis: () => void;
  onOpenAddTemplateModal: (rowIndex?: number) => void;
}

export default function ChatRoomView({
  conversation,
  settings,
  templates,
  onBack,
  onRefreshConversation,
  onOpenPaymentModal,
  onOpenEditAmountModal,
  onClearAmount,
  onToggleVoiceAnalysis,
  onOpenAddTemplateModal,
}: ChatRoomViewProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Calling feature
  const [isInCall, setIsInCall] = useState(false);

  // Audio Playback
  const [playingMsgId, setPlayingMsgId] = useState<number | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Real Microphone Recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // File Uploading
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group templates by rows 1 to 6
  const rowTemplates: { [row: number]: TemplateType[] } = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  templates.forEach((tpl) => {
    const r = tpl.rowIndex >= 1 && tpl.rowIndex <= 6 ? tpl.rowIndex : 1;
    if (!tpl.isHiddenInChat) {
      rowTemplates[r].push(tpl);
    }
  });

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3500);
    return () => clearInterval(interval);
  }, [conversation.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  // Handle phone copy
  const handleCopyPhone = () => {
    navigator.clipboard.writeText(conversation.customerPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const content = textToSend !== undefined ? textToSend : inputText.trim();
    if (!content) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: content,
          type: "text",
          sender: "agent",
        }),
      });

      if (res.ok) {
        if (!textToSend) setInputText("");
        await fetchMessages();
        onRefreshConversation();
      }
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setLoading(false);
    }
  };

  // Click canned template button
  const handleTemplateClick = (tpl: TemplateType) => {
    handleSendMessage(tpl.content);
  };

  // ----------------------------------------------------
  // REAL AUDIO PLAYBACK & SYNTHESIS
  // ----------------------------------------------------
  const playVoiceMessage = (msg: MessageType) => {
    // If clicking on already playing message, pause it
    if (playingMsgId === msg.id) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setPlayingMsgId(null);
      return;
    }

    // Stop any existing sound
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setPlayingMsgId(msg.id);

    // Case 1: Real audio file / base64 URL available
    if (msg.mediaUrl && (msg.mediaUrl.startsWith("data:audio") || msg.mediaUrl.startsWith("http"))) {
      const audio = new Audio(msg.mediaUrl);
      currentAudioRef.current = audio;
      audio.play().catch((err) => console.log("Audio play error", err));
      audio.onended = () => {
        setPlayingMsgId(null);
        currentAudioRef.current = null;
      };
      audio.onerror = () => {
        fallbackSpeak(msg);
      };
      return;
    }

    // Case 2: Realistic Speech Synthesis reading the transcription or voice text out loud!
    fallbackSpeak(msg);
  };

  const fallbackSpeak = (msg: MessageType) => {
    const textToSpeak = msg.transcription || "السلام عليكم، تفاصيل القسط متوفرة";
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "ar-IQ";
      utterance.rate = 0.95;
      utterance.onend = () => {
        setPlayingMsgId(null);
      };
      utterance.onerror = () => {
        setPlayingMsgId(null);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingMsgId(null), 3000);
    }
  };

  // ----------------------------------------------------
  // REAL MICROPHONE RECORDING (Voice Notes)
  // ----------------------------------------------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await sendVoiceNote(base64Audio, recordSeconds || 5);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Microphone access denied or not available, falling back to simulated recording:", err);
      // Fallback: simulated record
      setIsRecording(true);
      setRecordSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      // Fallback
      setIsRecording(false);
      sendVoiceNote(null, recordSeconds || 12);
    }
  };

  const sendVoiceNote = async (audioDataUrl: string | null, duration: number) => {
    try {
      await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `بصمة صوتية (${duration} ثانية)`,
          type: "voice",
          sender: "agent",
          durationSec: duration,
          mediaUrl: audioDataUrl,
          transcription: "رسالة صوتية مسجلة من موظف خدمة عملاء ARES",
        }),
      });
      await fetchMessages();
      onRefreshConversation();
    } catch (err) {
      console.error("Error sending voice note", err);
    }
  };

  // ----------------------------------------------------
  // REAL FILE / IMAGE / VIDEO UPLOADING
  // ----------------------------------------------------
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Send as chat message
        await fetch(`/api/conversations/${conversation.id}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: file.name,
            type: data.type,
            mediaUrl: data.url,
            fileName: data.fileName,
            fileSize: data.fileSize,
            sender: "agent",
          }),
        });
        await fetchMessages();
        onRefreshConversation();
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("فشل تحميل الملف");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Simulate customer sending image, video, file, or voice note (for testing both sides)
  const handleSimulateCustomerMedia = async (kind: "voice" | "image" | "video" | "file") => {
    let payload: Record<string, unknown> = {
      sender: "customer",
    };

    if (kind === "voice") {
      payload = {
        ...payload,
        type: "voice",
        text: "بصمة صوتية (0:22 ثانية)",
        durationSec: 22,
        transcription: "أهلاً يا غالي، أرسلتلكم صورة الوصل وبطاقة الماستر، شيكوها حتى اعتمد الاستلام",
      };
    } else if (kind === "image") {
      payload = {
        ...payload,
        type: "image",
        text: "صورة وصل القبض الرسمي 📄",
        mediaUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700&auto=format&fit=crop&q=80",
      };
    } else if (kind === "video") {
      payload = {
        ...payload,
        type: "video",
        text: "فيديو فحص كرتونة وشاشة الموبايل 📹",
        mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      };
    } else {
      payload = {
        ...payload,
        type: "file",
        text: "عقد_التقسيط_المعتمد.pdf",
        fileName: "عقد_التقسيط_المعتمد.pdf",
        fileSize: "1.4 MB",
      };
    }

    try {
      await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await fetchMessages();
      onRefreshConversation();
    } catch (err) {
      console.error("Error simulating customer message", err);
    }
  };

  // Color styles for rows matching screenshot 4
  const getRowPillStyle = (row: number) => {
    switch (row) {
      case 1:
        return "bg-[#182a46] hover:bg-[#20395e] text-blue-200 border-[#2b4c7e]";
      case 2:
        return "bg-[#451423] hover:bg-[#5a1b2e] text-rose-200 border-[#6b2137]";
      case 3:
        return "bg-[#453610] hover:bg-[#5c4815] text-amber-200 border-[#6d5519]";
      case 4:
        return "bg-[#0e3b43] hover:bg-[#144f5a] text-cyan-200 border-[#1c6b7a]";
      case 5:
        return "bg-[#15233c] hover:bg-[#1e3256] text-indigo-200 border-[#2a4574]";
      case 6:
        return "bg-[#162740] hover:bg-[#1e3557] text-sky-200 border-[#27446e]";
      default:
        return "bg-slate-800 text-slate-200 border-slate-700";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] text-white relative">
      {/* Hidden file input for uploading images, videos, and files */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,video/*,application/pdf,application/msword,.zip,.docx"
      />

      {/* Top Header */}
      <div className="px-3 py-2.5 bg-[#121722] border-b border-gray-800 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            title="رجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base text-white shadow-sm shrink-0"
            style={{ backgroundColor: conversation.avatarColor || "#0284c7" }}
          >
            {conversation.customerName ? conversation.customerName.charAt(0).toUpperCase() : "M"}
          </div>

          {/* Name & Read-only Phone */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-100">{conversation.customerName}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full border ${
                  conversation.voiceAnalysisStatus === "نشط" && settings.voiceAnalysisEnabled
                    ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
              >
                تحليل: {conversation.voiceAnalysisStatus === "نشط" && settings.voiceAnalysisEnabled ? "نشط" : "متوقف"}
              </span>
            </div>

            {/* Read-only phone with copy */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Phone className="w-3 h-3 text-blue-400" />
              <span className="font-mono tracking-wider select-all text-gray-300">
                {conversation.customerPhone}
              </span>
              <button
                onClick={handleCopyPhone}
                className="p-0.5 hover:text-white text-gray-400 transition-colors"
                title="نسخ الرقم (للقراءة فقط)"
              >
                {copiedPhone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Top actions: Call Button & Payments & Menu */}
        <div className="flex items-center gap-1.5 relative">
          {/* Direct Phone Call to Customer Button */}
          <button
            onClick={() => setIsInCall(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
            title="اتصال مباشر بالعميل"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span>اتصال بالعميل</span>
          </button>

          {/* Payment */}
          <button
            onClick={onOpenPaymentModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
            title="تسجيل دفعة"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>تسجيل دفعة</span>
          </button>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-10 left-0 w-60 bg-[#1b2230] border border-gray-700 rounded-xl shadow-2xl py-1.5 z-50 text-xs">
              <button
                onClick={() => {
                  setShowMenu(false);
                  setIsInCall(true);
                }}
                className="w-full text-right px-3.5 py-2 hover:bg-gray-700/60 flex items-center gap-2 text-emerald-400 font-semibold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>بدء مكالمة صوتية مع العميل</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenEditAmountModal();
                }}
                className="w-full text-right px-3.5 py-2 hover:bg-gray-700/60 flex items-center gap-2 text-gray-200"
              >
                <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                <span>تعديل المبلغ / الخطة المالية</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onClearAmount();
                }}
                className="w-full text-right px-3.5 py-2 hover:bg-gray-700/60 flex items-center gap-2 text-rose-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح المبلغ المسجل</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onToggleVoiceAnalysis();
                }}
                className="w-full text-right px-3.5 py-2 hover:bg-gray-700/60 flex items-center gap-2 text-purple-300"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>تبديل حالة تحليل البصمات</span>
              </button>
              <div className="border-t border-gray-700/70 my-1" />
              {/* Media Simulation to verify customer sending capabilities */}
              <div className="px-3 py-1 text-[10px] text-gray-400 font-bold">
                محاكاة إرسال العميل ميديا:
              </div>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleSimulateCustomerMedia("voice");
                }}
                className="w-full text-right px-3.5 py-1.5 hover:bg-gray-700/60 flex items-center gap-2 text-purple-300"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>العميل يرسل بصمة صوتية</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleSimulateCustomerMedia("image");
                }}
                className="w-full text-right px-3.5 py-1.5 hover:bg-gray-700/60 flex items-center gap-2 text-sky-300"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>العميل يرسل صورة وصل</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleSimulateCustomerMedia("video");
                }}
                className="w-full text-right px-3.5 py-1.5 hover:bg-gray-700/60 flex items-center gap-2 text-amber-300"
              >
                <Video className="w-3.5 h-3.5" />
                <span>العميل يرسل فيديو فحص جهاز</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleSimulateCustomerMedia("file");
                }}
                className="w-full text-right px-3.5 py-1.5 hover:bg-gray-700/60 flex items-center gap-2 text-emerald-300"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>العميل يرسل ملف مستند</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Tracker Strip (نظام تسجيل الدفعات والأقساط) */}
      <div className="px-3 py-2 bg-[#161c28] border-b border-gray-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400">المبلغ الإجمالي</span>
            <span className="font-bold text-gray-200">
              {conversation.totalAmount.toLocaleString()} {conversation.currency}
            </span>
          </div>
          <div className="h-6 w-px bg-gray-700" />
          <div className="flex flex-col">
            <span className="text-[10px] text-emerald-400">المسدد</span>
            <span className="font-bold text-emerald-300">
              {conversation.paidAmount.toLocaleString()} {conversation.currency}
            </span>
          </div>
          <div className="h-6 w-px bg-gray-700" />
          <div className="flex flex-col">
            <span className="text-[10px] text-amber-400">المتبقي (الأقساط)</span>
            <span className="font-bold text-amber-300">
              {conversation.remainingAmount.toLocaleString()} {conversation.currency}
            </span>
          </div>
        </div>

        {/* Quick action buttons for amounts */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenEditAmountModal}
            className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] transition-colors"
          >
            تعديل
          </button>
          <button
            onClick={onClearAmount}
            className="px-2 py-1 rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 text-[11px] border border-rose-800/50 transition-colors"
          >
            مسح
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#090d15] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Date separator matching Screenshot 4 */}
        <div className="flex justify-center">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-semibold bg-[#1a2333] border border-blue-900/40 text-blue-300 shadow-sm">
            اليوم • 2026/08/27
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-xs">
            لا توجد رسائل سابقة. اختر من الكلايش الجاهزة بالأسفل أو سجل بصمة أو أرسل ملفات.
          </div>
        ) : (
          messages.map((msg) => {
            const isCustomer = msg.sender === "customer";
            const isBot = msg.sender === "bot";
            const isPlaying = playingMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isCustomer ? "items-start" : isBot ? "items-center" : "items-end"
                }`}
              >
                {/* Bot announcement pill */}
                {isBot ? (
                  <div className="max-w-[85%] bg-purple-950/80 border border-purple-700/60 text-purple-200 text-xs rounded-2xl px-3.5 py-2 my-1 shadow">
                    <div className="flex items-center gap-1.5 mb-1 font-bold text-[11px] text-purple-300">
                      <Bot className="w-3.5 h-3.5" />
                      <span>المساعد الذكي (ARES AI)</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md transition-all ${
                      isCustomer
                        ? "bg-[#18202f] border border-gray-700/60 text-gray-100 rounded-tr-none"
                        : "bg-[#2563eb] text-white rounded-tl-none"
                    }`}
                  >
                    {/* Voice Note Message Player (سماع الفويس الحقيقي) */}
                    {msg.type === "voice" ? (
                      <div className="space-y-2 min-w-[240px]">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => playVoiceMessage(msg)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-md ${
                              isPlaying
                                ? "bg-amber-500 text-black animate-pulse"
                                : isCustomer
                                ? "bg-purple-600 text-white"
                                : "bg-white text-blue-600"
                            }`}
                            title={isPlaying ? "إيقاف مؤقت" : "تشغيل وسماع البصمة"}
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5 fill-current" />
                            ) : (
                              <Play className="w-5 h-5 ml-0.5 fill-current" />
                            )}
                          </button>

                          {/* Sound wave graphic animation */}
                          <div className="flex-1 flex items-center gap-1 h-6">
                            {[40, 70, 95, 60, 30, 85, 100, 45, 65, 80, 50, 70, 35].map(
                              (h, i) => (
                                <div
                                  key={i}
                                  className={`w-1 rounded-full transition-all duration-300 ${
                                    isPlaying
                                      ? "bg-amber-400 animate-pulse"
                                      : isCustomer
                                      ? "bg-gray-400"
                                      : "bg-blue-200"
                                  }`}
                                  style={{
                                    height: isPlaying ? `${Math.min(100, h + 20)}%` : `${h}%`,
                                  }}
                                />
                              )
                            )}
                          </div>
                          <span className="text-[10px] text-gray-300 font-mono">
                            0:{msg.durationSec ? (msg.durationSec < 10 ? `0${msg.durationSec}` : msg.durationSec) : "20"}
                          </span>
                        </div>

                        {/* Transcription Box powered by voice analysis */}
                        {msg.transcription && (
                          <div
                            className={`p-2.5 rounded-xl text-[11px] leading-relaxed border ${
                              isCustomer
                                ? "bg-[#121722] border-purple-900/60 text-purple-200"
                                : "bg-blue-700 border-blue-500 text-blue-100"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-purple-300 mb-1">
                              <span className="flex items-center gap-1 font-semibold">
                                <Sparkles className="w-3 h-3" />
                                <span>تحليل البصمة ({settings.modelName || "chirp_3"}):</span>
                              </span>
                              {msg.isProfaneFiltered && (
                                <span className="flex items-center gap-0.5 text-rose-400">
                                  <ShieldAlert className="w-3 h-3" />
                                  <span>مفلتر</span>
                                </span>
                              )}
                            </div>
                            <p className="select-text">{msg.transcription}</p>
                          </div>
                        )}
                      </div>
                    ) : msg.type === "image" ? (
                      /* Image Message with full view & download */
                      <div className="space-y-1.5">
                        <img
                          src={msg.mediaUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700&auto=format&fit=crop&q=80"}
                          alt="مرفق صورة"
                          className="rounded-xl max-h-60 w-auto object-cover border border-gray-700/80 cursor-pointer hover:opacity-95 shadow-md"
                          onClick={() => window.open(msg.mediaUrl || "#", "_blank")}
                        />
                        {msg.text && <p className="font-medium text-xs">{msg.text}</p>}
                      </div>
                    ) : msg.type === "video" ? (
                      /* Video Message with player */
                      <div className="space-y-1.5 max-w-[280px]">
                        <video
                          src={msg.mediaUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
                          controls
                          className="rounded-xl w-full max-h-56 bg-black border border-gray-700 shadow-md"
                        />
                        {msg.text && <p className="font-medium text-xs">{msg.text}</p>}
                      </div>
                    ) : msg.type === "file" ? (
                      /* Document / File Message */
                      <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-700 flex items-center justify-between gap-3 min-w-[220px]">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-blue-950 text-blue-300 border border-blue-800">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xs truncate max-w-[140px] text-white">
                              {msg.fileName || msg.text}
                            </p>
                            <span className="text-[10px] text-gray-400">
                              {msg.fileSize || "1.2 MB"}
                            </span>
                          </div>
                        </div>

                        {msg.mediaUrl && (
                          <a
                            href={msg.mediaUrl}
                            download={msg.fileName || "file"}
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                            title="تنزيل الملف"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ) : (
                      /* Standard Text Message */
                      <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.text}</p>
                    )}

                    {/* Timestamp */}
                    <div
                      className={`text-[9px] mt-1 text-left ${
                        isCustomer ? "text-gray-400" : "text-blue-200"
                      }`}
                    >
                      {new Intl.DateTimeFormat("ar-IQ", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }).format(new Date(msg.createdAt))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK TEMPLATES TOOLBAR (الكلايش الجاهزة) Directly on Chat Screen */}
      <div className="bg-[#0e131d] border-t border-gray-800/90 p-2.5 pb-1 space-y-1.5 shadow-2xl shrink-0">
        <div className="flex items-center justify-between px-1 text-[11px] text-gray-400 mb-0.5">
          <span className="font-semibold text-gray-300">الكلايش السريعة المباشرة (6 صفوف):</span>
          <button
            onClick={() => onOpenAddTemplateModal(1)}
            className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>إضافة كليشة على الشاشة</span>
          </button>
        </div>

        {/* The 6 Rows matching Screenshot 4 */}
        {[1, 2, 3, 4, 5, 6].map((rowNum) => {
          const tpls = rowTemplates[rowNum];
          if (!tpls || tpls.length === 0) return null;

          return (
            <div
              key={rowNum}
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
            >
              {tpls.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleTemplateClick(tpl)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 shrink-0 shadow-sm ${getRowPillStyle(
                    rowNum
                  )}`}
                  title={tpl.content}
                >
                  {tpl.title}
                </button>
              ))}

              <button
                onClick={() => onOpenAddTemplateModal(rowNum)}
                className="w-6 h-6 rounded-full border border-dashed border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white flex items-center justify-center shrink-0 text-xs"
                title={`إضافة كليشة في الصف ${rowNum}`}
              >
                +
              </button>
            </div>
          );
        })}
      </div>

      {/* Recording in progress indicator bar */}
      {isRecording && (
        <div className="px-4 py-2 bg-rose-950/80 border-t border-rose-800 flex items-center justify-between text-xs text-rose-300 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>جاري تسجيل بصمة صوتية حقيقية بالمايكروفون... ({recordSeconds} ثانية)</span>
          </div>
          <button
            onClick={stopRecording}
            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
          >
            إيقاف وإرسال
          </button>
        </div>
      )}

      {/* Uploading File indicator */}
      {uploadingFile && (
        <div className="px-4 py-1.5 bg-blue-950/80 border-t border-blue-800 text-xs text-blue-300 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span>جاري رفع المرفق (صورة / فيديو / ملف)...</span>
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div className="p-2.5 bg-[#121620] border-t border-gray-800 flex items-center gap-2 shrink-0">
        {/* Send Location */}
        <button
          onClick={() => {
            setInputText(settings.shopLocation || "موقع المحل: بغداد - المنصور - شارع 14 رمضان");
          }}
          className="p-2 text-blue-400 hover:text-blue-300 rounded-xl hover:bg-gray-800 transition-colors"
          title="إرسال موقع المحل"
        >
          <MapPin className="w-5 h-5" />
        </button>

        {/* Paperclip Button for Real Files, Photos, Videos */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors"
          title="إرفاق صور أو فيديوهات أو ملفات"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={isRecording ? `جاري التسجيل... (${recordSeconds} ث)` : "اكتب رسالة..."}
            className={`w-full bg-[#1a2130] border rounded-2xl py-2.5 pr-4 pl-4 text-xs text-gray-100 placeholder-gray-400 focus:outline-none transition-all ${
              isRecording ? "border-rose-500 bg-rose-950/20 text-rose-300" : "border-gray-700/80 focus:border-blue-500"
            }`}
          />
        </div>

        {/* Mic / Voice Record Button (Real Recording + Voice Notes) */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-2.5 rounded-full transition-all active:scale-95 shadow-md ${
            isRecording
              ? "bg-rose-600 text-white animate-pulse"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          }`}
          title={isRecording ? "إيقاف وحفظ البصمة" : "تسجيل بصمة صوتية"}
        >
          {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Send Button */}
        {inputText.trim() && (
          <button
            onClick={() => handleSendMessage()}
            disabled={loading}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95 shadow-md"
            title="إرسال"
          >
            <Send className="w-5 h-5 transform -rotate-90" />
          </button>
        )}
      </div>

      {/* Voice Call VoIP Modal with Customer */}
      {isInCall && (
        <CallModal
          customerName={conversation.customerName}
          customerPhone={conversation.customerPhone}
          onEndCall={() => setIsInCall(false)}
        />
      )}
    </div>
  );
}
