/**
 * 傳統風花札 — 10月「紅葉」
 * [0] タネ「紅葉に鹿」 [1] 青短 [2] カス [3] カス
 * Inner SVG markup for <symbol viewBox="0 0 200 320">.
 */

/** Seven-lobed maple leaf as a bold star-emblem centred at origin (radius ~15). */
const leaf = (x: number, y: number, s: number, r: number, fill: string): string =>
  `<g transform="translate(${x},${y}) rotate(${r}) scale(${s})">` +
  `<polygon points="0,-15 2.8,-5.9 11.7,-9.4 6.3,-1.4 14.6,3.3 5.1,4.1 6.5,13.5 0,6.5 -6.5,13.5 -5.1,4.1 -14.6,3.3 -6.3,-1.4 -11.7,-9.4 -2.8,-5.9" fill="${fill}" stroke="#1b1b1b" stroke-width="2.4"/>` +
  `<line x1="0" y1="6.5" x2="0" y2="14.5" stroke="#1b1b1b" stroke-width="2.4"/>` +
  `</g>`;

const frame = `<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/><rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>`;

/** タネ「紅葉に鹿」 — stag with head turned back, maples above, gold mist ground */
const shika = `
${frame}
<path d="M10,254 C40,244 74,260 108,252 C142,244 166,256 190,250 L190,296 C160,304 122,292 86,300 C54,306 30,296 10,300 Z" fill="#ecd9a0"/>
<path d="M10,254 C40,244 74,260 108,252 C142,244 166,256 190,250" fill="none" stroke="#e0b32e" stroke-width="3.5"/>
<path d="M10,300 C30,296 54,306 86,300 C122,292 160,304 190,296" fill="none" stroke="#e0b32e" stroke-width="3.5"/>
<path d="M188,30 C154,42 118,34 84,50 C60,60 38,58 12,50" fill="none" stroke="#1b1b1b" stroke-width="5"/>
<path d="M120,38 C112,50 100,56 88,58" fill="none" stroke="#1b1b1b" stroke-width="3.5"/>
<path d="M60,54 C58,66 50,74 40,78" fill="none" stroke="#1b1b1b" stroke-width="3.5"/>
${leaf(30, 42, 1, -15, "#e0b32e")}
${leaf(58, 60, 1.05, 20, "#bf2a20")}
${leaf(88, 50, 0.95, 40, "#9e2a20")}
${leaf(122, 32, 1, -30, "#bf2a20")}
${leaf(152, 40, 1.1, 10, "#e0b32e")}
${leaf(176, 58, 0.9, 55, "#bf2a20")}
${leaf(40, 88, 0.85, 70, "#9e2a20")}
${leaf(78, 84, 0.8, 100, "#bf2a20")}
${leaf(160, 96, 0.75, 130, "#e0b32e")}
${leaf(26, 140, 0.7, 160, "#bf2a20")}
${leaf(172, 150, 0.65, 200, "#9e2a20")}
<path d="M78,214 L74,264 L83,264 L88,216 Z" fill="#c99b5f" stroke="#1b1b1b" stroke-width="3"/>
<path d="M136,214 L142,264 L151,264 L150,210 Z" fill="#c99b5f" stroke="#1b1b1b" stroke-width="3"/>
<path d="M154,182 C162,178 168,184 162,192 C158,196 152,190 154,182 Z" fill="#c99b5f" stroke="#1b1b1b" stroke-width="3"/>
<path d="M62,206 C56,182 66,166 94,161 C124,156 150,164 156,186 C160,205 150,216 132,219 L88,219 C72,218 66,214 62,206 Z" fill="#c99b5f" stroke="#1b1b1b" stroke-width="4"/>
<path d="M64,210 L58,264 L68,264 L75,213 Z" fill="#c99b5f" stroke="#1b1b1b" stroke-width="3"/>
<path d="M122,216 L118,264 L128,264 L136,214 Z" fill="#c99b5f" stroke="#1b1b1b" stroke-width="3"/>
<rect x="57" y="264" width="12" height="8" fill="#1b1b1b"/>
<rect x="73" y="264" width="11" height="8" fill="#1b1b1b"/>
<rect x="117" y="264" width="12" height="8" fill="#1b1b1b"/>
<rect x="141" y="264" width="11" height="8" fill="#1b1b1b"/>
<path d="M86,219 C102,211 122,211 134,218 C120,224 98,224 86,219 Z" fill="#faf4e6"/>
<circle cx="146" cy="196" r="9" fill="#faf4e6"/>
<path d="M64,196 C60,186 62,176 68,170 C72,180 72,192 70,200 Z" fill="#faf4e6"/>
<path d="M108,92 C104,76 108,60 120,50 M112,72 C118,68 124,62 126,52 M106,80 C100,74 96,66 97,56" fill="none" stroke="#1b1b1b" stroke-width="4" stroke-linecap="round"/>
<path d="M80,172 C78,150 86,128 100,114 L120,124 C110,140 102,154 100,172 Z" fill="#c99b5f" stroke="#1b1b1b" stroke-width="4"/>
<path d="M98,100 C90,92 86,84 90,76 C98,80 104,88 106,96 Z" fill="#1b1b1b" stroke="#1b1b1b" stroke-width="2.5"/>
<path d="M98,118 C94,106 100,94 114,92 C126,90 138,98 142,108 C134,114 126,116 118,120 C110,124 102,124 98,118 Z" fill="#c99b5f" stroke="#1b1b1b" stroke-width="4"/>
<path d="M116,116 C122,112 130,110 138,110" fill="none" stroke="#faf4e6" stroke-width="2.5"/>
<circle cx="139" cy="106" r="3" fill="#1b1b1b"/>
<circle cx="116" cy="104" r="3.5" fill="#1b1b1b"/>
`;

/** 青短 — plain blue ribbon with a maple branch (no text) */
const aotan = `
${frame}
<path d="M14,12 C30,48 22,92 38,132 C46,154 44,180 56,204" fill="none" stroke="#1b1b1b" stroke-width="5"/>
<path d="M30,80 C40,86 46,96 48,106" fill="none" stroke="#1b1b1b" stroke-width="3"/>
${leaf(28, 38, 1, 10, "#bf2a20")}
${leaf(38, 66, 0.95, -20, "#e0b32e")}
${leaf(30, 104, 0.9, 35, "#9e2a20")}
${leaf(48, 136, 1, -10, "#bf2a20")}
${leaf(54, 170, 0.85, 25, "#e0b32e")}
${leaf(62, 200, 0.8, 60, "#bf2a20")}
<path d="M10,282 C44,274 84,290 124,282 C154,276 172,286 190,280 L190,304 A6,6 0 0 1 184,310 L16,310 A6,6 0 0 1 10,304 Z" fill="#ecd9a0"/>
<path d="M10,282 C44,274 84,290 124,282 C154,276 172,286 190,280" fill="none" stroke="#e0b32e" stroke-width="3.5"/>
<path d="M118,34 C112,26 116,18 126,16 C122,22 122,28 124,34 Z" fill="#3f6bb5" stroke="#1b1b1b" stroke-width="3"/>
<path d="M118,34 L158,40 L142,262 L102,256 Z" fill="#3f6bb5" stroke="#1b1b1b" stroke-width="3.5"/>
<path d="M126,44 L150,48 L136,250 L112,246 Z" fill="none" stroke="#faf4e6" stroke-width="2.5"/>
${leaf(174, 84, 0.75, 80, "#bf2a20")}
${leaf(172, 130, 0.7, 140, "#e0b32e")}
${leaf(168, 184, 0.75, 190, "#9e2a20")}
${leaf(176, 236, 0.7, 240, "#bf2a20")}
${leaf(84, 240, 0.9, 15, "#bf2a20")}
${leaf(70, 272, 0.8, -35, "#e0b32e")}
`;

/** カス — branch sweeping from top-left, gold mist band across the middle */
const kasuA = `
${frame}
<path d="M10,160 C40,150 76,166 112,158 C146,150 170,162 190,154 L190,196 C160,204 124,190 88,198 C56,204 32,196 10,200 Z" fill="#ecd9a0"/>
<path d="M10,160 C40,150 76,166 112,158 C146,150 170,162 190,154" fill="none" stroke="#e0b32e" stroke-width="3.5"/>
<path d="M10,200 C32,196 56,204 88,198 C124,190 160,204 190,196" fill="none" stroke="#e0b32e" stroke-width="3.5"/>
<path d="M12,18 C48,30 80,24 112,40 C140,52 162,50 188,60" fill="none" stroke="#1b1b1b" stroke-width="5"/>
<path d="M96,34 C100,48 96,62 88,72" fill="none" stroke="#1b1b1b" stroke-width="3"/>
<path d="M150,52 C158,64 158,78 152,90" fill="none" stroke="#1b1b1b" stroke-width="3"/>
${leaf(34, 38, 1, 15, "#bf2a20")}
${leaf(64, 38, 0.9, -25, "#e0b32e")}
${leaf(92, 54, 1, 40, "#9e2a20")}
${leaf(86, 78, 0.85, 70, "#bf2a20")}
${leaf(122, 46, 1, -10, "#e0b32e")}
${leaf(152, 92, 0.9, 30, "#bf2a20")}
${leaf(172, 66, 0.85, 55, "#9e2a20")}
${leaf(60, 118, 0.8, 110, "#bf2a20")}
${leaf(130, 122, 0.75, 150, "#e0b32e")}
${leaf(96, 140, 0.7, 190, "#9e2a20")}
${leaf(50, 236, 0.9, 20, "#bf2a20")}
${leaf(110, 252, 0.8, -40, "#e0b32e")}
${leaf(160, 232, 0.75, 65, "#bf2a20")}
${leaf(80, 286, 0.7, 130, "#9e2a20")}
`;

/** カス — branch rising from bottom-right, mist band along the top, deep-red leaves */
const kasuB = `
${frame}
<path d="M16,10 L184,10 A6,6 0 0 1 190,16 L190,44 C158,52 122,38 88,46 C56,52 32,42 10,48 L10,16 A6,6 0 0 1 16,10 Z" fill="#ecd9a0"/>
<path d="M10,48 C32,42 56,52 88,46 C122,38 158,52 190,44" fill="none" stroke="#e0b32e" stroke-width="3.5"/>
<path d="M186,306 C170,268 176,228 158,192 C146,166 148,136 132,112" fill="none" stroke="#1b1b1b" stroke-width="5"/>
<path d="M168,220 C158,214 150,204 146,192" fill="none" stroke="#1b1b1b" stroke-width="3"/>
<path d="M150,150 C140,146 132,138 128,128" fill="none" stroke="#1b1b1b" stroke-width="3"/>
${leaf(176, 286, 0.9, 35, "#9e2a20")}
${leaf(170, 246, 1, -15, "#bf2a20")}
${leaf(146, 196, 0.95, 50, "#e0b32e")}
${leaf(156, 160, 0.9, -30, "#bf2a20")}
${leaf(128, 124, 0.9, 20, "#9e2a20")}
${leaf(138, 94, 0.85, -50, "#bf2a20")}
${leaf(54, 110, 0.8, 100, "#e0b32e")}
${leaf(34, 170, 0.75, 145, "#bf2a20")}
${leaf(66, 210, 0.7, 185, "#9e2a20")}
${leaf(44, 262, 0.8, 220, "#bf2a20")}
${leaf(92, 288, 0.7, 260, "#e0b32e")}
`;

export const month10: [string, string, string, string] = [shika, aotan, kasuA, kasuB];
