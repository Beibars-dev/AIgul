/**
 * Готовые букеты магазина.
 *
 * В отличие от одиночных цветов из Excel — это собранные композиции с фото,
 * которые AI может рекомендовать «из коробки». Состав указан через ID цветов
 * из Excel-каталога (стеблей). Цена указана как готовая.
 *
 * Фото берём с Unsplash (permissive license), под каждый букет подобрано
 * максимально близкое визуально к описанию.
 */

export type BouquetComposition = {
  /** ID одиночного цветка из Excel-каталога (поле ID в xlsx) */
  stemId: number;
  /** Сколько штук в букете */
  count: number;
};

export type Bouquet = {
  id: string;
  name: string;
  /** Тип композиции для фильтра */
  category: "Романтика" | "Праздник" | "Извинения" | "Премиум" | "Просто так" | "Сезонные";
  description: string;
  /** Цена за букет целиком, ₸ */
  price: number;
  /** Список ID одиночных цветов и кол-во */
  composition: BouquetComposition[];
  /** Эмоциональные теги — AI использует для подбора */
  vibe: string[];
  /** Лучший повод для этого букета */
  bestFor: string[];
  /** Реальная фотография */
  image: string;
};

export const BOUQUETS: Bouquet[] = [
  {
    id: "white-peonies-7",
    name: "Белое примирение",
    category: "Извинения",
    description: "7 нежных белых пионов в крафт-бумаге. Символ искренности и желания начать с чистого листа.",
    price: 9500,
    composition: [{ stemId: 3, count: 7 }],
    vibe: ["нежная", "элегантная", "искренняя", "минимализм"],
    bestFor: ["извинения", "примирение", "первое свидание"],
    image: "https://images.unsplash.com/photo-1530092285049-1c42085fd395?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "pink-peonies-15",
    name: "Розовое утро",
    category: "Романтика",
    description: "15 пышных розовых пионов в кремовой обёртке. Главный «вау-букет» в нашей коллекции.",
    price: 22000,
    composition: [{ stemId: 3, count: 15 }],
    vibe: ["нежная", "женственная", "романтичная"],
    bestFor: ["день рождения", "годовщина", "8 марта"],
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "red-roses-25",
    name: "Страсть",
    category: "Романтика",
    description: "25 красных роз 70-80см в плотной чёрной упаковке. Классика серьёзных намерений.",
    price: 18500,
    composition: [{ stemId: 1, count: 25 }],
    vibe: ["страстная", "уверенная", "классическая"],
    bestFor: ["день влюблённых", "признание в любви", "годовщина свадьбы"],
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "white-roses-17",
    name: "Невеста",
    category: "Премиум",
    description: "17 белых роз — символ чистой любви. Идеально для свадьбы или знакомства с родителями.",
    price: 11900,
    composition: [{ stemId: 2, count: 17 }],
    vibe: ["элегантная", "сдержанная", "чистая"],
    bestFor: ["свадьба", "знакомство с родителями", "извинения"],
    image: "https://images.unsplash.com/photo-1454262041357-5d96f50a2f27?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "tulip-mix-51",
    name: "Весеннее настроение",
    category: "Сезонные",
    description: "51 тюльпан в пастельной гамме — белые, розовые, персиковые. Лёгкий весенний микс.",
    price: 14500,
    composition: [
      { stemId: 5, count: 17 },
      { stemId: 10, count: 17 },
      { stemId: 11, count: 17 },
    ],
    vibe: ["лёгкая", "молодая", "весенняя"],
    bestFor: ["8 марта", "Наурыз", "первое свидание"],
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "hydrangea-box",
    name: "Гортензия в шляпной коробке",
    category: "Премиум",
    description: "Авторская композиция: синяя гортензия, эвкалипт, фрезии — в стильной чёрной коробке.",
    price: 24000,
    composition: [
      { stemId: 7, count: 3 },
      { stemId: 12, count: 5 },
    ],
    vibe: ["статусная", "элегантная", "минималистичная"],
    bestFor: ["юбилей", "годовщина", "руководительнице"],
    image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "wildflower-mix",
    name: "Полевой микс",
    category: "Просто так",
    description: "Душевный сборный букет: лаванда, фрезии, подсолнухи, эустома. Для творческих натур.",
    price: 9500,
    composition: [
      { stemId: 6, count: 5 },
      { stemId: 12, count: 5 },
      { stemId: 13, count: 3 },
      { stemId: 14, count: 3 },
    ],
    vibe: ["бохо", "творческая", "натуральная"],
    bestFor: ["просто так", "девушка-художница", "первое свидание"],
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "sunflowers-9",
    name: "Солнце в руках",
    category: "Праздник",
    description: "9 ярких подсолнухов с зеленью. Энергия, тепло и улыбка с собой.",
    price: 5400,
    composition: [{ stemId: 13, count: 9 }],
    vibe: ["позитивная", "тёплая", "лёгкая"],
    bestFor: ["день рождения", "выздоровление", "просто так"],
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "lavender-25",
    name: "Лавандовый лес",
    category: "Просто так",
    description: "25 веточек лаванды с фрезией и эвкалиптом. Аромат прованса и нежности.",
    price: 7500,
    composition: [
      { stemId: 6, count: 25 },
      { stemId: 12, count: 5 },
    ],
    vibe: ["нежная", "ароматная", "натуральная"],
    bestFor: ["просто так", "благодарность", "маме"],
    image: "https://images.unsplash.com/photo-1566895291281-ea63efd4bdb0?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "orchid-7",
    name: "Орхидеи Cymbidium",
    category: "Премиум",
    description: "7 веток орхидей фаленопсис — для девушек с характером и тонким вкусом.",
    price: 19500,
    composition: [{ stemId: 15, count: 7 }],
    vibe: ["статусная", "необычная", "fashion"],
    bestFor: ["девушка с характером", "статусный жест", "юбилей"],
    image: "https://images.unsplash.com/photo-1567748157439-651aca2ff064?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "premium-roses-51",
    name: "Премиум 51",
    category: "Премиум",
    description: "51 эквадорская роза Freedom 80см в премиум-коробке. Большой жест.",
    price: 35000,
    composition: [{ stemId: 1, count: 51 }],
    vibe: ["роскошная", "уверенная", "статусная"],
    bestFor: ["предложение", "юбилей свадьбы", "большое извинение"],
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "naurz-mix",
    name: "Наурыз",
    category: "Сезонные",
    description: "25 жёлтых тюльпанов и фрезии — праздничный весенний букет на Наурыз и 8 марта.",
    price: 12000,
    composition: [
      { stemId: 5, count: 25 },
      { stemId: 12, count: 5 },
    ],
    vibe: ["праздничная", "тёплая", "весенняя"],
    bestFor: ["Наурыз", "8 марта", "маме"],
    image: "https://images.unsplash.com/photo-1493540447904-49763eecf55f?w=900&auto=format&fit=crop&q=80",
  },
];

export type GiftAddon = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export const GIFT_ADDONS: GiftAddon[] = [
  { id: "card", name: "Открытка с рукописным текстом", price: 1500, description: "Каллиграф напишет ваше послание от руки" },
  { id: "chocolate-small", name: "Бельгийский шоколад Godiva, 100г", price: 4500, description: "Маленькая коробочка пралине" },
  { id: "chocolate-big", name: "Бельгийский шоколад Godiva, 250г", price: 9500, description: "Большой ассорти-бокс" },
  { id: "macarons", name: "Макаруны Ladurée, 6 шт", price: 6500, description: "Французские макаруны" },
  { id: "raffaello", name: "Raffaello T15", price: 2900, description: "Классика, всегда в тему" },
  { id: "perfume-mini", name: "Миниатюра нишевого парфюма", price: 12000, description: "10мл — на пробу" },
  { id: "teddy-small", name: "Плюшевый мишка 30см", price: 5500, description: "Для романтичных и юных" },
  { id: "wine", name: "Просекко Mionetto", price: 9500, description: "Если она пьёт игристое" },
  { id: "balloons", name: "Шарики «I love you», 5 шт", price: 4500, description: "Для wow-эффекта при доставке" },
];

/**
 * Готовые букеты в виде текста для системного промпта Gemini.
 */
export function bouquetsToPromptContext(): string {
  const lines: string[] = [
    "=== ГОТОВЫЕ БУКЕТЫ МАГАЗИНА (с фото для клиента) ===",
    "AI должен предлагать ИМЕННО ИЗ ЭТОГО СПИСКА — у каждого есть готовое фото и оптовая цена.",
    "Используй id букета в служебной метке [BOUQUET:id|stems|price] (где id = id букета, stems = суммарное число цветов, price = price букета).",
    "",
  ];
  for (const b of BOUQUETS) {
    const compositionTxt = b.composition
      .map((c) => `${c.count}шт цветка #${c.stemId}`)
      .join(" + ");
    const totalStems = b.composition.reduce((sum, c) => sum + c.count, 0);
    lines.push(
      `• [${b.id}] «${b.name}» (${b.category}) — ${b.description}
  Состав: ${compositionTxt} (всего ${totalStems} стеблей).
  Цена: ${b.price.toLocaleString("ru-RU")} ₸.
  Подходит: ${b.bestFor.join(", ")}.
  Образ: ${b.vibe.join(", ")}.`,
    );
  }

  lines.push("");
  lines.push("=== ДОПОЛНЕНИЯ К БУКЕТАМ ===");
  for (const a of GIFT_ADDONS) {
    lines.push(`• [${a.id}] ${a.name} — ${a.price.toLocaleString("ru-RU")} ₸ (${a.description})`);
  }
  return lines.join("\n");
}
