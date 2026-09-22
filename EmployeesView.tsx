"use client";

import React, { useState } from "react";
import { EmployeeType } from "@/types";
import { ArrowRight, Plus, ShieldCheck, User, Phone, Trash2, Edit2, CheckCircle2 } from "lucide-react";

interface EmployeesViewProps {
  employees: EmployeeType[];
  onBack: () => void;
  onRefresh: () => void;
}

export default function EmployeesView({ employees, onBack, onRefresh }: EmployeesViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("مبيعات");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, phone: phone || "0770-000-0000" }),
      });
      if (res.ok) {
        setName("");
        setPhone("");
        setShowAddModal(false);
        onRefresh();
      }
    } catch (err) {
      console.error("Error adding employee", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الموظف؟")) {
      await fetch(`/api/employees?id=${id}`, { method: "DELETE" });
      onRefresh();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0e14] text-white">
      {/* Header */}
      <div className="px-4 py-3 bg-[#111622] border-b border-gray-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            title="رجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-100">إدارة الحسابات والموظفين</h1>
            <p className="text-[11px] text-gray-400">ربط موظفي المبيعات، المحاسبة، وتوزيع الرسائل</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة موظف</span>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-w-2xl mx-auto w-full">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-[#141926] border border-gray-800/90 rounded-2xl p-4 flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shadow-inner shrink-0"
                style={{ backgroundColor: emp.avatarColor || "#3b82f6" }}
              >
                {emp.name.charAt(0)}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-100">{emp.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                    {emp.role}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{emp.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-medium">
                {emp.status}
              </span>
              {emp.role !== "مدير" && (
                <button
                  onClick={() => handleDeleteEmployee(emp.id)}
                  className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors"
                  title="حذف الموظف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141a27] border border-gray-700 rounded-3xl p-5 max-w-md w-full space-y-4 text-right shadow-2xl">
            <h3 className="text-base font-bold text-white">إضافة موظف جديد للنظام</h3>
            <p className="text-xs text-gray-400">
              سيتمكن الموظف من الرد على الرسائل ومتابعة الأقساط والدفعات المسجلة.
            </p>

            <form onSubmit={handleAddEmployee} className="space-y-3">
              <div>
                <label className="text-xs text-gray-300 block mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: كرار حامد"
                  className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-right"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">الدور / الوظيفة:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-right"
                >
                  <option value="مبيعات">مبيعات واستفسارات</option>
                  <option value="محاسب دفعات">محاسب دفعات وأقساط</option>
                  <option value="دعم فني">دعم فني ومتابعة شحن</option>
                  <option value="مدير">مدير نظام</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">رقم الهاتف:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0770-123-4567"
                  className="w-full bg-[#1b2232] border border-gray-700 rounded-xl p-2.5 text-xs text-white text-right font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500"
                >
                  {loading ? "جاري الإضافة..." : "حفظ الموظف"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
