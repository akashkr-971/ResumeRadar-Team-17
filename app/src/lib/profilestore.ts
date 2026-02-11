import { Profile } from "../types/profile";

const STORAGE_KEY = 'resumeaid_profiles';

export class ProfileStorage {
  static getAllProfiles(): Profile[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static saveProfile(profile: Profile): void {
    const profiles = this.getAllProfiles();
    const existingIndex = profiles.findIndex(p => p.id === profile.id);
    
    const now = new Date().toISOString();
    const profileToSave = {
      ...profile,
      updatedAt: now,
      ...(existingIndex === -1 && { createdAt: now })
    };
    
    if (existingIndex > -1) {
      profiles[existingIndex] = profileToSave;
    } else {
      profiles.push(profileToSave);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }

  static getProfile(id: string): Profile | null {
    const profiles = this.getAllProfiles();
    return profiles.find(p => p.id === id) || null;
  }

  static deleteProfile(id: string): void {
    const profiles = this.getAllProfiles();
    const filtered = profiles.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}