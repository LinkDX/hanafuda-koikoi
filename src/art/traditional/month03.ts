/**
 * 傳統風花札 — 3月「桜」
 * [0] 光「桜に幕」 [1] 赤短 [2] カス [3] カス
 * Inner SVG markup for <symbol viewBox="0 0 200 320">.
 */

/** Emblem cherry blossom: five outlined notched petals, white heart, vermillion dot. */
const sakura = (cx: number, cy: number, r: number, fill: string): string => {
  const d =
    `M${cx} ${cy} ` +
    `C${(cx - r * 0.5).toFixed(1)} ${(cy - r * 0.28).toFixed(1)} ${(cx - r * 0.58).toFixed(1)} ${(cy - r * 0.9).toFixed(1)} ${(cx - r * 0.2).toFixed(1)} ${(cy - r).toFixed(1)} ` +
    `L${cx} ${(cy - r * 0.76).toFixed(1)} ` +
    `L${(cx + r * 0.2).toFixed(1)} ${(cy - r).toFixed(1)} ` +
    `C${(cx + r * 0.58).toFixed(1)} ${(cy - r * 0.9).toFixed(1)} ${(cx + r * 0.5).toFixed(1)} ${(cy - r * 0.28).toFixed(1)} ${cx} ${cy} Z`;
  let s = "";
  for (let i = 0; i < 5; i++) {
    s += `<path d="${d}" fill="${fill}" stroke="#1b1b1b" stroke-width="1.8" stroke-linejoin="round" transform="rotate(${i * 72} ${cx} ${cy})"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${(r * 0.3).toFixed(1)}" fill="#faf4e6"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${(r * 0.14).toFixed(1)}" fill="#bf2a20"/>`;
  return s;
};

/** Single falling cherry petal. */
const petal = (cx: number, cy: number, rot: number): string =>
  `<path d="M${cx} ${cy} Q${cx - 4} ${cy - 8} ${cx} ${cy - 13} Q${cx + 4} ${cy - 8} ${cx} ${cy} Z" fill="#d15a78" transform="rotate(${rot} ${cx} ${cy})"/>`;

/** 光「桜に幕」 — scalloped pink canopy over a bold striped festival curtain */
const hikari = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M18 40 Q50 30 84 36 Q116 28 150 36 Q178 32 186 44 Q168 54 138 50 Q104 58 70 50 Q38 56 18 48 Z" fill="#ecd9a0"/>
<path d="M14 96 Q12 70 36 64 Q38 42 64 42 Q74 26 98 32 Q118 20 138 34 Q166 30 170 54 Q188 60 182 84 Q190 102 168 110 Q158 124 132 118 Q114 130 94 122 Q66 130 52 114 Q24 116 14 96 Z" fill="#d15a78" stroke="#1b1b1b" stroke-width="3"/>
${sakura(48, 78, 21, "#faf4e6")}
${sakura(96, 58, 23, "#faf4e6")}
${sakura(146, 74, 20, "#faf4e6")}
${sakura(70, 112, 17, "#faf4e6")}
${sakura(120, 104, 18, "#faf4e6")}
${sakura(160, 100, 14, "#faf4e6")}
<circle cx="86" cy="84" r="3" fill="#faf4e6"/>
<circle cx="132" cy="82" r="3" fill="#faf4e6"/>
<circle cx="58" cy="52" r="2.5" fill="#faf4e6"/>
${petal(40, 152, 20)}
${petal(150, 148, -30)}
${petal(100, 160, 45)}
<rect x="14" y="176" width="172" height="130" fill="#bf2a20"/>
<rect x="34" y="188" width="18" height="118" fill="#faf4e6"/>
<rect x="74" y="188" width="18" height="118" fill="#faf4e6"/>
<rect x="114" y="188" width="18" height="118" fill="#faf4e6"/>
<rect x="154" y="188" width="18" height="118" fill="#faf4e6"/>
<rect x="14" y="176" width="172" height="12" fill="#9e2a20"/>
<path d="M12 178 Q32 164 52 175 Q72 186 92 175 Q112 164 132 175 Q152 186 172 175 Q181 170 188 176" stroke="#1b1b1b" stroke-width="8" fill="none" stroke-linecap="round"/>
<path d="M55 180 Q50 204 57 228" stroke="#4c3577" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M57 228 L50 252 L64 252 Z" fill="#4c3577"/>
<circle cx="57" cy="229" r="3.2" fill="#e0b32e"/>
<path d="M145 180 Q150 204 143 228" stroke="#4c3577" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<path d="M143 228 L136 252 L150 252 Z" fill="#4c3577"/>
<circle cx="143" cy="229" r="3.2" fill="#e0b32e"/>
`;

/** 赤短「桜に赤短」 — poem ribbon あかよろし with cherry sprig */
const tanzaku = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M190 200 Q160 194 138 172 Q118 152 116 118 L126 116 Q130 146 148 164 Q166 182 190 188 Z" fill="#1b1b1b"/>
<path d="M136 168 Q120 186 116 210 L126 212 Q130 190 144 176 Z" fill="#1b1b1b"/>
<path d="M132 128 Q120 104 130 82 Q148 74 168 84 Q186 100 180 126 Q188 148 172 162 Q150 170 136 156 Q126 144 132 128 Z" fill="#d15a78" stroke="#1b1b1b" stroke-width="2.5"/>
${sakura(150, 118, 19, "#faf4e6")}
${sakura(160, 148, 14, "#faf4e6")}
${sakura(126, 226, 17, "#d15a78")}
${petal(150, 258, 25)}
${petal(112, 60, -20)}
<path d="M116 286 Q146 278 176 284 Q158 296 128 294 Z" fill="#ecd9a0"/>
<g transform="rotate(-5 79 160)">
  <path d="M60 68 Q50 58 60 51 Q78 44 98 52 L98 70 Z" fill="#9e2a20"/>
  <rect x="60" y="66" width="38" height="190" fill="#bf2a20"/>
  <rect x="60" y="66" width="6" height="190" fill="#9e2a20"/>
  <rect x="60" y="250" width="38" height="6" fill="#9e2a20"/>
  <text x="81" y="86" font-family="serif" font-size="18" fill="#faf4e6" writing-mode="tb" letter-spacing="3">あかよろし</text>
</g>
<path d="M24 46 Q46 38 66 44 Q50 54 28 52 Z" fill="#ecd9a0"/>
`;

/** カスA — 桜（左上に花霞のかたまり、右下に金雲） */
const kasuA = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M10 118 Q44 116 70 134 Q94 152 100 186 L90 190 Q84 158 62 142 Q40 126 10 128 Z" fill="#1b1b1b"/>
<path d="M74 138 Q92 122 100 98 L90 94 Q84 116 66 130 Z" fill="#1b1b1b"/>
<path d="M22 66 Q20 44 46 42 Q56 26 82 34 Q106 24 116 46 Q134 52 128 76 Q140 96 122 110 Q124 132 100 132 Q88 148 66 140 Q44 150 34 130 Q14 126 18 102 Q12 84 22 66 Z" fill="#d15a78" stroke="#1b1b1b" stroke-width="2.5"/>
${sakura(46, 76, 22, "#faf4e6")}
${sakura(96, 60, 18, "#faf4e6")}
${sakura(102, 118, 19, "#faf4e6")}
${sakura(38, 128, 15, "#faf4e6")}
${sakura(66, 172, 14, "#d15a78")}
${sakura(112, 200, 16, "#d15a78")}
<circle cx="72" cy="98" r="3" fill="#faf4e6"/>
<circle cx="106" cy="88" r="2.5" fill="#faf4e6"/>
${petal(140, 96, 30)}
${petal(60, 232, -25)}
${petal(150, 176, 50)}
<path d="M104 262 Q136 252 168 260 Q184 266 168 274 Q136 280 110 272 Q92 268 104 262 Z" fill="#ecd9a0"/>
<path d="M124 284 Q152 280 172 286 Q152 294 130 292 Z" fill="#e0b32e"/>
`;

/** カスB — 桜（右下に花霞のかたまり、左上に金雲、鏡映し構図） */
const kasuB = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M190 200 Q156 200 130 220 Q106 238 100 272 L110 276 Q116 244 138 228 Q160 212 190 212 Z" fill="#1b1b1b"/>
<path d="M126 224 Q110 208 102 184 L112 180 Q118 202 136 216 Z" fill="#1b1b1b"/>
<path d="M178 176 Q188 196 178 212 Q188 232 174 246 Q184 268 160 274 Q152 292 128 284 Q108 296 96 278 Q76 278 78 256 Q64 240 82 226 Q78 204 100 198 Q108 180 132 184 Q156 168 178 176 Z" fill="#d15a78" stroke="#1b1b1b" stroke-width="2.5"/>
${sakura(154, 244, 22, "#faf4e6")}
${sakura(104, 260, 18, "#faf4e6")}
${sakura(102, 204, 19, "#faf4e6")}
${sakura(164, 188, 15, "#faf4e6")}
${sakura(134, 152, 14, "#d15a78")}
${sakura(88, 120, 16, "#d15a78")}
<circle cx="128" cy="222" r="3" fill="#faf4e6"/>
<circle cx="94" cy="232" r="2.5" fill="#faf4e6"/>
${petal(60, 224, -30)}
${petal(140, 88, 25)}
${petal(50, 144, -50)}
<path d="M96 58 Q64 48 32 56 Q16 62 32 70 Q64 76 90 68 Q108 64 96 58 Z" fill="#ecd9a0"/>
<path d="M76 80 Q48 76 28 82 Q48 90 70 88 Z" fill="#e0b32e"/>
`;

export const month03: [string, string, string, string] = [hikari, tanzaku, kasuA, kasuB];
