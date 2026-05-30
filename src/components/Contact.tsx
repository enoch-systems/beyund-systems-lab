"use client";

import { useState, useEffect } from "react";
import { personalData } from "@/lib/data";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    sex: "",
    country: "",
    state: "",
    course: "",
    employment: "",
    laptop: "",
    scholarship: "",
    hearAboutUs: "",
    reason: ""
  });

  const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);
  const [states, setStates] = useState<{ code: string; name: string }[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);

  useEffect(() => {
    // Fetch countries from REST Countries API
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=cca2,name");
        const data = await response.json();
        const sortedCountries = data
          .map((country: any) => ({
            code: country.cca2,
            name: country.name.common
          }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
        // Fallback to a minimal list if API fails
        setCountries([
          { code: "NG", name: "Nigeria" },
          { code: "US", name: "United States" },
          { code: "GB", name: "United Kingdom" },
          { code: "CA", name: "Canada" },
          { code: "AU", name: "Australia" },
          { code: "DE", name: "Germany" },
          { code: "FR", name: "France" },
          { code: "IN", name: "India" },
          { code: "BR", name: "Brazil" },
          { code: "ZA", name: "South Africa" },
          { code: "KE", name: "Kenya" },
          { code: "GH", name: "Ghana" },
          { code: "EG", name: "Egypt" },
          { code: "MA", name: "Morocco" },
          { code: "TZ", name: "Tanzania" },
          { code: "UG", name: "Uganda" },
          { code: "OTHER", name: "Other" }
        ]);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    // Fetch states based on selected country
    const fetchStates = async () => {
      if (!form.country || form.country === "OTHER") {
        setStates([]);
        return;
      }

      setLoadingStates(true);
      try {
        const response = await fetch(`https://countriesnow.space/api/v0.1/countries/states`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data?.data && Array.isArray(data.data)) {
          const countryData = data.data.find(
            (item: any) => item.iso2 === form.country || item.iso3 === form.country || item.country === form.country
          );
          if (countryData?.states && Array.isArray(countryData.states)) {
            const sortedStates = countryData.states
              .map((state: any) => ({
                code: state.state_code || state.name,
                name: state.name
              }))
              .sort((a: any, b: any) => a.name.localeCompare(b.name));
            setStates(sortedStates);
          } else {
            console.error("No states found for country:", form.country);
            setStates([]);
          }
        } else {
          console.error("States data is not in expected format:", data);
          setStates([]);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [form.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — could integrate with a service later
    alert("Registration submitted! We'll get back to you soon.");
    setForm({
      name: "",
      email: "",
      mobile: "",
      sex: "",
      country: "",
      state: "",
      course: "",
      employment: "",
      laptop: "",
      scholarship: "",
      hearAboutUs: "",
      reason: ""
    });
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="flex items-start gap-4 md:gap-6 mb-10 md:mb-14 max-w-2xl mx-auto">
          <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20 mt-1" />
          <div>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/30 uppercase mb-2">
              embrace clarity
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
              READY TO KICKOFF YOUR JOURNEY ?
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-white/60 uppercase mt-1">
              Register Now
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/70 mb-8 leading-relaxed">
            Ready to start your fullstack development journey at <span className="text-green-300 font-semibold">Beyund systems labs</span>? Fill out the form below to register for our program and take the first step towards becoming a production-ready fullstack developer.
          </p>

          {/* Application Form */}
          <div className="text-left mb-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              APPLICATION FORM
            </h3>
            <p className="text-white/60 text-sm mb-1">Enter student details</p>
            <p className="text-white/40 text-xs">All fields are required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 mb-12 text-left">
            {/* Personal Information */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
              <h4 className="text-lg font-semibold text-white mb-1">Personal Information</h4>
              <p className="text-white/50 text-sm mb-6">Basic details for student identification and contact.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Phone / WhatsApp Number *</label>
                  <div className="flex gap-3">
                    <div className="relative shrink-0" style={{ minWidth: "100px", maxWidth: "120px" }}>
                      <select
                        defaultValue="+234"
                        className="w-full px-2 py-4 pr-6 rounded-xl bg-neutral-900 border border-white/20 text-white/70 text-xs sm:text-sm focus:outline-none focus:border-yellow-500/50 transition-all duration-200 appearance-none cursor-pointer"
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="+93">+93 (AF)</option>
                        <option value="+355">+355 (AL)</option>
                        <option value="+213">+213 (DZ)</option>
                        <option value="+1">+1 (US/CA)</option>
                        <option value="+54">+54 (AR)</option>
                        <option value="+61">+61 (AU)</option>
                        <option value="+43">+43 (AT)</option>
                        <option value="+994">+994 (AZ)</option>
                        <option value="+973">+973 (BH)</option>
                        <option value="+880">+880 (BD)</option>
                        <option value="+375">+375 (BY)</option>
                        <option value="+32">+32 (BE)</option>
                        <option value="+229">+229 (BJ)</option>
                        <option value="+591">+591 (BO)</option>
                        <option value="+55">+55 (BR)</option>
                        <option value="+359">+359 (BG)</option>
                        <option value="+226">+226 (BF)</option>
                        <option value="+257">+257 (BI)</option>
                        <option value="+855">+855 (KH)</option>
                        <option value="+237">+237 (CM)</option>
                        <option value="+1">+1 (CA)</option>
                        <option value="+56">+56 (CL)</option>
                        <option value="+86">+86 (CN)</option>
                        <option value="+57">+57 (CO)</option>
                        <option value="+506">+506 (CR)</option>
                        <option value="+385">+385 (HR)</option>
                        <option value="+53">+53 (CU)</option>
                        <option value="+357">+357 (CY)</option>
                        <option value="+420">+420 (CZ)</option>
                        <option value="+45">+45 (DK)</option>
                        <option value="+253">+253 (DJ)</option>
                        <option value="+593">+593 (EC)</option>
                        <option value="+20">+20 (EG)</option>
                        <option value="+503">+503 (SV)</option>
                        <option value="+240">+240 (GQ)</option>
                        <option value="+251">+251 (ET)</option>
                        <option value="+679">+679 (FJ)</option>
                        <option value="+358">+358 (FI)</option>
                        <option value="+33">+33 (FR)</option>
                        <option value="+241">+241 (GA)</option>
                        <option value="+220">+220 (GM)</option>
                        <option value="+995">+995 (GE)</option>
                        <option value="+49">+49 (DE)</option>
                        <option value="+233">+233 (GH)</option>
                        <option value="+30">+30 (GR)</option>
                        <option value="+224">+224 (GN)</option>
                        <option value="+245">+245 (GW)</option>
                        <option value="+592">+592 (GY)</option>
                        <option value="+509">+509 (HT)</option>
                        <option value="+504">+504 (HN)</option>
                        <option value="+852">+852 (HK)</option>
                        <option value="+36">+36 (HU)</option>
                        <option value="+354">+354 (IS)</option>
                        <option value="+91">+91 (IN)</option>
                        <option value="+62">+62 (ID)</option>
                        <option value="+98">+98 (IR)</option>
                        <option value="+964">+964 (IQ)</option>
                        <option value="+353">+353 (IE)</option>
                        <option value="+972">+972 (IL)</option>
                        <option value="+39">+39 (IT)</option>
                        <option value="+225">+225 (CI)</option>
                        <option value="+81">+81 (JP)</option>
                        <option value="+962">+962 (JO)</option>
                        <option value="+254">+254 (KE)</option>
                        <option value="+82">+82 (KR)</option>
                        <option value="+965">+965 (KW)</option>
                        <option value="+996">+996 (KG)</option>
                        <option value="+371">+371 (LV)</option>
                        <option value="+961">+961 (LB)</option>
                        <option value="+266">+266 (LS)</option>
                        <option value="+231">+231 (LR)</option>
                        <option value="+218">+218 (LY)</option>
                        <option value="+423">+423 (LI)</option>
                        <option value="+370">+370 (LT)</option>
                        <option value="+352">+352 (LU)</option>
                        <option value="+853">+853 (MO)</option>
                        <option value="+261">+261 (MG)</option>
                        <option value="+265">+265 (MW)</option>
                        <option value="+60">+60 (MY)</option>
                        <option value="+223">+223 (ML)</option>
                        <option value="+356">+356 (MT)</option>
                        <option value="+222">+222 (MR)</option>
                        <option value="+230">+230 (MU)</option>
                        <option value="+52">+52 (MX)</option>
                        <option value="+373">+373 (MD)</option>
                        <option value="+976">+976 (MN)</option>
                        <option value="+212">+212 (MA)</option>
                        <option value="+258">+258 (MZ)</option>
                        <option value="+264">+264 (NA)</option>
                        <option value="+977">+977 (NP)</option>
                        <option value="+31">+31 (NL)</option>
                        <option value="+64">+64 (NZ)</option>
                        <option value="+227">+227 (NE)</option>
                        <option value="+234">+234 (NG)</option>
                        <option value="+47">+47 (NO)</option>
                        <option value="+968">+968 (OM)</option>
                        <option value="+92">+92 (PK)</option>
                        <option value="+970">+970 (PS)</option>
                        <option value="+507">+507 (PA)</option>
                        <option value="+595">+595 (PY)</option>
                        <option value="+51">+51 (PE)</option>
                        <option value="+63">+63 (PH)</option>
                        <option value="+48">+48 (PL)</option>
                        <option value="+351">+351 (PT)</option>
                        <option value="+974">+974 (QA)</option>
                        <option value="+242">+242 (CG)</option>
                        <option value="+40">+40 (RO)</option>
                        <option value="+7">+7 (RU)</option>
                        <option value="+250">+250 (RW)</option>
                        <option value="+966">+966 (SA)</option>
                        <option value="+221">+221 (SN)</option>
                        <option value="+381">+381 (RS)</option>
                        <option value="+232">+232 (SL)</option>
                        <option value="+65">+65 (SG)</option>
                        <option value="+421">+421 (SK)</option>
                        <option value="+386">+386 (SI)</option>
                        <option value="+252">+252 (SO)</option>
                        <option value="+27">+27 (ZA)</option>
                        <option value="+211">+211 (SS)</option>
                        <option value="+34">+34 (ES)</option>
                        <option value="+94">+94 (LK)</option>
                        <option value="+249">+249 (SD)</option>
                        <option value="+597">+597 (SR)</option>
                        <option value="+46">+46 (SE)</option>
                        <option value="+41">+41 (CH)</option>
                        <option value="+963">+963 (SY)</option>
                        <option value="+886">+886 (TW)</option>
                        <option value="+255">+255 (TZ)</option>
                        <option value="+66">+66 (TH)</option>
                        <option value="+228">+228 (TG)</option>
                        <option value="+216">+216 (TN)</option>
                        <option value="+90">+90 (TR)</option>
                        <option value="+256">+256 (UG)</option>
                        <option value="+380">+380 (UA)</option>
                        <option value="+971">+971 (AE)</option>
                        <option value="+44">+44 (GB)</option>
                        <option value="+1">+1 (US)</option>
                        <option value="+598">+598 (UY)</option>
                        <option value="+998">+998 (UZ)</option>
                        <option value="+58">+58 (VE)</option>
                        <option value="+84">+84 (VN)</option>
                        <option value="+967">+967 (YE)</option>
                        <option value="+260">+260 (ZM)</option>
                        <option value="+263">+263 (ZW)</option>
                      </select>
                      {/* Chevron indicator */}
                      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Enter your phone number"
                      value={form.mobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 25);
                        setForm({ ...form, mobile: val });
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={25}
                      required
                      className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Sex *</label>
                  <div className="relative">
                    <select
                      name="sex"
                      value={form.sex || ""}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-neutral-900 border border-white/20 text-white/70 text-sm focus:outline-none focus:border-yellow-500/50 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select your sex</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Country *</label>
                  <div className="relative">
                    <select
                      name="country"
                      value={form.country || ""}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-neutral-900 border border-white/20 text-white/70 text-sm focus:outline-none focus:border-yellow-500/50 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        {loadingCountries ? "Loading countries..." : "Select country"}
                      </option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                {loadingStates ? (
                  <>
                    <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">State/Province</label>
                    <div className="relative">
                      <select
                        disabled
                        className="w-full px-5 py-4 rounded-xl bg-neutral-900/50 border border-white/10 text-white/40 text-sm cursor-not-allowed"
                      >
                        <option>Loading states...</option>
                      </select>
                    </div>
                  </>
                ) : states.length > 0 ? (
                  <>
                    <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">State/Province *</label>
                    <div className="relative">
                      <select
                        name="state"
                        value={form.state || ""}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-xl bg-neutral-900 border border-white/20 text-white/70 text-sm focus:outline-none focus:border-yellow-500/50 transition-all duration-200 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select state</option>
                        {states.map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </>
                ) : form.country && form.country !== "OTHER" ? (
                  <>
                    <input type="hidden" name="state" value="n/a" />
                    <p className="text-white/40 text-xs mt-2 italic">This country has no states/provinces.</p>
                  </>
                ) : null}
              </div>
            </div>

            {/* Academic Profile */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
              <h4 className="text-lg font-semibold text-white mb-1">Academic Profile</h4>
              <p className="text-white/50 text-sm mb-6">Select the course and indicate readiness for the program.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Course Applying For *</label>
                  <select
                    name="course"
                    value={form.course || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-xl bg-neutral-900 border border-white/20 text-white/70 text-sm focus:outline-none focus:border-yellow-500/50 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="fullstack">Full Stack Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Employment Status *</label>
                  <div className="relative">
                    <select
                      name="employment"
                      value={form.employment || ""}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-neutral-900 border border-white/20 text-white/70 text-sm focus:outline-none focus:border-yellow-500/50 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select status</option>
                      <option value="employed">Employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="student">Student</option>
                      <option value="freelancer">Freelancer</option>
                    </select>
                    <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Do You Have a Laptop? *</label>
                  <div className="relative">
                    <select
                      name="laptop"
                      value={form.laptop || ""}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-neutral-900 border border-white/20 text-white/70 text-sm focus:outline-none focus:border-yellow-500/50 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
              </div>
            </div>

            {/* Application Context */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
              <h4 className="text-lg font-semibold text-white mb-1">Application Context</h4>
              <p className="text-white/50 text-sm mb-6">Tell us how you found the program and why you are applying.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">How Did You Hear About Us? *</label>
                  <div className="relative">
                    <select
                      name="hearAboutUs"
                      value={form.hearAboutUs || ""}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-neutral-900 border border-white/20 text-white/70 text-sm focus:outline-none focus:border-yellow-500/50 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="social-media">Social Media</option>
                      <option value="friend">Friend/Referral</option>
                      <option value="search">Search Engine</option>
                      <option value="blog">Blog/Article</option>
                      <option value="other">Other</option>
                    </select>
                    <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">Why Do You Want To Learn This Skill? *</label>
                  <textarea
                    name="reason"
                    placeholder="Tell us briefly why you want to learn fullstack development..."
                    rows={4}
                    value={form.reason || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-white text-black font-semibold text-sm tracking-[0.1em] uppercase hover:bg-white/90 transition-all duration-200 cursor-pointer"
            >
              Submit Registration
            </button>
          </form>

          {/* Social links — column on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href={personalData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/10 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-200 text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <a
              href={personalData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/10 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-200 text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X
            </a>
          </div>

          {/* Email — below X */}
          <div className="mt-6">
            <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-4 mt-10">
              You can reach out via email
            </p>
            <a
              href={`mailto:${personalData.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/10 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-200 text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {personalData.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}