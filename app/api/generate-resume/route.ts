import { NextRequest, NextResponse } from "next/server";
import { Profile } from "../../src/types/profile";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, jobDescription, targetRole } = body;

    if (!profile || !targetRole) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const content = await generateWithAI(profile, jobDescription, targetRole);
    const safeLatex = wrapLatex(content);

    return NextResponse.json({ latex: safeLatex, source: "ai" });

  } catch (error) {
    console.error("Resume Generation Error:", error);
    return NextResponse.json({ error: "Resume generation failed" }, { status: 500 });
  }
}

async function generateWithAI(
  profile: Profile,
  jobDescription: string,
  targetRole: string
): Promise<string> {

  const prompt = createResumePrompt(profile, jobDescription, targetRole);
  const ollamaHost = process.env.OLLAMA_HOST || "http://localhost:11434";

  const response = await fetch(`${ollamaHost}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || "mistral:latest",
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error("AI request failed");
  }

  const data = await response.json();
  return sanitizeContent(data.response);
}

function createResumePrompt(
  profile: Profile,
  jobDescription: string,
  targetRole: string
): string {
  return `
Generate ONLY the resume CONTENT (NO preamble).

DO NOT include:
- \\documentclass
- \\usepackage
- \\hypersetup
- \\begin{document}
- \\end{document}

Use only:
- \\section*{}
- \\textbf{}
- \\begin{itemize}
- \\item
- \\href{https://...}{text}

Profile:
Name: ${profile.fullName}
Email: ${profile.email}
Phone: ${profile.phone}
Location: ${profile.location}
LinkedIn: ${profile.linkedin || ""}
GitHub: ${profile.github || ""}
Portfolio: ${profile.portfolio || ""}

Target Role: ${targetRole}

Job Description:
${jobDescription}

Structure:

\\begin{center}
NAME
contact line
\\end{center}

\\section*{Professional Summary}

\\section*{Experience}

\\section*{Education}

\\section*{Skills}

\\section*{Projects}

Return ONLY valid LaTeX body content.
`;
}

/* 
   Only clean content-level issues.
   DO NOT sanitize infrastructure anymore.
*/
function sanitizeContent(content: string): string {
  if (!content) return "";

  content = content
    .replace(/```latex?/gi, "")
    .replace(/```/g, "")
    .replace(/\\hrefdefaultcolor/g, "")
    .replace(/\\hrefcolor/g, "")
    .replace(/\\newcommand/g, "")
    .replace(/\\moderncv/g, "")
    .trim();

  content = fixLonelyItems(content);
  content = balanceEnvironments(content);

  return content;
}

function fixLonelyItems(latex: string): string {
  const lines = latex.split("\n");
  let fixed: string[] = [];
  let insideList = false;
  let indentLevel = 0; // Track nesting depth

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if we're explicitly starting/ending a list
    if (trimmed.startsWith("\\begin{itemize}")) {
      insideList = true;
      indentLevel++;
      fixed.push(line);
      continue;
    }

    if (trimmed.startsWith("\\end{itemize}")) {
      insideList = indentLevel > 1; // Still inside if nested
      indentLevel = Math.max(0, indentLevel - 1);
      fixed.push(line);
      continue;
    }

    // If we encounter an \item
    if (trimmed.startsWith("\\item")) {
      if (!insideList) {
        // Start a new list before this orphaned item
        fixed.push("\\begin{itemize}");
        insideList = true;
        indentLevel = 1;
      }
      fixed.push(line);
    } else {
      // Non-item line
      // Close list if we hit a section or other structural element
      if (insideList && indentLevel === 1) {
        // Check if this is a structural break (section, empty line pattern, etc.)
        if (trimmed.startsWith("\\section") || 
            trimmed.startsWith("\\subsection") ||
            trimmed.startsWith("\\begin{center}") ||
            trimmed.startsWith("\\end{center}") ||
            (trimmed === "" && i > 0 && !lines[i-1].trim().startsWith("\\item"))) {
          fixed.push("\\end{itemize}");
          insideList = false;
          indentLevel = 0;
        }
      }
      fixed.push(line);
    }
  }

  // Close any remaining open lists
  while (indentLevel > 0) {
    fixed.push("\\end{itemize}");
    indentLevel--;
  }

  return fixed.join("\n");
}

function balanceEnvironments(latex: string): string {
  const envs = ["itemize", "enumerate", "center"];

  envs.forEach(env => {
    const beginRegex = new RegExp(`\\\\begin\\{${env}\\}`, "g");
    const endRegex = new RegExp(`\\\\end\\{${env}\\}`, "g");
    
    const beginCount = (latex.match(beginRegex) || []).length;
    const endCount = (latex.match(endRegex) || []).length;

    if (beginCount > endCount) {
      const missing = beginCount - endCount;
      for (let i = 0; i < missing; i++) {
        latex += `\n\\end{${env}}`;
      }
    } else if (endCount > beginCount) {
      // Remove extra \end{} tags
      const excess = endCount - beginCount;
      for (let i = 0; i < excess; i++) {
        latex = latex.replace(endRegex, "");
      }
    }
  });

  return latex;
}


/*
   YOU control the preamble.
   This never changes.
*/
function wrapLatex(content: string): string {
  return `
\\documentclass[11pt,a4paper]{article}

\\usepackage[margin=1.5cm]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}

\\hypersetup{
  colorlinks=true,
  urlcolor=blue,
  linkcolor=blue
}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{4pt}

\\begin{document}

${content}

\\end{document}
`.trim();
}