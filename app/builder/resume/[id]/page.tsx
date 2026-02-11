"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../src/components/navbar";
import Footer from "../../../src/components/footer";
import { ProfileStorage } from "../../../src/lib/profilestore";
import { Profile } from "../../../src/types/profile";
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  AlertCircle,
  Loader2,
  Wand2,
  Eye,
  Code,
  ArrowLeft,
  RefreshCw,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function ResumeBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params?.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [step, setStep] = useState<"job-details" | "generating" | "editor">("job-details");
  
  // Job Details Step
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  
  // Editor Step
  const [latexCode, setLatexCode] = useState("");
  const [compiledPdfUrl, setCompiledPdfUrl] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  
  // UI State
  const [showPreview, setShowPreview] = useState(true);
  const [autoCompile, setAutoCompile] = useState(true);

  useEffect(() => {
    if (profileId) {
      const loadedProfile = ProfileStorage.getProfile(profileId);
      if (loadedProfile) {
        setProfile(loadedProfile);
        setTargetRole(loadedProfile.targetRole || "");
      } else {
        router.push("/builder");
      }
    }
  }, [profileId, router]);

  // Generate LaTeX using AI
  // 1. Generate LaTeX from the actual API
const generateResume = async () => {
  if (!profile) return;
  
  setIsGenerating(true);
  setError("");
  setStep("generating");

  try {
    const response = await fetch("/api/generate-resume", { // Match your route folder name
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile,
        jobDescription,
        targetRole,
        targetCompany,
        additionalInstructions,
        useAI: true,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to generate");

    setLatexCode(data.latex);
    setStep("editor");
    
    // Trigger real compilation
    await compileLatex(data.latex);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Error connecting to AI");
    setStep("job-details");
  } finally {
    setIsGenerating(false);
  }
};

// 2. Compile LaTeX to real PDF via the backend
const compileLatex = async (code?: string) => {
  const codeToCompile = code || latexCode;
  if (!codeToCompile) return;

  setIsCompiling(true);
  setError("");

  try {
    const response = await fetch("/api/compile-latex", { // Match your route folder name
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latex: codeToCompile }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "PDF compilation failed");
    }

    // Convert PDF stream to a displayable URL
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    // Revoke old URL to prevent memory leaks
    if (compiledPdfUrl) URL.revokeObjectURL(compiledPdfUrl);
    
    setCompiledPdfUrl(url);
  } catch (err) {
    setError(err instanceof Error ? err.message : "PDF service error");
  } finally {
    setIsCompiling(false);
  }
};

  // Copy LaTeX to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download PDF
  const downloadPdf = () => {
    if (!compiledPdfUrl) return;
    const link = document.createElement("a");
    link.href = compiledPdfUrl;
    link.download = `${profile?.fullName.replace(/\s+/g, "_")}_Resume.pdf`;
    link.click();
  };

  // Auto-compile on LaTeX change (debounced)
  useEffect(() => {
    if (!autoCompile || !latexCode) return;

    const timeout = setTimeout(() => {
      compileLatex();
    }, 1000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- compileLatex is stable and including it causes infinite loops
  }, [latexCode, autoCompile]);

  if (!profile) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-gray-900">
      <Navbar />

      {/* Header */}
      <section className="px-6 md:px-16 py-8 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/builder"
                className="p-3 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Resume Builder</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">
                  Building resume for <span className="font-semibold text-gray-800">{profile.fullName}</span>
                </p>
              </div>
            </div>

            {step === "editor" && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-gray-700"
                >
                  {showPreview ? <Code size={18} /> : <Eye size={18} />}
                  {showPreview ? "Show Code" : "Show Preview"}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-gray-700"
                >
                  {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                  {copied ? "Copied!" : "Copy LaTeX"}
                </button>
                <button
                  onClick={downloadPdf}
                  disabled={!compiledPdfUrl}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Download size={18} />
                  Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Job Details Step */}
      {step === "job-details" && (
        <section className="px-6 md:px-16 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 rounded-full text-blue-600 text-sm font-semibold mb-6">
                  <Wand2 size={18} />
                  AI-Powered Resume Generation
                </div>
                <h2 className="text-4xl font-bold mb-4 text-gray-900">
                  Let&apos;s Tailor Your Resume
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Provide job details to create an ATS-optimized resume that stands out
                </p>
              </div>

              <div className="space-y-8">
                {/* Target Role */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    Target Role *
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Senior Software Engineer, Product Manager"
                    className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    The specific position you&apos;re applying for
                  </p>
                </div>

                {/* Target Company */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    Target Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g., Google, Microsoft, Amazon"
                    className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Helps tailor your resume to the company culture
                  </p>
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    Job Description (Optional but Recommended)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={10}
                    placeholder="Paste the full job description here. This helps AI tailor your resume with relevant keywords and skills that match the job requirements."
                    className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all text-gray-900 placeholder:text-gray-400"
                  />
                  <div className="flex items-start gap-2 mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">💡</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Pro Tip</p>
                      <p className="text-sm text-blue-700">
                        Including the job description helps match your resume to the role&apos;s requirements and improves ATS compatibility by up to 60%.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Instructions */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    Additional Instructions (Optional)
                  </label>
                  <textarea
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    rows={5}
                    placeholder="e.g., Emphasize leadership experience, highlight Python skills, use modern design, focus on achievements with metrics, etc."
                    className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all text-gray-900 placeholder:text-gray-400"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Any specific areas you want to emphasize or formatting preferences
                  </p>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="flex items-start gap-3 p-5 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    <AlertCircle size={24} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-base mb-1">Generation Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={generateResume}
                  disabled={!targetRole || isGenerating}
                  className="w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span>Generating Your Resume...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      <span>Generate Resume with AI</span>
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  This will use AI to create an ATS-optimized LaTeX resume tailored to your target role
                </p>
              </div>
            </div>

            {/* Profile Summary Card */}
            <div className="mt-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="font-bold text-xl mb-6 text-gray-800">Profile Summary</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <span className="text-sm font-medium text-gray-600 block mb-1">Experience</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {profile.experience?.length || 0}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">positions</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <span className="text-sm font-medium text-gray-600 block mb-1">Education</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {profile.education?.length || 0}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">degrees</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <span className="text-sm font-medium text-gray-600 block mb-1">Technical Skills</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {profile.technicalSkills?.length || 0}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">skills</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <span className="text-sm font-medium text-gray-600 block mb-1">Projects</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {profile.projects?.length || 0}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">projects</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <span className="text-sm font-medium text-gray-600 block mb-1">Certifications</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {profile.certifications?.length || 0}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">certs</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <span className="text-sm font-medium text-gray-600 block mb-1">Languages</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {profile.languages?.length || 0}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">languages</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Generating Step */}
      {step === "generating" && (
        <section className="px-6 md:px-16 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 md:p-16 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-8 relative">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-75"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Crafting Your Perfect Resume...
              </h2>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                Our AI is analyzing your profile and tailoring your resume for <span className="font-semibold text-gray-800">{targetRole}</span>
                {targetCompany && <> at <span className="font-semibold text-gray-800">{targetCompany}</span></>}
              </p>
              <div className="max-w-md mx-auto bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-base">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-gray-700">Analyzing job requirements...</span>
                  </div>
                  <div className="flex items-center gap-3 text-base" style={{ animationDelay: '0.2s' }}>
                    <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-gray-700">Optimizing keywords for ATS...</span>
                  </div>
                  <div className="flex items-center gap-3 text-base" style={{ animationDelay: '0.4s' }}>
                    <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-gray-700">Formatting professional LaTeX...</span>
                  </div>
                  <div className="flex items-center gap-3 text-base" style={{ animationDelay: '0.6s' }}>
                    <div className="w-3 h-3 bg-pink-600 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                    <span className="text-gray-700">Personalizing content...</span>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  This usually takes 10-30 seconds
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Editor Step */}
      {step === "editor" && (
        <section className="px-6 md:px-16 py-8">
          <div className="max-w-[1800px] mx-auto">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setStep("job-details")}
                  className="px-5 py-2.5 text-base border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-gray-700"
                >
                  <RefreshCw size={18} />
                  Regenerate
                </button>
                <label className="flex items-center gap-2 text-base cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoCompile}
                    onChange={(e) => setAutoCompile(e.target.checked)}
                    className="rounded w-5 h-5 text-blue-600"
                  />
                  <span className="font-medium text-gray-700">Auto-compile</span>
                </label>
                {!autoCompile && (
                  <button
                    onClick={() => compileLatex()}
                    disabled={isCompiling}
                    className="px-5 py-2.5 text-base bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                  >
                    {isCompiling ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Compiling...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={18} />
                        Compile
                      </>
                    )}
                  </button>
                )}
              </div>

              {isCompiling && (
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                  <Loader2 className="animate-spin" size={18} />
                  <span className="text-sm font-medium">Compiling PDF...</span>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-5 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle size={24} className="flex-shrink-0 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 text-base mb-1">Compilation Error</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Editor and Preview */}
            <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
              {/* LaTeX Editor */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 300px)' }}>
                <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Code className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">LaTeX Source</h3>
                      <p className="text-xs text-gray-500">Edit your resume code</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                    {latexCode.split('\n').length} lines
                  </div>
                </div>
                <textarea
                  value={latexCode}
                  onChange={(e) => setLatexCode(e.target.value)}
                  className="flex-1 p-5 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                  style={{ lineHeight: '1.6' }}
                  spellCheck={false}
                />
              </div>

              {/* PDF Preview */}
              {showPreview && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 300px)' }}>
                  <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Eye className="text-green-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">PDF Preview</h3>
                        <p className="text-xs text-gray-500">Live resume preview</p>
                      </div>
                    </div>
                    {compiledPdfUrl && (
                      <button
                        onClick={downloadPdf}
                        className="text-sm text-white bg-blue-600 hover:bg-blue-700 font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-auto bg-gray-100">
                    {compiledPdfUrl ? (
                      <iframe
                        src={compiledPdfUrl}
                        className="w-full h-full"
                        title="Resume Preview"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <FileText size={64} className="mx-auto mb-4 opacity-30" />
                          <p className="text-lg font-medium text-gray-700">No Preview Available</p>
                          <p className="text-sm mt-2 text-gray-500">Compile your LaTeX to see the preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}