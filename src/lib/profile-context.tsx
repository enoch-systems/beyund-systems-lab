"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./supabase";

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
  const [loaded, setLoaded] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    async function load() {
      const supabase = createSupabaseBrowserClient();
      const { data: settings } = await supabase
        .from("admin_settings")
        .select("value")
        .eq("key", "profile_image")
        .single();

      if (settings?.value) {
        setProfileImage(settings.value);
      }
      setLoaded(true);
    }
    load();
  }, []);

  // Save to Supabase whenever profileImage changes (after initial load)
  useEffect(() => {
    if (!loaded) return;

    const supabase = createSupabaseBrowserClient();
    if (profileImage) {
      supabase.from("admin_settings").upsert(
        { key: "profile_image", value: profileImage },
        { onConflict: "key" }
      );
    } else {
      supabase.from("admin_settings").delete().eq("key", "profile_image");
    }
  }, [profileImage, loaded]);

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}