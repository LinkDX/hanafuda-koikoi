/**
 * 傳統風花札 — 3月「桜」
 * [0] 光「桜に幕」 [1] 赤短 [2] カス [3] カス
 * Inner SVG markup for <symbol viewBox="0 0 200 320">.
 */

/** Five notched-petal cherry blossom with a pale heart. */
const sakura = (cx: number, cy: number, r: number, fill: string): string => {
  const d =
    `M${cx} ${cy} ` +
    `C${(cx - r * 0.5).toFixed(1)} ${(cy - r * 0.28).toFixed(1)} ${(cx - r * 0.58).toFixed(1)} ${(cy - r * 0.9).toFixed(1)} ${(cx - r * 0.2).toFixed(1)} ${(cy - r).toFixed(1)} ` +
    `L${cx} ${(cy - r * 0.76).toFixed(1)} ` +
    `L${(cx + r * 0.2).toFixed(1)} ${(cy - r).toFixed(1)} ` +
    `C${(cx + r * 0.58).toFixed(1)} ${(cy - r * 0.9).toFixed(1)} ${(cx + r * 0.5).toFixed(1)} ${(cy - r * 0.28).toFixed(1)} ${cx} ${cy} Z`;
  let s = "";
  for (let i = 0; i < 5; i++) {
    s += `<path d="${d}" fill="${fill}" transform="rotate(${i * 72} ${cx} ${cy})"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${(r * 0.18).toFixed(1)}" fill="#faf4e6"/>`;
  return s;
};

/** Single falling cherry petal. */
const petal = (cx: number, cy: number, rot: number): string =>
  `<path d="M${cx} ${cy} Q${cx - 4} ${cy - 8} ${cx} ${cy - 13} Q${cx + 4} ${cy - 8} ${cx} ${cy} Z" fill="#c2536b" transform="rotate(${rot} ${cx} ${cy})"/>`;

/** 光「桜に幕」 — cherry canopy over a striped festival curtain */
const hikari = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M18 40 Q50 30 84 36 Q116 28 150 36 Q178 32 186 44 Q168 54 138 50 Q104 58 70 50 Q38 56 18 48 Z" fill="#ecd9a0"/>
<path d="M14 100 Q28 58 72 52 Q96 28 130 38 Q168 32 182 66 Q192 92 176 112 Q140 132 96 126 Q42 130 14 100 Z" fill="#c2536b"/>
${sakura(48, 78, 21, "#e0899d")}
${sakura(96, 58, 23, "#e0899d")}
${sakura(146, 74, 20, "#e0899d")}
${sakura(70, 112, 17, "#e0899d")}
${sakura(120, 104, 18, "#e0899d")}
${sakura(166, 108, 14, "#e0899d")}
${sakura(28, 112, 13, "#e0899d")}
<circle cx="86" cy="84" r="3" fill="#faf4e6"/>
<circle cx="132" cy="82" r="3" fill="#faf4e6"/>
<circle cx="58" cy="56" r="2.5" fill="#faf4e6"/>
${petal(40, 152, 20)}
${petal(150, 148, -30)}
${petal(100, 160, 45)}
<rect x="14" y="176" width="172" height="130" fill="#c8362b"/>
<rect x="14" y="176" width="172" height="9" fill="#9e2a20"/>
<rect x="30" y="185" width="16" height="121" fill="#9e2a20"/>
<rect x="64" y="185" width="16" height="121" fill="#9e2a20"/>
<rect x="98" y="185" width="16" height="121" fill="#9e2a20"/>
<rect x="132" y="185" width="16" height="121" fill="#9e2a20"/>
<rect x="166" y="185" width="16" height="121" fill="#9e2a20"/>
<path d="M12 176 Q32 162 52 173 Q72 184 92 173 Q112 162 132 173 Q152 184 172 173 Q181 168 188 174" stroke="#1b1b1b" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M55 178 Q50 202 57 226" stroke="#6f5aa8" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M57 226 L50 250 L64 250 Z" fill="#6f5aa8"/>
<circle cx="57" cy="227" r="3" fill="#d9a441"/>
<path d="M145 178 Q150 202 143 226" stroke="#6f5aa8" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M143 226 L136 250 L150 250 Z" fill="#6f5aa8"/>
<circle cx="143" cy="227" r="3" fill="#d9a441"/>
`;

/** 赤短「桜に赤短」 — poem ribbon あかよろし with cherry sprig */
const tanzaku = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M190 200 Q160 194 138 172 Q118 152 116 118 L126 116 Q130 146 148 164 Q166 182 190 188 Z" fill="#1b1b1b"/>
<path d="M136 168 Q120 186 116 210 L126 212 Q130 190 144 176 Z" fill="#1b1b1b"/>
${sakura(120, 106, 18, "#e0899d")}
${sakura(160, 148, 15, "#c2536b")}
${sakura(126, 226, 17, "#e0899d")}
${sakura(174, 96, 13, "#e0899d")}
${petal(150, 258, 25)}
${petal(112, 60, -20)}
<path d="M116 286 Q146 278 176 284 Q158 296 128 294 Z" fill="#ecd9a0"/>
<g transform="rotate(-5 79 160)">
  <path d="M60 68 Q50 58 60 51 Q78 44 98 52 L98 70 Z" fill="#9e2a20"/>
  <rect x="60" y="66" width="38" height="190" fill="#c8362b"/>
  <rect x="60" y="66" width="6" height="190" fill="#9e2a20"/>
  <rect x="60" y="250" width="38" height="6" fill="#9e2a20"/>
  <text x="81" y="86" font-family="serif" font-size="18" fill="#faf4e6" writing-mode="tb" letter-spacing="3">あかよろし</text>
</g>
<path d="M24 46 Q46 38 66 44 Q50 54 28 52 Z" fill="#ecd9a0"/>
`;

/** カスA — 桜（左上に花のかたまり、右下に金雲） */
const kasuA = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M10 118 Q44 116 70 134 Q94 152 100 186 L90 190 Q84 158 62 142 Q40 126 10 128 Z" fill="#1b1b1b"/>
<path d="M74 138 Q92 122 100 98 L90 94 Q84 116 66 130 Z" fill="#1b1b1b"/>
${sakura(46, 76, 22, "#e0899d")}
${sakura(96, 60, 18, "#c2536b")}
${sakura(102, 118, 19, "#e0899d")}
${sakura(30, 140, 16, "#e0899d")}
${sakura(66, 168, 14, "#c2536b")}
${sakura(112, 200, 16, "#e0899d")}
<circle cx="72" cy="98" r="3" fill="#faf4e6"/>
<circle cx="106" cy="88" r="2.5" fill="#faf4e6"/>
${petal(140, 96, 30)}
${petal(60, 232, -25)}
${petal(150, 176, 50)}
<path d="M104 262 Q136 252 168 260 Q184 266 168 274 Q136 280 110 272 Q92 268 104 262 Z" fill="#ecd9a0"/>
<path d="M124 284 Q152 280 172 286 Q152 294 130 292 Z" fill="#d9a441"/>
`;

/** カスB — 桜（右下に花のかたまり、左上に金雲、鏡映し構図） */
const kasuB = `
<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/>
<rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>
<path d="M190 200 Q156 200 130 220 Q106 238 100 272 L110 276 Q116 244 138 228 Q160 212 190 212 Z" fill="#1b1b1b"/>
<path d="M126 224 Q110 208 102 184 L112 180 Q118 202 136 216 Z" fill="#1b1b1b"/>
${sakura(154, 244, 22, "#e0899d")}
${sakura(104, 260, 18, "#c2536b")}
${sakura(98, 200, 19, "#e0899d")}
${sakura(170, 180, 16, "#e0899d")}
${sakura(134, 152, 14, "#c2536b")}
${sakura(88, 120, 16, "#e0899d")}
<circle cx="128" cy="222" r="3" fill="#faf4e6"/>
<circle cx="94" cy="232" r="2.5" fill="#faf4e6"/>
${petal(60, 224, -30)}
${petal(140, 88, 25)}
${petal(50, 144, -50)}
<path d="M96 58 Q64 48 32 56 Q16 62 32 70 Q64 76 90 68 Q108 64 96 58 Z" fill="#ecd9a0"/>
<path d="M76 80 Q48 76 28 82 Q48 90 70 88 Z" fill="#d9a441"/>
`;

export const month03: [string, string, string, string] = [hikari, tanzaku, kasuA, kasuB];
