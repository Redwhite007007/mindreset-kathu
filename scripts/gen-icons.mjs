/**
 * Generate placeholder PWA icons (192 and 512) as solid-fill PNGs with
 * a brand-blue background and a soft gradient corner. No dependencies —
 * uses Node's built-in zlib to emit a minimal valid PNG.
 *
 * Replace public/icons/* with proper brand art before launch.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

/** Emit a valid PNG from an RGB buffer. */
function encodePng(width, height, rgb) {
  // Add a filter byte at the start of each row
  const stride = width * 3;
  const filtered = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    filtered[y * (stride + 1)] = 0;
    rgb.copy(filtered, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(filtered);

  const crc32Table = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c >>> 0;
    }
    return t;
  })();
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = crc32Table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crcBuf = Buffer.alloc(4);
    const c = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(c, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** Brand icon: radial gradient from neon (centre) to deep navy (edges) with a brain glyph area. */
function renderIcon(size) {
  const rgb = Buffer.alloc(size * size * 3);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = Math.hypot(cx, cy);
  // colours
  const inner = [0x22, 0xd3, 0xa8]; // neon green
  const mid = [0x3b, 0x82, 0xf6]; // electric blue
  const outer = [0x0b, 0x10, 0x20]; // deep navy
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const r = Math.hypot(x - cx, y - cy) / maxR; // 0..1
      let col;
      if (r < 0.5) {
        const t = r / 0.5;
        col = lerp(inner, mid, t);
      } else {
        const t = (r - 0.5) / 0.5;
        col = lerp(mid, outer, t);
      }
      const i = (y * size + x) * 3;
      rgb[i] = col[0];
      rgb[i + 1] = col[1];
      rgb[i + 2] = col[2];
    }
  }
  return encodePng(size, size, rgb);
}

function lerp(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

for (const size of [192, 512]) {
  const buf = renderIcon(size);
  const p = resolve(outDir, `icon-${size}.png`);
  writeFileSync(p, buf);
  console.log(`✓ ${p} (${buf.length} bytes)`);
}
