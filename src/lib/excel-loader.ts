/**
 * Excel-loader — RAG-источник истины для AI-агента.
 *
 * Магазин кладёт свой каталог в data/source/flowers.xlsx — мы парсим его и
 * скармливаем Gemini в системный промпт. Если файл обновился (по mtime) —
 * кэш сбрасывается автоматически. Если файла нет — fallback на встроенный
 * каталог в knowledge-base.ts.
 */

import fs from "fs/promises";
import path from "path";
import * as XLSX from "xlsx";

export type Stem = {
  id: number;
  nameRu: string;
  nameKz?: string;
  color: string;
  pricePerStem: number;
  available: boolean;
  occasions: string[];
  forWhom: string[];
  meaning: string;
  season: string;
  /** Подсветить в каталоге как «осторожно — траурный» (хризантема в РК) */
  warning?: string;
};

const EXCEL_PATH = path.join(process.cwd(), "data", "source", "flowers.xlsx");

/**
 * Кэш парсинга. Сбрасывается, когда mtime файла меняется.
 */
let cache: { mtime: number; stems: Stem[] } | null = null;

function splitList(raw: unknown): string[] {
  if (raw === null || raw === undefined) return [];
  return String(raw)
    .split(/[,/;]| и /)
    .map((s) => s.trim())
    .filter((s) => s && s !== "—" && s !== "-");
}

function isAvailable(raw: unknown): boolean {
  if (raw === null || raw === undefined) return true;
  const v = String(raw).trim().toLowerCase();
  return ["да", "yes", "true", "1", "+", "✓", "иә"].includes(v);
}

function detectWarning(raw: string): string | undefined {
  if (!raw) return undefined;
  if (raw.startsWith("⚠️") || /траур|не дарить|не дари/i.test(raw)) {
    return raw.replace(/^[⚠️!]+\s*/, "").trim();
  }
  return undefined;
}

/**
 * Маппит названия столбцов из xlsx → внутренние ключи.
 * Поддерживает разные варианты, чтобы магазину не нужно было точно следовать формату.
 */
const COLUMN_ALIASES: Record<string, keyof Stem | "raw_name_kz" | "raw"> = {
  "id": "id",
  "№": "id",
  "название (ru)": "nameRu",
  "название": "nameRu",
  "name (ru)": "nameRu",
  "название (kz)": "nameKz",
  "name (kz)": "nameKz",
  "цвет": "color",
  "color": "color",
  "цена (тг)": "pricePerStem",
  "цена": "pricePerStem",
  "price": "pricePerStem",
  "наличие": "available",
  "available": "available",
  "in stock": "available",
  "повод": "occasions",
  "occasion": "occasions",
  "occasions": "occasions",
  "кому дарить": "forWhom",
  "for whom": "forWhom",
  "значение / символика": "meaning",
  "значение": "meaning",
  "символика": "meaning",
  "meaning": "meaning",
  "сезон": "season",
  "season": "season",
};

function normalizeKey(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

async function readExcel(): Promise<Stem[]> {
  const buf = await fs.readFile(EXCEL_PATH);
  const wb = XLSX.read(buf, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error("В Excel-файле нет ни одного листа");

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
    defval: null,
    raw: false,
  });

  const stems: Stem[] = [];
  for (const row of rows) {
    const normalized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      const aliasKey = COLUMN_ALIASES[normalizeKey(key)];
      if (aliasKey) normalized[aliasKey] = value;
    }

    const id = Number(normalized.id);
    const nameRu = String(normalized.nameRu ?? "").trim();
    const price = Number(normalized.pricePerStem);

    if (!nameRu || !Number.isFinite(price) || price <= 0) {
      // строка без обязательных полей — пропускаем
      continue;
    }

    const meaning = String(normalized.meaning ?? "").trim();

    stems.push({
      id: Number.isFinite(id) && id > 0 ? id : stems.length + 1,
      nameRu,
      nameKz: normalized.nameKz ? String(normalized.nameKz).trim() : undefined,
      color: String(normalized.color ?? "").trim(),
      pricePerStem: Math.round(price),
      available: isAvailable(normalized.available),
      occasions: splitList(normalized.occasions),
      forWhom: splitList(normalized.forWhom),
      meaning: meaning.replace(/^⚠️\s*/, ""),
      season: String(normalized.season ?? "").trim() || "Круглый год",
      warning: detectWarning(meaning),
    });
  }

  if (stems.length === 0) {
    throw new Error("Excel прочитан, но в нём 0 валидных строк");
  }
  return stems;
}

/**
 * Главный API — возвращает каталог одиночных цветов из Excel.
 * Перечитывает файл, если он изменился. Возвращает [] если файла нет.
 */
export async function getStems(): Promise<Stem[]> {
  try {
    const stat = await fs.stat(EXCEL_PATH);
    const mtime = stat.mtimeMs;
    if (cache && cache.mtime === mtime) return cache.stems;
    const stems = await readExcel();
    cache = { mtime, stems };
    return stems;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    console.warn("⚠️  Не удалось прочитать Excel-каталог:", err);
    return [];
  }
}

