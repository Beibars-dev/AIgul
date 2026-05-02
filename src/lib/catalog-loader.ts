/**
 * Загрузчик каталога из XLSX-файла.
 * Парсит все 4 листа и экспортирует типизированные данные.
 * Данные кешируются — XLSX читается один раз при старте сервера.
 */
import * as XLSX from "xlsx";
import path from "path";

// ─── Types ───────────────────────────────────────────────────

export type CatalogFlower = {
  id: string;
  name: string;
  nameKz: string;
  color: string;
  pricePerStem: number;
  available: boolean;
  occasions: string[];
  recipients: string[];
  meaning: string;
  season: string;
  /** Path to first image under /flowers/<slug>/ */
  image: string;
  /** All image paths */
  images: string[];
  /** Slug used for IDs and image paths */
  slug: string;
};

export type CatalogOccasion = {
  occasion: string;
  topFlowers: string[];
  colors: string[];
  avoid: string[];
  budget: string;
  note: string;
};

export type CatalogRecipient = {
  recipient: string;
  recommended: string[];
  avoid: string[];
  budget: string;
  agentTip: string;
};

export type CatalogAddon = {
  id: string;
  name: string;
  price: number;
  occasions: string[];
  description: string;
};

// ─── Slugification ───────────────────────────────────────────

const CYR_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
  я: "ya",
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .split("")
    .map((c) => CYR_MAP[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── Image manifest ──────────────────────────────────────────

let imageManifest: Record<string, { slug: string; count: number }> | null =
  null;

function getImageManifest(): Record<
  string,
  { slug: string; count: number }
> {
  if (imageManifest) return imageManifest;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    imageManifest = require("../../data/flower-images-manifest.json");
    return imageManifest!;
  } catch {
    imageManifest = {};
    return imageManifest;
  }
}

function getFlowerImages(flowerName: string): string[] {
  const manifest = getImageManifest();
  const entry = manifest[flowerName];
  if (!entry) {
    const slug = slugify(flowerName);
    return [`/flowers/${slug}/1.jpg`];
  }
  const ext = (entry as { slug: string; count: number; ext?: string }).ext ?? "jpg";
  const images: string[] = [];
  for (let i = 1; i <= entry.count; i++) {
    images.push(`/flowers/${entry.slug}/${i}.${ext}`);
  }
  return images;
}

// ─── CSV split helper ────────────────────────────────────────

function splitCSV(value: string | undefined | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ─── Static fallback (used when XLSX is absent) ──────────────

// eslint-disable-next-line @typescript-eslint/no-require-imports
const STATIC_FLOWERS: Record<string, string>[] = (() => {
  try { return require("../data/flowers-static.json"); } catch { return []; }
})();

// ─── XLSX parsing ────────────────────────────────────────────

type CatalogData = {
  flowers: CatalogFlower[];
  occasions: CatalogOccasion[];
  recipients: CatalogRecipient[];
  addons: CatalogAddon[];
};

let cached: CatalogData | null = null;

function parseXLSX(): CatalogData {
  if (cached) return cached;

  let flowersRaw: Record<string, string>[] = STATIC_FLOWERS;
  let occasions: CatalogOccasion[] = [];
  let recipients: CatalogRecipient[] = [];
  let addons: CatalogAddon[] = [];

  try {
    const xlsxPath = path.join(process.cwd(), "data", "AIGul_FlowerShop_Catalog.xlsx");
    const workbook = XLSX.readFile(xlsxPath);

    // ── Sheet 1: Каталог цветов ──
    const flowersSheet = workbook.Sheets["Каталог цветов"];
    flowersRaw = XLSX.utils.sheet_to_json<Record<string, string>>(flowersSheet);

    // ── Sheet 2: Поводы и рекомендации ──
    const occasionsSheet = workbook.Sheets["Поводы и рекомендации"];
    const occasionsRaw = XLSX.utils.sheet_to_json<Record<string, string>>(occasionsSheet);
    occasions = occasionsRaw.map((row) => ({
      occasion: row["Повод"] || "",
      topFlowers: splitCSV(row["Топ цветы"]),
      colors: splitCSV(row["Цвета"]),
      avoid: splitCSV(row["Избегать"]),
      budget: row["Средний бюджет (тг)"] || "",
      note: row["Заметка"] || "",
    }));

    // ── Sheet 3: Кому дарить ──
    const recipientsSheet = workbook.Sheets["Кому дарить"];
    const recipientsRaw = XLSX.utils.sheet_to_json<Record<string, string>>(recipientsSheet);
    recipients = recipientsRaw.map((row) => ({
      recipient: row["Получатель"] || "",
      recommended: splitCSV(row["Рекомендованные цветы"]),
      avoid: splitCSV(row["Нежелательно"]),
      budget: row["Бюджет (тг)"] || "",
      agentTip: row["Совет агенту"] || "",
    }));

    // ── Sheet 4: Дополнения к букету ──
    const addonsSheet = workbook.Sheets["Дополнения к букету"];
    const addonsRaw = XLSX.utils.sheet_to_json<Record<string, string>>(addonsSheet);
    addons = addonsRaw.map((row) => {
      const name = row["Товар"] || "";
      return {
        id: slugify(name),
        name,
        price: parseInt(row["Цена (тг)"] || "0", 10),
        occasions: splitCSV(row["Подходит к поводу"]),
        description: row["Описание"] || "",
      };
    });
  } catch {
    // XLSX unavailable — flowers fall back to STATIC_FLOWERS, other sheets stay empty
  }

  const flowers: CatalogFlower[] = flowersRaw.map((row) => {
    const name = row["Название (RU)"] || "";
    const slug = slugify(name);
    const images = getFlowerImages(name);
    return {
      id: slug,
      name,
      nameKz: row["Название (KZ)"] || "",
      color: row["Цвет"] || "",
      pricePerStem: parseInt(row["Цена (тг)"] || "0", 10),
      available: (row["Наличие"] || "").toLowerCase() !== "нет",
      occasions: splitCSV(row["Повод"]),
      recipients: splitCSV(row["Кому дарить"]),
      meaning: row["Значение / Символика"] || "",
      season: row["Сезон"] || "",
      image: images[0],
      images,
      slug,
    };
  });

  cached = { flowers, occasions, recipients, addons };
  return cached;
}

// ─── Public API ──────────────────────────────────────────────

export function getCatalog(): CatalogData {
  return parseXLSX();
}

export function getFlowers(): CatalogFlower[] {
  return getCatalog().flowers;
}

export function getOccasions(): CatalogOccasion[] {
  return getCatalog().occasions;
}

export function getRecipients(): CatalogRecipient[] {
  return getCatalog().recipients;
}

export function getAddons(): CatalogAddon[] {
  return getCatalog().addons;
}
