"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  User,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface CallModalProps {
  customerName: string;
  customerPhone: string;
  onEndCall: () => void;
}

export function CallModal({ customerName, customerPhone, onEndCall }: CallModalProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<"connecting" | "active">("connecting");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    // Simulate connection after 2 seconds
    const connectTimer = setTimeout(() => {
      setCallStatus("active");
    }, 2200);

    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (callStatus === "active") {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callStatus]);

  const formatSeconds = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-[#0e131d] border border-gray-700/80 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Call Status Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/60 text-blue-300 text-xs mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span>{callStatus === "connecting" ? "جاري الاتصال بالعميل..." : "مكالمة جارية عبر شبكة VoIP"}</span>
        </div>

        {/* Customer Avatar with pulsating ring */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-gray-800">
            {customerName ? customerName.charAt(0).toUpperCase() : "C"}
          </div>
          {callStatus === "active" && (
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-60" />
          )}
        </div>

        {/* Customer Name and Phone */}
        <h2 className="text-xl font-bold text-white mb-1">{customerName}</h2>
        <p className="text-sm text-gray-400 font-mono tracking-wider mb-3" dir="ltr">
          {customerPhone}
        </p>

        {/* Call Timer / Audio waves */}
        <div className="mb-8">
          {callStatus === "connecting" ? (
            <p className="text-xs text-amber-400 animate-pulse">يرن الآن...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-mono font-bold text-emerald-400">
                {formatSeconds(callDuration)}
              </p>
              {/* Voice waves visualizer */}
              <div className="flex items-center justify-center gap-1 h-6">
                {[30, 75, 45, 90, 60, 100, 50, 80, 40, 70, 95, 30].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-emerald-400 rounded-full animate-pulse"
                    style={{
                      height: `${isMuted ? 15 : h}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* In-Call Controls */}
        <div className="grid grid-cols-3 gap-4 w-full mb-6">
          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs transition-colors ${
              isMuted
                ? "bg-rose-950/80 border border-rose-700 text-rose-300"
                : "bg-gray-800/80 hover:bg-gray-700 text-gray-200"
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5" />}
            <span className="text-[10px]">{isMuted ? "مكتوم" : "كتم"}</span>
          </button>

          {/* Speaker */}
          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs transition-colors ${
              isSpeaker
                ? "bg-blue-950/80 border border-blue-700 text-blue-300"
                : "bg-gray-800/80 hover:bg-gray-700 text-gray-200"
            }`}
          >
            {isSpeaker ? <Volume2 className="w-5 h-5 text-blue-400" /> : <VolumeX className="w-5 h-5" />}
            <span className="text-[10px]">مكبر الصوت</span>
          </button>

          {/* AI Live Transcribe / Monitor */}
          <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/50 flex flex-col items-center justify-center gap-1.5 text-xs text-purple-300">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-[10px]">تحليل ذكي</span>
          </div>
        </div>

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-all"
          title="إنهاء المكالمة"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
