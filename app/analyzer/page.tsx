"use client";

import { useState } from "react";
import { Upload, ShieldAlert, BarChart3, Map, UserCheck, Loader2, FileCheck } from "lucide-react";
import Navbar from "../src/components/navbar";

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">AI Resume Analyzer</h1>
          <p className="text-slate-600">Upload your PDF to check ATS compatibility and get a career roadmap.</p>
        </div>

        {!results ? (
          <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden" 
              id="resume-upload" 
            />
            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-16 h-16 text-blue-500 mb-4" />
              <span className="text-lg font-medium text-slate-700">
                {file ? file.name : "Click to upload your resume (PDF)"}
              </span>
            </label>
            {file && (
              <button 
                onClick={handleUpload}
                disabled={isAnalyzing}
                className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" /> : <FileCheck />}
                {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScoreCard icon={<BarChart3 />} title="ATS Score" value={`${results.atsScore}%`} color="text-blue-600" />
            <ScoreCard icon={<ShieldAlert />} title="Risk Factor" value={results.riskFactor} color="text-red-600" />
            <ScoreCard icon={<UserCheck />} title="Branding Score" value={`${results.personalBranding}%`} color="text-purple-600" />
            
            <div className="md:col-span-2 lg:col-span-3 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Map className="text-green-600" /> Skill Evaluation Roadmap</h3>
              <div className="space-y-4">
                {results.roadmap.map((step: string, i: number) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-lg border-l-4 border-green-500">
                    <span className="font-bold text-green-600">{i + 1}.</span>
                    <p className="text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ScoreCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 bg-slate-50 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}