"use client";

import { useState } from "react";
import { Profile, Experience, Education, Project, Certification } from "../types/profile";
import { Plus, Trash2, X, Briefcase, GraduationCap, Code, Award, Globe, AlertCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface AddProfileFormProps {
  onAdd: (profile: Profile) => void;
  initialData?: Profile | null;
}

// Common technology suggestions
const commonTechnologies = [
  "JavaScript", "TypeScript", "React", "Vue", "Angular", "Node.js", "Python",
  "Java", "C#", "C++", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin",
  "HTML", "CSS", "SASS", "Tailwind", "Bootstrap", "Next.js", "Express",
  "Django", "Flask", "Spring", ".NET", "Laravel", "Ruby on Rails",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Git",
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "GraphQL",
  "REST API", "Microservices", "CI/CD", "Jenkins", "GitLab", "GitHub Actions",
  "React Native", "Flutter", "Android", "iOS", "Unity", "Unreal Engine",
  "Machine Learning", "TensorFlow", "PyTorch", "Data Science", "Tableau",
  "Figma", "Adobe XD", "Photoshop", "Illustrator"
];

// Common soft skills
const commonSoftSkills = [
  "Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking",
  "Adaptability", "Time Management", "Creativity", "Project Management", "Agile/Scrum",
  "Public Speaking", "Negotiation", "Conflict Resolution", "Emotional Intelligence",
  "Attention to Detail", "Strategic Thinking", "Decision Making", "Mentoring"
];

export default function AddProfileForm({ onAdd, initialData }: AddProfileFormProps) {
  const isEditMode = !!initialData;
  
  // Basic Information
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [linkedin, setLinkedin] = useState(initialData?.linkedin || "");
  const [portfolio, setPortfolio] = useState(initialData?.portfolio || "");
  const [github, setGithub] = useState(initialData?.github || "");
  
  // Work Experience
  const [experiences, setExperiences] = useState<Experience[]>(
    initialData?.experience?.length 
      ? initialData.experience 
      : [{
          id: uuidv4(),
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: [""],
          technologies: []
        }]
  );

  // Education
  const [educations, setEducations] = useState<Education[]>(
    initialData?.education?.length 
      ? initialData.education 
      : [{
          id: uuidv4(),
          institution: "",
          degree: "",
          field: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          gpa: ""
        }]
  );

  // Technical Skills
  const [techSkillInput, setTechSkillInput] = useState("");
  const [technicalSkills, setTechnicalSkills] = useState<string[]>(
    initialData?.technicalSkills || []
  );

  // Soft Skills
  const [softSkillInput, setSoftSkillInput] = useState("");
  const [softSkills, setSoftSkills] = useState<string[]>(
    initialData?.softSkills || []
  );

  // Projects
  const [projects, setProjects] = useState<Project[]>(
    initialData?.projects?.length 
      ? initialData.projects 
      : [{
          id: uuidv4(),
          name: "",
          description: "",
          technologies: [],
          link: "",
          startDate: "",
          endDate: ""
        }]
  );

  // Certifications
  const [certifications, setCertifications] = useState<Certification[]>(
    initialData?.certifications?.length 
      ? initialData.certifications 
      : [{
          id: uuidv4(),
          name: "",
          issuer: "",
          issueDate: "",
          expiryDate: "",
          credentialId: "",
          link: ""
        }]
  );

  // Languages
  const [languageInput, setLanguageInput] = useState("");
  const [languages, setLanguages] = useState<string[]>(
    initialData?.languages || []
  );

  // Additional Sections
  const [achievementInput, setAchievementInput] = useState("");
  const [achievements, setAchievements] = useState<string[]>(
    initialData?.achievements || []
  );

  const [publicationInput, setPublicationInput] = useState("");
  const [publications, setPublications] = useState<string[]>(
    initialData?.publications || []
  );

  // Job Preferences
  const [targetRole, setTargetRole] = useState(initialData?.targetRole || "");
  const [targetIndustry, setTargetIndustry] = useState(initialData?.targetIndustry || "");

  // UI State
  const [activeSection, setActiveSection] = useState<string>("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic info validation
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!location.trim()) newErrors.location = "Location is required";

    // Experience validation
    experiences.forEach((exp, index) => {
      if (!exp.company.trim()) newErrors[`exp_${index}_company`] = "Company is required";
      if (!exp.position.trim()) newErrors[`exp_${index}_position`] = "Position is required";
      if (!exp.startDate) newErrors[`exp_${index}_startDate`] = "Start date is required";
      if (!exp.current && !exp.endDate) newErrors[`exp_${index}_endDate`] = "End date is required";
    });

    // Education validation
    educations.forEach((edu, index) => {
      if (!edu.institution.trim()) newErrors[`edu_${index}_institution`] = "Institution is required";
      if (!edu.degree.trim()) newErrors[`edu_${index}_degree`] = "Degree is required";
      if (!edu.field.trim()) newErrors[`edu_${index}_field`] = "Field of study is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add skill from input or pill click
  const addTechnicalSkill = (skill?: string) => {
    const skillToAdd = skill || techSkillInput.trim();
    if (skillToAdd && !technicalSkills.includes(skillToAdd)) {
      setTechnicalSkills([...technicalSkills, skillToAdd]);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.technicalSkills;
        return newErrors;
      });
    }
    setTechSkillInput("");
  };

  const removeTechnicalSkill = (skill: string) => {
    setTechnicalSkills(technicalSkills.filter(s => s !== skill));
  };

  // Add soft skill
  const addSoftSkill = (skill?: string) => {
    const skillToAdd = skill || softSkillInput.trim();
    if (skillToAdd && !softSkills.includes(skillToAdd)) {
      setSoftSkills([...softSkills, skillToAdd]);
    }
    setSoftSkillInput("");
  };

  const removeSoftSkill = (skill: string) => {
    setSoftSkills(softSkills.filter(s => s !== skill));
  };


  const [projectTechInput, setProjectTechInput] = useState<string>("");

const addProjectTechnology = (projectId: string, tech?: string) => {
  const techToAdd = tech || projectTechInput.trim();
  if (techToAdd) {
    setProjects(projects.map(proj => 
      proj.id === projectId 
        ? { ...proj, technologies: [...proj.technologies, techToAdd] }
        : proj
    ));
  }
  setProjectTechInput("");
};

const removeProjectTechnology = (projectId: string, tech: string) => {
  setProjects(projects.map(proj => 
    proj.id === projectId 
      ? { ...proj, technologies: proj.technologies.filter(t => t !== tech) }
      : proj
  ));
};

  // Add language
  const addLanguage = (lang?: string) => {
    const langToAdd = lang || languageInput.trim();
    if (langToAdd && !languages.includes(langToAdd)) {
      setLanguages([...languages, langToAdd]);
    }
    setLanguageInput("");
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  // Add achievement
  const addAchievement = () => {
    if (achievementInput.trim() && !achievements.includes(achievementInput.trim())) {
      setAchievements([...achievements, achievementInput.trim()]);
      setAchievementInput("");
    }
  };

  const removeAchievement = (achievement: string) => {
    setAchievements(achievements.filter(a => a !== achievement));
  };

  // Add publication
  const addPublication = () => {
    if (publicationInput.trim() && !publications.includes(publicationInput.trim())) {
      setPublications([...publications, publicationInput.trim()]);
      setPublicationInput("");
    }
  };

  const removePublication = (publication: string) => {
    setPublications(publications.filter(p => p !== publication));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const element = document.querySelector(`[data-error="${firstErrorKey}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const now = new Date().toISOString();
    const newProfile: Profile = {
      id: initialData?.id || uuidv4(),
      fullName,
      email,
      phone,
      location,
      linkedin,
      portfolio,
      github,
      experience: experiences.filter(exp => exp.company && exp.position),
      education: educations.filter(edu => edu.institution && edu.degree),
      technicalSkills,
      softSkills,
      projects: projects.filter(proj => proj.name && proj.description),
      certifications: certifications.filter(cert => cert.name && cert.issuer),
      languages,
      achievements,
      publications,
      targetRole,
      targetIndustry,
      createdAt: initialData?.createdAt || now,
      updatedAt: now
    };

    onAdd(newProfile);
    if (!isEditMode) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setLocation("");
    setLinkedin("");
    setPortfolio("");
    setGithub("");
    setExperiences([{
      id: uuidv4(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""],
      technologies: []
    }]);
    setEducations([{
      id: uuidv4(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: ""
    }]);
    setTechnicalSkills([]);
    setSoftSkills([]);
    setProjects([{
      id: uuidv4(),
      name: "",
      description: "",
      technologies: [],
      link: "",
      startDate: "",
      endDate: ""
    }]);
    setCertifications([{
      id: uuidv4(),
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      link: ""
    }]);
    setLanguages([]);
    setAchievements([]);
    setPublications([]);
    setTargetRole("");
    setTargetIndustry("");
    setErrors({});
  };

  // Experience Handlers
  const addExperience = () => {
    setExperiences([...experiences, {
      id: uuidv4(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""],
      technologies: []
    }]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: Experience[keyof Experience]) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
    // Clear error for this field
    const index = experiences.findIndex(exp => exp.id === id);
    if (index > -1) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`exp_${index}_${field}`];
        return newErrors;
      });
    }
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  const addExperienceDescription = (expId: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === expId 
        ? { ...exp, description: [...exp.description, ""] }
        : exp
    ));
  };

  const updateExperienceDescription = (expId: string, index: number, value: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === expId 
        ? { 
            ...exp, 
            description: exp.description.map((desc, i) => 
              i === index ? value : desc
            )
          }
        : exp
    ));
  };

  const removeExperienceDescription = (expId: string, index: number) => {
    setExperiences(experiences.map(exp => 
      exp.id === expId && exp.description.length > 1
        ? { 
            ...exp, 
            description: exp.description.filter((_, i) => i !== index)
          }
        : exp
    ));
  };

  // Education Handlers
  const addEducation = () => {
    setEducations([...educations, {
      id: uuidv4(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: ""
    }]);
  };

  const updateEducation = (id: string, field: keyof Education, value: Education[keyof Education]) => {
    setEducations(educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
    // Clear error for this field
    const index = educations.findIndex(edu => edu.id === id);
    if (index > -1) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`edu_${index}_${field}`];
        return newErrors;
      });
    }
  };

  const removeEducation = (id: string) => {
    if (educations.length > 1) {
      setEducations(educations.filter(edu => edu.id !== id));
    }
  };

  // Project Handlers
  const addProject = () => {
    setProjects([...projects, {
      id: uuidv4(),
      name: "",
      description: "",
      technologies: [],
      link: "",
      startDate: "",
      endDate: ""
    }]);
  };

  const updateProject = (id: string, field: keyof Project, value: Project[keyof Project]) => {
    setProjects(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const removeProject = (id: string) => {
    if (projects.length > 1) {
      setProjects(projects.filter(proj => proj.id !== id));
    }
  };

  // Certification Handlers
  const addCertification = () => {
    setCertifications([...certifications, {
      id: uuidv4(),
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      link: ""
    }]);
  };

  const updateCertification = (id: string, field: keyof Certification, value: Certification[keyof Certification]) => {
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const removeCertification = (id: string) => {
    if (certifications.length > 1) {
      setCertifications(certifications.filter(cert => cert.id !== id));
    }
  };

  // Navigation sections
  const sections = [
    { id: "basic", label: "Basic Info", icon: "👤" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "🛠️" },
    { id: "projects", label: "Projects", icon: "🚀" },
    { id: "certifications", label: "Certifications", icon: "🏆" },
    { id: "additional", label: "Additional", icon: "➕" },
  ];

  // Error message helper function
  const renderErrorMessage = (errorKey: string) => {
    const error = errors[errorKey];
    if (!error) return null;
    
    return (
      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm" data-error={errorKey}>
        <AlertCircle size={14} />
        <span>{error}</span>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeSection === section.id
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>{section.icon}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Form Title */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">
          {isEditMode ? "Edit Profile" : "Create New Profile"}
        </h3>
        {Object.keys(errors).length > 0 && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            <AlertCircle size={16} />
            <span className="text-sm">Please fix {Object.keys(errors).length} error(s)</span>
          </div>
        )}
      </div>

      {/* Basic Information */}
      {activeSection === "basic" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.fullName;
                    return newErrors;
                  });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.fullName ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="John Doe"
              />
              {renderErrorMessage("fullName")}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.email;
                    return newErrors;
                  });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.email ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="john@example.com"
              />
              {renderErrorMessage("email")}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.phone;
                    return newErrors;
                  });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.phone ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {renderErrorMessage("phone")}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.location;
                    return newErrors;
                  });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.location ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="San Francisco, CA"
              />
              {renderErrorMessage("location")}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Portfolio/GitHub
              </label>
              <input
                type="url"
                value={portfolio || github}
                onChange={(e) => setPortfolio(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="https://github.com/username"
              />
            </div>
          </div>
        </div>
      )}

      {/* Work Experience */}
      {activeSection === "experience" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="text-blue-600" size={20} />
              </div>
              <h3 className="text-xl font-bold">Work Experience</h3>
            </div>
            <button
              type="button"
              onClick={addExperience}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Experience
            </button>
          </div>

          {experiences.map((exp, index) => (
            <div key={exp.id} className="border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold">Experience #{index + 1}</h4>
                {experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors[`exp_${index}_company`] ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Google"
                  />
                  {renderErrorMessage(`exp_${index}_company`)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors[`exp_${index}_position`] ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Senior Software Engineer"
                  />
                  {renderErrorMessage(`exp_${index}_position`)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    required
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors[`exp_${index}_startDate`] ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {renderErrorMessage(`exp_${index}_startDate`)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Date {!exp.current && "*"}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      disabled={exp.current}
                      className={`w-full px-4 py-2 border rounded-lg disabled:bg-slate-100 ${
                        errors[`exp_${index}_endDate`] ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => {
                          updateExperience(exp.id, "current", e.target.checked);
                          if (e.target.checked) {
                            setErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors[`exp_${index}_endDate`];
                              return newErrors;
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">Current</span>
                    </label>
                  </div>
                  {renderErrorMessage(`exp_${index}_endDate`)}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Job Description
                  </label>
                  {exp.description.map((desc, descIndex) => (
                    <div key={descIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={desc}
                        onChange={(e) => updateExperienceDescription(exp.id, descIndex, e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                        placeholder="• Led a team of 5 developers..."
                      />
                      {exp.description.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperienceDescription(exp.id, descIndex)}
                          className="p-2 text-slate-500 hover:text-red-600 rounded-lg"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addExperienceDescription(exp.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add bullet point
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {activeSection === "education" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="text-blue-600" size={20} />
              </div>
              <h3 className="text-xl font-bold">Education</h3>
            </div>
            <button
              type="button"
              onClick={addEducation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Education
            </button>
          </div>

          {educations.map((edu, index) => (
            <div key={edu.id} className="border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold">Education #{index + 1}</h4>
                {educations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors[`edu_${index}_institution`] ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Stanford University"
                  />
                  {renderErrorMessage(`edu_${index}_institution`)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Degree *
                  </label>
                  <input
                    type="text"
                    required
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors[`edu_${index}_degree`] ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Bachelor of Science"
                  />
                  {renderErrorMessage(`edu_${index}_degree`)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    required
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors[`edu_${index}_field`] ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Computer Science"
                  />
                  {renderErrorMessage(`edu_${index}_field`)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    GPA
                  </label>
                  <input
                    type="text"
                    value={edu.gpa || ""}
                    onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    placeholder="3.8/4.0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {activeSection === "skills" && (
        <div className="space-y-8">
          {/* Technical Skills */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Code className="text-blue-600" size={20} />
              </div>
              <h3 className="text-xl font-bold">Technical Skills</h3>
            </div>
            
            <div className="mb-4">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={techSkillInput}
                  onChange={(e) => setTechSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnicalSkill())}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                  placeholder="Type a skill and press Enter..."
                />
                <button
                  type="button"
                  onClick={() => addTechnicalSkill()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {/* Selected Skills */}
              {technicalSkills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-slate-600 mb-2">Your Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {technicalSkills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeTechnicalSkill(skill)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Common Technology Suggestions */}
            <div>
              <p className="text-sm text-slate-600 mb-2">Common technologies:</p>
              <div className="flex flex-wrap gap-2">
                {commonTechnologies.slice(0, 20).map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => addTechnicalSkill(tech)}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors text-sm"
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Soft Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Soft Skills</h3>
            
            <div className="mb-4">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={softSkillInput}
                  onChange={(e) => setSoftSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSoftSkill())}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                  placeholder="Type a soft skill and press Enter..."
                />
                <button
                  type="button"
                  onClick={() => addSoftSkill()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {/* Selected Soft Skills */}
              {softSkills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-slate-600 mb-2">Your Soft Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {softSkills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSoftSkill(skill)}
                          className="ml-1 text-green-500 hover:text-green-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Common Soft Skill Suggestions */}
            <div>
              <p className="text-sm text-slate-600 mb-2">Common soft skills:</p>
              <div className="flex flex-wrap gap-2">
                {commonSoftSkills.slice(0, 15).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSoftSkill(skill)}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors text-sm"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects */}
{activeSection === "projects" && (
  <div className="space-y-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Globe className="text-blue-600" size={20} />
        </div>
        <h3 className="text-xl font-bold">Projects</h3>
      </div>
      <button
        type="button"
        onClick={addProject}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={16} />
        Add Project
      </button>
    </div>

    {projects.map((proj, index) => (
      <div key={proj.id} className="border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold">Project #{index + 1}</h4>
          {projects.length > 1 && (
            <button
              type="button"
              onClick={() => removeProject(proj.id)}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={proj.name}
              onChange={(e) => updateProject(proj.id, "name", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              placeholder="E-commerce Platform"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              value={proj.description}
              onChange={(e) => updateProject(proj.id, "description", e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              placeholder="Describe your project..."
            />
          </div>

          {/* Technologies Used - ADD THIS SECTION */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Technologies Used
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={projectTechInput}
                onChange={(e) => setProjectTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProjectTechnology(proj.id))}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="Type a technology and press Enter..."
              />
              <button
                type="button"
                onClick={() => addProjectTechnology(proj.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {proj.technologies.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-slate-600 mb-2">Technologies:</p>
                <div className="flex flex-wrap gap-2">
                  {proj.technologies.map((tech, techIndex) => (
                    <div
                      key={techIndex}
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeProjectTechnology(proj.id, tech)}
                        className="ml-1 text-indigo-500 hover:text-indigo-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Common Technology Suggestions - ADD THIS SECTION */}
            <div className="mt-3">
              <p className="text-sm text-slate-600 mb-2">Common technologies:</p>
              <div className="flex flex-wrap gap-2">
                {commonTechnologies.slice(0, 15).map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => addProjectTechnology(proj.id, tech)}
                    className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors text-xs"
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date
              </label>
              <input
                type="month"
                value={proj.startDate}
                onChange={(e) => updateProject(proj.id, "startDate", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Date
              </label>
              <input
                type="month"
                value={proj.endDate || ""}
                onChange={(e) => updateProject(proj.id, "endDate", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Link (Optional)
            </label>
            <input
              type="url"
              value={proj.link || ""}
              onChange={(e) => updateProject(proj.id, "link", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              placeholder="https://project.com"
            />
          </div>
        </div>
      </div>
    ))}
  </div>
)}

      {/* Certifications */}
      {activeSection === "certifications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="text-blue-600" size={20} />
              </div>
              <h3 className="text-xl font-bold">Certifications</h3>
            </div>
            <button
              type="button"
              onClick={addCertification}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Certification
            </button>
          </div>

          {certifications.map((cert, index) => (
            <div key={cert.id} className="border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold">Certification #{index + 1}</h4>
                {certifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCertification(cert.id)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    placeholder="AWS Certified Solutions Architect"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    placeholder="Amazon Web Services"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Issue Date *
                  </label>
                  <input
                    type="month"
                    required
                    value={cert.issueDate}
                    onChange={(e) => updateCertification(cert.id, "issueDate", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="month"
                    value={cert.expiryDate || ""}
                    onChange={(e) => updateCertification(cert.id, "expiryDate", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Credential ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={cert.credentialId || ""}
                    onChange={(e) => updateCertification(cert.id, "credentialId", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    placeholder="AWS-123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Verification Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={cert.link || ""}
                    onChange={(e) => updateCertification(cert.id, "link", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    placeholder="https://aws.amazon.com/certification"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional Information */}
      {activeSection === "additional" && (
        <div className="space-y-8">
          {/* Languages */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Languages</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="Type a language and press Enter..."
              />
              <button
                type="button"
                onClick={() => addLanguage()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {languages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <div
                    key={lang}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full"
                  >
                    <span>{lang}</span>
                    <button
                      type="button"
                      onClick={() => removeLanguage(lang)}
                      className="ml-1 text-purple-500 hover:text-purple-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Achievements & Awards</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="Type an achievement and press Enter..."
              />
              <button
                type="button"
                onClick={addAchievement}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {achievements.length > 0 && (
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg">
                    <span>{achievement}</span>
                    <button
                      type="button"
                      onClick={() => removeAchievement(achievement)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Publications */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Publications</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={publicationInput}
                onChange={(e) => setPublicationInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPublication())}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="Type a publication and press Enter..."
              />
              <button
                type="button"
                onClick={addPublication}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {publications.length > 0 && (
              <div className="space-y-2">
                {publications.map((publication, index) => (
                  <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                    <span>{publication}</span>
                    <button
                      type="button"
                      onClick={() => removePublication(publication)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Job Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Job Preferences</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  placeholder="Senior Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Industry
                </label>
                <input
                  type="text"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  placeholder="Technology, Finance, Healthcare..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-slate-200">
        <div>
          {sections.findIndex(s => s.id === activeSection) > 0 && (
            <button
              type="button"
              onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeSection);
                setActiveSection(sections[currentIndex - 1].id);
              }}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
          )}
        </div>

        <div className="flex gap-4">
          {sections.findIndex(s => s.id === activeSection) < sections.length - 1 && (
            <button
              type="button"
              onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeSection);
                setActiveSection(sections[currentIndex + 1].id);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next Section
            </button>
          )}

          {activeSection === sections[sections.length - 1].id && (
            <button
              type="submit"
              className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Save Profile
            </button>
          )}
        </div>
      </div>
    </form>
  );
}