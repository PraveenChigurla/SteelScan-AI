"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid, Crosshair, UploadCloud, BarChart2,
  Database, ListTree, PieChart, Book, Info, Hexagon, DatabaseZap
} from "lucide-react";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutGrid },
    { name: "Single Prediction", href: "/single", icon: Crosshair },
    { name: "Batch Prediction", href: "/batch", icon: UploadCloud },
    { name: "Model Performance", href: "/performance", icon: BarChart2 },
    { name: "Dataset Explorer", href: "/dataset", icon: Database, badge: "New" },
    { name: "Feature Analysis", href: "/features", icon: ListTree },
    { name: "Analytics", href: "/analytics", icon: PieChart },
    { name: "Documentation", href: "/docs", icon: Book },
    { name: "About", href: "/about", icon: Info },
  ];

  return (
    <aside className="w-[280px] bg-[#0b0f19] border-r border-panelBorder flex flex-col h-full shrink-0 z-20 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-brandBlue to-brandPurple rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <Hexagon className="text-white w-6 h-6 fill-white/20" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight text-lg leading-tight">Steel Faults</h1>
            <p className="text-xs text-brandPurple">Classifier</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-brandBlue to-brandPurple text-white shadow-lg"
                    : "text-textMuted hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={clsx("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                  {link.name}
                </div>
                {link.badge && (
                  <span className="bg-brandPurple/20 text-brandPurple text-[0.6rem] px-2 py-0.5 rounded-full font-bold uppercase">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        {/* Model Status Card */}
        <div className="bg-[#121827] border border-panelBorder rounded-xl p-4 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brandBlue to-brandPurple"></div>
          <p className="text-xs font-bold text-white mb-2">Model Status</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandGreen opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brandGreen"></span>
            </span>
            <span className="text-xs text-brandGreen font-medium">Operational</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[0.65rem] text-slate-500 uppercase">Model</p>
              <p className="text-xs text-slate-300">LightGBM Classifier</p>
            </div>
            <div>
              <p className="text-[0.65rem] text-slate-500 uppercase">Developers</p>
              <p className="text-xs text-slate-300">Praveen, Khushi</p>
            </div>
            <div>
              <p className="text-[0.65rem] text-slate-500 uppercase">Last Updated</p>
              <p className="text-xs text-slate-300">8/7/2026</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[0.65rem] text-slate-500 uppercase">Backend</p>
                <p className="text-xs text-slate-300">FastAPI</p>
              </div>
              <span className="bg-brandGreen/10 text-brandGreen text-[0.65rem] px-2 py-0.5 rounded border border-brandGreen/20">Running</span>
            </div>
          </div>
        </div>

        {/* Server Graphic */}
        <div className="flex flex-col items-center justify-center relative py-6">
          <div className="absolute inset-0 bg-brandBlue/10 blur-[30px] rounded-full"></div>
          <DatabaseZap className="w-16 h-16 text-brandBlue drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] mb-2 relative z-10" />
          <div className="w-24 h-2 bg-brandBlue/30 rounded-[50%] blur-[2px] mt-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          <div className="w-20 h-1 bg-brandPurple/40 rounded-[50%] blur-[1px] mt-1"></div>
        </div>
      </div>
    </aside>
  );
}
