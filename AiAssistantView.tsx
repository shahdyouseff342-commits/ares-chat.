"use client";

import React, { useState, useEffect } from "react";
import { AiDecisionType, AppSettingsType } from "@/types";
import {
  ArrowRight,
  RotateCw,
  Search,
  Trash2,
  HelpCircle,
  Sparkles,
  Bot,
  CheckCircle,
  Sliders,
  BookOpen,
  Send,
  Cpu,
} from "lucide-react";

interface AiAssistantViewProps {
  settings: AppSettingsType;
  onBack: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettingsType>) => Promise<void>;
}

export default function AiAssistantView({
  settings,
  onBack,
  onUpdateSettings,
}: AiAssistantViewProps) {
  const [activeTab, setActiveTab] = useState<"decisions" | "rules" | "templates" | "settings">("decisions");
  const [customerPhone, setCustomerPhone] = useState("");
  const [decisions, setDecisions] = useState<AiDecisionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(settings.aiSystemPrompt || "");
  const [aiAutoReply, setAiAutoReply] = useState(settings.aiAutoReply ?? false);
  const [aiActive, setAiActive] = useState(settings.aiActive ?? true);

  const fetchDecisions = async () => {
    try {
      const url = customerPhone
        ? `/api/ai/decisions?phone=${encodeURIComponent(customerPhone)}`
        : `/api/ai/decisions`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDecisions(data);
      }
    } catch (err) {
      console.error("Error fetching decisions", err);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, [customerPhone]);

  // Run AI Check for a customer phone
  const handleRunAiCheck = async () => {
    if (!customerPhone.trim()) {
      alert("يرجى كتابة رقم الزبون أولاً (مثال: 0773-392-6758)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: customerPhone }),
      });
      if (res.ok) {
        await fetchDecisions();
      }
    } catch (err) {
      console.error("Error running AI check", err);
    } finally {
      setLoading(false);
    }
  };

  // Clear all decisions
  const handleClearAllDecisions = async () => {
    if (confirm("هل تريد مسح جميع القرارات المسجلة؟")) {
      await fetch("/api/ai/decisions?id=all", { method: "DELETE" });
      setDecisions([]);
    }
  };

  const handleSaveAiSettings = async () => {
    await onUpdateSettings({
      aiSystemPrompt: systemPrompt,
      aiAutoReply,
      aiActive,
    });
    alert("تم حفظ إعدادات الذكاء الاصطناعي بنجاح!");
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0e14] text-white">
      {/* Top Header matching Screenshot 6 */}
      <div className="px-4 py-3 bg-[#111622] border-b border-gray-800 flex items-center justify-between shrink-0">
        <button
          onClick={fetchDecisions}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          title="تحديث"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-gray-100">المساعد الذكي</h1>

        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          title="رجوع"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs matching Screenshot 6: القرارات | القواعد | الكليش | الإعدادات */}
      <div className="flex items-center justify-around border-b border-gray-800 bg-[#141926] p-1.5 text-xs">
        <button
          onClick={() => setActiveTab("decisions")}
          className={`flex-1 py-2 rounded-xl text-center font-bold transition-all ${
            activeTab === "decisions"
              ? "bg-[#20273a] text-blue-400 shadow-sm"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          القرارات
        </button>
        <button
          onClick={() => setActiveTab("rules")}
          className={`flex-1 py-2 rounded-xl text-center font-bold transition-all ${
            activeTab === "rules"
              ? "bg-[#20273a] text-blue-400 shadow-sm"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          القواعد
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`flex-1 py-2 rounded-xl text-center font-bold transition-all ${
            activeTab === "templates"
              ? "bg-[#20273a] text-blue-400 shadow-sm"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          الكليش
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 py-2 rounded-xl text-center font-bold transition-all ${
            activeTab === "settings"
              ? "bg-[#20273a] text-blue-400 shadow-sm"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          الإعدادات
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full">
        {activeTab === "decisions" && (
          <div className="space-y-4">
            {/* Top Search Card matching Screenshot 6 */}
            <div className="bg-[#141926] border border-gray-800 rounded-3xl p-4 shadow-lg space-y-3">
              {/* Phone Input with Search Icon */}
              <div className="relative">
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="رقم الزبون (077.. / 078..)"
                  className="w-full bg-[#1b2232] border border-gray-700/80 rounded-2xl py-3 pr-4 pl-10 text-xs text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-right font-mono"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>

              {/* Action Buttons: Delete (red trash), Refresh, and "فحص الذكاء" button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearAllDecisions}
                  className="p-3 rounded-2xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 transition-colors"
                  title="مسح كافة القرارات"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={fetchDecisions}
                  className="p-3 rounded-2xl bg-[#1b2232] hover:bg-[#232b3f] border border-gray-700 text-gray-300 transition-colors"
                  title="تحديث"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRunAiCheck}
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? "جاري الفحص بالذكاء..." : "فحص الذكاء"}</span>
                  <HelpCircle className="w-3.5 h-3.5 opacity-80" />
                </button>
              </div>
            </div>

            {/* Decisions List or Empty State matching Screenshot 6 */}
            {decisions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-gray-800/40 border border-gray-800 flex items-center justify-center text-gray-500 shadow-inner">
                  <HelpCircle className="w-10 h-10 stroke-1" />
                </div>
                <h3 className="text-sm font-semibold text-gray-300">لا توجد قرارات بعد</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  أدخل رقم زبون واضغط &quot;فحص الذكاء&quot; لتحليل سلوكه، كشف نيته، واقتراح الكليشة الأنسب له.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                  <span>سجل القرارات المسجلة ({decisions.length})</span>
                  <span className="text-emerald-400">تحليل فوري دقيق</span>
                </div>

                {decisions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#141926] border border-gray-800/90 rounded-2xl p-4 shadow-md space-y-2.5 text-right"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-400">
                        {item.customerPhone}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300">
                        دقة: {item.confidence}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 block mb-0.5">النية المكتشفة:</span>
                      <p className="text-xs font-semibold text-gray-100">{item.detectedIntent}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#1b2232] border border-gray-800 text-xs text-gray-300">
                      <span className="text-[10px] text-purple-400 font-bold block mb-1">
                        الرد المقترح بالذكاء:
                      </span>
                      <p className="leading-relaxed">{item.suggestedReply}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-gray-500">الحالة: {item.status}</span>
                      <button
                        onClick={() => alert(`تم اعتماد وتطبيق القرار للزبون ${item.customerPhone}`)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium"
                      >
                        اعتماد الرد
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "rules" && (
          <div className="bg-[#141926] border border-gray-800 rounded-3xl p-5 space-y-4 text-right">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">قواعد المعالجة التلقائية</h2>
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              تحديد شروط استجابة الذكاء الاصطناعي لكلمات ومصطلحات معينة في رسائل وبصمات الزبائن.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-[#1b2232] border border-gray-800 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-200">شرط الأقساط والدفعات</p>
                  <p className="text-[10px] text-gray-400">إذا تضمنت الرسالة [قسط، دفعة، ماستر]</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  نشط
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#1b2232] border border-gray-800 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-200">كشف التحويل المالي</p>
                  <p className="text-[10px] text-gray-400">إذا تضمنت [وصل، حولت، زين كاش]</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  طلب صورة الوصل
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#1b2232] border border-gray-800 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-rose-300">فلتر وحظر الاحتيال</p>
                  <p className="text-[10px] text-gray-400">إذا طلب الزبون رابط أو كود OTP</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                  تفعيل ليبل احتيال
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="bg-[#141926] border border-gray-800 rounded-3xl p-5 space-y-4 text-right">
            <h2 className="text-sm font-bold text-white">ربط الذكاء بالكلايش الجاهزة</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              عند تحليل البصمة أو الرسالة، يختار الذكاء الكليشة الأقرب لطلب الزبون ليرسلها أو يعرضها للموظف بنقرة واحدة.
            </p>
            <div className="p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-2xl text-xs text-blue-200">
              ✓ كافة الكلايش الـ 51 من الصفوف الـ 6 مفهرسة تلقائياً داخل محرك الذكاء ARES.
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-[#141926] border border-gray-800 rounded-3xl p-5 space-y-4 text-right">
            <h2 className="text-sm font-bold text-white">إعدادات الذكاء والمساعد</h2>

            {/* AI Active toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <div>
                <span className="text-xs font-semibold text-gray-200 block">تشغيل الذكاء في التطبيق</span>
                <span className="text-[10px] text-gray-400">تحليل الرسائل والبصمات تلقائياً</span>
              </div>
              <button
                type="button"
                onClick={() => setAiActive(!aiActive)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  aiActive ? "bg-blue-600 justify-end" : "bg-gray-700 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* AI Auto Reply toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <div>
                <span className="text-xs font-semibold text-gray-200 block">الرد الآلي التلقائي (Auto Reply)</span>
                <span className="text-[10px] text-gray-400">إرسال الرد للزبون فوراً بدون انتظار الموظف</span>
              </div>
              <button
                type="button"
                onClick={() => setAiAutoReply(!aiAutoReply)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  aiAutoReply ? "bg-emerald-600 justify-end" : "bg-gray-700 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* System Prompt */}
            <div className="space-y-1.5 pt-2 border-t border-gray-800">
              <span className="text-xs text-gray-300 font-semibold block">برومبت المساعد (تعليمات النظام):</span>
              <textarea
                rows={4}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full bg-[#1b2232] border border-gray-700 rounded-2xl p-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500 leading-relaxed text-right"
              />
            </div>

            <button
              onClick={handleSaveAiSettings}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
            >
              حفظ إعدادات المساعد
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
