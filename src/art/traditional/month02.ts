/**
 * 傳統風花札 — 2月「梅」
 * [0] タネ「梅に鶯」 [1] 赤短 [2] カス [3] カス
 * Inner SVG markup for <symbol viewBox="0 0 200 320">.
 */

/** Emblem-style plum blossom: outlined round petals, white heart, gold centre dot. */
const plum = (cx: number, cy: number, r: number, fill: string): string => {
  let s = "";
  for (let i = 0; i < 5; i++) {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    s += `<circle cx="${(cx + r * Math.cos(a)).toFixed(1)}" cy="${(cy + r * Math.sin(a)).toFixed(1)}" r="${(r * 0.66).toFixed(1)}" fill="${fill}" stroke="#1b1b1b" stroke-width="2"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${(r * 0.46).toFixed(1)}" fill="#faf4e6" stroke="#1b1b1b" stroke-width="1.5"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${(r * 0.18).toFixed(1)}" fill="#e0b32e"/>`;
  for (let i = 0; i < 5; i++) {
    const a = ((-54 + i * 72) * Math.PI) / 180;
    s += `<circle cx="${(cx + r * 0.34 * Math.cos(a)).toFixed(1)}" cy="${(cy + r * 0.34 * Math.sin(a)).toFixed(1)}" r="1.6" fill="#e0b32e"/>`;
  }
  return s;
};

/** Closed plum bud with ink sepal. */
const bud = (cx: number, cy: number, r: number): string =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#bf2a20" stroke="#1b1b1b" stroke-width="2"/>` +
  `<path d="M${cx - r} ${cy + r * 0.4} Q${cx} ${cy + r * 1.6} ${cx + r} ${cy + r * 0.4}" stroke="#1b1b1b" stroke-width="2" fill="none" stroke-linecap="round"/>`;

/** タネ「梅に鶯」 — bush warbler perched on flowering plum branch */
const tane = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M96 32 Q136 22 170 34 Q186 42 170 50 Q136 58 104 48 Q84 40 96 32 Z" fill="#ecd9a0"/>
<path d="M118 58 Q150 54 170 62 Q150 72 126 68 Z" fill="#e0b32e"/>
<path d="M10 160 Q42 150 66 134 Q96 112 138 108 Q166 106 190 94 L190 106 Q162 116 140 118 Q102 122 76 144 Q48 166 10 174 Z" fill="#1b1b1b"/>
<path d="M148 112 Q168 132 174 158 L166 160 Q158 136 142 118 Z" fill="#1b1b1b"/>
<path d="M60 140 Q48 176 56 210 L64 208 Q58 178 68 148 Z" fill="#1b1b1b"/>
${plum(34, 146, 12, "#9e2a20")}
${plum(66, 200, 14, "#bf2a20")}
${plum(150, 60, 12, "#bf2a20")}
${plum(172, 166, 13, "#bf2a20")}
${plum(58, 118, 10, "#9e2a20")}
${bud(84, 132, 5)}
${bud(160, 132, 5)}
${bud(46, 216, 4.5)}
<path d="M84 100 L64 112 L68 98 L86 92 Z" fill="#6f7a24" stroke="#1b1b1b" stroke-width="2"/>
<path d="M84 98 Q88 76 112 74 Q136 72 140 90 Q142 106 118 112 Q94 118 84 98 Z" fill="#9aa832" stroke="#1b1b1b" stroke-width="3"/>
<path d="M90 102 Q106 114 122 108 Q106 118 92 108 Z" fill="#ecd9a0"/>
<path d="M94 88 Q108 80 122 86 Q112 98 96 96 Z" fill="#6f7a24" stroke="#1b1b1b" stroke-width="2"/>
<circle cx="134" cy="80" r="10" fill="#9aa832" stroke="#1b1b1b" stroke-width="3"/>
<path d="M143 77 L157 80 L143 84 Z" fill="#e0b32e" stroke="#1b1b1b" stroke-width="1.5"/>
<circle cx="136" cy="78" r="2" fill="#1b1b1b"/>
<g stroke="#1b1b1b" stroke-width="3" stroke-linecap="round" fill="none">
  <path d="M104 112 L102 122"/><path d="M116 111 L118 121"/>
</g>
<path d="M18 246 Q46 238 74 244 Q56 254 28 252 Z" fill="#ecd9a0"/>
`;

/** 赤短「梅に赤短」 — poem ribbon あかよろし with plum sprig */
const tanzaku = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M14 306 Q30 250 22 200 Q46 236 44 306 Z" fill="#1b1b1b"/>
<path d="M28 218 Q44 190 68 176 L72 184 Q50 198 38 224 Z" fill="#1b1b1b"/>
${plum(74, 172, 13, "#bf2a20")}
${plum(34, 194, 11, "#9e2a20")}
${plum(52, 262, 12, "#bf2a20")}
${bud(56, 200, 5)}
${bud(30, 246, 4.5)}
<path d="M118 278 Q146 270 174 276 Q158 288 130 286 Z" fill="#ecd9a0"/>
<g transform="rotate(5 121 160)">
  <path d="M102 68 Q92 58 102 51 Q120 44 140 52 L140 70 Z" fill="#9e2a20"/>
  <rect x="102" y="66" width="38" height="190" fill="#bf2a20"/>
  <rect x="102" y="66" width="6" height="190" fill="#9e2a20"/>
  <rect x="102" y="250" width="38" height="6" fill="#9e2a20"/>
  <text x="123" y="86" font-family="serif" font-size="18" fill="#faf4e6" writing-mode="tb" letter-spacing="3">あかよろし</text>
</g>
<path d="M26 52 Q48 44 68 50 Q52 60 30 58 Z" fill="#ecd9a0"/>
`;

/** カスA — 梅（左下から立ち上がる枝） */
const kasuA = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M22 306 Q44 250 36 196 Q34 160 58 128 Q78 104 122 96 L126 108 Q88 116 70 138 Q50 164 52 198 Q58 252 46 306 Z" fill="#1b1b1b"/>
<path d="M56 176 Q88 168 112 178 L108 188 Q86 178 60 186 Z" fill="#1b1b1b"/>
<path d="M104 102 Q126 90 148 92 L146 102 Q128 100 110 110 Z" fill="#1b1b1b"/>
${plum(126, 84, 14, "#bf2a20")}
${plum(158, 100, 12, "#9e2a20")}
${plum(120, 186, 14, "#bf2a20")}
${plum(42, 158, 12, "#bf2a20")}
${plum(70, 244, 11, "#9e2a20")}
${bud(94, 170, 5)}
${bud(146, 116, 4.5)}
${bud(56, 130, 4.5)}
<path d="M120 40 Q150 32 178 40 Q162 52 134 50 Q112 48 120 40 Z" fill="#ecd9a0"/>
<path d="M116 262 Q146 256 172 262 Q154 272 128 270 Z" fill="#e0b32e"/>
`;

/** カスB — 梅（右上から垂れ下がる枝、鏡映し構図） */
const kasuB = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M190 44 Q150 52 126 78 Q104 102 106 140 Q108 182 84 214 Q64 240 30 250 L34 262 Q72 250 94 222 Q120 188 118 142 Q118 108 138 88 Q158 66 190 58 Z" fill="#1b1b1b"/>
<path d="M112 122 Q86 114 62 122 L66 132 Q88 124 110 132 Z" fill="#1b1b1b"/>
<path d="M100 196 Q124 202 140 220 L132 226 Q118 210 96 206 Z" fill="#1b1b1b"/>
${plum(54, 126, 14, "#bf2a20")}
${plum(148, 232, 13, "#bf2a20")}
${plum(128, 62, 12, "#9e2a20")}
${plum(84, 158, 11, "#bf2a20")}
${plum(40, 268, 12, "#9e2a20")}
${bud(72, 118, 5)}
${bud(118, 186, 4.5)}
${bud(160, 210, 4.5)}
<path d="M22 62 Q52 54 80 62 Q62 74 36 72 Q14 70 22 62 Z" fill="#ecd9a0"/>
<path d="M120 290 Q150 284 178 290 Q160 300 132 298 Z" fill="#e0b32e"/>
`;

export const month02: [string, string, string, string] = [tane, tanzaku, kasuA, kasuB];
