/**
 * База знаний цветочного магазина "AIgul"
 * Используется для RAG-обогащения системного промпта Gemini.
 * Магазин может выгружать сюда актуальные данные из своей CRM.
 */

export type FlowerProduct = {
  id: string;
  name: string;
  category: "розы" | "пионы" | "тюльпаны" | "хризантемы" | "альстромерии" | "композиции" | "экзотика";
  colors: string[];
  pricePerStem?: number;
  bouquetPrices: { stems: number; price: number }[];
  description: string;
  meaning: string;
  bestFor: string[];
  vibe: string[];
  image: string;
};

export type GiftAddon = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type OccasionGuide = {
  occasion: string;
  recommendations: string[];
  avoid?: string[];
  tone: string;
};

export const FLOWERS: FlowerProduct[] = [
  {
    id: "white-peonies",
    name: "Белые пионы",
    category: "пионы",
    colors: ["белый"],
    bouquetPrices: [
      { stems: 7, price: 9500 },
      { stems: 11, price: 14500 },
      { stems: 15, price: 19500 },
      { stems: 25, price: 32000 },
    ],
    description:
      "Нежные, пышные белые пионы — символ искренности, чистоты и нового начала. Идеально для извинений и примирения.",
    meaning: "примирение, искренность, чистые намерения, обновление",
    bestFor: ["извинения", "примирение", "годовщина", "первое свидание"],
    vibe: ["нежная", "романтичная", "элегантная", "классическая"],
    image:
      "https://images.unsplash.com/photo-1530092285049-1c42085fd395?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "pink-peonies",
    name: "Розовые пионы",
    category: "пионы",
    colors: ["розовый", "пыльно-розовый"],
    bouquetPrices: [
      { stems: 7, price: 11000 },
      { stems: 11, price: 16500 },
      { stems: 15, price: 22000 },
      { stems: 25, price: 35000 },
    ],
    description:
      "Роскошные розовые пионы — самый «вау-эффект» среди цветов. Любимый цветок большинства девушек.",
    meaning: "счастливый брак, нежность, женственность",
    bestFor: ["день рождения", "годовщина", "8 марта", "просто так"],
    vibe: ["нежная", "женственная", "романтичная"],
    image:
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "red-roses",
    name: "Красные розы (премиум, Эквадор)",
    category: "розы",
    colors: ["красный"],
    pricePerStem: 750,
    bouquetPrices: [
      { stems: 11, price: 8500 },
      { stems: 15, price: 11500 },
      { stems: 25, price: 18500 },
      { stems: 51, price: 37000 },
      { stems: 101, price: 72000 },
    ],
    description:
      "Классические красные розы Freedom 70-80см. Символ страстной любви и серьёзных чувств.",
    meaning: "страстная любовь, верность, серьёзные намерения",
    bestFor: ["день влюблённых", "признание в любви", "годовщина свадьбы", "предложение"],
    vibe: ["страстная", "классическая", "уверенная"],
    image:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "white-roses",
    name: "Белые розы",
    category: "розы",
    colors: ["белый"],
    pricePerStem: 700,
    bouquetPrices: [
      { stems: 11, price: 7900 },
      { stems: 15, price: 10500 },
      { stems: 25, price: 17500 },
      { stems: 51, price: 35000 },
    ],
    description:
      "Утончённые белые розы — символ чистоты и невинности чувств. Часто выбирают на свадьбы.",
    meaning: "чистая любовь, начало, духовность",
    bestFor: ["свадьба", "знакомство с родителями", "извинения"],
    vibe: ["элегантная", "сдержанная", "классическая"],
    image:
      "https://images.unsplash.com/photo-1454262041357-5d96f50a2f27?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "pastel-tulips",
    name: "Пастельные тюльпаны",
    category: "тюльпаны",
    colors: ["белый", "розовый", "персиковый", "сиреневый"],
    pricePerStem: 350,
    bouquetPrices: [
      { stems: 25, price: 7500 },
      { stems: 51, price: 14500 },
      { stems: 101, price: 27000 },
    ],
    description:
      "Свежие голландские тюльпаны в пастельной гамме. Лёгкий, весенний и не банальный выбор.",
    meaning: "молодая любовь, нежность, весна, новые начала",
    bestFor: ["8 марта", "первое свидание", "просто так", "молодая девушка"],
    vibe: ["лёгкая", "молодая", "весенняя", "позитивная"],
    image:
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "hydrangea-bouquet",
    name: "Композиция с гортензией",
    category: "композиции",
    colors: ["голубой", "белый", "сиреневый"],
    bouquetPrices: [
      { stems: 1, price: 12500 },
      { stems: 3, price: 24000 },
    ],
    description:
      "Авторская композиция с гортензией, эвкалиптом и хлопком в стильной шляпной коробке.",
    meaning: "благодарность, искренность, глубокие чувства",
    bestFor: ["годовщина", "извинения", "женщина 30+", "руководительница"],
    vibe: ["статусная", "элегантная", "минималистичная", "стильная"],
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "wildflower-mix",
    name: "Полевой микс",
    category: "композиции",
    colors: ["разноцветный"],
    bouquetPrices: [
      { stems: 1, price: 6500 },
      { stems: 1, price: 9500 },
      { stems: 1, price: 13500 },
    ],
    description:
      "Душевный букет из ромашек, лаванды, лизиантуса и сезонных полевых цветов. Для творческих и природных натур.",
    meaning: "лёгкость, искренность, простая радость",
    bestFor: ["просто так", "девушка-художница", "девушка 18-25", "первое свидание"],
    vibe: ["бохо", "творческая", "лёгкая", "натуральная"],
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "alstroemeria",
    name: "Альстромерии микс",
    category: "альстромерии",
    colors: ["разноцветный"],
    pricePerStem: 600,
    bouquetPrices: [
      { stems: 11, price: 6500 },
      { stems: 15, price: 8900 },
      { stems: 25, price: 14500 },
    ],
    description:
      "Долгожитель среди букетов — стоят до 3 недель. Бюджетный, но очень красивый вариант.",
    meaning: "дружба, преданность, тёплые чувства",
    bestFor: ["просто так", "коллеге", "маме", "ограниченный бюджет"],
    vibe: ["дружеская", "тёплая", "повседневная"],
    image:
      "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "exotic-orchids",
    name: "Орхидеи Cymbidium",
    category: "экзотика",
    colors: ["зелёный", "белый", "розовый"],
    pricePerStem: 2500,
    bouquetPrices: [
      { stems: 5, price: 14500 },
      { stems: 7, price: 19500 },
      { stems: 11, price: 29500 },
    ],
    description:
      "Экзотические орхидеи для девушек, которые ценят необычное и не любят «как у всех».",
    meaning: "роскошь, уникальность, утончённый вкус",
    bestFor: ["девушка с характером", "fashion-индустрия", "годовщина", "статусный жест"],
    vibe: ["статусная", "необычная", "fashion", "минималистичная"],
    image:
      "https://images.unsplash.com/photo-1567748157439-651aca2ff064?w=800&auto=format&fit=crop&q=80",
  },
];

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
    almaty: "Бесплатная доставка по Алматы при заказе от 10 000 ₸. До 15 000 ₸ — 1500 ₸. Доставка за 90 минут.",
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
  "Один цветок — это не «дёшево», а интимно. Один пион стоит 1500₸ и смотрится сильнее, чем 11 ромашек",
];

/**
 * Сборка контекста для системного промпта.
 * В реальности здесь можно делать векторный поиск, но для MVP передаём всю базу —
 * она компактная и Gemini 1.5/2.0 справится с контекстом.
 */
export function buildKnowledgeContext(): string {
  const flowersText = FLOWERS.map((f) => {
    const prices = f.bouquetPrices
      .map((p) => `${p.stems} шт — ${p.price.toLocaleString("ru-RU")} ₸`)
      .join(", ");
    return `• ${f.name} [${f.category}] — ${f.description}
  Цвета: ${f.colors.join(", ")}. Значение: ${f.meaning}.
  Подходит: ${f.bestFor.join(", ")}.
  Образ: ${f.vibe.join(", ")}.
  Цены: ${prices}.`;
  }).join("\n\n");

  const addonsText = GIFT_ADDONS.map(
    (a) => `• ${a.name} — ${a.price.toLocaleString("ru-RU")} ₸ (${a.description})`,
  ).join("\n");

  const occasionsText = OCCASIONS_GUIDE.map(
    (o) =>
      `▸ ${o.occasion.toUpperCase()}\n  Рекомендации:\n  ${o.recommendations.map((r) => `- ${r}`).join("\n  ")}\n  Тон подачи: ${o.tone}${o.avoid ? `\n  Избегать: ${o.avoid.join(", ")}` : ""}`,
  ).join("\n\n");

  const rulesText = FLOWER_RULES.map((r, i) => `${i + 1}. ${r}`).join("\n");

  return `=== АКТУАЛЬНЫЙ КАТАЛОГ МАГАЗИНА AIGUL (Алматы) ===

${flowersText}

=== ДОПОЛНЕНИЯ К БУКЕТАМ ===

${addonsText}

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
