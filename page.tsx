"use client";

import React, { useState, useEffect } from "react";
import {
  AppSettingsType,
  ConversationType,
  EmployeeType,
  LabelType,
  TemplateType,
} from "@/types";
import { Language } from "@/utils/translations";
import MessagesView from "@/components/MessagesView";
import ChatRoomView from "@/components/ChatRoomView";
import ControlCenterView from "@/components/ControlCenterView";
import VoiceAnalysisSettingsView from "@/components/VoiceAnalysisSettingsView";
import TemplatesView from "@/components/TemplatesView";
import AiAssistantView from "@/components/AiAssistantView";
import ServerApiView from "@/components/ServerApiView";
import EmployeesView from "@/components/EmployeesView";
import { LoginModal } from "@/components/LoginModal";
import { InstallAppModal } from "@/components/InstallAppModal";
import {
  NewPaymentModal,
  EditAmountModal,
  AddTemplateModal,
  NewConversationModal,
  DiagnosticsModal,
} from "@/components/Modals";

export default function HomePage() {
  // Navigation screen
  const [currentScreen, setCurrentScreen] = useState<
    | "messages"
    | "chat"
    | "control_center"
    | "voice_analysis"
    | "templates"
    | "ai_assistant"
    | "server_api"
    | "employees"
  >("messages");

  // Authentication State
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeType | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Language state (ar / en)
  const [currentLang, setCurrentLang] = useState<Language>("ar");

  // Core data states
  const [settings, setSettings] = useState<AppSettingsType | null>(null);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [labels, setLabels] = useState<LabelType[]>([]);
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [employees, setEmployees] = useState<EmployeeType[]>([]);

  // Selected conversation for ChatRoomView
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);

  // Filters & search
  const [selectedLabel, setSelectedLabel] = useState<string>("الرسائل");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditAmountModal, setShowEditAmountModal] = useState(false);
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [addTemplateRow, setAddTemplateRow] = useState<number>(1);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [diagnosticsModalType, setDiagnosticsModalType] = useState<
    "location" | "sync" | "contact_compare" | "performance" | "check_customer" | "purge" | null
  >(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Initial fetch
  const fetchAllData = async () => {
    try {
      // 1. Settings
      const sRes = await fetch("/api/settings");
      if (sRes.ok) {
        const sData = await sRes.json();
        setSettings(sData);
      }

      // 2. Labels
      const lRes = await fetch("/api/labels");
      if (lRes.ok) {
        const lData = await lRes.json();
        setLabels(lData);
      }

      // 3. Templates
      const tRes = await fetch("/api/templates");
      if (tRes.ok) {
        const tData = await tRes.json();
        setTemplates(tData);
      }

      // 4. Employees
      const eRes = await fetch("/api/employees");
      if (eRes.ok) {
        const eData = await eRes.json();
        setEmployees(eData);
        // Default login to salih 2 (Admin) if not already logged in
        if (!currentEmployee && eData.length > 0) {
          setCurrentEmployee(eData[0]);
        }
      }

      // 5. Conversations
      await fetchConversations();
    } catch (err) {
      console.error("Error loading initial data", err);
    }
  };

  const fetchConversations = async () => {
    try {
      const q = new URLSearchParams();
      if (searchQuery) q.append("search", searchQuery);
      if (selectedLabel) q.append("label", selectedLabel);

      const res = await fetch(`/api/conversations?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        // If current chat is selected, update reference
        if (selectedConversation) {
          const updated = data.find((c: ConversationType) => c.id === selectedConversation.id);
          if (updated) setSelectedConversation(updated);
        }
      }
    } catch (err) {
      console.error("Error fetching conversations", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [searchQuery, selectedLabel]);

  // Synchronize dark/light theme to document root
  useEffect(() => {
    if (settings) {
      const isDark = settings.darkMode ?? true;
      if (isDark) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      }
    }
  }, [settings?.darkMode]);

  // Synchronize language dir & lang attribute
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  }, [currentLang]);

  // Update Settings
  const handleUpdateSettings = async (newSettings: Partial<AppSettingsType>) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
      }
    } catch (err) {
      console.error("Error updating settings", err);
    }
  };

  // Toggle Language between Arabic and English
  const handleToggleLanguage = () => {
    const nextLang = currentLang === "ar" ? "en" : "ar";
    setCurrentLang(nextLang);
  };

  // Toggle Dark / Light mode
  const handleToggleDarkMode = async () => {
    if (!settings) return;
    const newMode = !settings.darkMode;
    // Immediate optimistic update
    setSettings({ ...settings, darkMode: newMode });
    await handleUpdateSettings({ darkMode: newMode });
  };

  // Toggle conversation Pin
  const handleTogglePin = async (convId: number, currentPinned: boolean) => {
    try {
      await fetch("/api/conversations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: convId, isPinned: !currentPinned }),
      });
      await fetchConversations();
    } catch (err) {
      console.error("Error toggling pin", err);
    }
  };

  // Add new Label
  const handleAddNewLabel = async () => {
    const name = prompt(currentLang === "ar" ? "أدخل اسم الليبل (التصنيف) الجديد:" : "Enter new label name:");
    if (!name?.trim()) return;

    try {
      await fetch("/api/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const lRes = await fetch("/api/labels");
      if (lRes.ok) {
        const lData = await lRes.json();
        setLabels(lData);
      }
    } catch (err) {
      console.error("Error adding label", err);
    }
  };

  // Record a payment
  const handleRecordPayment = async (amount: number, method: string, note: string) => {
    if (!selectedConversation) return;
    try {
      await fetch(`/api/conversations/${selectedConversation.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          method,
          note,
          recordedBy: currentEmployee?.name || employees[0]?.name || "salih 2",
        }),
      });
      await fetchConversations();
    } catch (err) {
      console.error("Error recording payment", err);
    }
  };

  // Update payment plan
  const handleUpdatePaymentPlan = async (totalAmount: number, paidAmount: number, notes: string) => {
    if (!selectedConversation) return;
    try {
      await fetch(`/api/conversations/${selectedConversation.id}/payments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_plan",
          totalAmount,
          paidAmount,
          paymentPlanNotes: notes,
        }),
      });
      await fetchConversations();
    } catch (err) {
      console.error("Error updating payment plan", err);
    }
  };

  // Clear amount (مسح المبلغ المسجل)
  const handleClearAmount = async () => {
    if (!selectedConversation) return;
    if (confirm("هل أنت متأكد من مسح وتصفير كافة المبالغ والأقساط المسجلة لهذا الحساب؟")) {
      try {
        await fetch(`/api/conversations/${selectedConversation.id}/payments`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "clear_amount" }),
        });
        await fetchConversations();
      } catch (err) {
        console.error("Error clearing amount", err);
      }
    }
  };

  // Toggle voice analysis status for conversation
  const handleToggleVoiceAnalysis = async () => {
    if (!selectedConversation) return;
    const newStatus = selectedConversation.voiceAnalysisStatus === "نشط" ? "متوقف" : "نشط";
    try {
      await fetch("/api/conversations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedConversation.id,
          voiceAnalysisStatus: newStatus,
        }),
      });
      await fetchConversations();
    } catch (err) {
      console.error("Error updating voice analysis status", err);
    }
  };

  // Add Template (الكلايش الجاهزة)
  const handleAddTemplate = async (
    title: string,
    content: string,
    rowIndex: number,
    isManagerOnly: boolean
  ) => {
    try {
      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          rowIndex,
          isManagerOnly,
        }),
      });
      const tRes = await fetch("/api/templates");
      if (tRes.ok) {
        const tData = await tRes.json();
        setTemplates(tData);
      }
    } catch (err) {
      console.error("Error adding template", err);
    }
  };

  // Delete Template
  const handleDeleteTemplate = async (id: number) => {
    if (confirm("هل تريد حذف هذه الكليشة؟")) {
      await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
      const tRes = await fetch("/api/templates");
      if (tRes.ok) {
        const tData = await tRes.json();
        setTemplates(tData);
      }
    }
  };

  // Edit template quick prompt
  const handleEditTemplate = async (tpl: TemplateType) => {
    const newTitle = prompt("تعديل عنوان الكليشة:", tpl.title);
    if (!newTitle) return;
    const newContent = prompt("تعديل نص الكليشة:", tpl.content);
    if (!newContent) return;

    await fetch("/api/templates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: tpl.id,
        title: newTitle,
        content: newContent,
      }),
    });
    const tRes = await fetch("/api/templates");
    if (tRes.ok) {
      const tData = await tRes.json();
      setTemplates(tData);
    }
  };

  // Create new customer conversation
  const handleCreateNewConversation = async (
    name: string,
    phone: string,
    totalAmount: number,
    paidAmount: number,
    initialLabel: string
  ) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          totalAmount,
          paidAmount,
          labels: [initialLabel, "الرسائل"],
          assignedEmployeeId: currentEmployee?.id || employees[0]?.id || 1,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        await fetchConversations();
        setSelectedConversation(created);
        setCurrentScreen("chat");
      }
    } catch (err) {
      console.error("Error creating conversation", err);
    }
  };

  // Purge message data after confirmation
  const handlePurgeData = async () => {
    try {
      await fetch("/api/system/purge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_messages" }),
      });
      await fetchConversations();
      alert("تم مسح بيانات الرسائل بنجاح!");
    } catch (err) {
      console.error("Error purging messages", err);
    }
  };

  // Logout handler
  const handleLogout = () => {
    if (confirm(currentLang === "ar" ? "هل تريد تسجيل الخروج؟" : "Do you want to log out?")) {
      setCurrentEmployee(null);
      setShowLoginModal(true);
    }
  };

  // Success login
  const handleLoginSuccess = (emp: EmployeeType) => {
    setCurrentEmployee(emp);
    setShowLoginModal(false);
  };

  const isDark = settings?.darkMode ?? true;

  return (
    <main
      className={`min-h-screen flex justify-center transition-colors duration-300 ${
        isDark ? "bg-[#07090e] text-white" : "bg-[#e2e8f0] text-slate-900"
      }`}
    >
      {/* Mobile/Tablet Application Shell Container matching screenshots */}
      <div
        className={`w-full max-w-lg h-screen flex flex-col shadow-2xl relative border-x overflow-hidden transition-colors duration-300 ${
          isDark
            ? "bg-[#0b0e14] border-gray-800/80 text-white"
            : "bg-white border-slate-300 text-slate-900 shadow-slate-400"
        }`}
      >
        {/* Render Active Screen */}
        {currentScreen === "messages" && (
          <MessagesView
            conversations={conversations}
            labels={labels}
            selectedLabel={selectedLabel}
            onSelectLabel={setSelectedLabel}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectConversation={(conv) => {
              setSelectedConversation(conv);
              setCurrentScreen("chat");
            }}
            onOpenControlCenter={() => setCurrentScreen("control_center")}
            onOpenNewChatModal={() => setShowNewChatModal(true)}
            onTogglePin={handleTogglePin}
            onAddNewLabel={handleAddNewLabel}
            isDark={isDark}
            onToggleDarkMode={handleToggleDarkMode}
            currentLang={currentLang}
            onToggleLanguage={handleToggleLanguage}
            onOpenInstallModal={() => setShowInstallModal(true)}
          />
        )}

        {currentScreen === "chat" && selectedConversation && settings && (
          <ChatRoomView
            conversation={selectedConversation}
            settings={settings}
            templates={templates}
            onBack={() => setCurrentScreen("messages")}
            onRefreshConversation={fetchConversations}
            onOpenPaymentModal={() => setShowPaymentModal(true)}
            onOpenEditAmountModal={() => setShowEditAmountModal(true)}
            onClearAmount={handleClearAmount}
            onToggleVoiceAnalysis={handleToggleVoiceAnalysis}
            onOpenAddTemplateModal={(row = 1) => {
              setAddTemplateRow(row);
              setShowAddTemplateModal(true);
            }}
          />
        )}

        {currentScreen === "control_center" && settings && (
          <ControlCenterView
            settings={settings}
            currentEmployee={currentEmployee || employees[0]}
            currentLang={currentLang}
            onClose={() => setCurrentScreen("messages")}
            onNavigateTo={(screen) => setCurrentScreen(screen)}
            onOpenLocationModal={() => setDiagnosticsModalType("location")}
            onOpenSyncStatusModal={() => setDiagnosticsModalType("sync")}
            onOpenContactCompareModal={() => setDiagnosticsModalType("contact_compare")}
            onOpenPerformanceModal={() => setDiagnosticsModalType("performance")}
            onOpenCheckCustomerModal={() => setDiagnosticsModalType("check_customer")}
            onOpenPurgeModal={() => setDiagnosticsModalType("purge")}
            onToggleDarkMode={handleToggleDarkMode}
            onToggleLanguage={handleToggleLanguage}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === "voice_analysis" && settings && (
          <VoiceAnalysisSettingsView
            settings={settings}
            onBack={() => setCurrentScreen("control_center")}
            onSave={handleUpdateSettings}
          />
        )}

        {currentScreen === "templates" && (
          <TemplatesView
            templates={templates}
            onBack={() => setCurrentScreen("control_center")}
            onOpenAddModal={(row = 1) => {
              setAddTemplateRow(row);
              setShowAddTemplateModal(true);
            }}
            onEditTemplate={handleEditTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        )}

        {currentScreen === "ai_assistant" && settings && (
          <AiAssistantView
            settings={settings}
            onBack={() => setCurrentScreen("control_center")}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {currentScreen === "server_api" && settings && (
          <ServerApiView
            settings={settings}
            employees={employees}
            onBack={() => setCurrentScreen("control_center")}
            onRefreshStats={fetchAllData}
            onNavigateToEmployees={() => setCurrentScreen("employees")}
            onUpdateSettings={handleUpdateSettings}
            onOpenInstallModal={() => setShowInstallModal(true)}
          />
        )}

        {currentScreen === "employees" && (
          <EmployeesView
            employees={employees}
            onBack={() => setCurrentScreen("control_center")}
            onRefresh={async () => {
              const res = await fetch("/api/employees");
              if (res.ok) {
                const data = await res.json();
                setEmployees(data);
              }
            }}
          />
        )}

        {/* MODALS */}
        {showPaymentModal && selectedConversation && (
          <NewPaymentModal
            conversation={selectedConversation}
            onClose={() => setShowPaymentModal(false)}
            onSubmit={handleRecordPayment}
          />
        )}

        {showEditAmountModal && selectedConversation && (
          <EditAmountModal
            conversation={selectedConversation}
            onClose={() => setShowEditAmountModal(false)}
            onSubmit={handleUpdatePaymentPlan}
          />
        )}

        {showAddTemplateModal && (
          <AddTemplateModal
            defaultRow={addTemplateRow}
            onClose={() => setShowAddTemplateModal(false)}
            onSubmit={handleAddTemplate}
          />
        )}

        {showNewChatModal && (
          <NewConversationModal
            onClose={() => setShowNewChatModal(false)}
            onSubmit={handleCreateNewConversation}
          />
        )}

        {diagnosticsModalType && (
          <DiagnosticsModal
            type={diagnosticsModalType}
            shopLocation={settings?.shopLocation}
            onClose={() => setDiagnosticsModalType(null)}
            onSaveLocation={async (loc) => {
              await handleUpdateSettings({ shopLocation: loc });
            }}
            onPurgeData={handlePurgeData}
          />
        )}

        {/* Install On Device Modal */}
        {showInstallModal && (
          <InstallAppModal
            phone={settings?.whatsappPhone || "+964 773 387 8591"}
            onClose={() => setShowInstallModal(false)}
          />
        )}

        {/* Login Modal for Email or Phone */}
        {showLoginModal && (
          <LoginModal
            lang={currentLang}
            onSuccess={handleLoginSuccess}
          />
        )}
      </div>
    </main>
  );
}
