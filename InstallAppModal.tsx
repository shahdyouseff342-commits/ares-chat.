"use client";

import React, { useState } from "react";
import {
  Download,
  Smartphone,
  Share2,
  Check,
  Copy,
  PlusSquare,
  QrCode,
  ShieldCheck,
  X,
  Sparkles,
} from "lucide-react";

interface InstallAppModalProps {
  onClose: () => void;
  phone?: string;
}

export function InstallAppModal({ onClose, phone = "+964 773 387 8591" }: InstallAppModalProps) {
  const [deviceType, setDeviceType] = useState<"android" | "iphone" | "pc">("android");
  const [copiedLink, setCopiedLink] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "https://ares-chat.app";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-[#121622] border border-gray-700/80 rounded-3xl p-5 shadow-2xl relative text-right overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">تثبيت ARES Chat على هاتفك</h3>
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Device selector tabs */}
        <div className="flex items-center gap-2 mt-4 p-1 bg-[#1a2130] rounded-2xl text-xs">
          <button
            onClick={() => setDeviceType("android")}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${
              deviceType === "android"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            أندرويد (Samsung / Xiaomi)
          </button>
          <button
            onClick={() => setDeviceType("iphone")}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${
              deviceType === "iphone"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            آيفون (iPhone / iOS)
          </button>
          <button
            onClick={() => setDeviceType("pc")}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${
              deviceType === "pc"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            كمبيوتر (PC / Chrome)
          </button>
        </div>

        {/* Installation Instructions */}
        <div className="mt-4 p-4 rounded-2xl bg-[#171d2b] border border-gray-800 text-xs space-y-3">
          {deviceType === "android" && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Download className="w-4 h-4" />
                <span>خطوات التثبيت كتطبيق مستقل (APK / PWA):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-gray-300 leading-relaxed pr-1">
                <li>افتح هذا الرابط في متصفح <strong className="text-white">Google Chrome</strong>.</li>
                <li>اضغط على القائمة (الثلاث نقاط <strong>⋮</strong>) في أعلى يمين المتصفح.</li>
                <li>اختر <strong className="text-emerald-300">"تثبيت التطبيق"</strong> أو <strong className="text-emerald-300">"إضافة إلى الشاشة الرئيسية" (Install app)</strong>.</li>
                <li>سيظهر تطبيق <strong>ARES Chat</strong> كأيقونة تطبيق كامل بدون شريط المتصفح ويعمل مع الواتساب والإشعارات تلقائياً!</li>
              </ol>
            </div>
          )}

          {deviceType === "iphone" && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <Share2 className="w-4 h-4" />
                <span>خطوات التثبيت على الآيفون (Safari):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-gray-300 leading-relaxed pr-1">
                <li>افتح الرابط في متصفح <strong className="text-white">Safari</strong>.</li>
                <li>اضغط على زر المشاركة بالأسفل (<strong className="text-blue-300">Share</strong> أيقونة المربع بسهم للأعلى).</li>
                <li>انزل للأسفل واختر <strong className="text-blue-300">"إضافة إلى الصفحة الرئيسية" (Add to Home Screen)</strong>.</li>
                <li>اضغط <strong className="text-white">"إضافة" (Add)</strong>، وسيتم تثبيته كتطبيق شاشة رئيسية مستقل.</li>
              </ol>
            </div>
          )}

          {deviceType === "pc" && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Download className="w-4 h-4" />
                <span>تثبيت على ويندوز / ماك (Chrome / Edge):</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                اضغط على أيقونة التثبيت <strong className="text-purple-300">Install</strong> التي تظهر في شريط العنوان أعلى المتصفح، وسيعمل كنافذة برنامج منفصل على سطح المكتب.
              </p>
            </div>
          )}
        </div>

        {/* Copy App Link */}
        <div className="mt-4 space-y-1.5">
          <span className="text-[11px] text-gray-400 font-semibold block">
            رابط التطبيق لفتحه على هاتفك:
          </span>
          <div className="flex items-center gap-2 bg-[#1a2130] border border-gray-700/80 rounded-2xl p-2.5 text-xs text-cyan-300 font-mono">
            <span className="flex-1 truncate text-left" dir="ltr">
              {currentUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="p-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              title="نسخ الرابط"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Linked WhatsApp Phone Status */}
        <div className="mt-4 p-3 rounded-2xl bg-emerald-950/50 border border-emerald-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-bold">رقم الواتساب المربوط:</span>
          </div>
          <span className="font-mono text-white font-bold" dir="ltr">{phone}</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
        >
          فهمت الخطوات ✓
        </button>
      </div>
    </div>
  );
}
