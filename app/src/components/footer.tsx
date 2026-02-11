import Link from "next/link";
import { Zap, Mail, Linkedin, Twitter, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white rounded-xl">
                <Zap className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold">RESUMEAID</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              AI-powered resume building and analysis platform helping professionals land their dream jobs.
            </p>
            <div className="flex gap-4 mt-6">
              <a 
                href="#" 
                className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="#" 
                className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Product</h3>
            <ul className="space-y-4 text-slate-400">
              <li><Link href="/builder" className="hover:text-white transition-colors">Resume Builder</Link></li>
              <li><Link href="/analyzer" className="hover:text-white transition-colors">ATS Analyzer</Link></li>
              <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-6">Resources</h3>
            <ul className="space-y-4 text-slate-400">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/guides" className="hover:text-white transition-colors">ATS Guides</Link></li>
              <li><Link href="/examples" className="hover:text-white transition-colors">Resume Examples</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact</h3>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <a 
                  href="mailto:support@resumeaid.com" 
                  className="hover:text-white transition-colors"
                >
                  support@resumeaid.com
                </a>
              </li>
              <li>24/7 Support Available</li>
              <li>Response within 24 hours</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} AI Resume Builder & Analyzer. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}