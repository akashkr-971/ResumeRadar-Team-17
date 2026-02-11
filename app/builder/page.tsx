"use client";

import { useState, useEffect } from "react";
import AddProfileForm from "../src/components/AddProfileForm";
import { Profile } from "../src/types/profile";
import Navbar from "../src/components/navbar";
import Footer from "../src/components/footer";
import { UserPlus, Users, FileText, Edit2, Trash2, Plus, ArrowRight, Sparkles, Briefcase, GraduationCap, Mail, Phone, Code, Award, Globe, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ProfileStorage } from "../src/lib/profilestore";

export default function BuilderPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  // Load profiles from localStorage on mount
  useEffect(() => {
    const savedProfiles = ProfileStorage.getAllProfiles();
    setProfiles(savedProfiles);
  }, []);

  function addProfile(profile: Profile) {
    ProfileStorage.saveProfile(profile);
    const updatedProfiles = ProfileStorage.getAllProfiles();
    setProfiles(updatedProfiles);
    setShowAdd(false);
    setEditingProfile(null);
  }

  function deleteProfile(id: string) {
    if (confirm("Are you sure you want to delete this profile?")) {
      ProfileStorage.deleteProfile(id);
      const updatedProfiles = ProfileStorage.getAllProfiles();
      setProfiles(updatedProfiles);
    }
  }

  function startEditProfile(profile: Profile) {
    setEditingProfile(profile);
    setShowAdd(true);
  }

  function cancelEdit() {
    setEditingProfile(null);
    setShowAdd(false);
  }

  // Function to generate initials from name
  function getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Function to calculate total experience
  function calculateTotalExperience(profile: Profile): string {
    if (!profile.experience || profile.experience.length === 0) return "No experience";
    
    const sortedExp = [...profile.experience].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    const earliestDate = new Date(sortedExp[0].startDate);
    const currentDate = new Date();
    const years = currentDate.getFullYear() - earliestDate.getFullYear();
    
    return `${years}+ years`;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="px-6 md:px-16 py-16 md:py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-blue-600 text-sm font-semibold mb-6">
              <Sparkles size={16} />
              AI-Powered Resume Builder
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Create Professional Resumes
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                That Get You Hired
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Build ATS-optimized resumes with all necessary sections. Save multiple profiles for different roles.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{profiles.length}</div>
              <div className="text-slate-600 font-medium">
                {profiles.length === 1 ? 'Profile' : 'Profiles'}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {profiles.reduce((total, p) => total + (p.experience?.length || 0), 0)}
              </div>
              <div className="text-slate-600 font-medium">Experiences</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {profiles.reduce((total, p) => total + (p.projects?.length || 0), 0)}
              </div>
              <div className="text-slate-600 font-medium">Projects</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {profiles.reduce((total, p) => total + (p.certifications?.length || 0), 0)}
              </div>
              <div className="text-slate-600 font-medium">Certifications</div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold">Your Profiles</h2>
              <p className="text-slate-600 mt-2">
                {profiles.length === 0 
                  ? "No profiles yet. Create your first profile to get started." 
                  : `You have ${profiles.length} ${profiles.length === 1 ? 'profile' : 'profiles'} saved`
                }
              </p>
            </div>
            
            <div className="flex gap-4">
              <Link
                href="/analyzer"
                className="px-6 py-3 border-2 border-slate-200 text-slate-900 font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <FileText size={18} />
                Analyze Resume
              </Link>
              <button
                onClick={() => {
                  setEditingProfile(null);
                  setShowAdd(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <UserPlus size={18} />
                Add New Profile
              </button>
            </div>
          </div>

          {/* Add/Edit Profile Form */}
          {showAdd && (
            <div className="mb-12 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">
                  {editingProfile ? "Edit Profile" : "Create New Profile"}
                </h3>
                <button
                  onClick={cancelEdit}
                  className="text-slate-500 hover:text-slate-700 text-2xl font-semibold"
                >
                  ×
                </button>
              </div>
              <AddProfileForm 
                onAdd={addProfile} 
                initialData={editingProfile}
              />
            </div>
          )}

          {/* Empty State */}
          {profiles.length === 0 && !showAdd && (
            <div className="text-center py-16 bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-blue-500" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4">No profiles yet</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Start by creating your first profile. Include all necessary details for a comprehensive resume.
              </p>
              <button
                onClick={() => {
                  setEditingProfile(null);
                  setShowAdd(true);
                }}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Create Your First Profile
              </button>
            </div>
          )}

          {/* Profiles Grid */}
          {profiles.length > 0 && !showAdd && (
            <>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all overflow-hidden"
                  >
                    <div className="p-8">
                      {/* Profile Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">
                              {getInitials(profile.fullName)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{profile.fullName}</h3>
                            <p className="text-slate-500">
                              {profile.summary || "No summary available"}
                            </p>
                            {profile.targetRole && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                                  {profile.targetRole}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => startEditProfile(profile)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label={`Edit ${profile.fullName}'s profile`}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => deleteProfile(profile.id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label={`Delete ${profile.fullName}'s profile`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Profile Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Briefcase className="text-slate-400" size={14} />
                            <span className="text-sm text-slate-500">Experience</span>
                          </div>
                          <div className="font-medium">
                            {calculateTotalExperience(profile)} • {profile.experience?.length || 0} positions
                          </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Code className="text-slate-400" size={14} />
                            <span className="text-sm text-slate-500">Skills</span>
                          </div>
                          <div className="font-medium">{profile.technicalSkills?.length || 0}</div>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                          <Mail className="text-slate-400" size={16} />
                          <span className="text-sm truncate">{profile.email}</span>
                        </div>
                        
                        {profile.location && (
                          <div className="flex items-center gap-3">
                            <Globe className="text-slate-400" size={16} />
                            <span className="text-sm">{profile.location}</span>
                          </div>
                        )}

                        {profile.experience && profile.experience.length > 0 && (
                          <div className="flex items-center gap-3">
                            <Briefcase className="text-slate-400" size={16} />
                            <span className="text-sm">
                              {profile.experience[0].position} at {profile.experience[0].company}
                            </span>
                          </div>
                        )}

                        {profile.education && profile.education.length > 0 && (
                          <div className="flex items-center gap-3">
                            <GraduationCap className="text-slate-400" size={16} />
                            <span className="text-sm">
                              {profile.education[0].degree} at {profile.education[0].institution}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Skills Preview */}
                      {profile.technicalSkills && profile.technicalSkills.length > 0 && (
                        <div className="mt-6">
                          <p className="text-sm text-slate-500 mb-2">Top Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {profile.technicalSkills.slice(0, 5).map((skill, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {profile.technicalSkills.length > 5 && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                +{profile.technicalSkills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Soft Skills Preview */}
                      {profile.softSkills && profile.softSkills.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-slate-500 mb-2">Soft Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {profile.softSkills.slice(0, 3).map((skill, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Languages Preview */}
                      {profile.languages && profile.languages.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-slate-500 mb-2">Languages</p>
                          <div className="flex flex-wrap gap-2">
                            {profile.languages.map((lang, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between">
                      <button
                        onClick={() => startEditProfile(profile)}
                        className="px-5 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <Link
                        href={`/builder/resume/${profile.id}`}
                        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        Build Resume
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Another Profile Button */}
              <div className="text-center pt-8 border-t border-slate-200">
                <button
                  onClick={() => {
                    setEditingProfile(null);
                    setShowAdd(true);
                  }}
                  className="px-8 py-3 border-2 border-dashed border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-blue-400 transition-all flex items-center gap-2 mx-auto"
                >
                  <Plus size={20} />
                  Add Another Profile
                </button>
              </div>
            </>
          )}

          {/* CTA Section */}
          {profiles.length > 0 && (
            <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Build Your Perfect Resume?</h3>
                <p className="text-blue-100 mb-8">
                  Select a profile above to generate an ATS-optimized resume tailored to your target job.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/analyzer"
                    className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl transition-all hover:scale-105"
                  >
                    Try ATS Analyzer
                  </Link>
                  <Link
                    href="/templates"
                    className="px-8 py-3 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                  >
                    Browse Templates
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}