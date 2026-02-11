"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AddProfileForm from "../src/components/AddProfileForm";
import { Profile } from "../src/types/profile";
import Navbar from "../src/components/navbar";
import Footer from "../src/components/footer";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProfileStorage } from "../src/lib/profilestore";

export default function EditProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      const savedProfile = ProfileStorage.getProfile(id);
      setProfile(savedProfile);
    }
    setLoading(false);
  }, [params.id]);

  const handleSave = (updatedProfile: Profile) => {
    ProfileStorage.saveProfile(updatedProfile);
    router.push("/builder");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <Link href="/builder" className="text-blue-600 hover:text-blue-700">
          ← Back to Profiles
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <Navbar />
      
      <section className="px-6 md:px-16 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={18} />
              Back to Profiles
            </Link>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Edit Profile</h1>
              <p className="text-slate-600 mt-2">Update your profile information</p>
            </div>
            
            <AddProfileForm 
              onAdd={handleSave} 
              initialData={profile}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}