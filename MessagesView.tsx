"use client";

import React, { useState } from "react";
import { ConversationType, LabelType } from "@/types";
import { Search, Menu, Keyboard, Pin, PinOff, Image as ImageIcon, Mic, Plus, PhoneCall, Wallet, Moon, Sun, Globe } from "lucide-react";
import { translations, Language } from "@/utils/translations";

interface MessagesViewProps {
  conversations: ConversationType[];
  labels: LabelType[];
  selectedLabel: string;
  onSelectLabel: (label: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectConversation: (conv: ConversationType) => void;
  onOpenControlCenter: () => void;
  onOpenNewChatModal: () => void;
  onTogglePin: (convId: number, currentPinned: boolean) => void;
  onAddNewLabel: () => void;
  isDark?: boolean;
  onToggleDarkMode?: () => void;
  currentLang?: Language;
  onToggleLanguage?: () => void;
  onOpenInstallModal?: () => void;
}

export default function MessagesView({
  conversations,
  labels,
  selectedLabel,
  onSelectLabel,
  searchQuery,
  onSearchChange,
  onSelectConversation,
  onOpenControlCenter,
  onOpenNewChatModal,
  onTogglePin,
  onAddNewLabel,
  isDark = true,
  onToggleDarkMode,
  currentLang = "ar",
  onToggleLanguage,
  onOpenInstallModal,
}: MessagesViewProps) {
  const [showDialpad, setShowDialpad] = useState(false);
  const t = translations[currentLang];

  // Helper to render label badge styling
  const getLabelStyle = (labelName: string) => {
    if (!isDark) {
      return "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200";
    }
    switch (labelName) {
      case "الرسائل":
        return "bg-slate-700/80 text-slate-100 border-slate-500";
      case "غير مقروء":
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
      case "بشري":
        return "bg-rose-950/80 text-rose-300 border-rose-800";
      case "VIP":
        return "bg-blue-950/80 text-blue-300 border-blue-700";
      case "احتيال":
        return "bg-red-950 text-red-400 border-red-800";
      case "أقساط ودفعات":
        return "bg-emerald-950 text-emerald-300 border-emerald-700";
      case "بانتظار التحويل":
        return "bg-amber-950 text-amber-300 border-amber-700";
      case "تم الشحن":
        return "bg-purple-950 text-purple-300 border-purple-700";
      case "شكوى":
        return "bg-pink-950 text-pink-300 border-pink-700";
      case "متابعة الذكاء":
        return "bg-cyan-950 text-cyan-300 border-cyan-700";
      default:
        return "bg-gray-800 text-gray-300 border-gray-700";
    }
  };

  const getDotColor = (labelName: string) => {
    switch (labelName) {
      case "بشري":
        return "bg-red-500";
      case "VIP":
        return "bg-blue-500";
      case "احتيال":
        return "bg-red-600";
      case "أقساط ودفعات":
        return "bg-emerald-500";
      case "بانتظار التحويل":
        return "bg-amber-500";
      case "تم الشحن":
        return "bg-purple-500";
      case "شكوى":
        return "bg-pink-500";
      case "متابعة الذكاء":
        return "bg-cyan-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      className={`flex flex-col h-full transition-colors duration-300 ${
        isDark ? "bg-[#0d1017] text-white" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      {/* Top Header */}
      <div
        className={`p-4 pb-2 border-b transition-colors ${
          isDark ? "border-gray-800/60 bg-[#121620]" : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenControlCenter}
              className={`p-2 rounded-xl active:scale-95 transition-all ${
                isDark
                  ? "text-gray-300 hover:text-white hover:bg-gray-800/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title={t.controlCenter}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Quick Dark/Light Toggle in Header */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className={`p-2 rounded-xl transition-colors ${
                  isDark
                    ? "text-amber-400 hover:bg-gray-800"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                title="تبديل المظهر"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Quick Language Toggle in Header */}
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                className={`px-2 py-1 rounded-xl text-xs font-bold transition-colors border ${
                  isDark
                    ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
                title="تغيير اللغة"
              >
                {currentLang === "ar" ? "EN" : "عربي"}
              </button>
            )}

            {/* Install On My Phone Button */}
            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                className="px-2.5 py-1 rounded-xl text-xs font-bold transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1 active:scale-95"
                title="تثبيت التطبيق على جهازك"
              >
                <span>📲</span>
                <span className="hidden sm:inline">تنصيب بجهازي</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-wide">{t.messages}</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
              ARES
            </span>
          </div>

          <button
            onClick={onOpenNewChatModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newCustomer}</span>
          </button>
        </div>

        {/* Search Bar matching screenshot */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full border rounded-2xl py-2.5 pr-10 pl-11 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-right ${
              isDark
                ? "bg-[#1a202c] border-gray-700/60 text-gray-200 placeholder-gray-400"
                : "bg-slate-100 border-slate-300 text-slate-800 placeholder-slate-400"
            }`}
          />
          <Search className="w-5 h-5 text-gray-400 absolute right-3.5 pointer-events-none" />
          <button
            type="button"
            onClick={() => setShowDialpad(!showDialpad)}
            className="absolute left-3 text-gray-400 hover:text-blue-500 transition-colors p-1"
            title="لوحة الأرقام"
          >
            <Keyboard className="w-5 h-5" />
          </button>
        </div>

        {/* Optional quick number filter dialpad */}
        {showDialpad && (
          <div
            className={`mt-2.5 p-2 rounded-xl border flex items-center justify-between text-xs ${
              isDark
                ? "bg-[#171c26] border-gray-700/60 text-gray-300"
                : "bg-slate-100 border-slate-300 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-400">{t.popularPrefixes}</span>
              <button
                onClick={() => onSearchChange("077")}
                className={`px-2 py-1 rounded transition-colors ${
                  isDark ? "bg-gray-800 hover:bg-blue-600 text-white" : "bg-white hover:bg-blue-600 hover:text-white border border-slate-300 shadow-xs"
                }`}
              >
                077
              </button>
              <button
                onClick={() => onSearchChange("078")}
                className={`px-2 py-1 rounded transition-colors ${
                  isDark ? "bg-gray-800 hover:bg-blue-600 text-white" : "bg-white hover:bg-blue-600 hover:text-white border border-slate-300 shadow-xs"
                }`}
              >
                078
              </button>
              <button
                onClick={() => onSearchChange("075")}
                className={`px-2 py-1 rounded transition-colors ${
                  isDark ? "bg-gray-800 hover:bg-blue-600 text-white" : "bg-white hover:bg-blue-600 hover:text-white border border-slate-300 shadow-xs"
                }`}
              >
                075
              </button>
            </div>
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="text-xs text-rose-500 hover:underline"
              >
                {t.clearSearch}
              </button>
            )}
          </div>
        )}

        {/* Labels Carousel - More than 10 labels! */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar scroll-smooth">
          {labels.map((lbl) => {
            const isSelected = selectedLabel === lbl.name;
            const hasDot = ["بشري", "VIP", "احتيال", "أقساط ودفعات", "بانتظار التحويل", "تم الشحن", "شكوى", "متابعة الذكاء"].includes(
              lbl.name
            );

            return (
              <button
                key={lbl.id}
                onClick={() => onSelectLabel(lbl.name)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? isDark
                      ? "bg-slate-200 text-slate-900 border-white shadow-md font-bold"
                      : "bg-blue-600 text-white border-blue-600 shadow-md font-bold"
                    : getLabelStyle(lbl.name)
                }`}
              >
                {hasDot && !isSelected && (
                  <span className={`w-2 h-2 rounded-full ${getDotColor(lbl.name)}`} />
                )}
                <span>{lbl.name}</span>
              </button>
            );
          })}

          <button
            onClick={onAddNewLabel}
            className="whitespace-nowrap px-2.5 py-1.5 rounded-full text-xs text-blue-500 border border-dashed border-blue-500/50 hover:bg-blue-500/10 transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.newLabel}</span>
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div
        className={`flex-1 overflow-y-auto divide-y ${
          isDark ? "divide-gray-800/40" : "divide-slate-200"
        }`}
      >
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                isDark ? "bg-gray-800/60 text-gray-500" : "bg-slate-200 text-slate-400"
              }`}
            >
              <Search className="w-8 h-8" />
            </div>
            <p className={`text-base font-medium ${isDark ? "text-gray-300" : "text-slate-700"}`}>
              {t.noConversations}
            </p>
            <p className="text-xs text-gray-400 mt-1">{t.tryDifferentSearch}</p>
            <button
              onClick={onOpenNewChatModal}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
            >
              {t.addCustomerBtn}
            </button>
          </div>
        ) : (
          conversations.map((conv) => {
            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`group flex items-center gap-3.5 px-4 py-3.5 cursor-pointer transition-colors relative ${
                  isDark ? "hover:bg-[#151b27]" : "hover:bg-slate-100"
                }`}
              >
                {/* Avatar matching screenshot */}
                <div className="relative shrink-0">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner"
                    style={{ backgroundColor: conv.avatarColor || "#2563eb" }}
                  >
                    {conv.customerName ? conv.customerName.charAt(0).toUpperCase() : "•"}
                  </div>
                  {!conv.isRead && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 border-2 border-[#0d1017] rounded-full" />
                  )}
                  {conv.isPinned && (
                    <span className="absolute -bottom-1 -left-1 w-4 h-4 bg-amber-500/90 text-black rounded-full flex items-center justify-center text-[9px] shadow">
                      📌
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 truncate">
                      <h3
                        className={`text-sm font-semibold truncate ${
                          isDark ? "text-gray-100" : "text-slate-900"
                        }`}
                      >
                        {conv.customerName}
                      </h3>
                      {conv.remainingAmount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          قسط: {conv.remainingAmount.toLocaleString()} {conv.currency}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  {/* Message Preview matching screenshot */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1.5 truncate max-w-[80%]">
                      {conv.lastMessageType === "image" ? (
                        <span className="flex items-center gap-1 text-sky-400">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>صورة</span>
                        </span>
                      ) : conv.lastMessageType === "voice" ? (
                        <span className="flex items-center gap-1 text-purple-400 font-medium">
                          <Mic className="w-3.5 h-3.5" />
                          <span>{conv.lastMessage}</span>
                        </span>
                      ) : (
                        <span className={`truncate ${isDark ? "text-gray-300" : "text-slate-600"}`}>
                          {conv.lastMessage || t.startChat}
                        </span>
                      )}
                    </div>

                    {/* Pin button on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(conv.id, conv.isPinned);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-amber-400 transition-opacity"
                      title={conv.isPinned ? t.unpin : t.pin}
                    >
                      {conv.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Conversation Labels Pills */}
                  {conv.labels && conv.labels.length > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {conv.labels.slice(0, 3).map((l, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] px-1.5 py-0.2 rounded border ${
                            isDark
                              ? "bg-gray-800/80 text-gray-300 border-gray-700/60"
                              : "bg-slate-200 text-slate-700 border-slate-300"
                          }`}
                        >
                          {l}
                        </span>
                      ))}
                      {conv.labels.length > 3 && (
                        <span className="text-[9px] text-gray-500">
                          +{conv.labels.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
