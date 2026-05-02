/**
 * База знаний цветочного магазина «AIgul».
 *
 * RAG-источники:
 *   1. Excel-каталог одиночных цветов:    data/source/flowers.xlsx  (см. excel-loader.ts)
 *   2. Готовые букеты с фото:             src/lib/bouquets.ts
 *   3. Гайд по поводам и правила:         в этом файле ниже
 *   4. Информация о магазине:             в этом файле ниже
 *
 * Магазин может выгружать новые данные в Excel — приложение перечитает их
 * автоматически при следующем запросе клиента (mtime-кэш).
 */

import {
  BOUQUETS,
  GIFT_ADDONS,
  bouquetsToPromptContext,
  type Bouquet,
  type GiftAddon,
} from "./bouquets";

export type { Bouquet, GiftAddon };
export { BOUQUETS, GIFT_ADDONS };

/** Локальное представление одного цветка из Excel — без зависимости от excel-loader */
export type StemSummary = {
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
  warning?: string;
};

export type OccasionGuide = {
  occasion: string;
  recommendations: string[];
  avoid?: string[];
  tone: string;
};

export const OCCASIONS_GUIDE: OccasionGuide[] = [
  {
    occasion: "извинения / примирение после ссоры",
    recommendations: [
      "Белые пионы (символ примирения и чистых намерений) — топ выбор",
      "Белые розы — классика искренности",
      "Композиция с гортензией — если хочется чего-то более статусного",
      "ИЗБЕГАТЬ: красные розы — слишком пафосно, может быть прочитано как «откупиться»",
    ],
    avoid: ["красные розы (если ссора серьёзная)", "слишком крупные букеты — выглядят как 'купил прощение'"],
    tone: "искренне, без пафоса, с открыткой и личными словами",
  },
  {
    occasion: "годовщина отношений",
    recommendations: [
      "До 1 года — пионы или пастельные тюльпаны (нежно, не давит)",
      "1-3 года — красные или розовые пионы, премиум-розы",
      "3+ лет — авторские композиции, орхидеи, статусные букеты",
      "Подарки: добавить шоколад или парфюм",
    ],
    tone: "романтично, с историей, можно вспомнить детали первого свидания",
  },
  {
    occasion: "день рождения",
    recommendations: [
      "До 25 лет — тюльпаны, полевые миксы, яркие цвета",
      "25-35 — пионы, авторские композиции",
      "35+ — гортензии, орхидеи, премиум-розы",
      "Количество стеблей: чётное — НЕЛЬЗЯ (траур), только нечётное",
    ],
    tone: "праздничный, с поздравлением",
  },
  {
    occasion: "просто так / без повода",
    recommendations: [
      "Это самый сильный жест — потому что без причины",
      "Полевой микс или альстромерии — повседневно и душевно",
      "Тюльпаны — лёгко и не обязывающе",
      "Не нужно дорого — нужно неожиданно",
    ],
    tone: "лёгко, по-домашнему, с шуткой",
  },
  {
    occasion: "первое свидание",
    recommendations: [
      "1-3 цветка максимум — большой букет напугает",
      "Один пион или 3 тюльпана — идеально",
      "ИЗБЕГАТЬ: красные розы — слишком серьёзно для первого раза",
    ],
    avoid: ["большие букеты", "красные розы"],
    tone: "лёгко, по-джентльменски",
  },
  {
    occasion: "8 марта",
    recommendations: [
      "Тюльпаны — главный цветок 8 марта",
      "Мимоза — традиция",
      "Пионы — если бюджет позволяет",
    ],
    tone: "праздничный",
  },
  {
    occasion: "Наурыз",
    recommendations: [
      "Жёлтые тюльпаны — символ весны и Наурыза",
      "Фрезии и тюльпаны микс",
      "Подсолнухи для тёплого настроения",
    ],
    tone: "тёплый, по-казахски душевный",
  },
  {
    occasion: "выписка из роддома",
    recommendations: [
      "Только нежные пастельные тона",
      "Без сильного аромата (новорождённый)",
      "Альстромерии или розовые пионы",
    ],
    avoid: ["лилии (сильный запах)", "тёмные цвета"],
    tone: "поздравительный, заботливый",
  },
];

export const SHOP_INFO = {
  name: "AIgul",
  city: "Алматы",
  delivery: {
    almaty:
      "Бесплатная доставка по Алматы при заказе от 10 000 ₸. До 15 000 ₸ — 1500 ₸. Доставка за 90 минут.",
    other: "По Казахстану — Kaspi Доставка, 2-3 дня",
  },
  workHours: "9:00 – 22:00 без выходных",
  payment: ["Kaspi Pay", "Карта онлайн", "Наличные курьеру"],
  guarantee: "Если букет не понравился — заменим бесплатно в течение 24 часов",
};

export const FLOWER_RULES = [
  "В Казахстане и СНГ дарят ТОЛЬКО нечётное количество цветов (чётное — для похорон)",
  "Исключение — букеты от 21 цветка, там количество не критично",
  "Жёлтые цветы НЕ означают разлуку (это миф) — можно дарить",
  "Лилии и хризантемы НЕ дарят молодым девушкам — ассоциация со старшим возрастом",
  "Хризантемы в Казахстане — символ траура. Не дарить на праздники.",
  "Один цветок — это не «дёшево», а интимно. Один пион стоит 2200₸ и смотрится сильнее, чем 11 ромашек",
];

function stemsToPromptContext(stems: StemSummary[]): string {
  if (stems.length === 0) return "";

  const lines: string[] = [
    "=== АКТУАЛЬНЫЙ КАТАЛОГ ОДИНОЧНЫХ ЦВЕТОВ (загружено из Excel магазина) ===",
    "Эти цены — за один стебель. Букеты собираются из них или берутся из готовых композиций ниже.",
    "",
  ];
  for (const s of stems) {
    if (!s.available) continue;
    const parts = [
      `• #${s.id} ${s.nameRu}${s.nameKz ? ` / ${s.nameKz}` : ""}`,
      `  Цвет: ${s.color}. Цена: ${s.pricePerStem.toLocaleString("ru-RU")} ₸/шт.`,
      `  Значение: ${s.meaning}.`,
      s.occasions.length > 0 ? `  Повод: ${s.occasions.join(", ")}.` : "",
      s.forWhom.length > 0 ? `  Кому: ${s.forWhom.join(", ")}.` : "",
      `  Сезон: ${s.season}.`,
    ].filter(Boolean);
    if (s.warning) parts.push(`  ⚠️ ${s.warning}`);
    lines.push(parts.join("\n"));
  }
  return lines.join("\n");
}

/**
 * Сборка полного RAG-контекста для системного промпта Gemini.
 * Принимает уже распарсенные stems извне — это нужно, чтобы knowledge-base
 * не зависел от excel-loader (там Node-only API), и клиентский бандл оставался
 * чистым.
 */
export function buildKnowledgeContext(stems: StemSummary[] = []): string {
  const stemsContext =
    stems.length > 0
      ? stemsToPromptContext(stems)
      : "(Excel-каталог не загружен — используй только готовые букеты ниже)";

  const bouquetsContext = bouquetsToPromptContext();

  const occasionsText = OCCASIONS_GUIDE.map(
    (o) =>
      `▸ ${o.occasion.toUpperCase()}\n  Рекомендации:\n  ${o.recommendations.map((r) => `- ${r}`).join("\n  ")}\n  Тон подачи: ${o.tone}${o.avoid ? `\n  Избегать: ${o.avoid.join(", ")}` : ""}`,
  ).join("\n\n");

  const rulesText = FLOWER_RULES.map((r, i) => `${i + 1}. ${r}`).join("\n");

  return `${stemsContext}

${bouquetsContext}

=== ГАЙД ПО ПОВОДАМ (внутренние правила магазина) ===

${occasionsText}

=== ВАЖНЫЕ ПРАВИЛА ЦВЕТОЧНОГО ЭТИКЕТА ===

${rulesText}

=== ИНФОРМАЦИЯ О МАГАЗИНЕ ===

Магазин: ${SHOP_INFO.name}, г. ${SHOP_INFO.city}
Доставка по Алматы: ${SHOP_INFO.delivery.almaty}
По Казахстану: ${SHOP_INFO.delivery.other}
Часы работы: ${SHOP_INFO.workHours}
Оплата: ${SHOP_INFO.payment.join(", ")}
Гарантия: ${SHOP_INFO.guarantee}`;
}
