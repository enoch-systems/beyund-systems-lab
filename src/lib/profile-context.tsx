"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ProfileContextType = {
  profileImage: string | null;
  setProfileImage: (img: string | null) => void;
};

const ProfileContext = createContext<ProfileContextType>({
  profileImage: null,
  setProfileImage: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-profile-image");
    if (stored) setProfileImage(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (profileImage) {
        localStorage.setItem("admin-profile-image", profileImage);
      } else {
        localStorage.removeItem("admin-profile-image");
      }
    }
  }, [profileImage, mounted]);

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
