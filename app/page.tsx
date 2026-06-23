"use client";

import React, { useState } from "react";
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
      <aside className="w-72 bg-[#0d0f1a] border-r border-white/5 flex flex-col justify-between shrink-0">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo / Header */}
          <div className="p-6 border-b border-white/5 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/25">
              G
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wide text-white">GALLERY</span>
              <span className="text-[10px] block font-semibold text-indigo-400 tracking-wider">COMPILER</span>
            </div>
          </div>

          {/* Preset templates selector */}
          <div className="p-6 space-y-4">
            <div>
              <h4 className="font-semibold text-[10px] text-slate-500 uppercase tracking-widest mb-1">Layout Presets</h4>
              <p className="text-[11px] text-slate-400">Toggle template views instantly.</p>
            </div>

            <div className="space-y-2">
              {defaultTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateSelect(t)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    currentTemplate.id === t.id
                      ? "bg-indigo-600/15 border-indigo-500/50 text-indigo-200"
                      : "bg-slate-900/30 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200"
                  }`}
                >
                  <div className="font-semibold text-xs mb-0.5">{t.name}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{t.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Workspace Info Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-950/20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Compiler Engine Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0a0c14] p-8 md:p-12">
        <div className="max-w-6xl mx-auto h-full">
          <PreviewPane template={currentTemplate} />
        </div>
      </main>
    </div>
  );
}
