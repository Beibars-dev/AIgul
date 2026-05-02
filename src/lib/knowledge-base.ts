/**
 * База знаний цветочного магазина "AIgul"
 * Данные загружаются из XLSX-каталога (data/AIGul_FlowerShop_Catalog.xlsx).
 * Используется для RAG-обогащения системного промпта Gemini.
 */

import {
  getFlowers as loadFlowers,
  getOccasions as loadOccasions,
  getRecipients as loadRecipients,
  getAddons as loadAddons,
  type CatalogFlower,
  type CatalogOccasion,
  type CatalogRecipient,
  type CatalogAddon,
} from "./catalog-loader";

// ─── Re-export types for backward compatibility ─────────────

export type FlowerProduct = {
  id: string;
  name: string;
  nameKz: string;
  color: string;
  pricePerStem: number;
  /** Standard bouquet options with precomputed prices */
  bouquetPrices: { stems: number; price: number }[];
  description: string;
  meaning: string;
  bestFor: string[];
  vibe: string[];
  image: string;
  images: string[];
  season: string;
  available: boolean;
  recipients: string[];
};

export type GiftAddon = {
  id: string;
  name: string;
  price: number;
  description: string;
  occasions: string[];
};

export type OccasionGuide = {
  occasion: string;
  recommendations: string[];
  avoid: string[];
  tone: string;
  budget: string;
};

export type RecipientGuide = {
  recipient: string;
  recommended: string[];
  avoid: string[];
  budget: string;
  agentTip: string;
};

// ─── Standard bouquet sizes ─────────────────────────────────

const STANDARD_BOUQUET_SIZES = [1, 3, 5, 11, 15, 25];

function buildBouquetPrices(
  pricePerStem: number,
): { stems: number; price: number }[] {
  return STANDARD_BOUQUET_SIZES.map((stems) => ({
    stems,
    price: pricePerStem * stems,
  }));
}

// ─── Transform XLSX data → app types ────────────────────────

function transformFlower(f: CatalogFlower): FlowerProduct {
  return {
    id: f.id,
    name: f.name,
    nameKz: f.nameKz,
    color: f.color,
    pricePerStem: f.pricePerStem,
    bouquetPrices: buildBouquetPrices(f.pricePerStem),
    description: f.meaning,
    meaning: f.meaning,
    bestFor: f.occasions,
    vibe: f.occasions,
    image: f.image,
    images: f.images,
    season: f.season,
    available: f.available,
    recipients: f.recipients,
  };
}

function transformOccasion(o: CatalogOccasion): OccasionGuide {
  const recommendations = [
    `Топ цветы: ${o.topFlowers.join(", ")}`,
    `Цвета: ${o.colors.join(", ")}`,
    `Бюджет: ${o.budget}`,
    ...(o.note ? [o.note] : []),
  ];
  return {
    occasion: o.occasion,
    recommendations,
    avoid: o.avoid,
    tone: o.note || "",
    budget: o.budget,
  };
}

function transformAddon(a: CatalogAddon): GiftAddon {
  return {
    id: a.id,
    name: a.name,
    price: a.price,
    description: a.description,
    occasions: a.occasions,
  };
}

function transformRecipient(r: CatalogRecipient): RecipientGuide {
  return {
    recipient: r.recipient,
    recommended: r.recommended,
    avoid: r.avoid,
    budget: r.budget,
    agentTip: r.agentTip,
  };
}

// ─── Exported data (lazy-loaded from XLSX) ──────────────────

let _flowers: FlowerProduct[] | null = null;
let _addons: GiftAddon[] | null = null;
let _occasions: OccasionGuide[] | null = null;
let _recipients: RecipientGuide[] | null = null;

export function getFlowers(): FlowerProduct[] {
  if (!_flowers) _flowers = loadFlowers().map(transformFlower);
  return _flowers;
}

export function getAddons(): GiftAddon[] {
  if (!_addons) _addons = loadAddons().map(transformAddon);
  return _addons;
}

export function getOccasions(): OccasionGuide[] {
  if (!_occasions) _occasions = loadOccasions().map(transformOccasion);
  return _occasions;
}

export function getRecipients(): RecipientGuide[] {
  if (!_recipients) _recipients = loadRecipients().map(transformRecipient);
  return _recipients;
}

/** Backward-compatible aliases (used by catalog page, chat, etc.) */
export const FLOWERS: FlowerProduct[] = (() => {
  try { return getFlowers(); } catch { return []; }
})();

export const GIFT_ADDONS: GiftAddon[] = (() => {
  try { return getAddons(); } catch { return []; }
})();

export const OCCASIONS_GUIDE: OccasionGuide[] = (() => {
  try { return getOccasions(); } catch { return []; }
})();

export const RECIPIENTS_GUIDE: RecipientGuide[] = (() => {
  try { return getRecipients(); } catch { return []; }
})();

// ─── Shop info (not from XLSX) ──────────────────────────────

export const SHOP_INFO = {
  name: "AIgul",
  city: "Алматы",
  delivery: {
    almaty:
      "Бесплатная доставка по Алматы при заказе от 10 000 ₸. До 10 000 ₸ — 1500 ₸. Доставка за 90 минут.",
    other: "По Казахстану — Kaspi Доставка, 2-3 дня",
  },
  workHours: "9:00 – 22:00 без выходных",
  payment: ["Kaspi Pay", "Карта онлайн", "Наличные курьеру"],
  guarantee:
    "Если букет не понравился — заменим бесплатно в течение 24 часов",
};

// ─── Flower etiquette rules ─────────────────────────────────

export const FLOWER_RULES = [
  "В Казахстане и СНГ дарят ТОЛЬКО нечётное количество цветов (чётное — для похорон)",
  "Исключение — букеты от 21 цветка, там количество не критично",
  "Жёлтые цветы НЕ означают разлуку — это миф, можно дарить (подсолнухи, жёлтые тюльпаны)",
  "Белые хризантемы в Казахстане — символ ТРАУРА. НЕ дарить на праздники!",
  "Лилии и хризантемы НЕ дарят молодым девушкам — ассоциация со старшим возрастом",
  "Один цветок — это не «дёшево», а интимно. Одна роза или один пион — стильно и лаконично",
  "Избегайте сильно пахнущих цветов при выздоровлении и для новорождённых",
];

// ─── Build RAG context for Gemini ───────────────────────────

export function buildKnowledgeContext(): string {
  const flowers = getFlowers();
  const addons = getAddons();
  const occasions = getOccasions();
  const recipients = getRecipients();

  const flowersText = flowers
    .map((f) => {
      const prices = f.bouquetPrices
        .filter((p) => [1, 5, 11, 25].includes(p.stems))
        .map(
          (p) => `${p.stems} шт — ${p.price.toLocaleString("ru-RU")} ₸`,
        )
        .join(", ");
      return `• ${f.name} (${f.nameKz}) [ID: ${f.id}] — ${f.pricePerStem.toLocaleString("ru-RU")} ₸/шт
  Цвет: ${f.color}. Значение: ${f.meaning}.
  Подходит для: ${f.bestFor.join(", ")}.
  Кому: ${f.recipients.join(", ")}.
  Сезон: ${f.season}. ${!f.available ? "⚠️ НЕТ В НАЛИЧИИ" : "✅ В наличии"}
  Букеты: ${prices}.`;
    })
    .join("\n\n");

  const addonsText = addons
    .map(
      (a) =>
        `• ${a.name} [ID: ${a.id}] — ${a.price.toLocaleString("ru-RU")} ₸ (${a.description}). Поводы: ${a.occasions.join(", ")}`,
    )
    .join("\n");

  const occasionsText = occasions
    .map(
      (o) =>
        `▸ ${o.occasion.toUpperCase()}\n  ${o.recommendations.map((r) => `- ${r}`).join("\n  ")}${o.avoid.length > 0 ? `\n  Избегать: ${o.avoid.join(", ")}` : ""}`,
    )
    .join("\n\n");

  const recipientsText = recipients
    .map(
      (r) =>
        `▸ ${r.recipient.toUpperCase()}\n  Рекомендуем: ${r.recommended.join(", ")}\n  ${r.avoid.length > 0 ? `Избегать: ${r.avoid.join(", ")}\n  ` : ""}Бюджет: ${r.budget}\n  Совет: ${r.agentTip}`,
    )
    .join("\n\n");

  const rulesText = FLOWER_RULES.map((r, i) => `${i + 1}. ${r}`).join("\n");

  const flowerIds = flowers.map((f) => f.id).join(", ");
  const addonIds = addons.map((a) => a.id).join(", ");

  return `=== АКТУАЛЬНЫЙ КАТАЛОГ МАГАЗИНА AIGUL (Алматы) ===

${flowersText}

=== ДОПОЛНЕНИЯ К БУКЕТАМ ===

${addonsText}

=== ГАЙД ПО ПОВОДАМ ===

${occasionsText}

=== КОМУ ДАРИТЬ (рекомендации по получателю) ===

${recipientsText}

=== ВАЖНЫЕ ПРАВИЛА ЦВЕТОЧНОГО ЭТИКЕТА ===

${rulesText}

=== ДОПУСТИМЫЕ ID ДЛЯ МЕТОК ===
Flower IDs: ${flowerIds}
Addon IDs: ${addonIds}

=== ИНФОРМАЦИЯ О МАГАЗИНЕ ===

Магазин: ${SHOP_INFO.name}, г. ${SHOP_INFO.city}
Доставка по Алматы: ${SHOP_INFO.delivery.almaty}
По Казахстану: ${SHOP_INFO.delivery.other}
Часы работы: ${SHOP_INFO.workHours}
Оплата: ${SHOP_INFO.payment.join(", ")}
Гарантия: ${SHOP_INFO.guarantee}`;
}
