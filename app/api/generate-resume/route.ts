import { NextRequest, NextResponse } from "next/server";
import { Profile } from "../../src/types/profile";
import { generateModernLatex, generateFallbackLatex } from "../../src/lib/latex-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      profile,
      jobDescription,
      targetRole,
      targetCompany,
      additionalInstructions,
      useAI = true,
    }: {
      profile: Profile;
      jobDescription: string;
      targetRole: string;
      targetCompany: string;
      additionalInstructions: string;
      useAI?: boolean;
    } = body;

    // If AI is disabled or not available, use template
    if (!useAI) {
      const latex = generateModernLatex(profile, targetRole);
      return NextResponse.json({ latex, source: "template" });
    }

    try {
      // Try AI generation first
      const latex = await generateWithAI(
        profile,
        jobDescription,
        targetRole,
        targetCompany,
        additionalInstructions
      );
      return NextResponse.json({ latex, source: "ai" });
    } catch (aiError) {
      console.warn("AI generation failed, falling back to template:", aiError);
      
      // Fallback to template
      const latex = generateModernLatex(profile, targetRole);
      return NextResponse.json({ 
        latex, 
        source: "template",
        warning: "AI generation unavailable, using template"
      });
    }
  } catch (error) {
    console.error("Error generating resume:", error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}

async function generateWithAI(
  profile: Profile,
  jobDescription: string,
  targetRole: string,
  targetCompany: string,
  additionalInstructions: string
): Promise<string> {
  const prompt = createResumePrompt(
    profile,
    jobDescription,
    targetRole,
    targetCompany,
    additionalInstructions
  );

  const ollamaHost = process.env.OLLAMA_HOST || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "mistral:latest";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

  try {
    const ollamaResponse = await fetch(`${ollamaHost}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: prompt,
        stream: false,
        options: {
          temperature: parseFloat(process.env.OLLAMA_TEMPERATURE || "0.7"),
          num_predict: parseInt(process.env.OLLAMA_NUM_PREDICT || "4000"),
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status}`);
    }

    const data = await ollamaResponse.json();
    let latexCode = data.response;

    // Extract and clean LaTeX code
    latexCode = extractLatexFromResponse(latexCode);
    latexCode = cleanLatexCode(latexCode);

    // Validate LaTeX
    if (!isValidLatex(latexCode)) {
      throw new Error("Generated LaTeX is invalid");
    }

    return latexCode;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("AI generation timed out");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function createResumePrompt(
  profile: Profile,
  jobDescription: string,
  targetRole: string,
  targetCompany: string,
  additionalInstructions: string
): string {
  // Calculate years of experience
  const yearsExp = profile.experience?.length ? Math.max(profile.experience.length, 2) : 2;
  
  return `You are an expert resume writer and LaTeX specialist. Create a professional, ATS-optimized resume in LaTeX format.

**CRITICAL REQUIREMENTS:**
1. Return ONLY valid LaTeX code - no explanations, no markdown, no extra text
2. Use \\documentclass[11pt,a4paper]{article}
3. Include essential packages: geometry, enumitem, hyperref, xcolor, fontawesome5
4. Make it clean, modern, and ATS-friendly
5. Optimize for keywords from the job description
6. Use bullet points for achievements (start with action verbs)
7. Keep to 1-2 pages maximum
8. Use proper LaTeX escaping for special characters
9. MUST include a Professional Summary section at the top
10. Include ALL sections with actual content from the profile

**LATEX STRUCTURE:**
- Start with \\documentclass
- Include all necessary \\usepackage statements
- Set up geometry (margins around 1.5cm)
- Define custom colors if needed
- Create header with name and contact info
- IMPORTANT: Add Professional Summary section first (3-4 sentences highlighting experience and skills)
- Organize sections: Professional Summary, Experience, Education, Skills, Projects, Certifications
- End with \\end{document}

**PROFILE DATA:**
Name: ${profile.fullName}
Email: ${profile.email}
Phone: ${profile.phone}
Location: ${profile.location}
${profile.linkedin ? `LinkedIn: ${profile.linkedin}` : ""}
${profile.portfolio ? `Portfolio: ${profile.portfolio}` : ""}
${profile.github ? `GitHub: ${profile.github}` : ""}

**TARGET POSITION:** ${targetRole}
${targetCompany ? `**TARGET COMPANY:** ${targetCompany}` : ""}

**PROFESSIONAL SUMMARY TO WRITE:**
Write a compelling 3-4 sentence professional summary that:
- Highlights ${yearsExp}+ years of experience in the field
- Mentions top 3-5 technical skills from: ${profile.technicalSkills?.slice(0, 5).join(", ") || "relevant technologies"}
- Emphasizes achievements and impact
- Aligns with the target role of ${targetRole}
- Uses strong action words and quantifiable achievements

${jobDescription ? `**JOB DESCRIPTION (optimize for these keywords):**\n${jobDescription}\n` : ""}

**PROFESSIONAL EXPERIENCE:**
${profile.experience
  ?.map(
    (exp: any, idx: number) => `
${idx + 1}. ${exp.position} | ${exp.company} | ${exp.location}
   ${exp.startDate} - ${exp.current ? "Present" : exp.endDate}
   Achievements:
${exp.description.filter((d: string) => d.trim()).map((desc: string) => `   - ${desc}`).join("\n")}
   Technologies: ${exp.technologies.join(", ")}
`
  )
  .join("\n") || "No experience listed"}

**EDUCATION:**
${profile.education
  ?.map(
    (edu: any) => `
- ${edu.degree} in ${edu.field}
  ${edu.institution}, ${edu.location}
  ${edu.startDate} - ${edu.current ? "Present" : edu.endDate}
  ${edu.gpa ? `GPA: ${edu.gpa}` : ""}
`
  )
  .join("\n") || "No education listed"}

**TECHNICAL SKILLS:**
${profile.technicalSkills?.join(", ") || "None"}

**SOFT SKILLS:**
${profile.softSkills?.join(", ") || "None"}

${
  profile.projects && profile.projects.length > 0
    ? `**KEY PROJECTS:**
${profile.projects
  .map(
    (proj: any) => `
- ${proj.name}
  ${proj.description}
  Technologies: ${proj.technologies.join(", ")}
  ${proj.link ? `Link: ${proj.link}` : ""}
  ${proj.startDate ? `Duration: ${proj.startDate} - ${proj.endDate || "Present"}` : ""}
`
  )
  .join("\n")}`
    : ""
}

${
  profile.certifications && profile.certifications.length > 0
    ? `**CERTIFICATIONS:**
${profile.certifications
  .map(
    (cert: any) => `
- ${cert.name} | ${cert.issuer} | ${cert.issueDate}
  ${cert.credentialId ? `Credential ID: ${cert.credentialId}` : ""}
  ${cert.link ? `Verify: ${cert.link}` : ""}
`
  )
  .join("\n")}`
    : ""
}

${profile.languages && profile.languages.length > 0 ? `**LANGUAGES:** ${profile.languages.join(", ")}` : ""}

${profile.achievements && profile.achievements.length > 0 ? `**ACHIEVEMENTS:**\n${profile.achievements.map((a: string) => `- ${a}`).join("\n")}` : ""}

${additionalInstructions ? `**SPECIAL INSTRUCTIONS:**\n${additionalInstructions}` : ""}

**FORMATTING GUIDELINES:**
- Use professional fonts and clean layout
- Include icons for contact info (\\faEnvelope, \\faPhone, \\faMapMarker, \\faLinkedin, \\faGithub)
- Use \\textbf{} for emphasis
- Use \\section{} for main sections (Professional Summary, Experience, Education, Skills, Projects, Certifications)
- Use itemize environment for bullet points with [leftmargin=*,itemsep=2pt]
- Add proper spacing between sections (\\vspace{})
- Make section headers stand out with color or lines
- Ensure all special characters are properly escaped (%, &, $, #, _, {, })
- Use \\href{url}{text} for links

**EXAMPLE STRUCTURE:**
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1.5cm]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{fontawesome5}

\\begin{document}

% Header with name and contact
% Professional Summary section (REQUIRED - 3-4 sentences)
% Experience section with bullet points
% Education section
% Skills section
% Projects section (if applicable)
% Certifications section (if applicable)

\\end{document}

Generate the complete LaTeX code now. Return ONLY the LaTeX code, nothing else. Make sure to include the Professional Summary section with compelling content based on the profile data.`;
}

function extractLatexFromResponse(response: string): string {
  // Remove markdown code blocks
  let latex = response.replace(/```latex?\n?/gi, "").replace(/```\n?/g, "");

  // Find LaTeX document
  const docMatch = latex.match(/\\documentclass[\s\S]*?\\end\{document\}/);
  if (docMatch) {
    return docMatch[0];
  }

  return latex;
}

function cleanLatexCode(latex: string): string {
  // Remove any text before \documentclass
  const docStart = latex.indexOf("\\documentclass");
  if (docStart > 0) {
    latex = latex.substring(docStart);
  }

  // Remove any text after \end{document}
  const docEnd = latex.lastIndexOf("\\end{document}");
  if (docEnd > -1) {
    latex = latex.substring(0, docEnd + "\\end{document}".length);
  }

  // Ensure proper document structure
  if (!latex.includes("\\begin{document}")) {
    const insertPoint = latex.indexOf("\\documentclass");
    if (insertPoint > -1) {
      const endOfPreamble = latex.indexOf("\n\n", insertPoint + 100);
      if (endOfPreamble > -1) {
        latex =
          latex.substring(0, endOfPreamble) +
          "\n\n\\begin{document}\n" +
          latex.substring(endOfPreamble);
      }
    }
  }

  if (!latex.includes("\\end{document}")) {
    latex += "\n\\end{document}";
  }

  return latex.trim();
}

function isValidLatex(latex: string): boolean {
  // Basic validation
  const hasDocClass = latex.includes("\\documentclass");
  const hasBeginDoc = latex.includes("\\begin{document}");
  const hasEndDoc = latex.includes("\\end{document}");
  const isNotEmpty = latex.length > 100;

  return hasDocClass && hasBeginDoc && hasEndDoc && isNotEmpty;
}