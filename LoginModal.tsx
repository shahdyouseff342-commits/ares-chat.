"use client";

import React, { useState } from "react";
import { EmployeeType } from "@/types";
import { Mail, Phone, Lock, LogIn, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface LoginModalProps {
  onSuccess: (employee: EmployeeType) => void;
  lang?: "ar" | "en";
}

export function LoginModal({ onSuccess, lang = "ar" }: LoginModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isAr = lang === "ar";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg(isAr ? "يرجى كتابة البريد/الرقم وكلمة المرور" : "Please provide identifier and password");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.employee) {
        onSuccess(data.employee);
      } else {
        setErrorMsg(data.error || (isAr ? "فشل تسجيل الدخول" : "Login failed"));
      }
    } catch (err) {
      setErrorMsg(isAr ? "حدث خطأ بالاتصال بالسيرفر" : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121622] border border-gray-700/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Top Glow */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-600/30 mb-3 border border-white/20">
            ⚡
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {isAr ? "تسجيل الدخول إلى ARES Chat" : "Sign In to ARES Chat"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isAr
              ? "نظام إدارة المحادثات وتحليل البصمات والدفعات"
              : "Intelligent messaging, voice analysis & installments"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          {/* Email or Phone */}
          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold text-gray-300 block">
              {isAr ? "البريد الإلكتروني أو رقم الهاتف:" : "Email or Phone Number:"}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isAr ? "salih@ares.app أو 0770-112-3344" : "salih@ares.app or 0770-112-3344"}
                className="w-full bg-[#1a2130] border border-gray-700/80 rounded-2xl py-2.5 px-3 pr-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
                dir="ltr"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold text-gray-300 block">
              {isAr ? "كلمة المرور:" : "Password:"}
            </label>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1a2130] border border-gray-700/80 rounded-2xl py-2.5 px-3 pr-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
                dir="ltr"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>
              {loading
                ? isAr
                  ? "جاري تسجيل الدخول..."
                  : "Signing in..."
                : isAr
                ? "دخول إلى النظام"
                : "Sign In"}
            </span>
          </button>
        </form>

        {/* Demo Accounts Quick-Click */}
        <div className="mt-5 pt-4 border-t border-gray-800/80 text-xs">
          <p className="text-[11px] text-gray-400 mb-2 font-semibold text-center">
            {isAr ? "حسابات تجريبية سريعة بنقرة واحدة:" : "Quick 1-Click Demo Accounts:"}
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("salih@ares.app", "123456")}
              className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 text-[11px] text-center border border-gray-700/60"
            >
              👑 <span className="font-bold">salih 2</span> (مدير)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("0771-554-9911", "123456")}
              className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 text-[11px] text-center border border-gray-700/60"
            >
              💼 <span className="font-bold">علي الكرخي</span> (مبيعات)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("zainab@ares.app", "123456")}
              className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 text-[11px] text-center border border-gray-700/60"
            >
              💳 <span className="font-bold">زينب محمد</span> (دفعات)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("0773-665-4422", "123456")}
              className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 text-[11px] text-center border border-gray-700/60"
            >
              🔧 <span className="font-bold">حيدر البصري</span> (دعم)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
