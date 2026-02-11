# 🚀 AI-Powered Resume Builder

A modern, intelligent resume builder that uses local AI (Ollama) to generate professional, ATS-optimized LaTeX resumes. Edit in real-time with live PDF preview.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Ollama](https://img.shields.io/badge/Ollama-Powered-green)

## ✨ Features

- 🤖 **AI-Powered Generation** - Uses Ollama (local LLM) to create tailored resumes
- 📝 **Live LaTeX Editor** - Edit resume code with real-time preview
- 👁️ **Instant PDF Preview** - See changes immediately in split-pane view
- 🎯 **ATS Optimized** - Built-in optimization for Applicant Tracking Systems
- 💾 **Multiple Profiles** - Save different professional profiles
- 🎨 **Professional Templates** - Automatic fallback to clean templates
- 📥 **One-Click Export** - Download as PDF or copy LaTeX code
- 🔒 **100% Private** - All processing happens locally, no data sent to cloud
- ⚡ **Fast & Responsive** - Modern React with Next.js 14
- 🌐 **Fully Offline** - Works without internet (after setup)

## 🎬 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Ollama (for AI generation)
- LaTeX distribution (for PDF compilation)

### One-Command Setup

```bash
# Clone your repository
git clone <your-repo>
cd <your-repo>

# Run automated setup
chmod +x setup.sh
./setup.sh
```

The setup script will:

- ✅ Check Node.js and npm
- ✅ Install Ollama
- ✅ Download AI model (llama3.2)
- ✅ Install LaTeX distribution
- ✅ Install required LaTeX packages
- ✅ Install npm dependencies
- ✅ Create environment file

### Manual Setup

If you prefer manual installation, see [LATEX_SETUP.md](docs/LATEX_SETUP.md).

### Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/builder` to start building resumes!

## 📁 Project Structure

```
your-project/
├── app/
│   ├── builder/
│   │   ├── page.tsx                    # Profile management
│   │   └── resume/
│   │       └── [id]/
│   │           └── page.tsx            # Resume builder UI
│   └── api/
│       ├── generate-resume/
│       │   └── route.ts                # AI resume generation
│       └── compile-latex/
│           └── route.ts                # PDF compilation
├── src/
│   ├── components/
│   │   ├── AddProfileForm.tsx          # Profile creation form
│   │   ├── navbar.tsx                  # Navigation
│   │   └── footer.tsx                  # Footer
│   ├── lib/
│   │   ├── profilestore.ts             # Profile storage
│   │   └── latex-templates.ts          # LaTeX templates
│   └── types/
│       └── profile.ts                  # TypeScript types
├── docs/
│   ├── LATEX_SETUP.md                  # Installation guide
│   └── USAGE_GUIDE.md                  # Usage instructions
├── IMPLEMENTATION_SUMMARY.md           # Technical details
└── setup.sh                            # Automated setup script
```

## 🎯 How It Works

1. **Create Profile** - Add your experience, education, skills, and projects
2. **Enter Job Details** - Specify target role and paste job description
3. **AI Generation** - Ollama analyzes and creates tailored LaTeX resume
4. **Live Editing** - Modify LaTeX code with instant PDF preview
5. **Export** - Download professional PDF or copy LaTeX code

## 🛠️ Technology Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icon system

### AI & Processing

- **Ollama** - Local LLM for resume generation
- **Llama 3.2** - Efficient language model
- **LaTeX** - Professional document typesetting
- **pdflatex** - PDF compilation

### Storage

- **localStorage** - Client-side profile storage
- **File System** - Temporary LaTeX compilation

### 🧪 Test Cases
Test Case 1: Job Role-Based Resume Generation
Input:
Education: B.Tech Computer Science
Skills: Python, SQL
Job Role: Data Analyst
Expected Output:
Resume generated with job-specific summary
Relevant skills highlighted

Test Case 2: ATS Score Evaluation
Input: Resume without SQL keyword
Job Description requires SQL
Expected Output:
ATS Score below 70%
Risk factor: Missing SQL skill

Test Case 3: Job Probability Prediction
Input: Strong matching resume + matching JD
Expected Output:
Job probability above 80%
Low recruiter risk

Test Case 4: Personal Branding Score
Input: GitHub with 2 repos and low activity
Expected Output:
Low GitHub score
Suggestion to improve project consistency

## 📖 Documentation

- **[Installation Guide](docs/LATEX_SETUP.md)** - Complete setup instructions
- **[Usage Guide](docs/USAGE_GUIDE.md)** - How to use the resume builder
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Technical details and architecture
- **API Documentation** - Inline code comments in API routes

## 🚀 Usage Example

### 1. Create a Profile

```typescript
// Navigate to /builder
// Click "Add New Profile"
// Fill in your details:
{
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+1-234-567-8900",
  location: "San Francisco, CA",
  experience: [...],
  education: [...],
  technicalSkills: ["React", "Node.js", "Python"],
  // ... more fields
}
```

### 2. Generate Resume

```typescript
// Click "Build Resume" on your profile
// Enter job details:
{
  targetRole: "Senior Software Engineer",
  targetCompany: "Google",
  jobDescription: "Full job posting text...",
  additionalInstructions: "Emphasize Python and ML experience"
}
```

### 3. Edit and Export

- Edit LaTeX code in left pane
- See live preview in right pane
- Auto-compile on change (or manual)
- Download PDF when satisfied

## 🎨 Features in Detail

### AI-Powered Generation

- Analyzes job description for keywords
- Tailors resume to target role
- Optimizes for ATS systems
- Uses professional formatting
- Includes relevant sections

### Live Editor

- Syntax-aware LaTeX editing
- Real-time validation
- Error detection
- Line numbers
- Auto-indentation

### PDF Preview

- Instant compilation
- Side-by-side view
- Full-screen mode
- Download button
- Print support

### Template Library

Multiple professional templates:

- **ModernCV** - Classic academic style
- **Modern Professional** - Clean corporate look
- **Custom** - Create your own

## 🔧 Configuration

### Environment Variables

```env
# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_TEMPERATURE=0.7
OLLAMA_NUM_PREDICT=4000

# LaTeX Configuration
LATEX_TIMEOUT=30000
MAX_RESUME_SIZE=1048576
```

### Customization

```typescript
// src/lib/latex-templates.ts
export function generateCustomLatex(profile: Profile) {
  // Your custom template logic
}
```

## 📊 Performance

- **AI Generation**: ~10-30 seconds (depends on model)
- **PDF Compilation**: ~2-3 seconds
- **Live Preview**: <1 second update time
- **Profile Load**: Instant (localStorage)

## 🔐 Privacy & Security

- ✅ All data stored locally in browser
- ✅ AI processing runs on your machine
- ✅ No data sent to external servers
- ✅ No user tracking or analytics
- ✅ Temporary files auto-cleaned
- ✅ Input sanitization for LaTeX

## 🐛 Troubleshooting

### Ollama Not Running

```bash
ollama serve
```

### LaTeX Errors

```bash
# Install missing packages
sudo tlmgr install [package-name]

# Update all packages
sudo tlmgr update --self --all
```

### PDF Not Compiling

- Check LaTeX syntax errors
- Verify pdflatex is in PATH
- Review error messages in console

See [LATEX_SETUP.md](docs/LATEX_SETUP.md) for more troubleshooting.

## 🚀 Deployment

### Docker

```dockerfile
FROM node:18-alpine

RUN apk add --no-cache texlive-full
RUN curl -fsSL https://ollama.com/install.sh | sh

WORKDIR /app
COPY . .
RUN npm install && npm run build

CMD ["sh", "-c", "ollama serve & npm start"]
```

### Environment

```env
NODE_ENV=production
OLLAMA_HOST=http://ollama:11434
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🗺️ Roadmap

### Phase 1 (Current)

- [x] Profile management
- [x] AI resume generation
- [x] LaTeX editor
- [x] PDF compilation
- [x] Template library

### Phase 2 (Planned)

- [ ] Multiple resume templates
- [ ] Cover letter generation
- [ ] Version history
- [ ] Export to DOCX/HTML
- [ ] ATS scoring

### Phase 3 (Future)

- [ ] Collaborative editing
- [ ] Template marketplace
- [ ] Interview prep
- [ ] Skill gap analysis
- [ ] Mobile apps

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ollama** - Local LLM runtime
- **Meta** - Llama models
- **LaTeX Project** - Document preparation system
- **ModernCV** - LaTeX resume template
- **FontAwesome** - Icon library
- **Next.js** - React framework

## 📧 Support

- **Documentation**: See docs folder
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

## 🎓 Resources

- [Ollama Documentation](https://ollama.com/docs)
- [LaTeX Tutorial](https://www.latex-project.org/help/documentation/)
- [Resume Writing Guide](https://www.indeed.com/career-advice/resumes-cover-letters/how-to-make-a-resume)
- [ATS Optimization](https://www.jobscan.co/blog/ats-resume/)

## 📈 Stats

- **Lines of Code**: ~3,000+
- **Files**: 15+
- **Components**: 10+
- **API Routes**: 2
- **Templates**: 2+

---

**Built with ❤️ using Next.js, TypeScript, Ollama, and LaTeX**

**Star ⭐ this repo if you find it helpful!**
