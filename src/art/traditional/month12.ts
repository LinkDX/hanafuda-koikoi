/**
 * 傳統風花札 — 12月「桐」
 * [0] 光「桐に鳳凰」 [1] カス [2] カス [3] カス（下半分黃色的傳統黃桐）
 * Inner SVG markup for <symbol viewBox="0 0 200 320">.
 */

const frame = `<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/><rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>`;

/** Large tri-lobed paulownia leaf centred at origin (~76 wide), placed via transform. */
const kiriLeaf = (x: number, y: number, s: number, r: number, fill: string, vein: string): string =>
  `<g transform="translate(${x},${y}) rotate(${r}) scale(${s})">` +
  `<path d="M0,34 C-24,31 -36,18 -35,2 L-38,-10 L-26,-8 C-24,-18 -16,-26 -8,-24 L0,-36 L8,-24 C16,-26 24,-18 26,-8 L38,-10 L35,2 C36,18 24,31 0,34 Z" fill="${fill}" stroke="#1b1b1b" stroke-width="2.4"/>` +
  `<path d="M0,29 L0,-28 M-2,4 L-27,-8 M2,4 L27,-8" fill="none" stroke="${vein}" stroke-width="2"/>` +
  `</g>`;

/** Upright paulownia blossom spike: stem, paired purple bells, bud cluster on top. */
const kiriBloom = (x: number, y: number, s: number): string =>
  `<g transform="translate(${x},${y}) scale(${s})">` +
  `<path d="M0,6 C2,-14 -2,-40 0,-60" fill="none" stroke="#2e5d3f" stroke-width="3"/>` +
  `<ellipse cx="-9" cy="-8" rx="5.5" ry="8" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>` +
  `<ellipse cx="9" cy="-13" rx="5.5" ry="8" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>` +
  `<ellipse cx="-10" cy="-26" rx="5.5" ry="8" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>` +
  `<ellipse cx="10" cy="-30" rx="5.5" ry="8" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>` +
  `<ellipse cx="-7" cy="-42" rx="4.5" ry="7" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>` +
  `<ellipse cx="7" cy="-45" rx="4.5" ry="7" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>` +
  `<circle cx="-4" cy="-55" r="3.5" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>` +
  `<circle cx="4" cy="-58" r="3.5" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>` +
  `<circle cx="0" cy="-64" r="3" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>` +
  `</g>`;

/** 光「桐に鳳凰」 — phoenix with layered flowing tail plumes over paulownia */
const hoo = `
${frame}
<path d="M16,10 L184,10 A6,6 0 0 1 190,16 L190,40 C158,48 124,34 92,42 C60,48 34,38 10,44 L10,16 A6,6 0 0 1 16,10 Z" fill="#ecd9a0"/>
<path d="M10,44 C34,38 60,48 92,42 C124,34 158,48 190,40" fill="none" stroke="#d9a441" stroke-width="2.5"/>
<path d="M116,112 C154,96 180,112 184,150 C186,180 176,204 160,216 C172,192 172,160 158,140 C146,124 130,116 114,118 Z" fill="#2e5d3f" stroke="#1b1b1b" stroke-width="2"/>
<path d="M118,120 C156,116 178,140 178,176 C178,208 162,232 142,242 C158,216 160,184 148,162 C138,144 128,132 114,126 Z" fill="#d9a441" stroke="#1b1b1b" stroke-width="2"/>
<path d="M116,128 C150,132 166,158 162,192 C158,222 140,244 118,252 C136,226 140,196 130,174 C122,156 116,144 110,134 Z" fill="#c8362b" stroke="#1b1b1b" stroke-width="2"/>
<path d="M112,134 C140,146 150,174 142,204 C134,232 114,250 92,254 C112,232 120,204 114,182 C108,162 106,148 104,138 Z" fill="#47804f" stroke="#1b1b1b" stroke-width="2"/>
<path d="M106,140 C126,158 130,186 118,212 C106,236 84,250 62,250 C84,232 96,208 94,186 C92,166 96,150 98,142 Z" fill="#9e2a20" stroke="#1b1b1b" stroke-width="2"/>
<path d="M100,142 C112,164 110,192 94,214 C78,234 54,242 36,238 C58,226 72,206 74,186 C76,166 84,150 92,142 Z" fill="#ecd9a0" stroke="#1b1b1b" stroke-width="2"/>
<path d="M120,116 C154,106 174,124 176,152 M118,124 C152,126 168,150 166,182 M114,131 C144,140 156,166 150,196 M108,137 C132,152 140,178 132,206 M102,141 C118,162 120,188 108,212" fill="none" stroke="#1b1b1b" stroke-width="1.2"/>
<path d="M74,120 C80,100 102,90 122,98 C138,106 144,124 136,140 C126,158 100,162 86,150 C77,142 72,132 74,120 Z" fill="#2e5d3f" stroke="#1b1b1b" stroke-width="3"/>
<path d="M92,102 C98,74 122,56 150,52 C140,68 134,84 132,102 C120,94 104,96 92,102 Z" fill="#c8362b" stroke="#1b1b1b" stroke-width="2.5"/>
<path d="M100,100 C106,82 122,68 140,62 C132,76 128,88 126,100 C116,94 108,96 100,100 Z" fill="#d9a441" stroke="#1b1b1b" stroke-width="2"/>
<path d="M112,96 C116,82 124,70 134,62 M104,99 C108,88 114,78 122,70" fill="none" stroke="#1b1b1b" stroke-width="1.5"/>
<path d="M84,124 C90,120 96,120 100,124 M82,134 C88,130 94,130 98,134 M84,144 C90,140 96,140 100,144" fill="none" stroke="#d9a441" stroke-width="2"/>
<path d="M46,88 C52,102 62,112 78,118 L92,102 C78,98 64,92 56,80 Z" fill="#47804f" stroke="#1b1b1b" stroke-width="2.5"/>
<path d="M44,68 C38,56 40,44 50,36 C50,48 54,58 58,64 Z" fill="#c8362b" stroke="#1b1b1b" stroke-width="2"/>
<path d="M54,66 C52,54 58,44 68,40 C64,50 64,60 64,66 Z" fill="#d9a441" stroke="#1b1b1b" stroke-width="2"/>
<circle cx="48" cy="78" r="11" fill="#47804f" stroke="#1b1b1b" stroke-width="2.5"/>
<path d="M38,74 L18,80 L38,84 Z" fill="#d9a441" stroke="#1b1b1b" stroke-width="2"/>
<path d="M40,86 C38,94 42,100 48,102 C46,94 46,90 46,87 Z" fill="#c8362b" stroke="#1b1b1b" stroke-width="1.5"/>
<circle cx="50" cy="76" r="3" fill="#faf4e6" stroke="#1b1b1b" stroke-width="1.5"/>
<circle cx="50" cy="76" r="1.4" fill="#1b1b1b"/>
${kiriLeaf(52, 278, 0.85, 0, "#2e5d3f", "#47804f")}
${kiriLeaf(148, 282, 0.7, -12, "#47804f", "#2e5d3f")}
${kiriBloom(104, 296, 0.75)}
`;

/** カス — two ground leaves, tall blossom spike, gold mist band above */
const kasuA = `
${frame}
<path d="M16,10 L184,10 A6,6 0 0 1 190,16 L190,52 C156,60 120,46 86,54 C56,60 32,50 10,56 L10,16 A6,6 0 0 1 16,10 Z" fill="#ecd9a0"/>
<path d="M10,56 C32,50 56,60 86,54 C120,46 156,60 190,52" fill="none" stroke="#d9a441" stroke-width="3"/>
${kiriLeaf(164, 58, 0.6, 170, "#47804f", "#2e5d3f")}
<ellipse cx="70" cy="140" rx="5" ry="7" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>
<ellipse cx="130" cy="120" rx="5" ry="7" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>
${kiriBloom(36, 252, 0.7)}
${kiriBloom(100, 232, 1)}
${kiriLeaf(58, 262, 1.15, 0, "#2e5d3f", "#47804f")}
${kiriLeaf(146, 274, 0.95, 10, "#47804f", "#2e5d3f")}
`;

/** カス — leaf hanging from above, mist band across the middle, paired spikes below */
const kasuB = `
${frame}
<path d="M10,168 C44,158 82,172 120,164 C152,158 172,168 190,162 L190,206 C156,214 118,200 82,208 C52,214 30,206 10,210 Z" fill="#ecd9a0"/>
<path d="M10,168 C44,158 82,172 120,164 C152,158 172,168 190,162" fill="none" stroke="#d9a441" stroke-width="3"/>
<path d="M10,210 C30,206 52,214 82,208 C118,200 156,214 190,206" fill="none" stroke="#d9a441" stroke-width="3"/>
${kiriLeaf(70, 52, 0.9, 180, "#2e5d3f", "#47804f")}
<ellipse cx="150" cy="70" rx="5" ry="7" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>
<ellipse cx="128" cy="108" rx="4.5" ry="6.5" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>
${kiriBloom(52, 240, 0.8)}
${kiriBloom(160, 300, 0.95)}
${kiriLeaf(100, 272, 1.05, 0, "#2e5d3f", "#47804f")}
${kiriLeaf(38, 284, 0.65, -15, "#47804f", "#2e5d3f")}
`;

/** カス（黃桐）— traditional variant: bottom 40% of the paper is a solid gold band */
const kasuC = `
${frame}
<path d="M10,190 L190,190 L190,304 A6,6 0 0 1 184,310 L16,310 A6,6 0 0 1 10,304 Z" fill="#d9a441"/>
<path d="M10,190 L190,190" fill="none" stroke="#1b1b1b" stroke-width="2"/>
<path d="M10,52 C36,44 64,56 94,50 C120,44 142,52 162,48 L162,72 C138,78 112,66 86,74 C58,80 32,72 10,76 Z" fill="#ecd9a0"/>
<ellipse cx="110" cy="120" rx="5" ry="7" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>
<ellipse cx="78" cy="92" rx="4.5" ry="6.5" fill="#6f5aa8" stroke="#1b1b1b" stroke-width="1.5"/>
${kiriBloom(60, 196, 0.9)}
${kiriBloom(140, 180, 0.75)}
${kiriLeaf(96, 240, 1.1, 0, "#2e5d3f", "#47804f")}
${kiriLeaf(160, 282, 0.7, 15, "#47804f", "#2e5d3f")}
${kiriLeaf(38, 278, 0.6, -18, "#47804f", "#2e5d3f")}
`;

export const month12: [string, string, string, string] = [hoo, kasuA, kasuB, kasuC];
