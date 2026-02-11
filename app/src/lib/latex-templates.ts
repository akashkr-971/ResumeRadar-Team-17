import { Profile } from "../types/profile";

export function generateFallbackLatex(profile: Profile, targetRole: string): string {
  return `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{banking}
\\moderncvcolor{blue}
\\usepackage[utf8]{inputenc}
\\usepackage[scale=0.85]{geometry}
\\usepackage{hyperref}

% Personal information
\\name{${profile.fullName.split(" ")[0]}}{${profile.fullName.split(" ").slice(1).join(" ")}}
\\address{${profile.location}}{}{}
\\phone[mobile]{${profile.phone}}
\\email{${profile.email}}
${profile.linkedin ? `\\social[linkedin]{${profile.linkedin.replace("https://linkedin.com/in/", "")}}` : ""}
${profile.github ? `\\social[github]{${profile.github.replace("https://github.com/", "")}}` : ""}
${profile.portfolio ? `\\homepage{${profile.portfolio}}` : ""}

\\begin{document}
\\makecvtitle

${generateProfessionalSummary(profile, targetRole)}

${generateExperience(profile)}

${generateEducation(profile)}

${generateSkills(profile)}

${generateProjects(profile)}

${generateCertifications(profile)}

${generateAdditional(profile)}

\\end{document}`;
}

function generateProfessionalSummary(profile: Profile, targetRole: string): string {
  const yearsExp = profile.experience?.length || 0;
  const topSkills = profile.technicalSkills?.slice(0, 5).join(", ") || "";
  
  return `\\section{Professional Summary}
\\cvitem{}{${targetRole} with ${yearsExp}+ years of experience in software development. Proficient in ${topSkills}. Proven track record of delivering high-quality solutions and leading successful projects.}`;
}

function generateExperience(profile: Profile): string {
  if (!profile.experience || profile.experience.length === 0) return "";

  const experiences = profile.experience
    .map(
      (exp) => `\\cventry{${exp.startDate} -- ${exp.current ? "Present" : exp.endDate}}{${exp.position}}{${exp.company}}{${exp.location}}{}{
${exp.description.map((desc) => `\\begin{itemize}\\item ${desc}\\end{itemize}`).join("\n")}
${exp.technologies.length > 0 ? `\\textit{Technologies: ${exp.technologies.join(", ")}}` : ""}
}`
    )
    .join("\n\n");

  return `\\section{Work Experience}\n${experiences}`;
}

function generateEducation(profile: Profile): string {
  if (!profile.education || profile.education.length === 0) return "";

  const education = profile.education
    .map(
      (edu) => `\\cventry{${edu.startDate} -- ${edu.current ? "Present" : edu.endDate}}{${edu.degree}}{${edu.institution}}{${edu.location}}{${edu.gpa ? `GPA: ${edu.gpa}` : ""}}{${edu.field}}`
    )
    .join("\n");

  return `\\section{Education}\n${education}`;
}

function generateSkills(profile: Profile): string {
  if (
    (!profile.technicalSkills || profile.technicalSkills.length === 0) &&
    (!profile.softSkills || profile.softSkills.length === 0)
  ) {
    return "";
  }

  let skillsSection = "\\section{Skills}\n";

  if (profile.technicalSkills && profile.technicalSkills.length > 0) {
    skillsSection += `\\cvitem{Technical}{${profile.technicalSkills.join(", ")}}\n`;
  }

  if (profile.softSkills && profile.softSkills.length > 0) {
    skillsSection += `\\cvitem{Soft Skills}{${profile.softSkills.join(", ")}}\n`;
  }

  if (profile.languages && profile.languages.length > 0) {
    skillsSection += `\\cvitem{Languages}{${profile.languages.join(", ")}}\n`;
  }

  return skillsSection;
}

function generateProjects(profile: Profile): string {
  if (!profile.projects || profile.projects.length === 0) return "";

  const projects = profile.projects
    .map(
      (proj) => `\\cventry{${proj.startDate || ""} -- ${proj.endDate || ""}}{${proj.name}}{}{}{}{
${proj.description}
${proj.technologies.length > 0 ? `\\\\\\textit{Technologies: ${proj.technologies.join(", ")}}` : ""}
${proj.link ? `\\\\\\textit{Link: \\href{${proj.link}}{${proj.link}}}` : ""}
}`
    )
    .join("\n\n");

  return `\\section{Projects}\n${projects}`;
}

function generateCertifications(profile: Profile): string {
  if (!profile.certifications || profile.certifications.length === 0) return "";

  const certifications = profile.certifications
    .map(
      (cert) => `\\cventry{${cert.issueDate}}{${cert.name}}{${cert.issuer}}{}{}{${cert.credentialId ? `ID: ${cert.credentialId}` : ""}}`
    )
    .join("\n");

  return `\\section{Certifications}\n${certifications}`;
}

function generateAdditional(profile: Profile): string {
  let additional = "";

  if (profile.achievements && profile.achievements.length > 0) {
    additional += `\\section{Achievements}\n`;
    additional += profile.achievements
      .map((achievement) => `\\cvlistitem{${achievement}}`)
      .join("\n");
    additional += "\n\n";
  }

  if (profile.publications && profile.publications.length > 0) {
    additional += `\\section{Publications}\n`;
    additional += profile.publications
      .map((pub) => `\\cvlistitem{${pub}}`)
      .join("\n");
  }

  return additional;
}

// Modern professional template
export function generateModernLatex(profile: Profile, targetRole: string): string {
  const yearsExp = profile.experience?.length ? Math.max(profile.experience.length, 2) : 2;
  const topSkills = profile.technicalSkills?.slice(0, 5).join(", ") || "relevant technologies";
  
  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{fontawesome5}

\\geometry{left=1.5cm,right=1.5cm,top=1.5cm,bottom=1.5cm}

% Colors
\\definecolor{primary}{RGB}{0, 102, 204}
\\definecolor{secondary}{RGB}{102, 102, 102}

% Hyperlinks
\\hypersetup{
    colorlinks=true,
    linkcolor=primary,
    urlcolor=primary
}

% Section formatting
\\titleformat{\\section}
  {\\Large\\bfseries\\color{primary}}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{12pt}{6pt}

% No page numbers
\\pagestyle{empty}

% Custom commands
\\newcommand{\\resumeheader}[6]{
  \\begin{center}
    {\\Huge\\bfseries #1} \\\\[8pt]
    \\small
    \\faEnvelope\\ \\href{mailto:#2}{#2} \\quad
    \\faPhone\\ #3 \\quad
    \\faMapMarker\\ #4
    ${profile.linkedin ? `\\\\[4pt] \\faLinkedin\\ \\href{${escapeLatex(profile.linkedin)}}{LinkedIn}` : ""}
    ${profile.github ? `\\quad \\faGithub\\ \\href{${escapeLatex(profile.github)}}{GitHub}` : ""}
    ${profile.portfolio ? `\\quad \\faGlobe\\ \\href{${escapeLatex(profile.portfolio)}}{Portfolio}` : ""}
  \\end{center}
}

\\begin{document}

\\resumeheader{${escapeLatex(profile.fullName)}}{${escapeLatex(profile.email)}}{${escapeLatex(profile.phone)}}{${escapeLatex(profile.location)}}{}{}

${generateModernSummary(profile, targetRole, yearsExp, topSkills)}

${generateModernExperience(profile)}

${generateModernEducation(profile)}

${generateModernSkills(profile)}

${generateModernProjects(profile)}

${generateModernCertifications(profile)}

${generateModernAdditional(profile)}

\\end{document}`;
}

function generateModernSummary(profile: Profile, targetRole: string, yearsExp: number, topSkills: string): string {
  // Generate a meaningful professional summary
  const companyNames = profile.experience?.slice(0, 2).map(exp => exp.company).join(" and ") || "leading organizations";
  const education = profile.education?.[0];
  const degreeInfo = education ? `${education.degree} graduate` : "professional";
  
  return `\\section{Professional Summary}
Results-driven ${targetRole} with ${yearsExp}+ years of experience delivering innovative solutions at ${companyNames}. ${degreeInfo} with expertise in ${topSkills}. Proven track record of leading cross-functional teams, optimizing system performance, and driving projects from conception to successful deployment. Passionate about leveraging technology to solve complex business challenges and deliver measurable impact.`;
}

function generateModernExperience(profile: Profile): string {
  if (!profile.experience || profile.experience.length === 0) return "";

  const experiences = profile.experience
    .map(
      (exp) => `
\\textbf{${escapeLatex(exp.position)}} \\hfill \\textit{${exp.startDate} -- ${exp.current ? "Present" : exp.endDate}} \\\\
\\textit{${escapeLatex(exp.company)}, ${escapeLatex(exp.location)}} \\\\[-6pt]
\\begin{itemize}[leftmargin=*,itemsep=0pt,parsep=2pt]
${exp.description.filter(d => d.trim()).map((desc) => `  \\item ${escapeLatex(desc)}`).join("\n")}
\\end{itemize}
${exp.technologies.length > 0 ? `\\textit{\\small Technologies: ${exp.technologies.map(t => escapeLatex(t)).join(", ")}}` : ""}
`
    )
    .join("\n");

  return `\\section{Work Experience}\n${experiences}`;
}

function generateModernEducation(profile: Profile): string {
  if (!profile.education || profile.education.length === 0) return "";

  const education = profile.education
    .map(
      (edu) => `
\\textbf{${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}} \\hfill \\textit{${edu.startDate} -- ${edu.current ? "Present" : edu.endDate}} \\\\
\\textit{${escapeLatex(edu.institution)}, ${escapeLatex(edu.location)}} ${edu.gpa ? `\\quad GPA: ${edu.gpa}` : ""}`
    )
    .join("\n\n");

  return `\\section{Education}\n${education}`;
}

function generateModernSkills(profile: Profile): string {
  if (
    (!profile.technicalSkills || profile.technicalSkills.length === 0) &&
    (!profile.softSkills || profile.softSkills.length === 0)
  ) {
    return "";
  }

  let skillsSection = "\\section{Skills}\n\\begin{itemize}[leftmargin=*,itemsep=2pt]\n";

  if (profile.technicalSkills && profile.technicalSkills.length > 0) {
    skillsSection += `  \\item \\textbf{Technical:} ${profile.technicalSkills.map(s => escapeLatex(s)).join(", ")}\n`;
  }

  if (profile.softSkills && profile.softSkills.length > 0) {
    skillsSection += `  \\item \\textbf{Soft Skills:} ${profile.softSkills.map(s => escapeLatex(s)).join(", ")}\n`;
  }

  if (profile.languages && profile.languages.length > 0) {
    skillsSection += `  \\item \\textbf{Languages:} ${profile.languages.map(l => escapeLatex(l)).join(", ")}\n`;
  }

  skillsSection += "\\end{itemize}";

  return skillsSection;
}

function generateModernProjects(profile: Profile): string {
  if (!profile.projects || profile.projects.length === 0) return "";

  const projects = profile.projects
    .map(
      (proj) => `
\\textbf{${escapeLatex(proj.name)}} ${proj.link ? `\\href{${proj.link}}{\\faExternalLink}` : ""} \\\\[-6pt]
\\begin{itemize}[leftmargin=*,itemsep=0pt]
  \\item ${escapeLatex(proj.description)}
  ${proj.technologies.length > 0 ? `\\item \\textit{Technologies: ${proj.technologies.map(t => escapeLatex(t)).join(", ")}}` : ""}
\\end{itemize}
`
    )
    .join("\n");

  return `\\section{Projects}\n${projects}`;
}

function generateModernCertifications(profile: Profile): string {
  if (!profile.certifications || profile.certifications.length === 0) return "";

  const certifications = profile.certifications
    .map(
      (cert) => `\\textbf{${escapeLatex(cert.name)}} -- \\textit{${escapeLatex(cert.issuer)}} \\hfill ${cert.issueDate}`
    )
    .join(" \\\\\n");

  return `\\section{Certifications}\n${certifications}`;
}

function generateModernAdditional(profile: Profile): string {
  let additional = "";

  if (profile.achievements && profile.achievements.length > 0) {
    additional += `\\section{Achievements}\n`;
    additional += "\\begin{itemize}[leftmargin=*,itemsep=2pt]\n";
    additional += profile.achievements
      .map((achievement) => `  \\item ${escapeLatex(achievement)}`)
      .join("\n");
    additional += "\n\\end{itemize}\n\n";
  }

  if (profile.publications && profile.publications.length > 0) {
    additional += `\\section{Publications}\n`;
    additional += "\\begin{itemize}[leftmargin=*,itemsep=2pt]\n";
    additional += profile.publications
      .map((pub) => `  \\item ${escapeLatex(pub)}`)
      .join("\n");
    additional += "\n\\end{itemize}";
  }

  return additional;
}

// Helper function to escape LaTeX special characters
function escapeLatex(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[&%$#_{}]/g, "\\$&")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/</g, "\\textless{}")
    .replace(/>/g, "\\textgreater{}");
}