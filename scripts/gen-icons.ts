/** 產生 PWA icons：npx tsx scripts/gen-icons.ts */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const art = `
<rect x='120' y='72' width='220' height='352' rx='24' fill='#1b1b1b' transform='rotate(-8 230 248)'/>
<rect x='136' y='88' width='188' height='320' rx='14' fill='#f3e6cf' transform='rotate(-8 230 248)'/>
<g transform='rotate(-8 230 248)'>
  <path d='M160 360 Q200 300 180 250 Q230 290 225 372 Z' fill='#1b1b1b'/>
  <g stroke='#2e5d3f' stroke-width='9' stroke-linecap='round'>
    <path d='M210 240 L170 205'/><path d='M210 240 L190 195'/><path d='M210 240 L235 196'/><path d='M210 240 L250 220'/>
  </g>
</g>
<rect x='180' y='96' width='220' height='352' rx='24' fill='#1b1b1b' transform='rotate(7 290 272)'/>
<rect x='196' y='112' width='188' height='320' rx='14' fill='#9e2a20' transform='rotate(7 290 272)'/>
<g transform='rotate(7 290 272)'>
  <circle cx='290' cy='220' r='72' fill='#faf4e6'/>
  <path d='M200 430 L380 430 L380 340 Q290 380 200 355 Z' fill='#1b1b1b'/>
</g>`;

function svg(size: number, scale: number): Buffer {
  const offset = (512 * (1 - scale)) / 2;
  return Buffer.from(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 512 512'>
      <rect width='512' height='512' rx='${scale < 1 ? 0 : 96}' fill='#1d4434'/>
      <g transform='translate(${offset} ${offset}) scale(${scale})'>${art}</g>
    </svg>`,
  );
}

const outDir = join(import.meta.dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

await sharp(svg(192, 1)).png().toFile(join(outDir, 'pwa-192.png'));
await sharp(svg(512, 1)).png().toFile(join(outDir, 'pwa-512.png'));
await sharp(svg(512, 0.72)).png().toFile(join(outDir, 'pwa-maskable-512.png'));
console.log('icons generated in', outDir);
