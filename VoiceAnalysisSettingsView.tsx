"use client";

import React, { useState } from "react";
import { AppSettingsType } from "@/types";
import {
  ArrowRight,
  RotateCw,
  Save,
  Volume2,
  Clock,
  Sparkles,
  Globe,
  Sliders,
  Code2,
  CheckCircle2,
} from "lucide-react";

interface VoiceAnalysisSettingsViewProps {
  settings: AppSettingsType;
  onBack: () => void;
  onSave: (newSettings: Partial<AppSettingsType>) => Promise<void>;
}

export default function VoiceAnalysisSettingsView({
  settings,
  onBack,
  onSave,
}: VoiceAnalysisSettingsViewProps) {
  // Local state initialized with user instructions:
  // 1. تفعيل تحليل البصمات: شغال (true)
  // 2. نطاق التشغيل: عام
  // 3. Profanity filter: مقفول (false)
  // 4. Automatic punctuation: شغال (true)
  const [voiceAnalysisEnabled, setVoiceAnalysisEnabled] = useState(
    settings.voiceAnalysisEnabled ?? true
  );
  const [voiceAnalysisScope, setVoiceAnalysisScope] = useState(
    settings.voiceAnalysisScope ?? "عام"
  );
  const [maxVoiceSeconds, setMaxVoiceSeconds] = useState(
    settings.maxVoiceSeconds ?? 60
  );
  const [phraseHints, setPhraseHints] = useState(
    settings.phraseHints ??
      "ايفون\nكلكسي\nجلgeneric\nاندرويد\nاس 25 اولترا\nآيفون\niPhone\nPro Max 13"
  );
  const [modelName, setModelName] = useState(settings.modelName || "chirp_3");
  const [languageCode, setLanguageCode] = useState(settings.languageCode || "ar-IQ");
  const [autoPunctuation, setAutoPunctuation] = useState(
    settings.autoPunctuation ?? true
  );
  const [profanityFilter, setProfanityFilter] = useState(
    settings.profanityFilter ?? false
  );
  const [providerOptionsJson, setProviderOptionsJson] = useState(
    settings.providerOptionsJson ||
      "{\n  \"sample_rate_hertz\": 16000,\n  \"encoding\": \"OGG_OPUS\",\n  \"enable_automatic_punctuation\": true\n}"
  );

  const [saving, setSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        voiceAnalysisEnabled,
        voiceAnalysisScope,
        maxVoiceSeconds: Number(maxVoiceSeconds),
        phraseHints,
        modelName,
        languageCode,
        autoPunctuation,
        profanityFilter,
        providerOptionsJson,
      });
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setVoiceAnalysisEnabled(true);
    setVoiceAnalysisScope("عام");
    setMaxVoiceSeconds(60);
    setAutoPunctuation(true);
    setProfanityFilter(false);
    setModelName("chirp_3");
    setLanguageCode("ar-IQ");
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0e14] text-white">
      {/* Top Header matching Screenshot 7 */}
      <div className="px-4 py-3 bg-[#111622] border-b border-gray-800 flex items-center justify-between shrink-0">
        <button
          onClick={handleResetDefaults}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          title="استعادة الافتراضي"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-gray-100">تحليل البصمات</h1>

        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          title="رجوع"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full pb-24">
        {/* Toast Alert */}
        {showSavedToast && (
          <div className="p-3 rounded-2xl bg-emerald-950 border border-emerald-600 text-emerald-300 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>تم حفظ الإعدادات بنجاح وتطبيقها على السيرفر!</span>
          </div>
        )}

        {/* Card 1: التحكم العام matching Screenshot 7 */}
        <div className="bg-[#141926] border border-gray-800/90 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-100">التحكم العام</h2>
              <p
                className={`text-xs mt-0.5 font-semibold ${
                  voiceAnalysisEnabled ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {voiceAnalysisEnabled ? "الخدمة نشطة الآن" : "الخدمة متوقفة الآن"}
              </p>
            </div>
            <div
              className={`p-2 rounded-2xl border ${
                voiceAnalysisEnabled
                  ? "bg-emerald-950/60 border-emerald-800 text-emerald-400"
                  : "bg-rose-950/60 border-rose-800 text-rose-400"
              }`}
            >
              <Volume2 className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            هذا الزر يطفي أو يشغل تحليل البصمات بالكامل من السيرفر.
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-gray-800/80">
            <span className="text-xs font-semibold text-gray-200">
              تفعيل تحليل البصمات
            </span>
            <button
              type="button"
              onClick={() => setVoiceAnalysisEnabled(!voiceAnalysisEnabled)}
              className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors ${
                voiceAnalysisEnabled ? "bg-blue-600 justify-end" : "bg-gray-700 justify-start"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        {/* Card 2: الحد الأعلى لمدة البصمة */}
        <div className="bg-[#141926] border border-gray-800/90 rounded-3xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-gray-100">الحد الأعلى لمدة البصمة</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            إذا خليتها 0 فمعناه بدون حد. غيرها إلى 30 أو 40 مثلاً إذا تريد تمنع البصمات الطويلة.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">عدد الثواني</span>
              <div className="flex items-center gap-1.5 font-bold text-base text-blue-400">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{maxVoiceSeconds}</span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={maxVoiceSeconds}
              onChange={(e) => setMaxVoiceSeconds(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        {/* Card 3: نطاق التشغيل (عام / فلترة) */}
        <div className="bg-[#141926] border border-gray-800/90 rounded-3xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-gray-100">نطاق التشغيل</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setVoiceAnalysisScope("عام")}
              className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                voiceAnalysisScope === "عام"
                  ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30"
                  : "bg-[#1a2130] border-gray-700 text-gray-300 hover:bg-gray-800"
              }`}
            >
              عام
            </button>
            <button
              type="button"
              onClick={() => setVoiceAnalysisScope("فلترة")}
              className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                voiceAnalysisScope === "فلترة"
                  ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30"
                  : "bg-[#1a2130] border-gray-700 text-gray-300 hover:bg-gray-800"
              }`}
            >
              فلترة
            </button>
          </div>
        </div>

        {/* Card 4: الكلمات المساعدة (Phrase hints) */}
        <div className="bg-[#141926] border border-gray-800/90 rounded-3xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-100">الكلمات المساعدة</h2>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            حط أسماء الأجهزة والمصطلحات المتكررة، كل كلمة أو عبارة بسطر.
          </p>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 mb-1 block">Phrase hints</span>
            <textarea
              rows={6}
              value={phraseHints}
              onChange={(e) => setPhraseHints(e.target.value)}
              className="w-full bg-[#1b2232] border border-gray-700/80 rounded-2xl p-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed text-right"
              placeholder="ايفون&#10;كلكسي&#10;اندرويد&#10;اس 25 اولترا"
            />
          </div>
        </div>

        {/* Card 5: إعدادات المودل matching Screenshot 8 */}
        <div className="bg-[#141926] border border-gray-800/90 rounded-3xl p-5 shadow-lg space-y-4">
          <div>
            <h2 className="text-sm font-bold text-gray-100">إعدادات المودل</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              هذا القسم آخر شيء: المودل، اللغة، وعناصر متقدمة إذا احتجتها.
            </p>
          </div>

          {/* Model Name */}
          <div className="space-y-1.5 pt-2 border-t border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>اسم المودل</span>
              <Volume2 className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-200 text-center font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Language Code */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>رمز اللغة</span>
              <Globe className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              value={languageCode}
              onChange={(e) => setLanguageCode(e.target.value)}
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-200 text-center font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Automatic punctuation toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-800">
            <span className="text-xs text-gray-300">Automatic punctuation</span>
            <button
              type="button"
              onClick={() => setAutoPunctuation(!autoPunctuation)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                autoPunctuation ? "bg-blue-600 justify-end" : "bg-gray-700 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Profanity filter toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-800">
            <div>
              <span className="text-xs text-gray-300 block">Profanity filter</span>
              <span className="text-[10px] text-gray-500">فلتر الألفاظ الخارجة</span>
            </div>
            <button
              type="button"
              onClick={() => setProfanityFilter(!profanityFilter)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                profanityFilter ? "bg-blue-600 justify-end" : "bg-gray-700 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Provider options JSON */}
          <div className="space-y-1.5 pt-2 border-t border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Provider options JSON</span>
              <Code2 className="w-4 h-4 text-gray-500" />
            </div>
            <textarea
              rows={4}
              value={providerOptionsJson}
              onChange={(e) => setProviderOptionsJson(e.target.value)}
              className="w-full bg-[#121620] border border-gray-800 rounded-xl p-2.5 text-[11px] text-blue-300 font-mono focus:outline-none focus:border-blue-500 leading-relaxed text-left"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Floating Bottom Save Button Bar matching Screenshot 7 & 8 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0d111a]/95 backdrop-blur-md border-t border-gray-800/80 z-40 max-w-2xl mx-auto">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "جاري الحفظ..." : "حفظ الإعدادات"}</span>
        </button>
      </div>
    </div>
  );
}
