/**
 * 傳統風花札 — 1月「松」
 * [0] 光「松に鶴」 [1] 赤短「松に赤短」 [2] カス [3] カス
 * Inner SVG markup for <symbol viewBox="0 0 200 320">.
 */

/** Radiating pine-needle strokes around (cx, cy). */
const rays = (cx: number, cy: number, r: number, a0: number, a1: number, n: number): string => {
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = ((a0 + ((a1 - a0) * i) / (n - 1)) * Math.PI) / 180;
    s += `<path d="M${cx} ${cy} L${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}"/>`;
  }
  return s;
};

/** One full pine needle cluster: dark outer fan, lighter inner fan, ink core. */
const burst = (cx: number, cy: number, r: number): string =>
  `<g stroke="#2e5d3f" stroke-width="3" stroke-linecap="round" fill="none">${rays(cx, cy, r, 0, 337.5, 16)}</g>` +
  `<g stroke="#47804f" stroke-width="2" stroke-linecap="round" fill="none">${rays(cx, cy, r * 0.58, 11, 326, 10)}</g>` +
  `<circle cx="${cx}" cy="${cy}" r="3.5" fill="#1b1b1b"/>`;

/** 光「松に鶴」 — red sun, white crane, pine and gold ground */
const hikari = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M118 30 Q150 22 176 32 Q188 40 176 48 Q148 54 122 46 Q108 38 118 30 Z" fill="#ecd9a0"/>
<circle cx="100" cy="86" r="54" fill="#c8362b"/>
<path d="M10 282 Q60 268 100 276 Q150 284 190 272 L190 306 Q100 312 10 306 Z" fill="#d9a441"/>
<path d="M10 294 Q70 284 130 292 Q164 296 190 290 L190 306 Q100 312 10 306 Z" fill="#ecd9a0"/>
<path d="M12 306 Q30 272 22 246 Q52 262 60 306 Z" fill="#1b1b1b"/>
<path d="M188 306 Q178 274 184 252 Q158 266 150 306 Z" fill="#1b1b1b"/>
${burst(32, 242, 24)}
${burst(60, 262, 19)}
${burst(166, 248, 24)}
${burst(140, 268, 17)}
<path d="M120 168 Q160 138 178 146 Q162 168 140 180 Z" fill="#1b1b1b"/>
<path d="M124 182 Q164 164 180 174 Q160 192 136 194 Z" fill="#1b1b1b"/>
<path d="M64 196 Q66 162 104 156 Q146 152 152 186 Q156 216 118 226 Q78 234 64 196 Z" fill="#faf4e6" stroke="#1b1b1b" stroke-width="3"/>
<path d="M112 160 Q150 148 170 158 Q150 176 124 178 Z" fill="#1b1b1b"/>
<path d="M118 178 Q156 172 172 184 Q150 198 126 194 Z" fill="#1b1b1b"/>
<path d="M120 194 Q154 194 166 206 Q144 216 122 208 Z" fill="#1b1b1b"/>
<path d="M64 200 Q46 166 52 124 Q56 96 74 84 L88 94 Q70 108 68 140 Q66 172 82 196 Z" fill="#faf4e6" stroke="#1b1b1b" stroke-width="2.5"/>
<circle cx="78" cy="88" r="10" fill="#faf4e6" stroke="#1b1b1b" stroke-width="2.5"/>
<path d="M70 80 Q78 73 87 79 Q83 85 73 85 Z" fill="#c8362b"/>
<path d="M69 85 L44 91 L69 95 Z" fill="#d9a441" stroke="#1b1b1b" stroke-width="1.5"/>
<circle cx="81" cy="87" r="2" fill="#1b1b1b"/>
<g stroke="#1b1b1b" stroke-width="3.5" stroke-linecap="round" fill="none">
  <path d="M100 226 L98 258 L94 288"/>
  <path d="M120 224 L124 256 L122 288"/>
  <path d="M94 288 L84 293"/><path d="M94 288 L102 294"/>
  <path d="M122 288 L112 293"/><path d="M122 288 L130 294"/>
</g>
<path d="M20 118 Q42 110 62 116 Q46 126 26 124 Z" fill="#ecd9a0"/>
`;

/** 赤短「松に赤短」 — poem ribbon あかよろし with pine */
const tanzaku = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M162 306 Q150 240 168 190 Q176 158 162 126 Q182 140 184 190 Q172 242 186 306 Z" fill="#1b1b1b"/>
<path d="M150 250 L128 262 L134 246 L150 240 Z" fill="#1b1b1b"/>
${burst(152, 108, 26)}
${burst(176, 172, 19)}
${burst(126, 252, 22)}
${burst(170, 236, 15)}
<path d="M14 262 Q40 250 70 256 Q96 250 112 260 Q92 274 60 270 Q32 276 14 268 Z" fill="#ecd9a0"/>
<path d="M20 274 Q52 268 84 272 Q66 282 36 280 Z" fill="#d9a441"/>
<g transform="rotate(-5 79 160)">
  <path d="M60 68 Q50 58 60 51 Q78 44 98 52 L98 70 Z" fill="#9e2a20"/>
  <rect x="60" y="66" width="38" height="190" fill="#c8362b"/>
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
${burst(52, 178, 28)}
${burst(96, 226, 23)}
${burst(30, 254, 19)}
${burst(112, 280, 16)}
<path d="M108 60 Q146 50 176 66 Q158 82 122 78 Q100 72 108 60 Z" fill="#ecd9a0"/>
<path d="M126 84 Q156 80 174 90 Q154 98 132 94 Z" fill="#d9a441"/>
<g stroke="#2e5d3f" stroke-width="2" stroke-linecap="round" fill="none">
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
${burst(148, 178, 28)}
${burst(104, 226, 23)}
${burst(170, 254, 19)}
${burst(88, 280, 16)}
${burst(48, 84, 22)}
<path d="M24 50 Q60 40 92 54 Q72 70 38 66 Q16 62 24 50 Z" fill="#ecd9a0"/>
<path d="M26 138 Q56 132 76 142 Q54 152 30 148 Z" fill="#d9a441"/>
<g stroke="#2e5d3f" stroke-width="2" stroke-linecap="round" fill="none">
  <path d="M52 190 L38 178"/><path d="M50 196 L32 192"/><path d="M54 202 L40 212"/>
</g>
<path d="M134 128 Q156 120 174 128 Q158 138 138 136 Z" fill="#ecd9a0"/>
`;

export const month01: [string, string, string, string] = [hikari, tanzaku, kasuA, kasuB];
