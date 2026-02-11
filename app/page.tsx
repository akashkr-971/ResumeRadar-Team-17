import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="px-10 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          AI Resume Builder & Analyzer
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-gray-600">
          Build professional resumes using profile details or job descriptions.
          Generate LaTeX-based stable formatting and analyze your resume for ATS compatibility.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <Link
            href="/builder"
            className="px-6 py-3 bg-black text-white rounded-md"
          >
            Build Resume
          </Link>

          <Link
            href="/analyzer"
            className="px-6 py-3 border border-black rounded-md"
          >
            Analyze Resume
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-10 py-16 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Key Functionalities
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">
              Profile-Based Resume Generation
            </h3>
            <p className="text-gray-600">
              Generate resumes by entering your personal profile details.
              The system formats and structures the resume automatically.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">
              Job Description-Based Resume
            </h3>
            <p className="text-gray-600">
              Tailor your resume according to a specific job description
              to better match employer requirements.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">
              ATS Analyzer & Suggestions
            </h3>
            <p className="text-gray-600">
              Check your resume against ATS systems and receive suggestions
              to improve keyword matching and compatibility.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="px-10 py-16 bg-gray-100">
        <h2 className="text-3xl font-semibold text-center mb-12">
          System Overview
        </h2>

        <div className="max-w-4xl mx-auto text-gray-700 text-center">
          <p className="mb-4">
            The system uses AI models to generate resume content and provide
            analysis. Resumes are formatted in LaTeX to ensure structural
            stability and consistent formatting across platforms.
          </p>
          <p>
            Designed for students, job seekers, employees, and HR professionals,
            this platform simplifies resume creation and evaluation.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-10 py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} AI Resume Builder & Analyzer
      </footer>
    </main>
  );
}
