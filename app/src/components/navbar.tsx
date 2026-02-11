import Link from "next/link";
import { FileText, ShieldCheck, Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-16 py-5 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="text-2xl font-bold tracking-tighter flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
          <Zap className="text-white" size={24} />
        </div>
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          RESUMERADAR
        </span>
      </div>
      <div className="flex gap-8 text-sm font-medium text-slate-700">
        <Link 
          href="/builder" 
          className="hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          <FileText size={16} />
          Builder
        </Link>
        <Link 
          href="/analyzer" 
          className="hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          <ShieldCheck size={16} />
          ATS Scan
        </Link>
        <Link 
          href="/builder" 
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}