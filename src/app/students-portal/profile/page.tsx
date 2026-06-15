"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/server/integration/supabase.client";
import { useTheme } from "@/contexts/theme-context";
import { getColors, type Colors } from "@/config/theme-colors";
import {
  User, Mail, Phone, Globe, MapPin, BookOpen,
  Calendar, Save, Loader2, CheckCircle,
  Camera,
} from "lucide-react";

interface StudentProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  sex?: string;
  country?: string;
  state?: string;
  course_id?: string;
  cohort?: string;
  avatar_url?: string;
  created_at: string;
  course_title?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { theme } = useTheme();
  const C = getColors(theme);

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [phone, setPhone] = useState("");
  const [sex, setSex] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    document.title = "Profile — Student Portal";
  }, []);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/students-portal/login"); return; }

      const { data: sData } = await supabase
        .from("students")
        .select("*, courses:course_id(title)")
        .eq("auth_user_id", session.user.id)
        .single();

      if (!sData) { router.push("/students-portal/login"); return; }

      const p = {
        ...sData,
        course_title: sData.courses?.title,
      } as StudentProfile;
      setProfile(p);
      setPhone(p.phone || "");
      setSex(p.sex || "");
      setCountry(p.country || "");
      setState(p.state || "");
      setLoading(false);
    }
    load();
  }, [router, supabase]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("students")
      .update({ phone, sex, country, state, updated_at: new Date().toISOString() })
      .eq("id", profile.id);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2)
    : "SP";

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${C.dim}`, borderTopColor: C.teal }} />
    </div>
  );

  if (!profile) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", borderRadius: 5,
    border: `1px solid ${C.border}`, background: C.bg, color: C.text,
    fontSize: 12, outline: "none", boxSizing: "border-box",
  };

  const readOnlyStyle: React.CSSProperties = {
    ...inputStyle,
    opacity: 0.6,
    cursor: "not-allowed",
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
          My Profile
        </h1>
        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
          Manage your personal information
        </p>
      </div>

      {/* Avatar Card */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 6,
        padding: "20px", marginBottom: 16, textAlign: "center",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: C.teal, display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 12px",
          fontSize: 22, fontWeight: 700, color: "#fff",
        }}>
          {initials}
        </div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
          {profile.full_name}
        </h2>
        <p style={{ fontSize: 12, color: C.muted, margin: "0 0 6px" }}>
          {profile.course_title || "Student"} · {profile.cohort || "Cohort"}
        </p>
        <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>
          Member since {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Profile Fields */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 6,
        padding: 16, marginBottom: 16,
      }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: "0 0 14px" }}>
          Personal Information
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Full Name (read-only) */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: C.muted, display: "block", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <User size={10} />
                <span>Full Name</span>
              </div>
            </label>
            <input type="text" value={profile.full_name} readOnly style={readOnlyStyle} />
          </div>

          {/* Email (read-only) */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: C.muted, display: "block", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <Mail size={10} />
                <span>Email</span>
              </div>
            </label>
            <input type="email" value={profile.email} readOnly style={readOnlyStyle} />
          </div>

          {/* Phone */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: C.muted, display: "block", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <Phone size={10} />
                <span>Phone Number</span>
              </div>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 800 000 0000"
              style={inputStyle}
            />
          </div>

          {/* Sex */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: C.muted, display: "block", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <User size={10} />
                <span>Sex</span>
              </div>
            </label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: C.muted, display: "block", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <Globe size={10} />
                <span>Country</span>
              </div>
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Nigeria"
              style={inputStyle}
            />
          </div>

          {/* State */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: C.muted, display: "block", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <MapPin size={10} />
                <span>State</span>
              </div>
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Lagos"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "8px 16px", borderRadius: 5, border: "none",
              background: saving ? C.dim : C.teal, color: "#fff",
              fontSize: 11, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved && (
            <span style={{
              fontSize: 10, color: C.green, display: "flex", alignItems: "center", gap: 4,
            }}>
              <CheckCircle size={10} />
              Saved successfully
            </span>
          )}
        </div>
      </div>

      {/* Course Information */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 6,
        padding: 16,
      }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: "0 0 14px" }}>
          Course Information
        </h3>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ padding: "8px 10px", borderRadius: 4, background: C.bg, border: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 9, color: C.muted, margin: "0 0 2px" }}>Course</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.text, margin: 0 }}>
              {profile.course_title || "Not assigned"}
            </p>
          </div>
          <div style={{ padding: "8px 10px", borderRadius: 4, background: C.bg, border: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 9, color: C.muted, margin: "0 0 2px" }}>Cohort</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.text, margin: 0 }}>
              {profile.cohort || "Default"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}