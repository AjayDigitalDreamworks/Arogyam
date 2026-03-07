import { useState } from "react";

/* ─────────────────────────────────────────────
   LOTUS LOGO  – wide multi-petal blue lotus
───────────────────────────────────────────── */
const LotusLogo = () => (
  <svg width="42" height="38" viewBox="0 0 42 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 34 C14 28 8 20 10 12 C12 6 18 5 21 10 C24 5 30 6 32 12 C34 20 28 28 21 34Z" fill="#7BA8D4" opacity="0.45"/>
    <path d="M21 32 C16 30 6 26 4 18 C3 12 8 8 13 12 C15 14 17 20 21 32Z" fill="#5B8EC4" opacity="0.6"/>
    <path d="M21 32 C26 30 36 26 38 18 C39 12 34 8 29 12 C27 14 25 20 21 32Z" fill="#5B8EC4" opacity="0.6"/>
    <path d="M21 30 C18 28 5 22 3 14 C1 8 6 4 11 8 C14 10 16 18 21 30Z" fill="#7EC8D8" opacity="0.45"/>
    <path d="M21 30 C24 28 37 22 39 14 C41 8 36 4 31 8 C28 10 26 18 21 30Z" fill="#7EC8D8" opacity="0.45"/>
    <path d="M21 34 C17 28 15 20 17 14 C18 9 21 8 21 8 C21 8 24 9 25 14 C27 20 25 28 21 34Z" fill="#4A8EC0" opacity="0.9"/>
    <path d="M21 33 C18 27 10 22 9 16 C8 11 12 9 16 12 C18 14 19 22 21 33Z" fill="#5B9FCC" opacity="0.8"/>
    <path d="M21 33 C24 27 32 22 33 16 C34 11 30 9 26 12 C24 14 23 22 21 33Z" fill="#5B9FCC" opacity="0.8"/>
    <ellipse cx="21" cy="20" rx="4" ry="5" fill="#A8D4EE" opacity="0.7"/>
    <path d="M21 34 C21 34 20 36 21 38 C22 36 21 34 21 34Z" fill="#5B9FCC" opacity="0.5"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
    <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
    <path d="M4.405 11.9A6.01 6.01 0 014.09 10c0-.663.114-1.305.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC04"/>
    <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0A9.996 9.996 0 001.064 5.51l3.34 2.59C5.192 5.736 7.396 3.977 10 3.977z" fill="#EA4335"/>
  </svg>
);

const UnivIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="1.5" y="3.5" width="17" height="13" rx="2" fill="#5B9FCC" opacity="0.18"/>
    <rect x="1.5" y="3.5" width="17" height="13" rx="2" stroke="#5B9FCC" strokeWidth="1.4"/>
    <rect x="1.5" y="6.5" width="17" height="2" fill="#5B9FCC" opacity="0.25"/>
    <circle cx="6.5" cy="11" r="2.2" fill="#5B9FCC" opacity="0.55"/>
    <rect x="10" y="9.5" width="5.5" height="1.3" rx="0.65" fill="#5B9FCC" opacity="0.45"/>
    <rect x="10" y="11.5" width="3.5" height="1.3" rx="0.65" fill="#5B9FCC" opacity="0.35"/>
  </svg>
);

const EyeOn = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ─────────────────────────────────────────────
   MEDITATION ILLUSTRATION
───────────────────────────────────────────── */
const MeditationIllustration = () => (
  <svg viewBox="0 0 320 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:"300px"}}>
    <ellipse cx="160" cy="268" rx="115" ry="18" fill="#B8D8F0" opacity="0.25"/>
    {/* green mat */}
    <ellipse cx="160" cy="264" rx="82" ry="14" fill="#8FC8A0" opacity="0.55"/>
    <ellipse cx="160" cy="263" rx="74" ry="11" fill="#72B888" opacity="0.4"/>
    {/* books */}
    <rect x="60" y="246" width="40" height="7" rx="1.5" fill="#A8C4E0" opacity="0.9"/>
    <rect x="63" y="239" width="34" height="7" rx="1.5" fill="#7EB0D4" opacity="0.85"/>
    <rect x="65" y="233" width="30" height="6" rx="1.5" fill="#9DC5DF" opacity="0.8"/>
    <rect x="67" y="228" width="26" height="5" rx="1.5" fill="#6FA4CC" opacity="0.75"/>
    {/* candle */}
    <rect x="52" y="216" width="10" height="26" rx="2" fill="#F5E4B0" opacity="0.9"/>
    <ellipse cx="57" cy="216" rx="6" ry="3.5" fill="#E8D090" opacity="0.8"/>
    <path d="M57 216 C58 211 60 207 57 204 C55 207 56 211 57 216Z" fill="#F5A030" opacity="0.95"/>
    <path d="M57 215 C57.5 211 58.5 208 57 206 C56 208 56.5 211 57 215Z" fill="#FDD060" opacity="0.8"/>
    <ellipse cx="57" cy="208" rx="11" ry="9" fill="#FDD060" opacity="0.1"/>
    {/* open notebook */}
    <path d="M86 264 Q108 260 122 262 Q108 268 86 270Z" fill="#F0EEE0" opacity="0.8"/>
    <path d="M122 262 Q136 260 152 264 Q136 270 122 268Z" fill="#E8E6D8" opacity="0.75"/>
    <line x1="122" y1="262" x2="122" y2="268" stroke="#C8C8B0" strokeWidth="0.8" opacity="0.6"/>
    {/* plant pot */}
    <path d="M224 250 Q224 240 232 240 Q240 240 240 250Z" fill="#9FC4A0" opacity="0.6"/>
    <rect x="220" y="250" width="24" height="14" rx="3" fill="#B8A890" opacity="0.7"/>
    <path d="M232 247 Q226 234 218 230 Q222 237 232 247Z" fill="#7AAA7A" opacity="0.65"/>
    <path d="M232 244 Q240 232 248 230 Q244 238 232 244Z" fill="#8ABC88" opacity="0.6"/>
    <path d="M232 240 Q230 226 224 220 Q226 230 232 240Z" fill="#72A872" opacity="0.55"/>
    {/* mug */}
    <path d="M196 244 Q197 236 206 236 Q215 236 216 244 L215 258 Q206 261 197 258Z" fill="#D8EEF8" opacity="0.85"/>
    <path d="M216 239 Q222 239 222 243 Q222 248 216 248" stroke="#B8D8F0" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M203 234 Q204 230 203 227" stroke="#C8E0F0" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M208 233 Q209 229 208 226" stroke="#C8E0F0" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4"/>
    {/* legs crossed – dark blue jeans */}
    <path d="M98 232 Q104 220 122 222 Q132 224 140 233 Q120 244 98 240Z" fill="#4A7AAA" opacity="0.88"/>
    <path d="M182 232 Q176 220 158 222 Q148 224 140 233 Q160 244 182 240Z" fill="#4A7AAA" opacity="0.88"/>
    <ellipse cx="140" cy="237" rx="29" ry="11" fill="#3D6A9A" opacity="0.7"/>
    <ellipse cx="180" cy="238" rx="13" ry="8" transform="rotate(-15 180 238)" fill="#3D6A9A" opacity="0.85"/>
    <ellipse cx="100" cy="238" rx="13" ry="8" transform="rotate(15 100 238)" fill="#3D6A9A" opacity="0.85"/>
    {/* torso teal hoodie */}
    <path d="M114 180 Q116 168 140 166 Q164 168 166 180 L170 230 Q155 238 140 239 Q125 238 110 230Z" fill="#5BBFB0" opacity="0.92"/>
    <path d="M126 212 Q140 215 154 212 Q154 222 140 224 Q126 222 126 212Z" fill="#4AAFA0" opacity="0.6"/>
    <line x1="140" y1="173" x2="140" y2="224" stroke="#4AAFA0" strokeWidth="1" opacity="0.45"/>
    <circle cx="136" cy="176" r="1.5" fill="#3A9F90" opacity="0.6"/>
    <circle cx="144" cy="176" r="1.5" fill="#3A9F90" opacity="0.6"/>
    {/* arms */}
    <path d="M114 192 Q102 198 96 218 Q104 224 114 218 Q116 207 118 196Z" fill="#5BBFB0" opacity="0.88"/>
    <path d="M166 192 Q178 198 184 218 Q176 224 166 218 Q164 207 162 196Z" fill="#5BBFB0" opacity="0.88"/>
    {/* hands */}
    <ellipse cx="102" cy="230" rx="10" ry="6" fill="#D4B8A0" opacity="0.85"/>
    <ellipse cx="178" cy="230" rx="10" ry="6" fill="#D4B8A0" opacity="0.85"/>
    {/* neck */}
    <rect x="133" y="156" width="14" height="14" rx="6" fill="#D4B8A0"/>
    {/* head */}
    <ellipse cx="140" cy="135" rx="27" ry="29" fill="#D4B8A0"/>
    {/* hair */}
    <path d="M113 129 Q114 102 140 100 Q166 102 167 129 Q161 109 140 107 Q119 109 113 129Z" fill="#3A2E24"/>
    <path d="M119 116 Q129 104 140 102 Q151 104 161 116 Q156 106 140 104 Q124 106 119 116Z" fill="#2A2018"/>
    <path d="M113 128 Q111 118 115 110 Q112 120 113 128Z" fill="#3A2E24"/>
    <path d="M167 128 Q169 118 165 110 Q168 120 167 128Z" fill="#3A2E24"/>
    {/* closed eyes */}
    <path d="M127 132 Q130 134.5 133 132" stroke="#6B4E3A" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M147 132 Q150 134.5 153 132" stroke="#6B4E3A" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {/* lashes */}
    <path d="M127 132 Q126 130 126.5 129" stroke="#6B4E3A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M133 132 Q134 130 133.5 129" stroke="#6B4E3A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M147 132 Q146 130 146.5 129" stroke="#6B4E3A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M153 132 Q154 130 153.5 129" stroke="#6B4E3A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
    {/* smile */}
    <path d="M134 141 Q140 145 146 141" stroke="#C09A84" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* nose */}
    <path d="M139 138 Q140 140 141 138" stroke="#C09A84" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    {/* ears */}
    <ellipse cx="113" cy="136" rx="5" ry="7" fill="#CCA898"/>
    <ellipse cx="167" cy="136" rx="5" ry="7" fill="#CCA898"/>
    {/* blush */}
    <ellipse cx="126" cy="142" rx="6" ry="3.5" fill="#E8A090" opacity="0.22"/>
    <ellipse cx="154" cy="142" rx="6" ry="3.5" fill="#E8A090" opacity="0.22"/>
    {/* sparkles */}
    <circle cx="96" cy="112" r="2" fill="#C8E0F0" opacity="0.65"/>
    <circle cx="188" cy="108" r="1.5" fill="#A8CCE8" opacity="0.55"/>
    <circle cx="174" cy="97" r="1" fill="#B8D8F0" opacity="0.5"/>
    <circle cx="108" cy="100" r="1.2" fill="#C0D8EE" opacity="0.5"/>
  </svg>
);

/* ─────────────────────────────────────────────
   DECORATIVE LEAVES
───────────────────────────────────────────── */
const LeavesLeft = () => (
  <svg viewBox="0 0 220 320" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{position:"absolute",bottom:0,left:0,width:"clamp(140px,16vw,220px)",pointerEvents:"none",zIndex:1}}>
    <path d="M15 320 Q35 275 25 230 Q45 242 35 285 Q55 255 42 210 Q65 225 50 268 Q75 232 60 188 Q85 205 67 245 Q95 210 77 165 Q105 185 83 228" stroke="#8AAEC8" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
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
  <svg viewBox="0 0 220 320" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{position:"absolute",bottom:0,right:0,width:"clamp(140px,16vw,220px)",pointerEvents:"none",zIndex:1,transform:"scaleX(-1)"}}>
    <path d="M15 320 Q35 275 25 230 Q45 242 35 285 Q55 255 42 210 Q65 225 50 268 Q75 232 60 188 Q85 205 67 245 Q95 210 77 165 Q105 185 83 228" stroke="#8AAEC8" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
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

/* ─────────────────────────────────────────────
   PAINTERLY CLOUD BACKGROUND
───────────────────────────────────────────── */
const CloudBg = () => (
  <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}
    viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" fill="none">
    <defs>
      <radialGradient id="sky" cx="50%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#D2D8EC"/>
        <stop offset="50%" stopColor="#C5CCE4"/>
        <stop offset="100%" stopColor="#B8C0DA"/>
      </radialGradient>
      <filter id="b4"><feGaussianBlur stdDeviation="4"/></filter>
      <filter id="b8"><feGaussianBlur stdDeviation="8"/></filter>
      <filter id="b14"><feGaussianBlur stdDeviation="14"/></filter>
      <filter id="b20"><feGaussianBlur stdDeviation="20"/></filter>
    </defs>
    <rect width="1200" height="800" fill="url(#sky)"/>
    {/* lavender-pink tints top */}
    <ellipse cx="600" cy="100" rx="700" ry="200" fill="#C8C0E0" opacity="0.22" filter="url(#b20)"/>
    <ellipse cx="200" cy="80" rx="300" ry="120" fill="#D4B8D8" opacity="0.18" filter="url(#b14)"/>
    <ellipse cx="950" cy="90" rx="280" ry="110" fill="#C8C0D8" opacity="0.15" filter="url(#b14)"/>
    {/* big white cloud masses */}
    <ellipse cx="600" cy="220" rx="550" ry="210" fill="white" opacity="0.2" filter="url(#b20)"/>
    <ellipse cx="150" cy="180" rx="330" ry="145" fill="white" opacity="0.22" filter="url(#b14)"/>
    <ellipse cx="1050" cy="200" rx="310" ry="135" fill="white" opacity="0.18" filter="url(#b14)"/>
    {/* mid-level clouds */}
    <ellipse cx="350" cy="360" rx="250" ry="80" fill="white" opacity="0.16" filter="url(#b8)"/>
    <ellipse cx="850" cy="340" rx="270" ry="75" fill="white" opacity="0.14" filter="url(#b8)"/>
    <ellipse cx="600" cy="420" rx="450" ry="90" fill="white" opacity="0.13" filter="url(#b14)"/>
    {/* wispy highlights */}
    <ellipse cx="490" cy="145" rx="130" ry="32" fill="white" opacity="0.28" filter="url(#b4)"/>
    <ellipse cx="760" cy="230" rx="150" ry="36" fill="white" opacity="0.24" filter="url(#b4)"/>
    <ellipse cx="180" cy="300" rx="110" ry="28" fill="white" opacity="0.2" filter="url(#b4)"/>
    <ellipse cx="1020" cy="310" rx="120" ry="30" fill="white" opacity="0.18" filter="url(#b4)"/>
    {/* bottom cloud bank */}
    <ellipse cx="300" cy="700" rx="380" ry="110" fill="white" opacity="0.18" filter="url(#b14)"/>
    <ellipse cx="900" cy="720" rx="350" ry="100" fill="white" opacity="0.16" filter="url(#b14)"/>
    <ellipse cx="600" cy="780" rx="600" ry="120" fill="white" opacity="0.14" filter="url(#b20)"/>
    {/* subtle pink streaks top-right */}
    <ellipse cx="1100" cy="50" rx="200" ry="60" fill="#E8C0D0" opacity="0.15" filter="url(#b14)"/>
    <ellipse cx="100" cy="60" rx="180" ry="55" fill="#D8C0E0" opacity="0.12" filter="url(#b14)"/>
  </svg>
);

/* ─────────────────────────────────────────────
   LOGIN FORM (right card)
───────────────────────────────────────────── */
const LoginForm = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPass,setShowPass]=useState(false);
  const [remember,setRemember]=useState(true);
  const [loading,setLoading]=useState(false);
  const [focusedField,setFocusedField]=useState(null);

  const inputStyle = (name) => ({
    width:"100%",padding:"0.72rem 1rem",
    border:`1.5px solid ${focusedField===name?"#8AAFD4":"#DDE8F2"}`,
    borderRadius:"10px",fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",
    color:"#2D4A6B",background:focusedField===name?"#FAFCFF":"#F4F8FC",
    outline:"none",boxShadow:focusedField===name?"0 0 0 3px rgba(122,175,212,0.12)":"none",
    transition:"all 0.18s",boxSizing:"border-box"
  });

  return (
    <div style={{
      background:"rgba(255,255,255,0.88)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",
      borderRadius:"22px",boxShadow:"0 8px 40px rgba(90,140,190,0.2),0 2px 10px rgba(90,140,190,0.1)",
      padding:"2.5rem 2.3rem",width:"100%",maxWidth:"430px",
      border:"1.5px solid rgba(255,255,255,0.85)"
    }}>
      <h2 style={{fontFamily:"'DM Sans',sans-serif",fontSize:"2rem",fontWeight:800,color:"#1E3A5A",margin:"0 0 0.2rem",letterSpacing:"-0.025em"}}>
        Welcome Back
      </h2>
      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",color:"#8AAAC8",margin:"0 0 1.8rem"}}>
        Sign in to continue to Arogyam
      </p>

      {/* input group card */}
      <div style={{background:"rgba(238,246,255,0.55)",borderRadius:"14px",padding:"1.3rem 1.2rem 0.4rem",marginBottom:"1rem",border:"1px solid rgba(200,222,242,0.5)"}}>
        {/* email */}
        <div style={{marginBottom:"1rem"}}>
          <label style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.78rem",fontWeight:600,color:"#6B8CAA",display:"block",marginBottom:"0.3rem"}}>Email Address</label>
          <input type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)}
            onFocus={()=>setFocusedField("email")} onBlur={()=>setFocusedField(null)}
            style={inputStyle("email")}/>
        </div>
        {/* password */}
        <div style={{marginBottom:"0.5rem"}}>
          <label style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.78rem",fontWeight:600,color:"#6B8CAA",display:"block",marginBottom:"0.3rem"}}>Password</label>
          <div style={{position:"relative"}}>
            <input type={showPass?"text":"password"} placeholder="••••••••••" value={password} onChange={e=>setPassword(e.target.value)}
              onFocus={()=>setFocusedField("password")} onBlur={()=>setFocusedField(null)}
              style={{...inputStyle("password"),paddingRight:"4rem"}}/>
            <button onClick={()=>setShowPass(!showPass)} style={{
              position:"absolute",right:"10px",top:"50%",transform:"translateY(-50%)",
              background:"none",border:"none",cursor:"pointer",color:"#8AAFC8",
              fontFamily:"'DM Sans',sans-serif",fontSize:"0.8rem",fontWeight:600,
              display:"flex",alignItems:"center",gap:"3px",padding:"2px"
            }}
              onMouseEnter={e=>e.currentTarget.style.color="#4A7EA5"}
              onMouseLeave={e=>e.currentTarget.style.color="#8AAFC8"}>
              {showPass?<EyeOff/>:<span>Show</span>}
            </button>
          </div>
        </div>
      </div>

      {/* remember + forgot */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.1rem"}}>
        <label style={{display:"flex",alignItems:"center",gap:"0.45rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"0.84rem",color:"#5B7A95"}}>
          <div onClick={()=>setRemember(!remember)} style={{
            width:"17px",height:"17px",border:`2px solid ${remember?"#5B8FB9":"#C0D4E8"}`,
            borderRadius:"4px",background:remember?"#5B8FB9":"white",
            display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.18s",flexShrink:0
          }}>
            {remember&&<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1 5l2.5 2.5L8 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          Remember me
        </label>
        <a href="#" style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.84rem",color:"#8AAFC8",textDecoration:"none",fontWeight:500}}
          onMouseEnter={e=>e.target.style.color="#4A7FA5"} onMouseLeave={e=>e.target.style.color="#8AAFC8"}>
          Forgot Password?
        </a>
      </div>

      {/* Sign In button */}
      <button onClick={()=>{setLoading(true);setTimeout(()=>setLoading(false),1800);}} style={{
        width:"100%",padding:"0.85rem",
        background:"linear-gradient(135deg,#6BA5D8 0%,#5592C8 45%,#4480B8 100%)",
        border:"none",borderRadius:"13px",color:"white",
        fontFamily:"'DM Sans',sans-serif",fontSize:"0.95rem",fontWeight:700,
        cursor:loading?"not-allowed":"pointer",opacity:loading?0.82:1,
        boxShadow:"0 4px 20px rgba(74,128,184,0.45)",transition:"all 0.22s",
        display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",
        marginBottom:"1rem",letterSpacing:"0.01em"
      }}
        onMouseEnter={e=>{if(!loading){e.currentTarget.style.transform="translateY(-1.5px)";e.currentTarget.style.boxShadow="0 8px 26px rgba(74,128,184,0.55)";}}}
        onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 20px rgba(74,128,184,0.45)";}}>
        {loading?(
          <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{animation:"spin 1s linear infinite"}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Signing In…</>
        ):"Sign In"}
      </button>

      {/* OR */}
      <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.85rem"}}>
        <div style={{flex:1,height:"1px",background:"#E2EEF8"}}/>
        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.78rem",color:"#AACAE0",fontWeight:600,letterSpacing:"0.06em"}}>OR</span>
        <div style={{flex:1,height:"1px",background:"#E2EEF8"}}/>
      </div>

      {/* Social */}
      {[{icon:<GoogleIcon/>,label:"Continue with Google"},{icon:<UnivIcon/>,label:"Continue with University ID"}].map(({icon,label})=>(
        <button key={label} style={{
          width:"100%",padding:"0.7rem 1rem",background:"white",border:"1.5px solid #DDE8F5",
          borderRadius:"10px",color:"#3A5A7A",fontFamily:"'DM Sans',sans-serif",fontSize:"0.87rem",fontWeight:500,
          display:"flex",alignItems:"center",justifyContent:"center",gap:"0.65rem",
          cursor:"pointer",transition:"all 0.18s",marginBottom:"0.6rem"
        }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#8AAFD4";e.currentTarget.style.background="#F4F9FF";e.currentTarget.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#DDE8F5";e.currentTarget.style.background="white";e.currentTarget.style.transform="none";}}>
          {icon}{label}
        </button>
      ))}

      {/* create account */}
      <p style={{textAlign:"center",fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem",color:"#8AAAC8",marginTop:"0.8rem",marginBottom:0}}>
        Don't have an account?{" "}
        <a href="#" style={{color:"#4A7EB8",fontWeight:700,textDecoration:"none"}}
          onMouseEnter={e=>e.target.style.color="#2D5A90"} onMouseLeave={e=>e.target.style.color="#4A7EB8"}>
          Create Account
        </a>
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ROOT PAGE
───────────────────────────────────────────── */
export default function LoginPage() {
  const features = ["AI Mental Health Support","Campus Counselling Access","Wellness Resources","Peer Support Community"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{margin:0;padding:0;}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .anim-float{animation:float 6s ease-in-out infinite;}
        .fu{animation:fadeUp 0.55s ease-out both;}
        .d1{animation-delay:0.05s}.d2{animation-delay:0.18s}.d3{animation-delay:0.28s}
        .d4{animation-delay:0.38s}.d5{animation-delay:0.48s}
        @media(max-width:700px){.two-col{flex-direction:column!important;} .left-col{min-height:auto!important;}}
      `}</style>

      <div style={{minHeight:"100vh",width:"100%",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <CloudBg/>
        <LeavesLeft/>
        <LeavesRight/>

        <div className="two-col" style={{
          position:"relative",zIndex:2,display:"flex",flexWrap:"wrap",
          width:"100%",maxWidth:"1050px",margin:"0 auto",padding:"2rem 1.5rem",
          gap:"1.5rem",alignItems:"center",justifyContent:"center",minHeight:"100vh"
        }}>

          {/* ── LEFT BRANDING CARD ── */}
          <div className="fu d1" style={{
            flex:"1 1 320px",maxWidth:"400px",
            background:"rgba(215,228,248,0.42)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
            borderRadius:"26px",border:"1.5px solid rgba(255,255,255,0.55)",
            boxShadow:"0 4px 32px rgba(100,140,200,0.14)",
            padding:"2.4rem 2.2rem 0",display:"flex",flexDirection:"column",
            overflow:"hidden",minHeight:"560px"
          }}>
            {/* logo */}
            <div className="fu d2" style={{display:"flex",alignItems:"center",gap:"0.55rem",marginBottom:"1.6rem"}}>
              <LotusLogo/>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#2A4A6E",letterSpacing:"-0.02em"}}>
                Arogyam
              </span>
            </div>

            {/* heading */}
            <div className="fu d3" style={{marginBottom:"1.5rem"}}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"1.6rem",fontWeight:800,color:"#1E3A5A",lineHeight:1.2,margin:"0 0 0.1rem"}}>
                Your <span style={{color:"#3872B0"}}>Digital</span>
              </p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"1.5rem",fontWeight:600,color:"#2A4A6E",lineHeight:1.2,margin:0}}>
                Mental Wellness Companion
              </p>
            </div>

            {/* features */}
            <ul className="fu d4" style={{listStyle:"none",padding:0,margin:"0 0 1.2rem",display:"flex",flexDirection:"column",gap:"0.65rem"}}>
              {features.map(f=>(
                <li key={f} style={{display:"flex",alignItems:"center",gap:"0.55rem"}}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3.5 9.5l3.8 3.8 7-8" stroke="#4A7AB0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.9rem",color:"#2A4A6E"}}>{f}</span>
                </li>
              ))}
            </ul>

            {/* illustration */}
            <div className="anim-float" style={{flex:1,display:"flex",alignItems:"flex-end",justifyContent:"center",marginTop:"auto"}}>
              <MeditationIllustration/>
            </div>
          </div>

          {/* ── RIGHT LOGIN AREA ── */}
          <div className="fu d2" style={{flex:"1 1 370px",maxWidth:"460px",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.9rem"}}>
            <LoginForm/>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.75rem",color:"rgba(55,85,125,0.55)",textAlign:"center"}}>
              © 2026 Arogyam&ensp;
              <a href="#" style={{color:"rgba(55,85,125,0.65)",textDecoration:"none"}}
                onMouseEnter={e=>e.target.style.color="#2D5A90"} onMouseLeave={e=>e.target.style.color="rgba(55,85,125,0.65)"}>Privacy Policy</a>
              <span style={{margin:"0 0.35rem",opacity:0.4}}>·</span>
              <a href="#" style={{color:"rgba(55,85,125,0.65)",textDecoration:"none"}}
                onMouseEnter={e=>e.target.style.color="#2D5A90"} onMouseLeave={e=>e.target.style.color="rgba(55,85,125,0.65)"}>Terms</a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
