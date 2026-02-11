import Link from "next/link";
import { Target, ShieldCheck, Download, CheckCircle, Sparkles, Users, Award, ArrowRight } from "lucide-react";
import Navbar from "./src/components/navbar";
import Footer from "./src/components/footer";


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Navigation - Sticky & Clean */}
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 md:px-16 py-24 md:py-32 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-semibold mb-8">
            <Sparkles size={16} />
            AI-Powered Resume Assistant
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Build Resumes That 
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block md:inline"> Pass Every ATS Filter</span>
          </h1>
          
          <p className="text-xl max-w-3xl mx-auto text-slate-600 leading-relaxed mb-10">
            Create professional, ATS-optimized resumes tailored to specific job descriptions. 
            Get real-time suggestions and export in perfect LaTeX format.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              href="/builder"
              className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              Start Building Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link
              href="/analyzer"
              className="px-10 py-4 border-2 border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-white hover:border-blue-600 transition-all"
            >
              Analyze Your Resume
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">99%</div>
              <div className="text-slate-600">ATS Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50K+</div>
              <div className="text-slate-600">Resumes Built</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">4.9/5</div>
              <div className="text-slate-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need for the Perfect Resume</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Professional tools designed to help you land your dream job
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Target className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">JD-Tailored Creation</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Paste any job description and generate a resume specifically optimized for that exact role with relevant keywords.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="text-green-500" size={18} />
                  Keyword optimization
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="text-green-500" size={18} />
                  Skills matching
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="text-green-500" size={18} />
                  Format customization
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-green-200 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">ATS Suggestion Engine</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
              Real-time ATS scoring with actionable suggestions to improve your resume&apos;s chances of getting noticed.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="text-green-500" size={18} />
                  Score tracking
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="text-green-500" size={18} />
                  Keyword suggestions
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="text-green-500" size={18} />
                  Industry benchmarks
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-purple-200 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Download className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Perfect Format Export</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Export in LaTeX format for flawless, consistent formatting across all platforms and devices.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="text-green-500" size={18} />
                  Format stability
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="text-green-500" size={18} />
                  PDF generation
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="text-green-500" size={18} />
                  Custom templates
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="px-6 md:px-16 py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-blue-600 text-sm font-semibold mb-4">
              <Users size={16} />
              Trusted by Professionals Worldwide
            </div>
            <h2 className="text-4xl font-bold mb-4">Who Uses ResumeAid?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From students to HR professionals, our platform serves diverse career needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🎓", title: "Students", desc: "Create professional first resumes" },
              { icon: "🚀", title: "Job Seekers", desc: "Optimize for specific roles" },
              { icon: "👔", title: "HR Professionals", desc: "Analyze incoming resumes" },
              { icon: "📈", title: "Employees", desc: "Career advancement resumes" }
            ].map((user, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{user.icon}</div>
                <h4 className="text-xl font-bold mb-2">{user.title}</h4>
                <p className="text-slate-600 text-sm">{user.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-16 py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="mx-auto mb-6" size={48} />
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have landed their dream jobs with ResumeAid
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-12 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            Start Building Free
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Enhanced Footer */}
      <Footer />
    </main>
  );
}