"use client";

import React from "react";

interface DashboardProps {
  assetCount: number;
  templateName: string;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ assetCount, templateName, onNavigate }: DashboardProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 p-8 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">
            Gallery Template Exporter
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            Design gorgeous responsive galleries, live-preview them on mobile, tablet, and desktop viewports, and compile them into standalone HTML packages or native desktop applications.
          </p>
          <button
            onClick={() => onNavigate("assets")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
          >
            Start Selecting Assets &rarr;
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-sm font-semibold tracking-wider uppercase">Active Media Files</span>
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-white mb-1">{assetCount}</div>
            <p className="text-xs text-slate-500">In-memory assets loaded</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-sm font-semibold tracking-wider uppercase">Selected Theme Template</span>
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-bold text-indigo-200 truncate mb-1">{templateName}</div>
            <p className="text-xs text-slate-500">Customizable layout structure</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-sm font-semibold tracking-wider uppercase">Target Formats</span>
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold text-white mb-1">HTML, EXE, DMG, ZIP</div>
            <p className="text-xs text-slate-500">Ready for instant bundle compilation</p>
          </div>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-wide">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
              1
            </div>
            <h3 className="font-semibold text-white">Choose Files</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select images, videos, and PDFs from your computer. Files remain secure in your browser.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
              2
            </div>
            <h3 className="font-semibold text-white">Pick a Template</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select or code dynamic HTML templates with support for flexible layout engines and CSS properties.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
              3
            </div>
            <h3 className="font-semibold text-white">Live Preview</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly preview layout responses, image sizing, video controls, and interactive elements.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
              4
            </div>
            <h3 className="font-semibold text-white">Compile & Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Build a self-contained HTML page, download a portable ZIP, or export native executable packages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
