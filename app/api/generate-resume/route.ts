import { NextRequest, NextResponse } from "next/server";
import { Profile } from "../../src/types/profile";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, jobDescription, targetRole } = body;

    if (!profile || !targetRole) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Debug logging
    console.log("Profile received:", {
      fullName: profile.fullName,
      experienceCount: profile.experience?.length || 0,
      educationCount: profile.education?.length || 0,
      technicalSkillsCount: profile.technicalSkills?.length || 0,
      projectsCount: profile.projects?.length || 0,
      certificationsCount: profile.certifications?.length || 0,
      languagesCount: profile.languages?.length || 0,
    });

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

  try {
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
      console.warn("AI request failed, falling back to template");
      return generateTemplateResume(profile, jobDescription, targetRole);
    }

    const data = await response.json();
    const aiContent = sanitizeContent(data.response);
    
    // Check if AI generated placeholder content
    if (isPlaceholderContent(aiContent)) {
      console.warn("AI generated placeholder content, using template instead");
      return generateTemplateResume(profile, jobDescription, targetRole);
    }
    
    return aiContent;
  } catch (error) {
    console.warn("AI generation error, falling back to template:", error);
    return generateTemplateResume(profile, jobDescription, targetRole);
  }
}

function isPlaceholderContent(content: string): boolean {
  const placeholders = [
    'Company Name',
    'Position, Location',
    'University Name',
    'Project Name',
    'Brief description',
    'Another Company',
    'Month Year',
    'XYZ Company'
  ];
  
  return placeholders.some(placeholder => content.includes(placeholder));
}

function createResumePrompt(
  profile: Profile,
  jobDescription: string,
  targetRole: string
): string {
  const experiences = profile.experience || [];
  const education = profile.education || [];
  const technicalSkills = profile.technicalSkills || [];
  const softSkills = profile.softSkills || [];
  const projects = profile.projects || [];
  const certifications = profile.certifications || [];
  const languages = profile.languages || [];
  const achievements = profile.achievements || [];
  const publications = profile.publications || [];

  return `You are a resume writer. Generate a professional resume in LaTeX format using ONLY the data provided below.

CRITICAL RULES:
1. DO NOT include: \\documentclass, \\usepackage, \\hypersetup, \\begin{document}, \\end{document}
2. DO NOT use placeholder text like "Company Name" or "Project Name"
3. USE ONLY the actual data from the profile below
4. Return ONLY the LaTeX body content

CANDIDATE DATA:
Name: ${profile.fullName}
Email: ${profile.email}
Phone: ${profile.phone}
Location: ${profile.location}
${profile.linkedin ? `LinkedIn: ${profile.linkedin}` : ''}
${profile.github ? `GitHub: ${profile.github}` : ''}
${profile.portfolio ? `Portfolio: ${profile.portfolio}` : ''}

EXPERIENCE (${experiences.length} entries):
${experiences.length > 0 ? experiences.map((exp, i) => `
${i + 1}. ${exp.position} at ${exp.company}
   Location: ${exp.location}
   Duration: ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
   Responsibilities:
   ${exp.description.map(d => `   - ${d}`).join('\n')}
   Technologies: ${exp.technologies.join(', ')}
`).join('\n') : 'No experience data provided'}

EDUCATION (${education.length} entries):
${education.length > 0 ? education.map((edu, i) => `
${i + 1}. ${edu.degree} in ${edu.field}
   Institution: ${edu.institution}
   Location: ${edu.location}
   Duration: ${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}
   ${edu.gpa ? `GPA: ${edu.gpa}` : ''}
`).join('\n') : 'No education data provided'}

TECHNICAL SKILLS (${technicalSkills.length} skills):
${technicalSkills.length > 0 ? technicalSkills.join(', ') : 'No technical skills'}

SOFT SKILLS (${softSkills.length} skills):
${softSkills.length > 0 ? softSkills.join(', ') : 'No soft skills'}

PROJECTS (${projects.length} entries):
${projects.length > 0 ? projects.map((proj, i) => `
${i + 1}. ${proj.name}
   Description: ${proj.description}
   Technologies: ${proj.technologies.join(', ')}
   Duration: ${proj.startDate}${proj.endDate ? ` - ${proj.endDate}` : ''}
   ${proj.link ? `Link: ${proj.link}` : ''}
`).join('\n') : 'No projects data provided'}

CERTIFICATIONS (${certifications.length} entries):
${certifications.length > 0 ? certifications.map((cert, i) => `
${i + 1}. ${cert.name}
   Issuer: ${cert.issuer}
   Issue Date: ${cert.issueDate}
   ${cert.expiryDate ? `Expiry: ${cert.expiryDate}` : ''}
   ${cert.credentialId ? `ID: ${cert.credentialId}` : ''}
   ${cert.link ? `Link: ${cert.link}` : ''}
`).join('\n') : 'No certifications'}

LANGUAGES (${languages.length} languages):
${languages.length > 0 ? languages.join(', ') : 'No languages'}

ACHIEVEMENTS (${achievements.length} achievements):
${achievements.length > 0 ? achievements.map((a, i) => `${i + 1}. ${a}`).join('\n') : 'No achievements'}

PUBLICATIONS (${publications.length} publications):
${publications.length > 0 ? publications.map((p, i) => `${i + 1}. ${p}`).join('\n') : 'No publications'}

TARGET ROLE: ${targetRole}

JOB DESCRIPTION:
${jobDescription || 'No job description provided'}

NOW GENERATE A PROFESSIONAL RESUME IN LATEX FORMAT USING THE ACTUAL DATA ABOVE. 
Use this structure:

\\begin{center}
\\textbf{\\Large ${profile.fullName}} \\\\
${profile.email} | ${profile.phone} | ${profile.location} \\\\
${[profile.linkedin, profile.github, profile.portfolio].filter(Boolean).map(link => `\\href{${link}}{Link}`).join(' | ')}
\\end{center}

\\section*{Professional Summary}
[Write 2-3 sentences for ${targetRole}]

\\section*{Experience}
[Format each with \\textbf{Position} -- \\textbf{Company}, Location \\hfill Dates
\\begin{itemize} for each responsibility
\\textit{Technologies: ...}]

\\section*{Education}
[Format each entry]

\\section*{Technical Skills}
[List all skills]

\\section*{Projects}
[Format each project]

${certifications.length > 0 ? '\\section*{Certifications}\n[List certifications]' : ''}
${achievements.length > 0 ? '\\section*{Achievements}\n[List achievements]' : ''}
${publications.length > 0 ? '\\section*{Publications}\n[List publications]' : ''}

USE ONLY REAL DATA FROM ABOVE. NO PLACEHOLDERS.`;
}

function generateTemplateResume(
  profile: Profile,
  jobDescription: string,
  targetRole: string
): string {
  const experiences = profile.experience || [];
  const education = profile.education || [];
  const technicalSkills = profile.technicalSkills || [];
  const softSkills = profile.softSkills || [];
  const projects = profile.projects || [];
  const certifications = profile.certifications || [];
  const languages = profile.languages || [];
  const achievements = profile.achievements || [];
  const publications = profile.publications || [];

  let resume = `\\begin{center}
\\textbf{\\Large ${profile.fullName}} \\\\
${profile.email} | ${profile.phone} | ${profile.location} \\\\`;

  const links = [
    profile.linkedin ? `\\href{${profile.linkedin}}{LinkedIn}` : '',
    profile.github ? `\\href{${profile.github}}{GitHub}` : '',
    profile.portfolio ? `\\href{${profile.portfolio}}{Portfolio}` : ''
  ].filter(Boolean).join(' | ');

  if (links) {
    resume += `\n${links}`;
  }

  resume += `\n\\end{center}\n\n`;

  // Professional Summary
  resume += `\\section*{Professional Summary}\n`;
  if (profile.summary) {
    resume += `${profile.summary}\n\n`;
  } else {
    const yearsOfExp = experiences.length > 0 ? `${experiences.length}+ years` : 'experience';
    const topSkills = technicalSkills.slice(0, 3).join(', ');
    resume += `${targetRole || 'Professional'} with ${yearsOfExp} of experience${topSkills ? ` in ${topSkills}` : ''}. Proven track record of delivering high-quality solutions and driving results in fast-paced environments.\n\n`;
  }

  // Experience
  if (experiences.length > 0) {
    resume += `\\section*{Experience}\n`;
    experiences.forEach(exp => {
      resume += `\\textbf{${exp.position}} -- \\textbf{${exp.company}}, ${exp.location} \\hfill ${exp.startDate} -- ${exp.current ? 'Present' : exp.endDate}\n`;
      
      if (exp.description && exp.description.length > 0) {
        resume += `\\begin{itemize}\n`;
        exp.description.forEach(desc => {
          resume += `\\item ${desc}\n`;
        });
        resume += `\\end{itemize}\n`;
      }
      
      if (exp.technologies && exp.technologies.length > 0) {
        resume += `\\textit{Technologies: ${exp.technologies.join(', ')}}\n`;
      }
      
      resume += `\n`;
    });
  }

  // Education
  if (education.length > 0) {
    resume += `\\section*{Education}\n`;
    education.forEach(edu => {
      resume += `\\textbf{${edu.degree} in ${edu.field}} \\hfill ${edu.startDate} -- ${edu.current ? 'Present' : edu.endDate}\n`;
      resume += `${edu.institution}, ${edu.location}\n`;
      
      if (edu.gpa) {
        resume += `GPA: ${edu.gpa}\n`;
      }
      
      resume += `\n`;
    });
  }

  // Technical Skills
  if (technicalSkills.length > 0) {
    resume += `\\section*{Technical Skills}\n`;
    resume += `${technicalSkills.join(', ')}\n\n`;
  }

  // Soft Skills
  if (softSkills.length > 0) {
    resume += `\\section*{Soft Skills}\n`;
    resume += `${softSkills.join(', ')}\n\n`;
  }

  // Projects
  if (projects.length > 0) {
    resume += `\\section*{Projects}\n`;
    projects.forEach(proj => {
      const projectLink = proj.link ? ` (\\href{${proj.link}}{Link})` : '';
      resume += `\\textbf{${proj.name}}${projectLink}\n`;
      resume += `${proj.description}\n`;
      
      if (proj.technologies && proj.technologies.length > 0) {
        resume += `\\textit{Technologies: ${proj.technologies.join(', ')}}\n`;
      }
      
      resume += `\\textit{${proj.startDate}${proj.endDate ? ` - ${proj.endDate}` : ''}}\n`;
      resume += `\n`;
    });
  }

  // Certifications
  if (certifications.length > 0) {
    resume += `\\section*{Certifications}\n`;
    certifications.forEach(cert => {
      resume += `\\textbf{${cert.name}} -- ${cert.issuer} \\hfill ${cert.issueDate}\n`;
      if (cert.credentialId) {
        resume += `Credential ID: ${cert.credentialId}\n`;
      }
      if (cert.link) {
        resume += `\\href{${cert.link}}{View Certificate}\n`;
      }
      resume += `\n`;
    });
  }

  // Languages
  if (languages.length > 0) {
    resume += `\\section*{Languages}\n`;
    resume += `${languages.join(', ')}\n\n`;
  }

  // Achievements
  if (achievements.length > 0) {
    resume += `\\section*{Achievements}\n`;
    resume += `\\begin{itemize}\n`;
    achievements.forEach(achievement => {
      resume += `\\item ${achievement}\n`;
    });
    resume += `\\end{itemize}\n\n`;
  }

  // Publications
  if (publications.length > 0) {
    resume += `\\section*{Publications}\n`;
    resume += `\\begin{itemize}\n`;
    publications.forEach(publication => {
      resume += `\\item ${publication}\n`;
    });
    resume += `\\end{itemize}\n\n`;
  }

  return resume.trim();
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
  let openLists: number[] = []; // Stack to track list nesting

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Handle explicit list starts
    if (trimmed.startsWith("\\begin{itemize}") || trimmed.startsWith("\\begin{enumerate}")) {
      openLists.push(i);
      fixed.push(line);
      continue;
    }

    // Handle explicit list ends
    if (trimmed.startsWith("\\end{itemize}") || trimmed.startsWith("\\end{enumerate}")) {
      if (openLists.length > 0) {
        openLists.pop();
      }
      fixed.push(line);
      continue;
    }

    // Handle orphaned \item tags
    if (trimmed.startsWith("\\item")) {
      // If we're not in a list, start one
      if (openLists.length === 0) {
        fixed.push("\\begin{itemize}");
        openLists.push(i);
      }
      fixed.push(line);
      continue;
    }

    // For non-item, non-list lines
    // Close lists when we hit structural boundaries
    const isStructuralBoundary = 
      trimmed.startsWith("\\section") || 
      trimmed.startsWith("\\subsection") ||
      trimmed.startsWith("\\begin{center}") ||
      trimmed.startsWith("\\end{center}") ||
      trimmed.startsWith("\\end{document}");

    if (isStructuralBoundary && openLists.length > 0) {
      // Close all open lists before the structural element
      while (openLists.length > 0) {
        fixed.push("\\end{itemize}");
        openLists.pop();
      }
    }

    fixed.push(line);

    // Also close lists after 2+ consecutive blank lines (likely section break)
    if (trimmed === "" && i > 0) {
      const prevLine = lines[i - 1]?.trim() || "";
      const nextLine = lines[i + 1]?.trim() || "";
      
      // If we have blank lines surrounding us and we're in a list
      if (prevLine === "" && openLists.length > 0 && !nextLine.startsWith("\\item")) {
        while (openLists.length > 0) {
          fixed.push("\\end{itemize}");
          openLists.pop();
        }
      }
    }
  }

  // Close any remaining open lists at the end
  while (openLists.length > 0) {
    fixed.push("\\end{itemize}");
    openLists.pop();
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
      // Insert missing \end before \end{document}
      const docEndPos = latex.lastIndexOf("\\end{document}");
      if (docEndPos !== -1) {
        const closingTags = Array(missing).fill(`\\end{${env}}`).join("\n");
        latex = latex.substring(0, docEndPos) + closingTags + "\n" + latex.substring(docEndPos);
      } else {
        // No \end{document} found, append to end
        const closingTags = Array(missing).fill(`\\end{${env}}`).join("\n");
        latex += "\n" + closingTags;
      }
    } else if (endCount > beginCount) {
      // Remove extra \end{} tags by replacing them one by one
      const excess = endCount - beginCount;
      let removed = 0;
      const lines = latex.split("\n");
      const filtered = lines.filter(line => {
        if (removed < excess && line.trim() === `\\end{${env}}`) {
          removed++;
          return false; // Remove this line
        }
        return true;
      });
      latex = filtered.join("\n");
    }
  });

  return latex;
}

/*
   YOU control the preamble.
   This never changes.
*/
function wrapLatex(content: string): string {
  // Ensure content doesn't already have document wrapper
  content = content
    .replace(/\\begin\{document\}/g, "")
    .replace(/\\end\{document\}/g, "")
    .replace(/\\documentclass.*?\n/g, "")
    .replace(/\\usepackage.*?\n/g, "")
    .replace(/\\hypersetup\{[\s\S]*?\}/g, "")
    .trim();

  return `\\documentclass[11pt,a4paper]{article}

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

\\end{document}`;
}