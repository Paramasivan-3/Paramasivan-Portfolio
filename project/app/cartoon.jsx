/* Cartoon character — 3D illustrated SVG */
function CartoonCharacter() {
  return (
    <div className="cartoon-wrap">
      <div className="cartoon-glow-ring" />
      <svg
        viewBox="0 0 360 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cartoon-svg"
        role="img"
        aria-label="Cartoon character sitting at laptop"
      >
        <defs>
          <radialGradient id="cSkin" cx="38%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#f9d8b8"/>
            <stop offset="55%" stopColor="#e8a878"/>
            <stop offset="100%" stopColor="#bf7545"/>
          </radialGradient>
          <radialGradient id="cSkinDark" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#e8a878"/>
            <stop offset="100%" stopColor="#bf7545"/>
          </radialGradient>
          <linearGradient id="cHair" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#2a1400"/>
            <stop offset="100%" stopColor="#0d0600"/>
          </linearGradient>
          <linearGradient id="cShirt" x1="0.1" y1="0" x2="0.1" y2="1">
            <stop offset="0%" stopColor="#7c3aed"/>
            <stop offset="50%" stopColor="#5b21b6"/>
            <stop offset="100%" stopColor="#3b0764"/>
          </linearGradient>
          <linearGradient id="cShirtHl" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="cPants" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b"/>
            <stop offset="100%" stopColor="#0f172a"/>
          </linearGradient>
          <linearGradient id="cChairBack" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#4c1d95"/>
            <stop offset="55%" stopColor="#2e1065"/>
            <stop offset="100%" stopColor="#160730"/>
          </linearGradient>
          <linearGradient id="cSeat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6d28d9"/>
            <stop offset="100%" stopColor="#3b0764"/>
          </linearGradient>
          <linearGradient id="cLaptop" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#4b5563"/>
            <stop offset="100%" stopColor="#1f2937"/>
          </linearGradient>
          <radialGradient id="cScreen" cx="50%" cy="45%" r="58%">
            <stop offset="0%" stopColor="#e0f2fe"/>
            <stop offset="35%" stopColor="#38bdf8"/>
            <stop offset="100%" stopColor="#0369a1"/>
          </radialGradient>
          <radialGradient id="cWheel" cx="35%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#9ca3af"/>
            <stop offset="100%" stopColor="#374151"/>
          </radialGradient>
          <filter id="cShadow" x="-18%" y="-12%" width="136%" height="136%">
            <feDropShadow dx="2" dy="7" stdDeviation="11" floodColor="#000000" floodOpacity="0.45"/>
          </filter>
          <filter id="cHeadShadow" x="-22%" y="-18%" width="144%" height="144%">
            <feDropShadow dx="3" dy="9" stdDeviation="14" floodColor="#000000" floodOpacity="0.5"/>
          </filter>
          <filter id="cScreenGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="cLedGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* ── FLOOR SHADOW ── */}
        <ellipse cx="180" cy="443" rx="115" ry="12" fill="rgba(0,0,0,0.38)"/>

        {/* ── CHAIR POLE ── */}
        <rect x="173" y="348" width="14" height="68" rx="7" fill="#374151"/>
        <rect x="175" y="348" width="4" height="68" rx="2" fill="#6b7280"/>

        {/* ── CHAIR BASE SPOKES ── */}
        <g transform="translate(180,410)">
          <rect x="-30" y="-5" width="60" height="10" rx="5" fill="#1f2937"/>
          <rect x="-30" y="-5" width="60" height="10" rx="5" fill="#1f2937" transform="rotate(72)"/>
          <rect x="-30" y="-5" width="60" height="10" rx="5" fill="#1f2937" transform="rotate(144)"/>
          <rect x="-30" y="-5" width="60" height="10" rx="5" fill="#1f2937" transform="rotate(216)"/>
          <rect x="-30" y="-5" width="60" height="10" rx="5" fill="#1f2937" transform="rotate(288)"/>
        </g>

        {/* ── WHEELS ── */}
        <g transform="translate(180,410)">
          <ellipse cx="0" cy="28" rx="9" ry="7" fill="url(#cWheel)"/>
          <ellipse cx="27" cy="18" rx="9" ry="7" fill="url(#cWheel)" transform="rotate(20 27 18)"/>
          <ellipse cx="17" cy="-24" rx="9" ry="7" fill="url(#cWheel)" transform="rotate(-36 17 -24)"/>
          <ellipse cx="-17" cy="-24" rx="9" ry="7" fill="url(#cWheel)" transform="rotate(36 -17 -24)"/>
          <ellipse cx="-27" cy="18" rx="9" ry="7" fill="url(#cWheel)" transform="rotate(-20 -27 18)"/>
        </g>

        {/* ── CHAIR BACK ── */}
        <path d="M115 188 Q113 158 126 144 Q180 132 234 144 Q247 158 245 188 L243 328 Q214 338 180 338 Q146 338 117 328 Z"
              fill="url(#cChairBack)" filter="url(#cShadow)"/>
        {/* Inner back panel */}
        <path d="M124 196 Q123 170 133 158 Q180 148 227 158 Q237 170 236 196 L234 318 Q214 325 180 325 Q146 325 126 318 Z"
              fill="#3b1f8c" opacity="0.45"/>
        {/* Headrest bump */}
        <path d="M140 141 Q180 129 220 141 Q220 159 180 163 Q140 159 140 141 Z"
              fill="#5b21b6"/>
        <path d="M148 143 Q180 134 212 143 Q212 154 180 157 Q148 154 148 143 Z"
              fill="#6d28d9" opacity="0.55"/>
        {/* Chair back stitching detail */}
        <path d="M148 180 L148 310" stroke="#6d28d9" strokeWidth="1.5" strokeDasharray="5,6" opacity="0.4"/>
        <path d="M212 180 L212 310" stroke="#6d28d9" strokeWidth="1.5" strokeDasharray="5,6" opacity="0.4"/>
        <path d="M130 220 Q180 215 230 220" stroke="#6d28d9" strokeWidth="1.5" strokeDasharray="5,6" opacity="0.3" fill="none"/>

        {/* ── CHAIR ARMRESTS ── */}
        {/* Left */}
        <path d="M108 278 L106 314 Q102 316 98 312 L95 270 Q99 266 108 278 Z" fill="#1e1b4b"/>
        <rect x="86" y="264" width="30" height="14" rx="7" fill="#3730a3"/>
        <rect x="88" y="265" width="26" height="6" rx="3" fill="#4338ca" opacity="0.6"/>
        {/* Right */}
        <path d="M252 278 L254 314 Q258 316 262 312 L265 270 Q261 266 252 278 Z" fill="#1e1b4b"/>
        <rect x="244" y="264" width="30" height="14" rx="7" fill="#3730a3"/>
        <rect x="246" y="265" width="26" height="6" rx="3" fill="#4338ca" opacity="0.6"/>

        {/* ── CHAIR SEAT ── */}
        <path d="M103 302 Q105 284 128 278 Q180 270 232 278 Q255 284 257 302 Q257 323 232 329 Q180 337 128 329 Q105 323 103 302 Z"
              fill="url(#cSeat)" filter="url(#cShadow)"/>
        <path d="M114 297 Q116 287 134 282 Q180 276 226 282 Q244 287 246 297 Q246 310 226 315 Q180 319 134 315 Q116 310 114 297 Z"
              fill="#6d28d9" opacity="0.3"/>

        {/* ── PERSON LEGS ── */}
        {/* Left thigh */}
        <path d="M125 305 Q120 320 116 346 Q112 364 115 380"
              stroke="#1e293b" strokeWidth="32" strokeLinecap="round" fill="none"/>
        {/* Right thigh */}
        <path d="M235 305 Q240 320 244 346 Q248 364 245 380"
              stroke="#1e293b" strokeWidth="32" strokeLinecap="round" fill="none"/>
        {/* Left lower leg */}
        <path d="M115 380 Q112 400 114 418"
              stroke="#0f172a" strokeWidth="26" strokeLinecap="round" fill="none"/>
        {/* Right lower leg */}
        <path d="M245 380 Q248 400 246 418"
              stroke="#0f172a" strokeWidth="26" strokeLinecap="round" fill="none"/>
        {/* Left shoe */}
        <path d="M100 418 Q104 430 132 430 Q139 430 138 422 Q130 413 104 413 Z" fill="#111827"/>
        <path d="M106 419 Q118 424 132 422" stroke="#374151" strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* Right shoe */}
        <path d="M260 418 Q256 430 228 430 Q221 430 222 422 Q230 413 256 413 Z" fill="#111827"/>
        <path d="M254 419 Q242 424 228 422" stroke="#374151" strokeWidth="2" strokeLinecap="round" fill="none"/>

        {/* ── LAPTOP BASE (ON LAP) ── */}
        <path d="M108 293 Q180 282 252 293 L248 308 Q180 296 112 308 Z"
              fill="url(#cLaptop)"/>
        <path d="M112 308 Q180 296 248 308 L246 313 Q180 301 114 313 Z"
              fill="#111827"/>
        <path d="M113 294 Q180 284 247 294" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

        {/* ── LAPTOP SCREEN ── */}
        <path d="M114 292 L124 190 Q126 180 137 179 L223 179 Q234 180 236 190 L246 292 Z"
              fill="url(#cLaptop)" filter="url(#cShadow)"/>
        {/* Screen bezel */}
        <path d="M118 290 L127 197 Q129 190 138 189 L222 189 Q231 190 233 197 L242 290 Z"
              fill="#111827"/>
        {/* Screen display */}
        <path d="M133 202 L130 278 L230 278 L227 202 Z"
              fill="url(#cScreen)" filter="url(#cScreenGlow)"/>
        {/* Dark code editor bg overlay */}
        <path d="M133 202 L130 278 L230 278 L227 202 Z"
              fill="#020617" opacity="0.55"/>
        {/* Code lines */}
        <rect x="140" y="210" width="44" height="3.5" rx="1.75" fill="#f472b6" opacity="0.9"/>
        <rect x="144" y="218" width="68" height="3.5" rx="1.75" fill="#a5f3fc" opacity="0.85"/>
        <rect x="152" y="226" width="36" height="3.5" rx="1.75" fill="#86efac" opacity="0.85"/>
        <rect x="144" y="234" width="55" height="3.5" rx="1.75" fill="#fde68a" opacity="0.8"/>
        <rect x="140" y="242" width="42" height="3.5" rx="1.75" fill="#a5f3fc" opacity="0.8"/>
        <rect x="152" y="250" width="60" height="3.5" rx="1.75" fill="#f472b6" opacity="0.75"/>
        <rect x="144" y="258" width="28" height="3.5" rx="1.75" fill="#86efac" opacity="0.75"/>
        <rect x="144" y="266" width="52" height="3.5" rx="1.75" fill="#fde68a" opacity="0.7"/>
        <rect className="c-cursor" x="140" y="273" width="10" height="4" rx="2" fill="#a5f3fc"/>
        {/* Webcam dot */}
        <circle cx="180" cy="193" r="3.5" fill="#374151"/>
        <circle cx="180" cy="193" r="2" fill="#0f172a"/>
        <circle cx="181" cy="192" r="0.8" fill="#6b7280"/>
        {/* Screen glow halo */}
        <path d="M133 202 L130 278 L230 278 L227 202 Z" fill="#38bdf8" opacity="0.04"/>

        {/* ── HANDS ── */}
        {/* Left hand */}
        <ellipse className="c-hand-l" cx="143" cy="290" rx="20" ry="9" fill="url(#cSkin)"/>
        <path d="M130 289 Q135 282 141 287" stroke="#bf7545" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
        <path d="M137 287 Q142 280 147 285" stroke="#bf7545" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
        <path d="M143 286 Q148 279 153 284" stroke="#bf7545" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
        {/* Right hand */}
        <ellipse className="c-hand-r" cx="217" cy="290" rx="20" ry="9" fill="url(#cSkin)"/>
        <path d="M207 289 Q212 282 218 287" stroke="#bf7545" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
        <path d="M213 287 Q218 280 223 285" stroke="#bf7545" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
        <path d="M219 286 Q224 279 229 284" stroke="#bf7545" strokeWidth="4.5" strokeLinecap="round" fill="none"/>

        {/* ── TORSO ── */}
        <path d="M126 298 Q126 288 143 282 Q180 274 217 282 Q234 288 234 298 L230 212 Q211 200 180 196 Q149 200 130 212 Z"
              fill="url(#cShirt)" filter="url(#cShadow)"/>
        {/* Shirt highlight */}
        <path d="M150 212 Q162 206 173 210 L171 264 Q161 258 153 250 Z"
              fill="url(#cShirtHl)"/>
        {/* V-neck collar */}
        <path d="M162 205 L180 220 L198 205 L193 216 Q180 225 167 216 Z"
              fill="#3b0764"/>
        {/* Code icon on shirt */}
        <text x="180" y="250" textAnchor="middle" fontSize="11" fill="#c4b5fd" opacity="0.55" fontFamily="monospace">&lt;/&gt;</text>

        {/* ── ARMS ── */}
        {/* Left arm */}
        <path d="M130 217 Q110 252 128 293" stroke="#5b21b6" strokeWidth="30" strokeLinecap="round" fill="none"/>
        <path d="M133 219 Q115 254 131 290" stroke="#7c3aed" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.38"/>
        {/* Right arm */}
        <path d="M230 217 Q250 252 232 293" stroke="#5b21b6" strokeWidth="30" strokeLinecap="round" fill="none"/>
        <path d="M227 219 Q245 254 229 290" stroke="#7c3aed" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.38"/>

        {/* ── NECK ── */}
        <path d="M162 200 L162 185 Q163 173 180 170 Q197 173 198 185 L198 200 Q190 207 180 207 Q170 207 162 200 Z"
              fill="url(#cSkin)"/>

        {/* ── EARS ── */}
        <ellipse cx="119" cy="138" rx="12" ry="15" fill="#dfa070"/>
        <ellipse cx="119" cy="138" rx="8" ry="11" fill="#bf7545"/>
        <ellipse cx="241" cy="138" rx="12" ry="15" fill="#dfa070"/>
        <ellipse cx="241" cy="138" rx="8" ry="11" fill="#bf7545"/>

        {/* ── HEAD ── */}
        <ellipse cx="180" cy="124" rx="60" ry="62" fill="url(#cSkin)" filter="url(#cHeadShadow)"/>
        {/* Chin */}
        <ellipse cx="180" cy="166" rx="43" ry="23" fill="url(#cSkin)"/>

        {/* ── HAIR ── */}
        <path d="M120 108 Q118 64 143 52 Q180 42 217 52 Q242 64 240 108 Q224 90 200 84 Q180 80 160 84 Q136 90 120 108 Z"
              fill="url(#cHair)"/>
        <path d="M120 104 Q116 128 119 142" stroke="#1a0800" strokeWidth="10" strokeLinecap="round" fill="none"/>
        <path d="M240 104 Q244 128 241 142" stroke="#1a0800" strokeWidth="10" strokeLinecap="round" fill="none"/>
        {/* Hair highlight */}
        <path d="M152 54 Q180 44 208 54 Q196 66 180 68 Q164 66 152 54 Z"
              fill="#3d2000" opacity="0.5"/>
        {/* Hair wisp top */}
        <path d="M174 44 Q180 36 186 44" stroke="#241200" strokeWidth="4.5" strokeLinecap="round" fill="none"/>

        {/* ── EYEBROWS ── */}
        <path d="M146 105 Q160 99 173 104" stroke="#1a0800" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
        <path d="M187 104 Q200 99 214 105" stroke="#1a0800" strokeWidth="4.5" strokeLinecap="round" fill="none"/>

        {/* ── EYES ── */}
        {/* Whites */}
        <ellipse cx="161" cy="126" rx="15" ry="14" fill="white"/>
        <ellipse cx="199" cy="126" rx="15" ry="14" fill="white"/>
        {/* Shadow top edge */}
        <path d="M146 121 Q161 115 176 121" fill="#f9d8b8" opacity="0.4"/>
        <path d="M184 121 Q199 115 214 121" fill="#f9d8b8" opacity="0.4"/>
        {/* Iris */}
        <circle cx="161" cy="127" r="9.5" fill="#2a1600"/>
        <circle cx="199" cy="127" r="9.5" fill="#2a1600"/>
        <circle cx="161" cy="127" r="7.5" fill="#3d2200"/>
        <circle cx="199" cy="127" r="7.5" fill="#3d2200"/>
        {/* Pupil */}
        <circle cx="162" cy="128" r="4.8" fill="#070300"/>
        <circle cx="200" cy="128" r="4.8" fill="#070300"/>
        {/* Shine */}
        <circle cx="166" cy="122" r="3.8" fill="white" opacity="0.93"/>
        <circle cx="204" cy="122" r="3.8" fill="white" opacity="0.93"/>
        <circle cx="158" cy="131" r="2" fill="white" opacity="0.52"/>
        <circle cx="196" cy="131" r="2" fill="white" opacity="0.52"/>
        {/* Lashes */}
        <path d="M147 117 Q161 111 175 117" stroke="#1a0800" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        <path d="M185 117 Q199 111 213 117" stroke="#1a0800" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        {/* Eyelids for blink animation */}
        <ellipse className="c-lid-l" cx="161" cy="126" rx="15" ry="0" fill="url(#cSkin)"/>
        <ellipse className="c-lid-r" cx="199" cy="126" rx="15" ry="0" fill="url(#cSkin)"/>

        {/* ── NOSE ── */}
        <path d="M175 140 Q180 150 185 140" stroke="#a86030" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="176.5" cy="149" r="4" fill="#bf7545" opacity="0.42"/>
        <circle cx="183.5" cy="149" r="4" fill="#bf7545" opacity="0.42"/>

        {/* ── CHEEK BLUSH ── */}
        <ellipse cx="140" cy="148" rx="17" ry="11" fill="#ff7060" opacity="0.17"/>
        <ellipse cx="220" cy="148" rx="17" ry="11" fill="#ff7060" opacity="0.17"/>

        {/* ── SMILE ── */}
        <path d="M163 160 Q180 173 197 160" stroke="#9a5830" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <path d="M165 162 Q180 172 195 162 Q188 169 180 169 Q172 169 165 162 Z"
              fill="white" opacity="0.87"/>

        {/* ── HEADPHONES ── */}
        <path d="M121 110 Q123 64 180 60 Q237 64 239 110"
              stroke="#1e1b4b" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M122 109 Q124 65 180 61 Q236 65 238 109"
              stroke="#4338ca" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.55"/>
        {/* Left cup */}
        <ellipse cx="118" cy="112" rx="17" ry="19" fill="#4338ca" filter="url(#cShadow)"/>
        <ellipse cx="118" cy="112" rx="12" ry="14" fill="#3730a3"/>
        <ellipse cx="118" cy="112" rx="7.5" ry="9" fill="#1e1b4b"/>
        {/* Right cup */}
        <ellipse cx="242" cy="112" rx="17" ry="19" fill="#4338ca" filter="url(#cShadow)"/>
        <ellipse cx="242" cy="112" rx="12" ry="14" fill="#3730a3"/>
        <ellipse cx="242" cy="112" rx="7.5" ry="9" fill="#1e1b4b"/>
        {/* LED dots */}
        <circle className="c-led" cx="110" cy="104" r="4.5" fill="#06b6d4" filter="url(#cLedGlow)"/>
        <circle className="c-led" cx="250" cy="104" r="4.5" fill="#06b6d4" filter="url(#cLedGlow)"/>

        {/* Screen light reflected on face */}
        <ellipse cx="180" cy="168" rx="40" ry="24" fill="#38bdf8" opacity="0.045"/>
      </svg>

      {/* Orbital floating particles */}
      <div className="c-particles">
        <span className="c-p c-p1">⚡</span>
        <span className="c-p c-p2">✦</span>
        <span className="c-p c-p3">◆</span>
        <span className="c-p c-p4">★</span>
        <span className="c-p c-p5">✦</span>
        <span className="c-p c-p6">⚡</span>
        <span className="c-p c-p7">◇</span>
      </div>
    </div>
  );
}

Object.assign(window, { CartoonCharacter });
