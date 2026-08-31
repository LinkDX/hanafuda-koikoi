/**
 * 傳統風花札 — 1月「松」
 * [0] 光「松に鶴」 [1] 赤短「松に赤短」 [2] カス [3] カス
 * Inner SVG markup for <symbol viewBox="0 0 200 320">.
 */

/** Fan of short needle strokes radiating from (cx, cy) between radii r0..r1 over a0..a1 degrees. */
const fan = (
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  a0: number,
  a1: number,
  n: number,
  color: string,
  w: number,
): string => {
  let s = `<g stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none">`;
  for (let i = 0; i < n; i++) {
    const a = ((a0 + ((a1 - a0) * i) / (n - 1)) * Math.PI) / 180;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    s += `<path d="M${(cx + r0 * dx).toFixed(1)} ${(cy + r0 * dy).toFixed(1)} L${(cx + r1 * dx).toFixed(1)} ${(cy + r1 * dy).toFixed(1)}"/>`;
  }
  return s + "</g>";
};

/** Jagged black needle-mass silhouette (spiky ink blob, authentic pine style). */
const mass = (cx: number, cy: number, r: number): string => {
  let d = "";
  const n = 16;
  for (let i = 0; i < n; i++) {
    const a = (((i * 360) / n - 90) * Math.PI) / 180;
    const rr = i % 2 === 0 ? r : r * 0.62;
    d += `${i === 0 ? "M" : "L"}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="#1b1b1b"/>`;
};

/** Pine cluster: black jagged mass with green/white radiating needle strokes on top. */
const pine = (cx: number, cy: number, r: number): string =>
  mass(cx, cy, r * 1.06) +
  fan(cx, cy, r * 0.3, r * 0.96, -90, 247.5, 16, "#2f7a4b", 2.6) +
  fan(cx, cy, r * 0.24, r * 0.6, -79, 236, 10, "#faf4e6", 2) +
  `<circle cx="${cx}" cy="${cy}" r="3.2" fill="#1b1b1b"/>`;

/** 光「松に鶴」 — big vermillion sun, bold white crane, ink pine, gold ground */
const hikari = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<circle cx="100" cy="88" r="60" fill="#bf2a20"/>
<path d="M112 26 Q148 18 178 28 Q190 36 178 44 Q146 52 116 44 Q102 36 112 26 Z" fill="#ecd9a0"/>
<path d="M122 48 Q152 44 174 52 Q152 62 128 58 Z" fill="#e0b32e"/>
<path d="M10 258 Q58 246 100 254 Q150 262 190 250 L190 306 Q100 312 10 306 Z" fill="#e0b32e"/>
<path d="M10 286 Q70 276 130 284 Q164 288 190 282 L190 306 Q100 312 10 306 Z" fill="#ecd9a0"/>
<path d="M12 306 Q30 270 20 242 Q54 260 62 306 Z" fill="#1b1b1b"/>
<path d="M188 306 Q176 272 184 248 Q156 264 148 306 Z" fill="#1b1b1b"/>
${pine(36, 242, 23)}
${pine(62, 262, 19)}
${pine(163, 246, 23)}
${pine(138, 268, 17)}
<path d="M120 168 Q162 136 180 146 Q164 168 140 180 Z" fill="#1b1b1b"/>
<path d="M124 182 Q166 164 182 174 Q160 194 136 196 Z" fill="#1b1b1b"/>
<path d="M62 196 Q64 160 104 154 Q148 150 154 186 Q158 218 118 228 Q76 236 62 196 Z" fill="#faf4e6" stroke="#1b1b1b" stroke-width="4"/>
<path d="M112 160 Q152 146 172 156 Q152 176 124 178 Z" fill="#1b1b1b"/>
<path d="M118 178 Q158 172 174 184 Q152 198 126 194 Z" fill="#1b1b1b"/>
<path d="M120 194 Q156 194 168 206 Q144 218 122 208 Z" fill="#1b1b1b"/>
<path d="M64 200 Q44 164 52 122 Q56 94 74 82 L90 94 Q70 108 68 140 Q66 172 84 196 Z" fill="#faf4e6" stroke="#1b1b1b" stroke-width="3.5"/>
<circle cx="78" cy="86" r="11" fill="#faf4e6" stroke="#1b1b1b" stroke-width="3.5"/>
<path d="M69 78 Q78 70 88 77 Q84 84 72 84 Z" fill="#bf2a20"/>
<path d="M68 84 L42 90 L68 95 Z" fill="#e0b32e" stroke="#1b1b1b" stroke-width="2"/>
<circle cx="81" cy="86" r="2.2" fill="#1b1b1b"/>
<g stroke="#1b1b1b" stroke-width="4" stroke-linecap="round" fill="none">
  <path d="M100 226 L98 258 L94 288"/>
  <path d="M120 224 L124 256 L122 288"/>
  <path d="M94 288 L84 293"/><path d="M94 288 L102 294"/>
  <path d="M122 288 L112 293"/><path d="M122 288 L130 294"/>
</g>
<path d="M18 118 Q42 110 62 116 Q46 126 26 124 Z" fill="#ecd9a0"/>
`;

/** 赤短「松に赤短」 — poem ribbon あかよろし with ink pine */
const tanzaku = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M160 306 Q148 240 166 190 Q174 158 160 126 Q182 140 184 190 Q172 242 186 306 Z" fill="#1b1b1b"/>
<path d="M150 250 L126 262 L132 246 L150 240 Z" fill="#1b1b1b"/>
${pine(150, 106, 25)}
${pine(172, 172, 16)}
${pine(126, 252, 21)}
${pine(168, 234, 14)}
<path d="M14 262 Q40 250 70 256 Q96 250 112 260 Q92 274 60 270 Q32 276 14 268 Z" fill="#ecd9a0"/>
<path d="M20 274 Q52 268 84 272 Q66 282 36 280 Z" fill="#e0b32e"/>
<g transform="rotate(-5 79 160)">
  <path d="M60 68 Q50 58 60 51 Q78 44 98 52 L98 70 Z" fill="#9e2a20"/>
  <rect x="60" y="66" width="38" height="190" fill="#bf2a20"/>
  <rect x="60" y="66" width="6" height="190" fill="#9e2a20"/>
  <rect x="60" y="250" width="38" height="6" fill="#9e2a20"/>
  <text x="81" y="86" font-family="serif" font-size="18" fill="#faf4e6" writing-mode="tb" letter-spacing="3">あかよろし</text>
</g>
<path d="M20 44 Q40 36 58 42 Q44 52 24 50 Z" fill="#ecd9a0"/>
`;

/** カスA — 松（左下の幹と針葉、右上に金雲） */
const kasuA = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M20 306 Q60 262 40 202 Q90 242 80 306 Z" fill="#1b1b1b"/>
<path d="M44 216 L70 196 L64 214 L48 226 Z" fill="#1b1b1b"/>
<path d="M36 250 L14 240 L18 256 L34 262 Z" fill="#1b1b1b"/>
${pine(52, 176, 26)}
${pine(96, 226, 22)}
${pine(30, 254, 18)}
${pine(112, 280, 15)}
<path d="M108 60 Q146 50 176 66 Q158 82 122 78 Q100 72 108 60 Z" fill="#ecd9a0"/>
<path d="M126 84 Q156 80 174 90 Q154 98 132 94 Z" fill="#e0b32e"/>
<g stroke="#1e5c38" stroke-width="2.5" stroke-linecap="round" fill="none">
  <path d="M148 130 L162 118"/><path d="M150 136 L168 132"/><path d="M146 142 L160 152"/>
</g>
<path d="M28 118 Q48 110 66 118 Q50 128 30 126 Z" fill="#ecd9a0"/>
`;

/** カスB — 松（右下の幹、配置を鏡映しに変化） */
const kasuB = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M180 306 Q140 262 160 202 Q110 242 120 306 Z" fill="#1b1b1b"/>
<path d="M156 216 L130 196 L136 214 L152 226 Z" fill="#1b1b1b"/>
<path d="M164 250 L186 240 L182 256 L166 262 Z" fill="#1b1b1b"/>
${pine(148, 176, 26)}
${pine(104, 226, 22)}
${pine(170, 254, 18)}
${pine(88, 280, 15)}
${pine(48, 84, 20)}
<path d="M24 50 Q60 40 92 54 Q72 70 38 66 Q16 62 24 50 Z" fill="#ecd9a0"/>
<path d="M26 138 Q56 132 76 142 Q54 152 30 148 Z" fill="#e0b32e"/>
<g stroke="#1e5c38" stroke-width="2.5" stroke-linecap="round" fill="none">
  <path d="M52 190 L38 178"/><path d="M50 196 L32 192"/><path d="M54 202 L40 212"/>
</g>
<path d="M134 128 Q156 120 174 128 Q158 138 138 136 Z" fill="#ecd9a0"/>
`;

export const month01: [string, string, string, string] = [hikari, tanzaku, kasuA, kasuB];
