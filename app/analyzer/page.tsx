"use client";

import { useState } from "react";
import { 
  Upload, 
  ShieldAlert, 
  BarChart3, 
  Map, 
  UserCheck, 
  Loader2, 
  FileCheck, 
  BrainCircuit, 
  Target, 
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";
import Navbar from "../src/components/navbar";

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleUpload = async () => {
    if (!file || !targetRole) return;
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetRole", targetRole);

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Failed to analyze resume. Make sure Ollama is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    const r = risk?.toLowerCase() || "";
    if (r.includes("low")) return { text: "text-green-600", bg: "bg-green-50", border: "border-green-100" };
    if (r.includes("med")) return { text: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" };
    return { text: "text-red-600", bg: "bg-red-50", border: "border-red-100" };
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-4">
            <BrainCircuit size={16} /> Advanced NLP Diagnosis
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
            Resume <span className="text-blue-600">Intelligence</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Strategic analysis and hiring probability for your target role.
          </p>
        </header>

        {!results ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <Target size={18} className="text-blue-600" /> 1. Target Job Role
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Next.js Developer, AI Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-medium"
                />
              </div>

              <div className="relative group">
                <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="resume-upload" />
                <label htmlFor="resume-upload" className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <span className="text-xl font-bold text-slate-800">{file ? file.name : "2. Upload Resume PDF"}</span>
                </label>
              </div>

              {file && targetRole && (
                <button onClick={handleUpload} disabled={isAnalyzing} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl">
                  {isAnalyzing ? <Loader2 className="animate-spin" /> : <TrendingUp />}
                  {isAnalyzing ? "Processing AI Analysis..." : "Start Diagnostics"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {/* ROW 1: ATS, RISK, PROBABILITY */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* ATS SCORE */}
              <ScoreCard 
                icon={<BarChart3 />} 
                title="ATS Match Score" 
                value={`${results.atsScore}%`} 
                color="text-blue-600" 
                bg="bg-blue-50" 
              />

              {/* RISK FACTOR */}
              <div className={`p-8 rounded-[2rem] border shadow-sm flex flex-col justify-center ${getRiskColor(results.riskFactor).bg} ${getRiskColor(results.riskFactor).border}`}>
                 <div className="flex items-center gap-3 mb-2">
                    <ShieldAlert className={getRiskColor(results.riskFactor).text} size={20} />
                    <p className="text-xs font-black uppercase tracking-widest opacity-60">Risk Level</p>
                 </div>
                 <p className={`text-4xl font-black ${getRiskColor(results.riskFactor).text}`}>{results.riskFactor?.split(' ')[0]}</p>
                 <p className="text-slate-600 text-xs mt-2 font-medium italic">
                    {results.riskFactor?.split(' ').slice(1).join(' ')}
                 </p>
              </div>

              {/* JOB PROBABILITY */}
              <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden flex flex-col justify-center">
                 <p className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">Hiring Probability</p>
                 <div className="text-5xl font-black text-white">{results.jobProbability}</div>
                 <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-tighter">Match for {targetRole}</p>
              </div>
            </div>

            {/* ROW 2: ROADMAP (Left) & RISK DETECTION/BRANDING (Right) */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* 30-DAY ROADMAP */}
              <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
                  <Map className="text-green-600" /> 30-Day Technical Roadmap
                </h3>
                <div className="space-y-8 relative">
                  {(results?.roadmap || []).map((step: any, i: number) => (
                    <div key={i} className="flex gap-6 relative group">
                      {i !== (results?.roadmap?.length - 1) && <div className="absolute left-6 top-10 w-0.5 h-full bg-slate-100" />}
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold z-10 shrink-0">
                        {i + 1}
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 w-full hover:bg-white hover:border-green-200 transition-all">
                        <span className="text-green-600 font-black text-xs uppercase tracking-widest">{step.period || `Week ${i+1}`}</span>
                        <p className="text-slate-800 font-bold text-lg mt-1">{step.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RISK DETECTION & PERSONAL BRANDING */}
              <div className="space-y-6">
                {/* INTERVIEW RISK DETECTION */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                   <div className="flex items-center gap-2 mb-4">
                      <Award className="text-orange-500" size={20} />
                      <h4 className="font-black text-slate-400 text-xs uppercase tracking-widest">Interview Risk Detection</h4>
                   </div>
                   <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-800 text-sm font-bold italic leading-relaxed">
                    "{results.interviewRiskDetection}"
                   </div>
                </div>

                {/* PERSONAL BRANDING SCORE */}
                <ScoreCard 
                  icon={<UserCheck />} 
                  title="Branding Score" 
                  value={`${results.personalBrandingScore}%`} 
                  color="text-purple-600" 
                  bg="bg-purple-50" 
                />

                {/* CRITICAL IMPROVEMENTS LIST */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-4">Required Improvements</p>
                  <ul className="space-y-3">
                    {(results?.improvements || []).map((imp: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 font-bold text-xs">
                        <ChevronRight size={14} className="text-blue-500 shrink-0 mt-0.5" /> 
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => setResults(null)}
                  className="w-full py-4 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                >
                  Analyze New Resume
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ScoreCard({ icon, title, value, color, bg }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all w-full">
      <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
        <p className={`text-4xl font-black ${color}`}>{value}</p>
      </div>
    </div>
  );
}