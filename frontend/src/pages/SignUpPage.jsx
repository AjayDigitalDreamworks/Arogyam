import { useState, useRef } from "react";

/* ─── LOTUS LOGO ─────────────────────────────────────────────────────────── */
const LotusLogo = () => (
  <svg width="42" height="38" viewBox="0 0 42 38" fill="none">
    <path d="M21 34 C14 28 8 20 10 12 C12 6 18 5 21 10 C24 5 30 6 32 12 C34 20 28 28 21 34Z" fill="#7BA8D4" opacity="0.45"/>
    <path d="M21 32 C16 30 6 26 4 18 C3 12 8 8 13 12 C15 14 17 20 21 32Z" fill="#5B8EC4" opacity="0.6"/>
    <path d="M21 32 C26 30 36 26 38 18 C39 12 34 8 29 12 C27 14 25 20 21 32Z" fill="#5B8EC4" opacity="0.6"/>
    <path d="M21 30 C18 28 5 22 3 14 C1 8 6 4 11 8 C14 10 16 18 21 30Z" fill="#7EC8D8" opacity="0.45"/>
    <path d="M21 30 C24 28 37 22 39 14 C41 8 36 4 31 8 C28 10 26 18 21 30Z" fill="#7EC8D8" opacity="0.45"/>
    <path d="M21 34 C17 28 15 20 17 14 C18 9 21 8 21 8 C21 8 24 9 25 14 C27 20 25 28 21 34Z" fill="#4A8EC0" opacity="0.9"/>
    <path d="M21 33 C18 27 10 22 9 16 C8 11 12 9 16 12 C18 14 19 22 21 33Z" fill="#5B9FCC" opacity="0.8"/>
    <path d="M21 33 C24 27 32 22 33 16 C34 11 30 9 26 12 C24 14 23 22 21 33Z" fill="#5B9FCC" opacity="0.8"/>
    <ellipse cx="21" cy="20" rx="4" ry="5" fill="#A8D4EE" opacity="0.7"/>
  </svg>
);

/* ─── EYE ICONS ──────────────────────────────────────────────────────────── */
const EyeShow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeHide = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ─── MEDITATION ILLUSTRATION ────────────────────────────────────────────── */
const MeditationIllustration = () => (
  <svg viewBox="0 0 320 300" fill="none" style={{width:"100%",maxWidth:"300px"}}>
    <ellipse cx="160" cy="268" rx="115" ry="18" fill="#B8D8F0" opacity="0.25"/>
    <ellipse cx="160" cy="264" rx="82" ry="14" fill="#8FC8A0" opacity="0.55"/>
    <ellipse cx="160" cy="263" rx="74" ry="11" fill="#72B888" opacity="0.4"/>
    <rect x="60" y="246" width="40" height="7" rx="1.5" fill="#A8C4E0" opacity="0.9"/>
    <rect x="63" y="239" width="34" height="7" rx="1.5" fill="#7EB0D4" opacity="0.85"/>
    <rect x="65" y="233" width="30" height="6" rx="1.5" fill="#9DC5DF" opacity="0.8"/>
    <rect x="67" y="228" width="26" height="5" rx="1.5" fill="#6FA4CC" opacity="0.75"/>
    <rect x="52" y="216" width="10" height="26" rx="2" fill="#F5E4B0" opacity="0.9"/>
    <ellipse cx="57" cy="216" rx="6" ry="3.5" fill="#E8D090" opacity="0.8"/>
    <path d="M57 216 C58 211 60 207 57 204 C55 207 56 211 57 216Z" fill="#F5A030" opacity="0.95"/>
    <path d="M57 215 C57.5 211 58.5 208 57 206 C56 208 56.5 211 57 215Z" fill="#FDD060" opacity="0.8"/>
    <path d="M86 264 Q108 260 122 262 Q108 268 86 270Z" fill="#F0EEE0" opacity="0.8"/>
    <path d="M122 262 Q136 260 152 264 Q136 270 122 268Z" fill="#E8E6D8" opacity="0.75"/>
    <path d="M224 250 Q224 240 232 240 Q240 240 240 250Z" fill="#9FC4A0" opacity="0.6"/>
    <rect x="220" y="250" width="24" height="14" rx="3" fill="#B8A890" opacity="0.7"/>
    <path d="M232 247 Q226 234 218 230 Q222 237 232 247Z" fill="#7AAA7A" opacity="0.65"/>
    <path d="M232 244 Q240 232 248 230 Q244 238 232 244Z" fill="#8ABC88" opacity="0.6"/>
    <path d="M196 244 Q197 236 206 236 Q215 236 216 244 L215 258 Q206 261 197 258Z" fill="#D8EEF8" opacity="0.85"/>
    <path d="M216 239 Q222 239 222 243 Q222 248 216 248" stroke="#B8D8F0" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M98 232 Q104 220 122 222 Q132 224 140 233 Q120 244 98 240Z" fill="#4A7AAA" opacity="0.88"/>
    <path d="M182 232 Q176 220 158 222 Q148 224 140 233 Q160 244 182 240Z" fill="#4A7AAA" opacity="0.88"/>
    <ellipse cx="140" cy="237" rx="29" ry="11" fill="#3D6A9A" opacity="0.7"/>
    <ellipse cx="180" cy="238" rx="13" ry="8" transform="rotate(-15 180 238)" fill="#3D6A9A" opacity="0.85"/>
    <ellipse cx="100" cy="238" rx="13" ry="8" transform="rotate(15 100 238)" fill="#3D6A9A" opacity="0.85"/>
    <path d="M114 180 Q116 168 140 166 Q164 168 166 180 L170 230 Q155 238 140 239 Q125 238 110 230Z" fill="#5BBFB0" opacity="0.92"/>
    <path d="M126 212 Q140 215 154 212 Q154 222 140 224 Q126 222 126 212Z" fill="#4AAFA0" opacity="0.6"/>
    <path d="M114 192 Q102 198 96 218 Q104 224 114 218 Q116 207 118 196Z" fill="#5BBFB0" opacity="0.88"/>
    <path d="M166 192 Q178 198 184 218 Q176 224 166 218 Q164 207 162 196Z" fill="#5BBFB0" opacity="0.88"/>
    <ellipse cx="102" cy="230" rx="10" ry="6" fill="#D4B8A0" opacity="0.85"/>
    <ellipse cx="178" cy="230" rx="10" ry="6" fill="#D4B8A0" opacity="0.85"/>
    <rect x="133" y="156" width="14" height="14" rx="6" fill="#D4B8A0"/>
    <ellipse cx="140" cy="135" rx="27" ry="29" fill="#D4B8A0"/>
    <path d="M113 129 Q114 102 140 100 Q166 102 167 129 Q161 109 140 107 Q119 109 113 129Z" fill="#3A2E24"/>
    <path d="M113 128 Q111 118 115 110 Q112 120 113 128Z" fill="#3A2E24"/>
    <path d="M167 128 Q169 118 165 110 Q168 120 167 128Z" fill="#3A2E24"/>
    <path d="M127 132 Q130 134.5 133 132" stroke="#6B4E3A" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M147 132 Q150 134.5 153 132" stroke="#6B4E3A" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M134 141 Q140 145 146 141" stroke="#C09A84" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="113" cy="136" rx="5" ry="7" fill="#CCA898"/>
    <ellipse cx="167" cy="136" rx="5" ry="7" fill="#CCA898"/>
    <ellipse cx="126" cy="142" rx="6" ry="3.5" fill="#E8A090" opacity="0.22"/>
    <ellipse cx="154" cy="142" rx="6" ry="3.5" fill="#E8A090" opacity="0.22"/>
    <circle cx="96" cy="112" r="2" fill="#C8E0F0" opacity="0.65"/>
    <circle cx="188" cy="108" r="1.5" fill="#A8CCE8" opacity="0.55"/>
  </svg>
);

/* ─── LEAVES ─────────────────────────────────────────────────────────────── */
const LeavesLeft = () => (
  <svg viewBox="0 0 220 320" fill="none"
    style={{position:"absolute",bottom:0,left:0,width:"clamp(140px,16vw,220px)",pointerEvents:"none",zIndex:1}}>
    <path d="M15 320 Q35 275 25 230 Q45 242 35 285 Q55 255 42 210 Q65 225 50 268 Q75 232 60 188 Q85 205 67 245 Q95 210 77 165 Q105 185 83 228"
      stroke="#8AAEC8" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
    {[[25,230,20],[42,210,18],[60,188,17],[77,165,19],[83,228,16]].map(([x,y,r],i)=>(
      <g key={i}>
        <ellipse cx={x-10} cy={y-6} rx={r} ry={r*0.52} transform={`rotate(-28 ${x-10} ${y-6})`} fill="#8AAEC8" opacity="0.42"/>
        <ellipse cx={x+10} cy={y-10} rx={r} ry={r*0.52} transform={`rotate(22 ${x+10} ${y-10})`} fill="#9ABDD8" opacity="0.35"/>
      </g>
    ))}
    <ellipse cx="45" cy="298" rx="36" ry="15" transform="rotate(-18 45 298)" fill="#7A9EC0" opacity="0.38"/>
    <ellipse cx="90" cy="310" rx="30" ry="13" transform="rotate(-8 90 310)" fill="#8AAEC8" opacity="0.32"/>
    <ellipse cx="12" cy="305" rx="26" ry="11" transform="rotate(-32 12 305)" fill="#6A8EB8" opacity="0.32"/>
  </svg>
);

const LeavesRight = () => (
  <svg viewBox="0 0 220 320" fill="none"
    style={{position:"absolute",bottom:0,right:0,width:"clamp(140px,16vw,220px)",pointerEvents:"none",zIndex:1,transform:"scaleX(-1)"}}>
    <path d="M15 320 Q35 275 25 230 Q45 242 35 285 Q55 255 42 210 Q65 225 50 268 Q75 232 60 188 Q85 205 67 245 Q95 210 77 165 Q105 185 83 228"
      stroke="#8AAEC8" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
    {[[25,230,20],[42,210,18],[60,188,17],[77,165,19],[83,228,16]].map(([x,y,r],i)=>(
      <g key={i}>
        <ellipse cx={x-10} cy={y-6} rx={r} ry={r*0.52} transform={`rotate(-28 ${x-10} ${y-6})`} fill="#8AAEC8" opacity="0.42"/>
        <ellipse cx={x+10} cy={y-10} rx={r} ry={r*0.52} transform={`rotate(22 ${x+10} ${y-10})`} fill="#9ABDD8" opacity="0.35"/>
      </g>
    ))}
    <ellipse cx="45" cy="298" rx="36" ry="15" transform="rotate(-18 45 298)" fill="#7A9EC0" opacity="0.38"/>
    <ellipse cx="90" cy="310" rx="30" ry="13" transform="rotate(-8 90 310)" fill="#8AAEC8" opacity="0.32"/>
    <ellipse cx="12" cy="305" rx="26" ry="11" transform="rotate(-32 12 305)" fill="#6A8EB8" opacity="0.32"/>
  </svg>
);

/* ─── CLOUD BACKGROUND ───────────────────────────────────────────────────── */
const CloudBg = () => (
  <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}
    viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" fill="none">
    <defs>
      <radialGradient id="skyG" cx="50%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#D2D8EC"/>
        <stop offset="50%" stopColor="#C5CCE4"/>
        <stop offset="100%" stopColor="#B8C0DA"/>
      </radialGradient>
      <filter id="f4"><feGaussianBlur stdDeviation="4"/></filter>
      <filter id="f8"><feGaussianBlur stdDeviation="8"/></filter>
      <filter id="f14"><feGaussianBlur stdDeviation="14"/></filter>
      <filter id="f20"><feGaussianBlur stdDeviation="20"/></filter>
    </defs>
    <rect width="1200" height="800" fill="url(#skyG)"/>
    <ellipse cx="600" cy="100" rx="700" ry="200" fill="#C8C0E0" opacity="0.22" filter="url(#f20)"/>
    <ellipse cx="200" cy="80"  rx="300" ry="120" fill="#D4B8D8" opacity="0.18" filter="url(#f14)"/>
    <ellipse cx="950" cy="90"  rx="280" ry="110" fill="#C8C0D8" opacity="0.15" filter="url(#f14)"/>
    <ellipse cx="600" cy="220" rx="550" ry="210" fill="white" opacity="0.20" filter="url(#f20)"/>
    <ellipse cx="150" cy="180" rx="330" ry="145" fill="white" opacity="0.22" filter="url(#f14)"/>
    <ellipse cx="1050" cy="200" rx="310" ry="135" fill="white" opacity="0.18" filter="url(#f14)"/>
    <ellipse cx="490" cy="145" rx="130" ry="32"  fill="white" opacity="0.28" filter="url(#f4)"/>
    <ellipse cx="760" cy="230" rx="150" ry="36"  fill="white" opacity="0.24" filter="url(#f4)"/>
    <ellipse cx="300" cy="700" rx="380" ry="110" fill="white" opacity="0.18" filter="url(#f14)"/>
    <ellipse cx="900" cy="720" rx="350" ry="100" fill="white" opacity="0.16" filter="url(#f14)"/>
    <ellipse cx="1100" cy="50" rx="200" ry="60"  fill="#E8C0D0" opacity="0.15" filter="url(#f14)"/>
    <ellipse cx="100"  cy="60" rx="180" ry="55"  fill="#D8C0E0" opacity="0.12" filter="url(#f14)"/>
  </svg>
);

/* ─── REUSABLE FIELD INPUT ───────────────────────────────────────────────── */
const Field = ({ label, required, error, children }) => (
  <div style={{ marginBottom: "0.9rem" }}>
    <label style={{
      display: "block", marginBottom: "0.3rem",
      fontFamily: "'DM Sans', sans-serif", fontSize: "0.79rem",
      fontWeight: 600, color: "#6B8CAA"
    }}>
      {label}
      {required && <span style={{ color: "#E07070", marginLeft: 2 }}>*</span>}
    </label>
    {children}
    {error && (
      <p style={{
        margin: "4px 0 0 2px", fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.72rem", color: "#D06060"
      }}>{error}</p>
    )}
  </div>
);

/* shared input styles — we apply them directly so no closure over stale state */
const getInputStyle = (isFocused, hasError) => ({
  width: "100%",
  padding: "0.72rem 1rem",
  border: `1.5px solid ${hasError ? "#E8A0A0" : isFocused ? "#8AAFD4" : "#DDE8F2"}`,
  borderRadius: "10px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.88rem",
  color: "#2D4A6B",
  background: isFocused ? "#FAFCFF" : "#F4F8FC",
  outline: "none",
  boxShadow: hasError
    ? "0 0 0 3px rgba(232,120,120,0.1)"
    : isFocused ? "0 0 0 3px rgba(122,175,212,0.12)" : "none",
  transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s",
  boxSizing: "border-box",
});

/* ─── AVATAR EMOJI PICKER ────────────────────────────────────────────────── */
const EMOJIS = ["🎓","🧘","🌸","🌿","💙","🦋","🌙","⭐","🌈","🍃","🌊","🔮"];

const AvatarPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "0.72rem 1rem",
          border: "1.5px solid #DDE8F2", borderRadius: "10px",
          fontFamily: "'DM Sans', sans-serif", fontSize: "1.2rem",
          background: "#F4F8FC", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "0.5rem",
          boxSizing: "border-box", textAlign: "left",
          transition: "border-color 0.18s",
        }}
        onFocus={e => { e.currentTarget.style.borderColor = "#8AAFD4"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(122,175,212,0.12)"; }}
        onBlur={e => { if (!open) { e.currentTarget.style.borderColor = "#DDE8F2"; e.currentTarget.style.boxShadow = "none"; } }}
      >
        <span>{value}</span>
        <svg width="11" height="11" viewBox="0 0 12 8" fill="none" style={{ marginLeft: "auto", opacity: 0.4, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M1 1.5l5 5 5-5" stroke="#5B7A95" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 100,
          background: "white", borderRadius: "12px", padding: "0.6rem",
          boxShadow: "0 8px 30px rgba(80,120,180,0.2)", border: "1px solid #DDE8F2",
          display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "4px",
        }}>
          {EMOJIS.map(em => (
            <button
              key={em} type="button"
              onClick={() => { onChange(em); setOpen(false); }}
              style={{
                background: value === em ? "#EEF6FF" : "transparent",
                border: "none", cursor: "pointer", fontSize: "1.2rem",
                padding: "6px", borderRadius: "8px", transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#EEF6FF"}
              onMouseLeave={e => e.currentTarget.style.background = value === em ? "#EEF6FF" : "transparent"}
            >
              {em}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── SIGN UP FORM ───────────────────────────────────────────────────────── */
const SignUpForm = () => {
  /* individual state for each field — avoids any closure/batching issues */
  const [displayName, setDisplayName] = useState("");
  const [fullName,    setFullName]    = useState("");
  const [email,       setEmail]       = useState("");
  const [phone,       setPhone]       = useState("");
  const [password,    setPassword]    = useState("");
  const [avatar,      setAvatar]      = useState("🎓");
  const [university,  setUniversity]  = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState("");
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  const validate = () => {
    const e = {};
    if (!displayName.trim())                          e.displayName = "Display name is required";
    if (!fullName.trim())                             e.fullName    = "Full name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email      = "A valid email is required";
    if (password.length < 6)                          e.password    = "Minimum 6 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1500);
  };

  if (success) {
    return (
      <div style={{
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(18px)",
        borderRadius: "22px", boxShadow: "0 8px 40px rgba(90,140,190,0.2)",
        padding: "3rem 2.3rem", width: "100%", maxWidth: "430px",
        border: "1.5px solid rgba(255,255,255,0.85)", textAlign: "center"
      }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
        <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#1E3A5A", marginBottom: "0.5rem" }}>
          Account Created!
        </h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "#8AAAC8", marginBottom: "1.5rem" }}>
          Welcome to Arogyam, {displayName} {avatar}
        </p>
        <button onClick={() => setSuccess(false)} style={{
          padding: "0.8rem 2rem", background: "linear-gradient(135deg,#6BA5D8,#4480B8)",
          border: "none", borderRadius: "13px", color: "white",
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", fontWeight: 700,
          cursor: "pointer", boxShadow: "0 4px 18px rgba(74,128,184,0.4)"
        }}>Back to Sign Up</button>
      </div>
    );
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      borderRadius: "22px", boxShadow: "0 8px 40px rgba(90,140,190,0.2), 0 2px 10px rgba(90,140,190,0.1)",
      padding: "2.2rem 2.3rem 2rem", width: "100%", maxWidth: "430px",
      border: "1.5px solid rgba(255,255,255,0.85)",
    }}>
      {/* Header */}
      <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1.9rem", fontWeight: 800, color: "#1E3A5A", margin: "0 0 0.2rem", letterSpacing: "-0.025em" }}>
        Sign Up
      </h2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: "#8AAAC8", margin: "0 0 1.4rem" }}>
        Create your Arogyam account
      </p>

      {/* Scrollable field group */}
      <div style={{
        background: "rgba(238,246,255,0.55)", borderRadius: "14px",
        padding: "1.2rem 1.1rem 0.5rem", marginBottom: "1.1rem",
        border: "1px solid rgba(200,222,242,0.5)",
        maxHeight: "370px", overflowY: "auto",
        scrollbarWidth: "thin", scrollbarColor: "#C8DDED transparent",
      }}>

        {/* Display Name */}
        <Field label="Display Name" required error={errors.displayName}>
          <input
            type="text"
            value={displayName}
            placeholder="How you'll appear to others"
            style={getInputStyle(focused === "displayName", !!errors.displayName)}
            onFocus={() => setFocused("displayName")}
            onBlur={() => setFocused("")}
            onChange={e => setDisplayName(e.target.value)}
          />
        </Field>

        {/* Full Name */}
        <Field label="Full Name" required error={errors.fullName}>
          <input
            type="text"
            value={fullName}
            placeholder="Your legal name"
            style={getInputStyle(focused === "fullName", !!errors.fullName)}
            onFocus={() => setFocused("fullName")}
            onBlur={() => setFocused("")}
            onChange={e => setFullName(e.target.value)}
          />
        </Field>

        {/* Email */}
        <Field label="Email" required error={errors.email}>
          <input
            type="email"
            value={email}
            placeholder="you@university.edu"
            style={getInputStyle(focused === "email", !!errors.email)}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused("")}
            onChange={e => setEmail(e.target.value)}
          />
        </Field>

        {/* Phone */}
        <Field label="Phone">
          <input
            type="tel"
            value={phone}
            placeholder="+91 00000 00000"
            style={getInputStyle(focused === "phone", false)}
            onFocus={() => setFocused("phone")}
            onBlur={() => setFocused("")}
            onChange={e => setPhone(e.target.value)}
          />
        </Field>

        {/* Password */}
        <Field label="Password" required error={errors.password}>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              placeholder="Min 6 characters"
              style={{ ...getInputStyle(focused === "password", !!errors.password), paddingRight: "4.5rem" }}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPass(s => !s)}
              style={{
                position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "#8AAFC8", fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.78rem", fontWeight: 600,
                display: "flex", alignItems: "center", gap: "3px", padding: "2px",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#4A7EA5"}
              onMouseLeave={e => e.currentTarget.style.color = "#8AAFC8"}
            >
              {showPass ? <EyeHide /> : <span>Show</span>}
            </button>
          </div>
        </Field>

        {/* Avatar */}
        <Field label="Avatar (emoji)">
          <AvatarPicker value={avatar} onChange={setAvatar} />
        </Field>

        {/* University */}
        <Field label="University">
          <input
            type="text"
            value={university}
            placeholder="Your institution"
            style={getInputStyle(focused === "university", false)}
            onFocus={() => setFocused("university")}
            onBlur={() => setFocused("")}
            onChange={e => setUniversity(e.target.value)}
          />
        </Field>

        {/* Year of Study */}
        <Field label="Year of Study">
          <div style={{ position: "relative" }}>
            <select
              value={yearOfStudy}
              style={{
                ...getInputStyle(focused === "year", false),
                appearance: "none", WebkitAppearance: "none",
                paddingRight: "2.5rem",
                cursor: "pointer",
                color: yearOfStudy ? "#2D4A6B" : "#9BBDD6",
              }}
              onFocus={() => setFocused("year")}
              onBlur={() => setFocused("")}
              onChange={e => setYearOfStudy(e.target.value)}
            >
              <option value="" disabled>Select</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year</option>
              <option value="pg">Postgraduate</option>
              <option value="phd">PhD</option>
            </select>
            <svg width="11" height="11" viewBox="0 0 12 8" fill="none"
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.5 }}>
              <path d="M1 1.5l5 5 5-5" stroke="#5B7A95" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Field>

      </div>{/* end scroll area */}

      {/* Sign Up Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%", padding: "0.85rem",
          background: loading ? "#88AACC" : "linear-gradient(135deg,#6BA5D8 0%,#5592C8 45%,#4480B8 100%)",
          border: "none", borderRadius: "13px", color: "white",
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 20px rgba(74,128,184,0.42)",
          transition: "all 0.22s", display: "flex", alignItems: "center",
          justifyContent: "center", gap: "0.5rem",
          marginBottom: "1rem", letterSpacing: "0.01em",
        }}
        onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1.5px)"; e.currentTarget.style.boxShadow = "0 8px 26px rgba(74,128,184,0.55)"; } }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(74,128,184,0.42)"; }}
      >
        {loading ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
              strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Creating Account…
          </>
        ) : "Sign Up"}
      </button>

      {/* Login link */}
      <p style={{ textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", color: "#8AAAC8", margin: 0 }}>
        Already have an account?{" "}
        <a href="#" style={{ color: "#4A7EB8", fontWeight: 700, textDecoration: "none" }}
          onMouseEnter={e => e.target.style.color = "#2D5A90"}
          onMouseLeave={e => e.target.style.color = "#4A7EB8"}>
          Login
        </a>
      </p>
    </div>
  );
};

/* ─── ROOT PAGE ──────────────────────────────────────────────────────────── */
export default function SignUpPage() {
  const features = [
    "AI Mental Health Support",
    "Campus Counselling Access",
    "Wellness Resources",
    "Peer Support Community",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; padding: 0; }
        @keyframes spin  { from { transform: rotate(0deg) }   to { transform: rotate(360deg) } }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes fadeUp{ from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .anim-float { animation: float 6s ease-in-out infinite; }
        .fu  { animation: fadeUp 0.55s ease-out both; }
        .d1  { animation-delay: 0.05s } .d2 { animation-delay: 0.18s }
        .d3  { animation-delay: 0.28s } .d4 { animation-delay: 0.38s }
        /* thin scrollbar */
        ::-webkit-scrollbar        { width: 4px; }
        ::-webkit-scrollbar-track  { background: transparent; }
        ::-webkit-scrollbar-thumb  { background: #C8DDED; border-radius: 10px; }
        select option { color: #2D4A6B; }
        @media (max-width: 700px) {
          .two-col { flex-direction: column !important; }
          .left-col { min-height: auto !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", width: "100%", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CloudBg />
        <LeavesLeft />
        <LeavesRight />

        <div className="two-col" style={{
          position: "relative", zIndex: 2, display: "flex", flexWrap: "wrap",
          width: "100%", maxWidth: "1050px", margin: "0 auto", padding: "2rem 1.5rem",
          gap: "1.5rem", alignItems: "center", justifyContent: "center", minHeight: "100vh",
        }}>

          {/* ── LEFT BRANDING CARD ── */}
          <div className="left-col fu d1" style={{
            flex: "1 1 320px", maxWidth: "400px",
            background: "rgba(215,228,248,0.42)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            borderRadius: "26px", border: "1.5px solid rgba(255,255,255,0.55)",
            boxShadow: "0 4px 32px rgba(100,140,200,0.14)",
            padding: "2.4rem 2.2rem 0", display: "flex", flexDirection: "column",
            overflow: "hidden", minHeight: "560px",
          }}>
            {/* Logo */}
            <div className="fu d2" style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "1.6rem" }}>
              <LotusLogo />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#2A4A6E", letterSpacing: "-0.02em" }}>
                Arogyam
              </span>
            </div>

            {/* Heading */}
            <div className="fu d3" style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#1E3A5A", lineHeight: 1.2, margin: "0 0 0.1rem" }}>
                Your <span style={{ color: "#3872B0" }}>Digital</span>
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1.5rem", fontWeight: 600, color: "#2A4A6E", lineHeight: 1.2, margin: 0 }}>
                Mental Wellness Companion
              </p>
            </div>

            {/* Features */}
            <ul className="fu d4" style={{ listStyle: "none", padding: 0, margin: "0 0 1.2rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {features.map(f => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3.5 9.5l3.8 3.8 7-8" stroke="#4A7AB0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: "#2A4A6E" }}>{f}</span>
                </li>
              ))}
            </ul>

            {/* Illustration */}
            <div className="anim-float" style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", marginTop: "auto" }}>
              <MeditationIllustration />
            </div>
          </div>

          {/* ── RIGHT SIGN UP FORM ── */}
          <div className="fu d2" style={{ flex: "1 1 370px", maxWidth: "460px", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.9rem" }}>
            <SignUpForm />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: "rgba(55,85,125,0.55)", textAlign: "center" }}>
              © 2026 Arogyam&ensp;
              <a href="#" style={{ color: "rgba(55,85,125,0.65)", textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#2D5A90"}
                onMouseLeave={e => e.target.style.color = "rgba(55,85,125,0.65)"}>Privacy Policy</a>
              <span style={{ margin: "0 0.35rem", opacity: 0.4 }}>·</span>
              <a href="#" style={{ color: "rgba(55,85,125,0.65)", textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#2D5A90"}
                onMouseLeave={e => e.target.style.color = "rgba(55,85,125,0.65)"}>Terms</a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
