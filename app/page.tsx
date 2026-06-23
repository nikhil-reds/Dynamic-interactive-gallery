"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import PreviewPane from "../components/PreviewPane";
import { defaultTemplates, Template } from "../lib/templates";

export default function Page() {
  const [currentTemplate, setCurrentTemplate] = useState<Template>(defaultTemplates[0]);

  const handleTemplateSelect = (template: Template) => {
    setCurrentTemplate(template);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0c14] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTemplate={currentTemplate}
        onTemplateSelect={handleTemplateSelect}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-[#0a0c14] overflow-hidden">
        <PreviewPane template={currentTemplate} />
      </main>
    </div>
  );
}
