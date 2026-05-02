/**
 * Copies flower images from data/flowers/<Name>/ → public/flowers/<slug>/
 * Renames them to 1.jpg, 2.jpg, … for predictable URLs.
 * Run: node scripts/sync-flower-images.mjs
 */
import { readdirSync, mkdirSync, copyFileSync, existsSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = join(ROOT, "data", "flowers");
const DEST = join(ROOT, "public", "flowers");

/** Transliterate Cyrillic folder name → ASCII slug */
function slugify(name) {
  const map = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
    я: "ya",
  };
  return name
    .toLowerCase()
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

if (!existsSync(SRC)) {
  console.error("Source dir not found:", SRC);
  process.exit(1);
}

mkdirSync(DEST, { recursive: true });

const folders = readdirSync(SRC, { withFileTypes: true }).filter((d) =>
  d.isDirectory()
);

const manifest = {};

for (const folder of folders) {
  const slug = slugify(folder.name);
  const srcDir = join(SRC, folder.name);
  const destDir = join(DEST, slug);
  mkdirSync(destDir, { recursive: true });

  const images = readdirSync(srcDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();

  manifest[folder.name] = { slug, count: images.length };

  images.forEach((img, i) => {
    const ext = img.split(".").pop().toLowerCase();
    const destFile = join(destDir, `${i + 1}.${ext}`);
    copyFileSync(join(srcDir, img), destFile);
  });

  console.log(`✓ ${folder.name} → /flowers/${slug}/ (${images.length} images)`);
}

// Write manifest for reference
import { writeFileSync } from "fs";
writeFileSync(
  join(ROOT, "data", "flower-images-manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf-8"
);

console.log(`\nDone! ${folders.length} flower folders synced.`);
console.log("Manifest:", join(ROOT, "data", "flower-images-manifest.json"));
