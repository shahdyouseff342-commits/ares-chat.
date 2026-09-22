"use client";

import React, { useState } from "react";
import { AppSettingsType, EmployeeType } from "@/types";
import { translations, Language } from "@/utils/translations";
import {
  X,
  Sparkles,
  Sliders,
  FolderClosed,
  ChevronDown,
  ChevronLeft,
  Moon,
  Sun,
  MapPin,
  RefreshCw,
  Users2,
  Activity,
  UserCheck,
  Trash2,
  MessageSquareQuote,
  ShieldCheck,
  Server,
  LogOut,
  ChevronUp,
  Globe,
  Languages,
} from "lucide-react";

interface ControlCenterViewProps {
  settings: AppSettingsType;
  currentEmployee?: EmployeeType;
  currentLang?: Language;
  onClose: () => void;
  onNavigateTo: (screen: "voice_analysis" | "ai_assistant" | "templates" | "employees" | "server_api") => void;
  onOpenLocationModal: () => void;
  onOpenSyncStatusModal: () => void;
  onOpenContactCompareModal: () => void;
  onOpenPerformanceModal: () => void;
  onOpenCheckCustomerModal: () => void;
  onOpenPurgeModal: () => void;
  onToggleDarkMode: () => void;
  onToggleLanguage: () => void;
  onLogout: () => void;
}

export default function ControlCenterView({
  settings,
  currentEmployee,
  currentLang = "ar",
  onClose,
  onNavigateTo,
  onOpenLocationModal,
  onOpenSyncStatusModal,
  onOpenContactCompareModal,
  onOpenPerformanceModal,
  onOpenCheckCustomerModal,
  onOpenPurgeModal,
  onToggleDarkMode,
  onToggleLanguage,
  onLogout,
}: ControlCenterViewProps) {
  const t = translations[currentLang];
  const isDark = settings.darkMode ?? true;

  // Accordions state: 1: AI, 2: App & Diagnostics, 3: Accounts & Templates
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    ai: true,
    app: true,
    accounts: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className={`flex flex-col h-full overflow-y-auto p-4 space-y-4 transition-colors duration-300 ${
        isDark ? "bg-[#0a0d14] text-white" : "bg-[#f1f5f9] text-slate-900"
      }`}
    >
      {/* Top Header Card matching Screenshot 1 */}
      <div
        className={`border rounded-3xl p-5 shadow-xl relative transition-colors ${
          isDark
            ? "bg-[#1a1c29] border-gray-800/80 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-slate-200"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 left-4 p-2 rounded-full transition-colors ${
            isDark
              ? "bg-gray-800/60 hover:bg-gray-700 text-gray-300 hover:text-white"
              : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
          }`}
          title={t.back}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mt-1">
          <div>
            <h1 className="text-xl font-bold tracking-wide">{t.controlCenterTitle}</h1>
            <p className={`text-sm font-semibold mt-0.5 ${isDark ? "text-gray-300" : "text-slate-600"}`}>
              {currentEmployee?.name || "salih 2"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-semibold border ${
                isDark
                  ? "bg-purple-900/60 border-purple-700/60 text-purple-200"
                  : "bg-purple-100 border-purple-300 text-purple-800"
              }`}
            >
              {currentEmployee?.role || t.admin}
            </span>
          </div>
        </div>

        <p className={`text-xs mt-4 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
          {t.selectSectionTools}
        </p>
      </div>

      {/* Accordion 1: الذكاء الاصطناعي (المساعد وتحليل البصمات) - badge 2 */}
      <div
        className={`border rounded-3xl overflow-hidden shadow-lg transition-all ${
          isDark
            ? "bg-[#141724] border-purple-900/30"
            : "bg-white border-purple-200 shadow-purple-50"
        }`}
      >
        <button
          onClick={() => toggleSection("ai")}
          className={`w-full flex items-center justify-between p-4 transition-colors ${
            isDark
              ? "bg-[#181b2a] hover:bg-[#1e2235]"
              : "bg-purple-50/50 hover:bg-purple-50 text-slate-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow ${
                isDark
                  ? "bg-purple-950/70 border-purple-700/50 text-purple-300"
                  : "bg-purple-100 border-purple-300 text-purple-700"
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h2 className="text-sm font-bold">{t.aiSection}</h2>
              <p className={`text-[11px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                {t.aiSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                isDark ? "bg-purple-900/50 text-purple-300" : "bg-purple-200 text-purple-800"
              }`}
            >
              2
            </span>
            {openSections.ai ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>

        {openSections.ai && (
          <div
            className={`p-3 space-y-2 border-t ${
              isDark ? "bg-[#121520] border-gray-800/60" : "bg-slate-50 border-slate-200"
            }`}
          >
            {/* تحليل البصمات */}
            <button
              onClick={() => onNavigateTo("voice_analysis")}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-right group ${
                isDark
                  ? "bg-[#191d2c] hover:bg-[#202538] border-gray-800/80"
                  : "bg-white hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div>
                <h3 className="text-xs font-bold group-hover:text-purple-500 transition-colors">
                  {t.voiceAnalysisTool}
                </h3>
                <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  {t.voiceAnalysisDesc}
                </p>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
            </button>

            {/* المساعد الذكي */}
            <button
              onClick={() => onNavigateTo("ai_assistant")}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-right group ${
                isDark
                  ? "bg-[#191d2c] hover:bg-[#202538] border-gray-800/80"
                  : "bg-white hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div>
                <h3 className="text-xs font-bold group-hover:text-purple-500 transition-colors">
                  {t.aiAssistantTool}
                </h3>
                <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  {t.aiAssistantDesc}
                </p>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
            </button>
          </div>
        )}
      </div>

      {/* Accordion 2: التطبيق والفحص (الإعدادات والمزامنة والتشخيص) - badge 7 matching Screenshot 8 */}
      <div
        className={`border rounded-3xl overflow-hidden shadow-lg transition-all ${
          isDark
            ? "bg-[#121a24] border-cyan-900/30"
            : "bg-white border-cyan-200 shadow-cyan-50"
        }`}
      >
        <button
          onClick={() => toggleSection("app")}
          className={`w-full flex items-center justify-between p-4 transition-colors ${
            isDark
              ? "bg-[#14202d] hover:bg-[#192738]"
              : "bg-cyan-50/50 hover:bg-cyan-50 text-slate-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow ${
                isDark
                  ? "bg-cyan-950/70 border-cyan-700/50 text-cyan-300"
                  : "bg-cyan-100 border-cyan-300 text-cyan-700"
              }`}
            >
              <Sliders className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h2 className="text-sm font-bold">{t.appAndDiagnostics}</h2>
              <p className={`text-[11px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                {t.appAndDiagnosticsSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                isDark ? "bg-cyan-900/50 text-cyan-300" : "bg-cyan-200 text-cyan-800"
              }`}
            >
              8
            </span>
            {openSections.app ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>

        {openSections.app && (
          <div
            className={`p-3 space-y-2 border-t ${
              isDark ? "bg-[#0e1620] border-gray-800/60" : "bg-slate-50 border-slate-200"
            }`}
          >
            {/* 1. المظهر (Dark / Light Mode Toggle) - WORKING! */}
            <div
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                isDark
                  ? "bg-[#141f2c] border-gray-800/80"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    isDark ? "bg-gray-800 text-amber-400" : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-xs font-bold">{t.appearance}</h3>
                  <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    {isDark ? "الوضع الداكن نشط (انقر للتبديل للفاتح)" : "Light mode active (Click for dark)"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleDarkMode}
                className={`w-14 h-7 flex items-center rounded-full p-1 transition-all shadow-inner ${
                  isDark ? "bg-blue-600 justify-end" : "bg-amber-400 justify-start"
                }`}
                title="تبديل المظهر"
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center text-[10px]">
                  {isDark ? "🌙" : "☀️"}
                </div>
              </button>
            </div>

            {/* 2. زر تغيير اللغة (Language Toggle: Arabic / English) - WORKING! */}
            <div
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                isDark
                  ? "bg-[#141f2c] border-gray-800/80"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    isDark ? "bg-blue-950 text-blue-300 border border-blue-800" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Languages className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold">{t.language}</h3>
                  <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    {currentLang === "ar" ? "اللغة الحالية: العربية (AR)" : "Current: English (EN)"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleLanguage}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1"
                title="تغيير اللغة"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{currentLang === "ar" ? "English" : "العربية"}</span>
              </button>
            </div>

            {/* 3. موقع المحل */}
            <button
              onClick={onOpenLocationModal}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-right group ${
                isDark
                  ? "bg-[#141f2c] hover:bg-[#1b2a3b] border-gray-800/80"
                  : "bg-white hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    isDark ? "bg-blue-950 text-blue-300 border-blue-800" : "bg-blue-100 text-blue-700 border-blue-200"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold group-hover:text-cyan-400 transition-colors">
                    {t.storeLocation}
                  </h3>
                  <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    {settings.shopLocation || "تعديل بيانات وموقع النشاط"}
                  </p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
            </button>

            {/* 4. حالة التحميل */}
            <button
              onClick={onOpenSyncStatusModal}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-right group ${
                isDark
                  ? "bg-[#141f2c] hover:bg-[#1b2a3b] border-gray-800/80"
                  : "bg-white hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    isDark ? "bg-cyan-950 text-cyan-300 border-cyan-800" : "bg-cyan-100 text-cyan-700 border-cyan-200"
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold group-hover:text-cyan-400 transition-colors">
                    {t.syncStatus}
                  </h3>
                  <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    {t.syncStatusDesc}
                  </p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
            </button>

            {/* 5. مقارنة الكونتاكت */}
            <button
              onClick={onOpenContactCompareModal}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-right group ${
                isDark
                  ? "bg-[#141f2c] hover:bg-[#1b2a3b] border-gray-800/80"
                  : "bg-white hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    isDark ? "bg-teal-950 text-teal-300 border-teal-800" : "bg-teal-100 text-teal-700 border-teal-200"
                  }`}
                >
                  <Users2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold group-hover:text-cyan-400 transition-colors">
                    {t.contactCompare}
                  </h3>
                  <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    {t.contactCompareDesc}
                  </p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
            </button>

            {/* 6. مراقبة الأداء */}
            <button
              onClick={onOpenPerformanceModal}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-right group ${
                isDark
                  ? "bg-[#141f2c] hover:bg-[#1b2a3b] border-gray-800/80"
                  : "bg-white hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    isDark ? "bg-indigo-950 text-indigo-300 border-indigo-800" : "bg-indigo-100 text-indigo-700 border-indigo-200"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold group-hover:text-cyan-400 transition-colors">
                    {t.performanceMonitor}
                  </h3>
                  <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    {t.performanceMonitorDesc}
                  </p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
            </button>

            {/* 7. فحص بيانات زبون */}
            <button
              onClick={onOpenCheckCustomerModal}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-right group ${
                isDark
                  ? "bg-[#141f2c] hover:bg-[#1b2a3b] border-gray-800/80"
                  : "bg-white hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    isDark ? "bg-sky-950 text-sky-300 border-sky-800" : "bg-sky-100 text-sky-700 border-sky-200"
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold group-hover:text-cyan-400 transition-colors">
                    {t.checkCustomer}
                  </h3>
                  <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    {t.checkCustomerDesc}
                  </p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
            </button>

            {/* 8. مسح البيانات */}
            <button
              onClick={onOpenPurgeModal}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-right group ${
                isDark
                  ? "bg-[#261317] hover:bg-[#33171d] border-rose-900/60 text-rose-300"
                  : "bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    isDark ? "bg-rose-950 text-rose-300 border-rose-800" : "bg-rose-100 text-rose-700 border-rose-200"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold">{t.purgeData}</h3>
                  <p className={`text-[10px] ${isDark ? "text-rose-400/80" : "text-rose-600/80"}`}>
                    {t.purgeDataDesc}
                  </p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Accordion 3: الحسابات والكلايش (المستخدمون والردود المحفوظة) - badge 3 */}
      <div
        className={`border rounded-3xl overflow-hidden shadow-lg transition-all ${
          isDark
            ? "bg-[#121c1a] border-emerald-900/30"
            : "bg-white border-emerald-200 shadow-emerald-50"
        }`}
      >
        <button
          onClick={() => toggleSection("accounts")}
          className={`w-full flex items-center justify-between p-4 transition-colors ${
            isDark
              ? "bg-[#142320] hover:bg-[#1a2e2a]"
              : "bg-emerald-50/50 hover:bg-emerald-50 text-slate-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow ${
                isDark
                  ? "bg-emerald-950/70 border-emerald-700/50 text-emerald-300"
                  : "bg-emerald-100 border-emerald-300 text-emerald-700"
              }`}
            >
              <FolderClosed className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h2 className="text-sm font-bold">{t.accountsAndTemplates}</h2>
              <p className={`text-[11px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                {t.accountsAndTemplatesSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                isDark ? "bg-emerald-900/50 text-emerald-300" : "bg-emerald-200 text-emerald-800"
              }`}
            >
              3
            </span>
            {openSections.accounts ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>

        {openSections.accounts && (
          <div
            className={`p-3 space-y-2 border-t ${
              isDark ? "bg-[#0e1715] border-gray-800/60" : "bg-slate-50 border-slate-200"
            }`}
          >
            {/* الكلايش الجاهزة */}
            <button
              onClick={() => onNavigateTo("templates")}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-right group ${
                isDark
                  ? "bg-[#14211e] hover:bg-[#1b2d29] border-gray-800/80"
                  : "bg-white hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    isDark ? "bg-emerald-950 text-emerald-300 border-emerald-800" : "bg-emerald-100 text-emerald-700 border-emerald-200"
                  }`}
                >
                  <MessageSquareQuote className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold group-hover:text-emerald-500 transition-colors">
                    {t.templatesTool}
                  </h3>
                  <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    {t.templatesDesc}
                  </p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
            </button>

            {/* إدارة الحسابات وربط الموظفين */}
            <button
              onClick={() => onNavigateTo("employees")}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-right group ${
                isDark
                  ? "bg-[#14211e] hover:bg-[#1b2d29] border-gray-800/80"
                  : "bg-white hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    isDark ? "bg-teal-950 text-teal-300 border-teal-800" : "bg-teal-100 text-teal-700 border-teal-200"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold group-hover:text-emerald-500 transition-colors">
                    {t.employeeAccounts}
                  </h3>
                  <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    {t.employeeAccountsDesc}
                  </p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
            </button>

            {/* ربط السيرفر والـ API */}
            <button
              onClick={() => onNavigateTo("server_api")}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-right group ${
                isDark
                  ? "bg-[#14211e] hover:bg-[#1b2d29] border-gray-800/80"
                  : "bg-white hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    isDark ? "bg-cyan-950 text-cyan-300 border-cyan-800" : "bg-cyan-100 text-cyan-700 border-cyan-200"
                  }`}
                >
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold group-hover:text-emerald-500 transition-colors">
                    {t.serverApiWhatsapp}
                  </h3>
                  <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    {t.serverApiWhatsappDesc}
                  </p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
            </button>

            {/* تسجيل الخروج */}
            <button
              onClick={onLogout}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-right group ${
                isDark
                  ? "bg-[#1c1819] hover:bg-[#282123] border-rose-900/40 text-rose-300"
                  : "bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    isDark ? "bg-rose-950 text-rose-300 border-rose-800" : "bg-rose-100 text-rose-700 border-rose-200"
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold">{t.logout}</h3>
                  <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    {t.logoutDesc} ({currentEmployee?.name || "salih 2"})
                  </p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="py-6 text-center">
        <p className={`text-xs font-bold tracking-widest uppercase ${isDark ? "text-gray-500" : "text-slate-400"}`}>
          ARES Chat
        </p>
        <p className={`text-[10px] mt-0.5 ${isDark ? "text-gray-600" : "text-slate-500"}`}>
          نظام إدارة الرسائل والأقساط والدفعات الذكي
        </p>
      </div>
    </div>
  );
}
