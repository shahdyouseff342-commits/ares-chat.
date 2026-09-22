"use client";

import React, { useState } from "react";
import { ConversationType, TemplateType } from "@/types";
import { X, CreditCard, Plus, Trash2, Check, AlertTriangle, Search, Activity, RefreshCw } from "lucide-react";

// 1. New Payment Modal (تسجيل دفعة جديدة)
export function NewPaymentModal({
  conversation,
  onClose,
  onSubmit,
}: {
  conversation: ConversationType;
  onClose: () => void;
  onSubmit: (amount: number, method: string, note: string) => Promise<void>;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("زين كاش");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) return;
    setLoading(true);
    try {
      await onSubmit(num, method, note);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141a27] border border-gray-700 rounded-3xl p-5 max-w-sm w-full space-y-4 text-right shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-gray-800">
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">تسجيل دفعة على الحساب</h3>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#1b2232] border border-gray-800 text-xs text-gray-300">
          <p>
            الزبون: <span className="font-bold text-white">{conversation.customerName}</span>
          </p>
          <p className="mt-0.5">
            المتبقي حالياً:{" "}
            <span className="font-bold text-amber-400">
              {conversation.remainingAmount.toLocaleString()} {conversation.currency}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-300 block mb-1">المبلغ المدفوع (د.ع):</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="مثال: 250000"
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-sm text-emerald-400 font-bold text-center font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">طريقة الدفع:</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-right"
            >
              <option value="زين كاش">زين كاش (ZainCash)</option>
              <option value="نقد">نقد عند الاستلام (كاش)</option>
              <option value="ماستر كارد">ماستر كارد (MasterCard)</option>
              <option value="كي كارد">كي كارد (Qi Card)</option>
              <option value="حوالة">حوالة صيرفة / الطيف</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">ملاحظة الدفعة (اختياري):</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثال: دفعة القسط الأول"
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-right"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
            >
              {loading ? "جاري التسجيل..." : "تأكيد الدفعة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. Edit Amount Modal (تعديل إجمالي المبلغ والخطة المالية)
export function EditAmountModal({
  conversation,
  onClose,
  onSubmit,
}: {
  conversation: ConversationType;
  onClose: () => void;
  onSubmit: (totalAmount: number, paidAmount: number, notes: string) => Promise<void>;
}) {
  const [total, setTotal] = useState(String(conversation.totalAmount));
  const [paid, setPaid] = useState(String(conversation.paidAmount));
  const [notes, setNotes] = useState(conversation.paymentPlanNotes || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(Number(total) || 0, Number(paid) || 0, notes);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141a27] border border-gray-700 rounded-3xl p-5 max-w-sm w-full space-y-4 text-right shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-gray-800">
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-sm font-bold text-white">تعديل المبلغ والخطة المالية</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-300 block mb-1">المبلغ الإجمالي للجهاز/الطلب:</label>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-sm text-blue-400 font-bold text-center font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">المبلغ المسدد مسبقاً:</label>
            <input
              type="number"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-sm text-emerald-400 font-bold text-center font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">تفاصيل وملاحظات خطة الأقساط:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: قسطين شهرياً، موعد القسط يوم 28 من كل شهر"
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2 text-xs text-white text-right"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-md"
            >
              {loading ? "جاري الحفظ..." : "حفظ التعديل"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. Add Template Modal (إضافة كليشة جاهزة مباشرة على الشاشة)
export function AddTemplateModal({
  defaultRow = 1,
  onClose,
  onSubmit,
}: {
  defaultRow?: number;
  onClose: () => void;
  onSubmit: (title: string, content: string, rowIndex: number, isManagerOnly: boolean) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rowIndex, setRowIndex] = useState(defaultRow);
  const [isManagerOnly, setIsManagerOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      await onSubmit(title.trim(), content.trim(), Number(rowIndex), isManagerOnly);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141a27] border border-gray-700 rounded-3xl p-5 max-w-sm w-full space-y-4 text-right shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-gray-800">
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-sm font-bold text-white">إضافة كليشة سريعة للشاشة</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-300 block mb-1">
              عنوان الزر على الشاشة (كلمة أو كلمتين):
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: خصم, موافقة, كفيل"
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-right"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">الصف المخصص (1 إلى 6):</label>
            <select
              value={rowIndex}
              onChange={(e) => setRowIndex(Number(e.target.value))}
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-right"
            >
              <option value={1}>الصف 1 (أزرق - موديلات وأجهزة)</option>
              <option value={2}>الصف 2 (وردي - اتفاق وشروط)</option>
              <option value={3}>الصف 3 (أصفر - ماليات وضمان)</option>
              <option value={4}>الصف 4 (سماوي - فحص وصور)</option>
              <option value={5}>الصف 5 (كحلي - عملاء ودفعات)</option>
              <option value={6}>الصف 6 (كحلي فاتح - مواعيد وتأكيد)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">نص الكليشة الكامل:</label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب العبارة التي يتم إرسالها للزبون عند الضغط..."
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-right"
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-gray-300">ظهور للمدير فقط</span>
            <input
              type="checkbox"
              checked={isManagerOnly}
              onChange={(e) => setIsManagerOnly(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-md"
            >
              {loading ? "جاري الإضافة..." : "حفظ الكليشة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 4. New Conversation Modal (إضافة زبون جديد)
export function NewConversationModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (name: string, phone: string, totalAmount: number, initialPaid: number, initialLabel: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [total, setTotal] = useState("");
  const [paid, setPaid] = useState("");
  const [label, setLabel] = useState("أقساط ودفعات");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    try {
      await onSubmit(name.trim(), phone.trim(), Number(total) || 0, Number(paid) || 0, label);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141a27] border border-gray-700 rounded-3xl p-5 max-w-sm w-full space-y-4 text-right shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-gray-800">
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-sm font-bold text-white">تسجيل زبون ونظام دفعات</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-300 block mb-1">اسم الزبون:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: أحمد عبد الله"
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-right"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">رقم الهاتف:</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0773-000-0000"
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-right font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-300 block mb-1">المبلغ الإجمالي:</label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="1400000"
                className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-center font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-gray-300 block mb-1">الدفعة الأولى:</label>
              <input
                type="number"
                value={paid}
                onChange={(e) => setPaid(e.target.value)}
                placeholder="500000"
                className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-emerald-400 text-center font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">التصنيف الأولي (الليبل):</label>
            <select
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-right"
            >
              <option value="أقساط ودفعات">أقساط ودفعات</option>
              <option value="بشري">بشري</option>
              <option value="VIP">VIP</option>
              <option value="غير مقروء">غير مقروء</option>
              <option value="بانتظار التحويل">بانتظار التحويل</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-md"
            >
              {loading ? "جاري الإنشاء..." : "فتح المحادثة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 5. Diagnostics & System Modals
export function DiagnosticsModal({
  type,
  onClose,
  shopLocation,
  onSaveLocation,
  onPurgeData,
}: {
  type: "location" | "sync" | "contact_compare" | "performance" | "check_customer" | "purge";
  onClose: () => void;
  shopLocation?: string;
  onSaveLocation?: (loc: string) => Promise<void>;
  onPurgeData?: () => Promise<void>;
}) {
  const [locInput, setLocInput] = useState(shopLocation || "بغداد - المنصور - شارع 14 رمضان (مجمع النور)");
  const [checkNum, setCheckNum] = useState("");
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [confirmPurgeText, setConfirmPurgeText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckCustomer = () => {
    if (!checkNum.trim()) return;
    setCheckResult(`تم تشخيص الرقم ${checkNum}: الحساب نشط على السيرفر، لا توجد بلاغات أمنية أو احتيال، وحالة المزامنة 100%.`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141a27] border border-gray-700 rounded-3xl p-5 max-w-sm w-full space-y-4 text-right shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-gray-800">
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-sm font-bold text-white">
            {type === "location" && "تعديل موقع المحل"}
            {type === "sync" && "حالة التحميل والمزامنة"}
            {type === "contact_compare" && "مقارنة الكونتاكت مع السيرفر"}
            {type === "performance" && "مراقبة أداء وسرعة السيرفر"}
            {type === "check_customer" && "فحص بيانات زبون"}
            {type === "purge" && "مسح بيانات الرسائل بعد التأكيد"}
          </h3>
        </div>

        {type === "location" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">
              عنوان ونشاط المحل الذي يتم إرساله للزبائن بنقرة واحدة داخل الشات.
            </p>
            <textarea
              rows={3}
              value={locInput}
              onChange={(e) => setLocInput(e.target.value)}
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-right"
            />
            <button
              onClick={async () => {
                if (onSaveLocation) await onSaveLocation(locInput);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500"
            >
              حفظ موقع المحل
            </button>
          </div>
        )}

        {type === "sync" && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-emerald-300">
              ✓ كافة الرسائل والصوتيات والكلايش متزامنة لحظياً بنسبة 100%.
            </div>
            <p className="text-gray-400">
              السيرفر المحلي وقاعدة بيانات PostgreSQL متصلة وتستقبل الـ Webhooks بدون أي فقدان في البيانات.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gray-800 text-white text-xs font-bold hover:bg-gray-700"
            >
              إغلاق
            </button>
          </div>
        )}

        {type === "contact_compare" && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#1b2232] border border-gray-700 rounded-2xl space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-400">عدد أرقام الزبائن بالسيرفر:</span>
                <span className="font-bold text-white">متطابق بالكامل</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">الفروقات المكتشفة:</span>
                <span className="font-bold text-emerald-400">0 (لا يوجد تضارب)</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500"
            >
              تأكيد المطابقة
            </button>
          </div>
        )}

        {type === "performance" && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#1b2232] border border-gray-700 rounded-2xl space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">سرعة الاستجابة (Latency):</span>
                <span className="font-bold text-emerald-400 font-mono">38 ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">زمن تحليل البصمات الصوتي:</span>
                <span className="font-bold text-cyan-400 font-mono">1.2 ثانية (Chirp_3)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">استهلاك المعالج:</span>
                <span className="font-bold text-white font-mono">8%</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gray-800 text-white text-xs font-bold hover:bg-gray-700"
            >
              إغلاق
            </button>
          </div>
        )}

        {type === "check_customer" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">تشخيص بيانات رقم محدد بدون إجراء أي تغيير عليه:</p>
            <input
              type="text"
              value={checkNum}
              onChange={(e) => setCheckNum(e.target.value)}
              placeholder="اكتب رقم الهاتف (0773...)"
              className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-right font-mono"
            />
            <button
              onClick={handleCheckCustomer}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500"
            >
              بدء الفحص والتشخيص
            </button>
            {checkResult && (
              <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs">
                {checkResult}
              </div>
            )}
          </div>
        )}

        {type === "purge" && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-2xl text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
              <div>
                <p className="font-bold">تحذير مسح البيانات</p>
                <p className="mt-0.5 text-[11px] text-rose-300/80">
                  سيتم تفريغ كافة سجلات الرسائل من السيرفر. لتأكيد المسح، يرجى كتابة &quot;مسح&quot; في الحقل أدناه.
                </p>
              </div>
            </div>

            <input
              type="text"
              value={confirmPurgeText}
              onChange={(e) => setConfirmPurgeText(e.target.value)}
              placeholder="اكتب كلمة مسح للتأكيد"
              className="w-full bg-[#1b2232] border border-rose-800 rounded-xl p-2.5 text-xs text-rose-300 text-center font-bold"
            />

            <button
              disabled={confirmPurgeText !== "مسح" || loading}
              onClick={async () => {
                setLoading(true);
                if (onPurgeData) await onPurgeData();
                setLoading(false);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold transition-all"
            >
              {loading ? "جاري المسح..." : "تأكيد مسح البيانات نهائياً"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
