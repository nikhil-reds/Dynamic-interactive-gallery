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
      <main className="flex-1 overflow-y-auto bg-[#0a0c14] p-8 md:p-12">
        <div className="max-w-6xl mx-auto h-full">
          <PreviewPane template={currentTemplate} />
        </div>
      </main>
    </div>
  );
}
