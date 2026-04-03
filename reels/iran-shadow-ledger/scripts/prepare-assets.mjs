import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const CHINA_SOURCE = "C:\\Users\\97152\\Downloads\\China_blank_map.svg";
const IRAN_SOURCE =
  "C:\\Users\\97152\\Downloads\\iran-solid-black-outline-border-map-of-country-area-simple-flat-vector-illustration-2E9BCJD.jpg";
const OUT_DIR = path.resolve("public/maps");

const BRAND = {
  paper: "#f7f6f3",
  mutedFill: "#201d1a",
  mutedStroke: "#6d665d",
  provinceStroke: "#4a433b",
  accent: "#b83025",
};

const ensureDir = async () => {
  await fs.mkdir(OUT_DIR, {recursive: true});
};

const extractSvgElement = (svg, id) => {
  const regex = new RegExp(`<path\\s+id="${id}"[\\s\\S]*?\\/>`, "m");
  const match = svg.match(regex);
  if (!match) {
    throw new Error(`Could not find SVG path: ${id}`);
  }

  return match[0];
};

const buildChinaAssets = async () => {
  let svg = await fs.readFile(CHINA_SOURCE, "utf8");

  svg = svg.replace(
    /<svg([^>]*?)width="1000" height="850">/,
    '<svg$1width="1000" height="850" viewBox="0 0 1000 850">',
  );
  svg = svg.replace(/<g\s+id="layer1"[\s\S]*?<\/g>/, "");
  svg = svg.replace(/<g\s+id="layer5"[\s\S]*?<\/g>/, "");
  svg = svg.replace(/<g\s+id="layer6"[\s\S]*?<\/g>/, "");
  svg = svg.replace(
    /class="other_countries"\s+style="fill:#94ad94;stroke:#1821de;stroke-width:0\.5"/,
    `class="other_countries" style="fill:${BRAND.mutedFill};stroke:${BRAND.mutedStroke};stroke-width:0.8;opacity:0.72"`,
  );
  svg = svg.replace(
    /class="disputed"\s+style="display:inline;fill-opacity:1;fill:#bece97; stroke:#1821de;stroke-width:0\.5"/,
    `class="disputed" style="display:inline;fill-opacity:1;fill:#2b2722;stroke:${BRAND.mutedStroke};stroke-width:0.8;opacity:0.76"`,
  );
  svg = svg.replace(
    /class="province"\s+style="fill-opacity:1; stroke:none"/,
    `class="province" style="fill:${BRAND.paper};fill-opacity:1;stroke:${BRAND.provinceStroke};stroke-width:0.72"`,
  );
  svg = svg.replace(/\.province \{fill:#ffffd0\}/, `.province {fill:${BRAND.paper}}`);

  await fs.writeFile(path.join(OUT_DIR, "china-clean.svg"), svg, "utf8");

  const shandongFill = extractSvgElement(svg, "pSD").replace(
    /id="pSD"/,
    `id="pSD" fill="${BRAND.accent}" stroke="${BRAND.paper}" stroke-width="1.4" opacity="0.95"`,
  );
  const shandongOutline = extractSvgElement(svg, "ShandongW_839").replace(
    /id="ShandongW_839"/,
    `id="ShandongW_839" fill="none" stroke="${BRAND.paper}" stroke-width="1.6" opacity="0.95"`,
  );
  const shandongSvg = [
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="850" viewBox="0 0 1000 850">',
    shandongFill,
    shandongOutline,
    "</svg>",
  ].join("\n");

  await fs.writeFile(path.join(OUT_DIR, "china-shandong.svg"), shandongSvg, "utf8");
};

const toBinaryMask = (gray, threshold) => {
  const mask = new Uint8Array(gray.length);
  for (let i = 0; i < gray.length; i++) {
    mask[i] = gray[i] < threshold ? 1 : 0;
  }

  return mask;
};

const findBottomCrop = (gray, width, height, threshold) => {
  const coverage = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    let darkCount = 0;
    for (let x = 0; x < width; x++) {
      if (gray[y * width + x] < threshold) {
        darkCount++;
      }
    }
    coverage[y] = darkCount / width;
  }

  let cropBottom = height;
  let started = false;

  for (let y = height - 1; y >= Math.floor(height * 0.55); y--) {
    if (coverage[y] > 0.55) {
      cropBottom = y - 6;
      started = true;
      continue;
    }

    if (started && coverage[y] < 0.14) {
      break;
    }
  }

  return Math.max(Math.floor(height * 0.55), cropBottom);
};

const cropGray = (gray, width, top, bottom) => {
  const height = bottom - top;
  const out = new Uint8Array(width * height);
  for (let y = top; y < bottom; y++) {
    out.set(gray.subarray(y * width, (y + 1) * width), (y - top) * width);
  }
  return {data: out, height};
};

const dilate = (mask, width, height, iterations = 1) => {
  let current = mask;
  for (let step = 0; step < iterations; step++) {
    const next = new Uint8Array(current.length);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        if (current[index]) {
          next[index] = 1;
          continue;
        }

        let found = 0;
        for (let oy = -1; oy <= 1 && !found; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const nx = x + ox;
            const ny = y + oy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
              continue;
            }
            if (current[ny * width + nx]) {
              found = 1;
              break;
            }
          }
        }
        next[index] = found;
      }
    }
    current = next;
  }
  return current;
};

const largestComponent = (mask, width, height) => {
  const visited = new Uint8Array(mask.length);
  let bestPixels = [];

  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || visited[start]) {
      continue;
    }

    const queue = [start];
    const pixels = [];
    visited[start] = 1;

    for (let qi = 0; qi < queue.length; qi++) {
      const index = queue[qi];
      pixels.push(index);
      const x = index % width;
      const y = (index - x) / width;

      for (let oy = -1; oy <= 1; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
          if (ox === 0 && oy === 0) {
            continue;
          }
          const nx = x + ox;
          const ny = y + oy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
            continue;
          }
          const next = ny * width + nx;
          if (!mask[next] || visited[next]) {
            continue;
          }
          visited[next] = 1;
          queue.push(next);
        }
      }
    }

    if (pixels.length > bestPixels.length) {
      bestPixels = pixels;
    }
  }

  const out = new Uint8Array(mask.length);
  for (const index of bestPixels) {
    out[index] = 1;
  }
  return out;
};

const fillInterior = (borderMask, width, height) => {
  const visited = new Uint8Array(borderMask.length);
  const queue = [];

  const maybePush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return;
    }
    const index = y * width + x;
    if (borderMask[index] || visited[index]) {
      return;
    }
    visited[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < width; x++) {
    maybePush(x, 0);
    maybePush(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    maybePush(0, y);
    maybePush(width - 1, y);
  }

  for (let qi = 0; qi < queue.length; qi++) {
    const index = queue[qi];
    const x = index % width;
    const y = (index - x) / width;
    maybePush(x + 1, y);
    maybePush(x - 1, y);
    maybePush(x, y + 1);
    maybePush(x, y - 1);
  }

  const fill = new Uint8Array(borderMask.length);
  for (let i = 0; i < borderMask.length; i++) {
    fill[i] = borderMask[i] || visited[i] ? 0 : 1;
  }
  return fill;
};

const boundingBox = (mask, width, height) => {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!mask[y * width + x]) {
        continue;
      }
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  return {minX, minY, maxX, maxY};
};

const rgbaFromMask = (mask, width, height, [r, g, b]) => {
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < mask.length; i++) {
    const alpha = mask[i] ? 255 : 0;
    const offset = i * 4;
    rgba[offset] = r;
    rgba[offset + 1] = g;
    rgba[offset + 2] = b;
    rgba[offset + 3] = alpha;
  }
  return rgba;
};

const cropRgba = (rgba, width, height, box, padding) => {
  const minX = Math.max(0, box.minX - padding);
  const minY = Math.max(0, box.minY - padding);
  const maxX = Math.min(width - 1, box.maxX + padding);
  const maxY = Math.min(height - 1, box.maxY + padding);
  const outWidth = maxX - minX + 1;
  const outHeight = maxY - minY + 1;
  const cropped = new Uint8ClampedArray(outWidth * outHeight * 4);

  for (let y = minY; y <= maxY; y++) {
    const srcOffset = (y * width + minX) * 4;
    const destOffset = ((y - minY) * outWidth) * 4;
    cropped.set(rgba.subarray(srcOffset, srcOffset + outWidth * 4), destOffset);
  }

  return {data: cropped, width: outWidth, height: outHeight};
};

const buildIranAssets = async () => {
  const {data, info} = await sharp(IRAN_SOURCE).greyscale().raw().toBuffer({resolveWithObject: true});
  const cropBottom = findBottomCrop(data, info.width, info.height, 72);
  const cropped = cropGray(data, info.width, 0, cropBottom);
  const thresholdMask = toBinaryMask(cropped.data, 72);
  const borderMask = largestComponent(thresholdMask, info.width, cropped.height);
  const strengthenedBorder = dilate(borderMask, info.width, cropped.height, 2);
  const fillMask = fillInterior(strengthenedBorder, info.width, cropped.height);
  const silhouetteMask = new Uint8Array(fillMask.length);

  for (let i = 0; i < silhouetteMask.length; i++) {
    silhouetteMask[i] = fillMask[i] || strengthenedBorder[i] ? 1 : 0;
  }

  const box = boundingBox(silhouetteMask, info.width, cropped.height);
  const fillRgba = rgbaFromMask(silhouetteMask, info.width, cropped.height, [247, 246, 243]);
  const borderRgba = rgbaFromMask(strengthenedBorder, info.width, cropped.height, [255, 255, 255]);
  const croppedFill = cropRgba(fillRgba, info.width, cropped.height, box, 48);
  const croppedBorder = cropRgba(borderRgba, info.width, cropped.height, box, 48);

  await sharp(croppedFill.data, {
    raw: {width: croppedFill.width, height: croppedFill.height, channels: 4},
  })
    .png()
    .toFile(path.join(OUT_DIR, "iran-fill.png"));

  await sharp(croppedBorder.data, {
    raw: {width: croppedBorder.width, height: croppedBorder.height, channels: 4},
  })
    .png()
    .toFile(path.join(OUT_DIR, "iran-border.png"));
};

await ensureDir();
await buildChinaAssets();
await buildIranAssets();

console.log("Prepared china-clean.svg, china-shandong.svg, iran-fill.png, and iran-border.png");
