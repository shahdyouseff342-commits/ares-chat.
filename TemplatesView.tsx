"use client";

import React, { useState } from "react";
import { TemplateType } from "@/types";
import {
  ArrowRight,
  MoreVertical,
  Plus,
  Download,
  CloudCheck,
  EyeOff,
  Users,
  Lock,
  GripHorizontal,
  GripVertical,
  Palette,
  CheckCircle,
  FileBox,
  Rows,
  Layers,
  Edit,
  Trash2,
} from "lucide-react";

interface TemplatesViewProps {
  templates: TemplateType[];
  onBack: () => void;
  onOpenAddModal: (rowIndex?: number) => void;
  onEditTemplate: (tpl: TemplateType) => void;
  onDeleteTemplate: (id: number) => void;
}

export default function TemplatesView({
  templates,
  onBack,
  onOpenAddModal,
  onEditTemplate,
  onDeleteTemplate,
}: TemplatesViewProps) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Stats calculation
  const totalCount = templates.length;
  const managerOnlyCount = templates.filter((t) => t.isManagerOnly).length;
  const publicCount = totalCount - managerOnlyCount;
  const hiddenInChatCount = templates.filter((t) => t.isHiddenInChat).length;
  const uploadedCount = templates.filter((t) => t.isUploaded).length;
  const rowsCount = 6;
  const serverFilesCount = totalCount + 31; // Mock server assets

  // Group by rows 1 to 6
  const rows = [1, 2, 3, 4, 5, 6].map((rowNum) => {
    return {
      rowNum,
      items: templates.filter((t) => t.rowIndex === rowNum),
    };
  });

  const getRowColorDot = (r: number) => {
    switch (r) {
      case 1:
        return "bg-blue-400";
      case 2:
        return "bg-rose-500";
      case 3:
        return "bg-amber-400";
      case 4:
        return "bg-cyan-400";
      case 5:
        return "bg-indigo-400";
      case 6:
        return "bg-sky-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1017] text-white">
      {/* Header matching Screenshot 3 */}
      <div className="px-4 py-3 bg-[#131722] border-b border-gray-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            title="رجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-100">الكلايش الجاهزة</h1>
            <p className="text-[11px] text-gray-400">واجهة أنظف وترتيب أوضح</p>
          </div>
        </div>

        <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Main scrollable body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-20 max-w-4xl mx-auto w-full">
        {/* Quick Stats Grid matching Screenshot 3 */}
        <div className="bg-[#141824] border border-gray-800/90 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="text-right">
            <h2 className="text-base font-bold text-gray-100">معلومات سريعة</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              ملخص واضح عن عدد الكلايش وحالتها الحالية.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* عدد الكلايش */}
            <div className="bg-[#1a2030] border border-gray-800 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px]">عدد الكلايش</span>
                <Rows className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-2xl font-extrabold text-white mt-2">{totalCount}</span>
            </div>

            {/* للمدير فقط */}
            <div className="bg-[#1a2030] border border-gray-800 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px]">للمدير فقط</span>
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-2xl font-extrabold text-white mt-2">{managerOnlyCount}</span>
            </div>

            {/* العامة */}
            <div className="bg-[#1a2030] border border-gray-800 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px]">العامة</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-extrabold text-white mt-2">{publicCount}</span>
            </div>

            {/* عدد الصفوف */}
            <div className="bg-[#1a2030] border border-gray-800 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px]">عدد الصفوف</span>
                <Layers className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-2xl font-extrabold text-white mt-2">{rowsCount}</span>
            </div>

            {/* مخفية بالشات */}
            <div className="bg-[#1a2030] border border-gray-800 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px]">مخفية بالشات</span>
                <EyeOff className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-2xl font-extrabold text-white mt-2">{hiddenInChatCount}</span>
            </div>

            {/* المرفوعة */}
            <div className="bg-[#1a2030] border border-gray-800 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px]">المرفوعة</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-extrabold text-white mt-2">{uploadedCount}</span>
            </div>

            {/* غير المرفوعة */}
            <div className="bg-[#1a2030] border border-gray-800 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px]">غير المرفوعة</span>
                <span className="text-gray-500">🚫</span>
              </div>
              <span className="text-2xl font-extrabold text-white mt-2">0</span>
            </div>

            {/* ملفات السيرفر */}
            <div className="bg-[#1a2030] border border-gray-800 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px]">ملفات السيرفر</span>
                <FileBox className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-2xl font-extrabold text-white mt-2">{serverFilesCount}</span>
            </div>
          </div>

          {/* Sync Status Banner */}
          <div className="bg-[#14261f] border border-emerald-800/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-emerald-300">تحميل الكل</p>
                <p className="text-[11px] text-emerald-400/80">نعم، الكل متحمّل ومتزامن</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700">
              جاهز 100%
            </span>
          </div>

          {/* Action buttons matching Screenshot 3 */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onOpenAddModal()}
              className="py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كليشة</span>
            </button>
            <button
              onClick={() => alert("تم تنزيل وتحديث ملفات الميديا بنجاح!")}
              className="py-3 px-4 rounded-2xl bg-[#1e2536] hover:bg-[#273046] border border-gray-700 text-gray-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>تنزيل الميديا</span>
            </button>
          </div>
        </div>

        {/* Informative Drag Notice matching screenshot */}
        <p className="text-[11px] text-gray-400 text-center px-4 leading-relaxed">
          اسحب من المقبض السفلي حتى ترتب الكروت داخل نفس الصف. ولتحريك الصف كامل استخدم مقبض السحب الصغير في هيدر الصف.
        </p>

        {/* Rows with cards matching Screenshot 5 & 9 */}
        <div className="space-y-6">
          {rows.map(({ rowNum, items }) => (
            <div
              key={rowNum}
              className="bg-[#121622] border border-gray-800/80 rounded-3xl p-4 shadow-lg space-y-3.5"
            >
              {/* Row Header matching screenshot */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-800/80">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${getRowColorDot(rowNum)} shadow`} />
                  <h3 className="text-sm font-bold text-gray-200">الصف {rowNum}</h3>
                  <span className="text-xs text-gray-400">({items.length} كليشة)</span>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <Palette className="w-4 h-4 hover:text-white cursor-pointer" />
                  <GripHorizontal className="w-4 h-4 hover:text-white cursor-grab" />
                  <button
                    onClick={() => onOpenAddModal(rowNum)}
                    className="p-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white text-xs px-2"
                  >
                    + إضافة
                  </button>
                </div>
              </div>

              {/* Cards Grid (2 Columns matching Screenshot 5 & 9) */}
              <div className="grid grid-cols-2 gap-3">
                {items.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="bg-[#1c2230] border border-gray-700/70 rounded-3xl p-3.5 flex flex-col justify-between min-h-[130px] hover:border-gray-500 transition-all shadow-md group relative"
                  >
                    {/* Top card bar: Cloud & 3-dots */}
                    <div className="flex items-center justify-between">
                      <div className="w-6 h-6 rounded-full bg-emerald-950/80 border border-emerald-700 flex items-center justify-center text-emerald-400 text-xs">
                        ✓
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => onEditTemplate(tpl)}
                          className="p-1 text-gray-400 hover:text-blue-400"
                          title="تعديل"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTemplate(tpl.id)}
                          className="p-1 text-gray-400 hover:text-rose-400"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title center matching Screenshot 5 & 9 */}
                    <div className="py-2 text-center">
                      <h4 className="text-sm font-extrabold text-white tracking-wide">
                        {tpl.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate max-w-[130px] mx-auto mt-0.5">
                        {tpl.content}
                      </p>
                    </div>

                    {/* Bottom grip dots handle matching screenshot */}
                    <div className="flex justify-center text-gray-600 group-hover:text-gray-400 cursor-grab pt-1">
                      <GripVertical className="w-4 h-4 transform rotate-90" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
