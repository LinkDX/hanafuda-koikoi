/**
 * 傳統風花札 — 11月「柳」
 * [0] 光「柳に小野道風」 [1] タネ「柳に燕」 [2] 短冊 [3] カス「鬼札」
 * Inner SVG markup for <symbol viewBox="0 0 200 320">.
 */

const frame = `<rect x="2" y="2" width="196" height="316" rx="12" fill="#1b1b1b"/><rect x="10" y="10" width="180" height="300" rx="6" fill="#f3e6cf"/>`;

/** Hanging willow strand: bold black sweep with a bright green core. */
const strand = (x: number, len: number, sway: number): string => {
  const d = `M${x},10 C${x + sway},${10 + len * 0.33} ${x - sway},${10 + len * 0.66} ${x + sway * 0.5},${10 + len}`;
  return `<path d="${d}" fill="none" stroke="#1b1b1b" stroke-width="4.5"/><path d="${d}" fill="none" stroke="#2f7a4b" stroke-width="2"/>`;
};

/** Slender willow leaf. */
const wLeaf = (x: number, y: number, r: number): string =>
  `<path transform="translate(${x},${y}) rotate(${r})" d="M0,0 C6,-6 14,-7 20,-3 C14,3 6,4 0,0 Z" fill="#2f7a4b" stroke="#1b1b1b" stroke-width="1.4"/>`;

/** Diagonal rain: one path of bold black parallel strokes, [x, y, length] each, slope dx = -0.17*dy. */
const rain = (lines: ReadonlyArray<[number, number, number]>): string =>
  `<path d="${lines.map(([x, y, l]) => `M${x},${y} l${(-l * 0.17).toFixed(1)},${l}`).join(" ")}" stroke="#1b1b1b" stroke-width="3" fill="none"/>`;

/** 光「柳に小野道風」 — courtier with gold umbrella watching a leaping frog in the rain */
const michikaze = `
${frame}
<path d="M10,246 C42,238 82,252 122,244 C152,238 172,248 190,242 L190,304 A6,6 0 0 1 184,310 L16,310 A6,6 0 0 1 10,304 Z" fill="#ecd9a0"/>
<path d="M10,246 C42,238 82,252 122,244 C152,238 172,248 190,242" fill="none" stroke="#e0b32e" stroke-width="3.5"/>
${strand(20, 130, 8)}
${wLeaf(18, 52, 20)}${wLeaf(24, 96, -10)}${wLeaf(14, 132, 15)}
${strand(34, 90, 6)}
${wLeaf(36, 70, -25)}
${strand(168, 150, 8)}
${wLeaf(150, 60, 200)}${wLeaf(156, 110, 160)}${wLeaf(150, 152, 190)}
${strand(182, 100, 5)}
${wLeaf(166, 92, 170)}
${rain([[62, 12, 292], [76, 12, 292], [162, 12, 290], [178, 12, 286], [44, 12, 226], [28, 12, 130], [148, 12, 120], [90, 12, 48], [116, 12, 40], [36, 150, 148], [56, 180, 122], [186, 120, 180], [154, 160, 130], [70, 280, 28]])}
<path d="M97,68 L112,150" stroke="#1b1b1b" stroke-width="4.5"/>
<path d="M43,68 A54,54 0 0 1 151,68 Z" fill="#e0b32e" stroke="#1b1b1b" stroke-width="4"/>
<path d="M97,68 L50,41 M97,68 L70,21 M97,68 L97,14 M97,68 L124,21 M97,68 L144,41" fill="none" stroke="#1b1b1b" stroke-width="3"/>
<circle cx="97" cy="14" r="4.5" fill="#1b1b1b"/>
<path d="M98,86 C96,70 102,58 112,56 C118,62 118,74 114,88 Z" fill="#1b1b1b"/>
<circle cx="105" cy="95" r="12" fill="#faf4e6" stroke="#1b1b1b" stroke-width="3"/>
<circle cx="99" cy="93" r="1.8" fill="#1b1b1b"/>
<path d="M96,88 L102,87 M95,97 C97,99 99,99 101,98" fill="none" stroke="#1b1b1b" stroke-width="1.5"/>
<path d="M92,104 C76,116 66,152 62,198 C59,232 66,250 78,254 L138,254 C148,238 150,208 144,178 C140,152 132,122 120,106 C112,112 100,112 92,104 Z" fill="#1e5c38" stroke="#1b1b1b" stroke-width="4"/>
<path d="M92,104 L106,120 L120,106" fill="none" stroke="#1b1b1b" stroke-width="2.5"/>
<path d="M84,150 C80,180 78,214 80,244 M124,140 C130,170 132,210 128,246" fill="none" stroke="#1b1b1b" stroke-width="2.5"/>
<path d="M98,116 C88,124 84,138 90,150 C100,158 114,156 120,146 C118,134 112,122 106,114 Z" fill="#2f7a4b" stroke="#1b1b1b" stroke-width="3"/>
<circle cx="111" cy="149" r="5" fill="#faf4e6" stroke="#1b1b1b" stroke-width="2.5"/>
<path d="M78,254 L138,254 L136,266 L80,266 Z" fill="#faf4e6" stroke="#1b1b1b" stroke-width="2.5"/>
<path d="M84,266 L102,266 L102,274 L84,274 Z" fill="#1b1b1b"/>
<path d="M112,266 L130,266 L130,274 L112,274 Z" fill="#1b1b1b"/>
<path d="M28,274 C20,276 15,281 14,287" fill="none" stroke="#1e5c38" stroke-width="3.5" stroke-linecap="round"/>
<path d="M26,272 C25,262 34,255 45,257 C54,259 58,267 53,273 C44,277 33,277 26,272 Z" fill="#2f7a4b" stroke="#1b1b1b" stroke-width="3"/>
<path d="M50,271 C54,275 58,277 63,277" fill="none" stroke="#1e5c38" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="47" cy="259" r="3.5" fill="#faf4e6" stroke="#1b1b1b" stroke-width="1.5"/>
<circle cx="47" cy="259" r="1.5" fill="#1b1b1b"/>
<path d="M52,265 C55,266 57,265 58,263" fill="none" stroke="#1b1b1b" stroke-width="1.5"/>
`;

/** タネ「柳に燕」 — red-throated swallow swooping among willow strands */
const tsubame = `
${frame}
<path d="M10,252 C44,244 84,258 124,250 C154,244 174,254 190,248 L190,304 A6,6 0 0 1 184,310 L16,310 A6,6 0 0 1 10,304 Z" fill="#ecd9a0"/>
<path d="M10,252 C44,244 84,258 124,250 C154,244 174,254 190,248" fill="none" stroke="#e0b32e" stroke-width="3.5"/>
${strand(24, 160, 8)}
${wLeaf(22, 60, 20)}${wLeaf(28, 110, -15)}${wLeaf(18, 160, 25)}
${strand(40, 100, 6)}
${wLeaf(42, 84, -30)}
${strand(96, 70, 5)}
${wLeaf(94, 66, 10)}
${strand(160, 140, 8)}
${wLeaf(142, 80, 190)}${wLeaf(148, 132, 160)}
${strand(176, 180, 6)}
${wLeaf(160, 120, 175)}${wLeaf(162, 180, 200)}
${rain([[70, 12, 120], [150, 20, 140], [36, 180, 120], [120, 210, 96], [58, 12, 70], [132, 12, 90], [178, 210, 90], [26, 240, 60]])}
<path d="M98,146 C110,122 136,108 162,106 C152,124 136,140 116,150 Z" fill="#1b1b1b" stroke="#1b1b1b" stroke-width="2.5"/>
<path d="M112,142 C124,126 142,116 156,112 M106,146 C118,130 134,120 148,114" fill="none" stroke="#faf4e6" stroke-width="2"/>
<path d="M56,154 C64,142 80,136 96,140 C114,144 128,158 134,172 C120,168 106,168 94,172 C78,178 62,168 56,154 Z" fill="#1b1b1b" stroke="#1b1b1b" stroke-width="2.5"/>
<path d="M56,154 L47,151 L57,159 Z" fill="#1b1b1b"/>
<path d="M57,151 C62,145 70,141 79,140 C75,148 67,153 60,156 Z" fill="#bf2a20" stroke="#1b1b1b" stroke-width="1.5"/>
<path d="M70,168 C82,161 98,159 112,164 C102,172 84,176 73,173 Z" fill="#faf4e6"/>
<path d="M94,172 C104,182 114,196 118,210 C102,202 88,190 82,178 Z" fill="#1b1b1b" stroke="#1b1b1b" stroke-width="2.5"/>
<path d="M92,176 C100,186 108,196 112,204" fill="none" stroke="#faf4e6" stroke-width="2"/>
<path d="M128,164 L174,146 L136,172 Z" fill="#1b1b1b"/>
<path d="M130,174 L170,200 L132,180 Z" fill="#1b1b1b"/>
<circle cx="66" cy="147" r="2" fill="#faf4e6"/>
`;

/** 短冊 — plain red ribbon among willow strands and bold rain (no text) */
const tanzaku = `
${frame}
<path d="M10,286 C46,278 88,292 128,284 C156,278 174,288 190,282 L190,304 A6,6 0 0 1 184,310 L16,310 A6,6 0 0 1 10,304 Z" fill="#ecd9a0"/>
<path d="M10,286 C46,278 88,292 128,284 C156,278 174,288 190,282" fill="none" stroke="#e0b32e" stroke-width="3.5"/>
${strand(20, 180, 8)}
${wLeaf(18, 70, 20)}${wLeaf(24, 130, -15)}${wLeaf(14, 186, 30)}
${strand(36, 120, 6)}
${wLeaf(38, 100, -25)}
${strand(52, 70, 5)}
${wLeaf(50, 62, 15)}
${strand(140, 110, 7)}
${wLeaf(124, 70, 185)}${wLeaf(126, 112, 160)}
${strand(158, 200, 8)}
${wLeaf(142, 150, 195)}${wLeaf(144, 204, 170)}
${strand(178, 140, 6)}
${wLeaf(162, 128, 180)}${wLeaf(166, 74, 200)}
${strand(66, 44, 4)}
${wLeaf(64, 40, 20)}
${rain([[150, 40, 200], [170, 80, 180], [40, 150, 140], [30, 60, 100], [56, 210, 80], [136, 130, 120], [184, 30, 90]])}
<path d="M84,32 C78,24 82,16 92,14 C88,20 88,27 90,32 Z" fill="#bf2a20" stroke="#1b1b1b" stroke-width="3"/>
<path d="M84,32 L124,36 L112,258 L72,254 Z" fill="#bf2a20" stroke="#1b1b1b" stroke-width="3.5"/>
<path d="M92,42 L116,45 L105,246 L82,243 Z" fill="none" stroke="#faf4e6" stroke-width="2.5"/>
`;

/** カス「鬼札」 — abstract lightning card: thunder-drum spiral, bolts and claw arcs on black */
const onifuda = `
${frame}
<rect x="10" y="10" width="180" height="300" rx="6" fill="#1b1b1b"/>
<circle cx="146" cy="64" r="40" fill="#bf2a20"/>
<path d="M116,64 A30,30 0 1 1 176,64 A24,24 0 1 1 128,64 A18,18 0 1 1 164,64 A12,12 0 1 1 140,64 A6,6 0 1 1 152,64" fill="none" stroke="#faf4e6" stroke-width="6.5" stroke-linecap="round"/>
<path d="M105,49 L88,43" stroke="#faf4e6" stroke-width="6" stroke-linecap="round" fill="none"/>
<path d="M124,26 L115,12" stroke="#faf4e6" stroke-width="6" stroke-linecap="round" fill="none"/>
<path d="M146,20 L146,12" stroke="#faf4e6" stroke-width="6" stroke-linecap="round" fill="none"/>
<path d="M105,79 L88,86" stroke="#faf4e6" stroke-width="6" stroke-linecap="round" fill="none"/>
<path d="M118,98 L107,111" stroke="#faf4e6" stroke-width="6" stroke-linecap="round" fill="none"/>
<path d="M112,90 C74,116 56,164 68,224" fill="none" stroke="#bf2a20" stroke-width="13" stroke-linecap="round"/>
<path d="M116,96 C84,120 70,160 78,212" fill="none" stroke="#faf4e6" stroke-width="4.5" stroke-linecap="round"/>
<polygon points="138,106 112,162 128,160 90,234 122,180 106,182 146,112" fill="#faf4e6"/>
<polygon points="44,36 28,98 42,94 22,158 50,102 38,104 60,42" fill="#e0b32e"/>
<polygon points="168,180 150,226 162,224 140,272 166,230 154,232 176,186" fill="#faf4e6"/>
<polygon points="84,244 72,286 82,283 70,308 90,282 80,284 94,248" fill="#e0b32e"/>
<path d="M28,232 C52,208 92,200 124,214 C92,212 60,224 38,250 Z" fill="#bf2a20"/>
<path d="M36,262 C62,244 98,240 126,252 C98,252 70,262 50,282 Z" fill="#bf2a20"/>
<path d="M48,290 C70,276 100,274 122,284 C100,284 76,292 62,304 Z" fill="#bf2a20"/>
<path d="M150,250 C168,236 180,214 182,190 C186,220 174,250 154,266 Z" fill="#faf4e6"/>
<path d="M60,150 A10,10 0 1 1 80,150 A6,6 0 1 1 68,150" fill="none" stroke="#bf2a20" stroke-width="5"/>
<path d="M150,140 A9,9 0 1 1 168,140" fill="none" stroke="#e0b32e" stroke-width="5"/>
<circle cx="86" cy="60" r="4" fill="#e0b32e"/>
<circle cx="70" cy="84" r="3" fill="#e0b32e"/>
<circle cx="160" cy="158" r="4" fill="#ecd9a0"/>
<circle cx="34" cy="180" r="3" fill="#faf4e6"/>
<circle cx="176" cy="120" r="3" fill="#bf2a20"/>
<circle cx="132" cy="290" r="4" fill="#e0b32e"/>
`;

export const month11: [string, string, string, string] = [michikaze, tsubame, tanzaku, onifuda];
