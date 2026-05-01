/**
 * Memory layer для AI-агента.
 *
 * Хранит на сервере:
 *  • Профиль клиента (имя, телефон, email)
 *  • Историю всех чатов (по сессиям)
 *  • Историю заказов
 *
 * Реализация для MVP — file-based JSON в папке data/memories/.
 * Для production-деплоя на Vercel используйте Vercel KV / Upstash Redis / Postgres
 * (serverless ФС read-only кроме /tmp).
 */

import fs from "node:fs/promises";
import path from "node:path";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  ts: string;
};

export type ChatSession = {
  id: string;
  startedAt: string;
  updatedAt: string;
  messages: ChatTurn[];
};

export type SavedOrder = {
  orderId: string;
  createdAt: string;
  bouquetSummary: string;
  recipientName?: string;
  recipientAddress?: string;
  occasion?: string;
  total?: number;
  cardMessage?: string;
};

export type ClientProfile = {
  name?: string;
  phone?: string;
  email?: string;
  /** Свободные факты о клиенте, которые AI может извлекать (любимые цветы, имя девушки и т.д.) */
  knownFacts?: string[];
};

export type UserMemory = {
  userId: string;
  profile: ClientProfile;
  sessions: ChatSession[];
  orders: SavedOrder[];
  createdAt: string;
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data", "memories");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function memoryPath(userId: string) {
  // Защита от path traversal — userId должен быть UUID-подобным
  const safe = userId.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!safe || safe.length < 8) throw new Error("Невалидный userId");
  return path.join(DATA_DIR, `${safe}.json`);
}

function emptyMemory(userId: string): UserMemory {
  const now = new Date().toISOString();
  return {
    userId,
    profile: {},
    sessions: [],
    orders: [],
    createdAt: now,
    updatedAt: now,
  };
}

export async function getMemory(userId: string): Promise<UserMemory> {
  await ensureDir();
  try {
    const raw = await fs.readFile(memoryPath(userId), "utf8");
    return JSON.parse(raw) as UserMemory;
  } catch {
    return emptyMemory(userId);
  }
}

async function writeMemory(memory: UserMemory): Promise<void> {
  await ensureDir();
  memory.updatedAt = new Date().toISOString();
  await fs.writeFile(
    memoryPath(memory.userId),
    JSON.stringify(memory, null, 2),
    "utf8",
  );
}

export async function appendChatTurn(
  userId: string,
  isNewSession: boolean,
  turn: ChatTurn,
): Promise<UserMemory> {
  const memory = await getMemory(userId);
  const now = new Date().toISOString();

  if (isNewSession || memory.sessions.length === 0) {
    memory.sessions.push({
      id: `s-${Date.now().toString(36)}`,
      startedAt: now,
      updatedAt: now,
      messages: [turn],
    });
  } else {
    const last = memory.sessions[memory.sessions.length - 1];
    last.messages.push(turn);
    last.updatedAt = now;
  }

  // Оставляем максимум 30 последних сессий, чтобы файл не разрастался
  if (memory.sessions.length > 30) {
    memory.sessions = memory.sessions.slice(-30);
  }
  await writeMemory(memory);
  return memory;
}

export async function appendOrder(
  userId: string,
  order: SavedOrder,
  profileUpdate?: Partial<ClientProfile>,
): Promise<UserMemory> {
  const memory = await getMemory(userId);
  memory.orders.push(order);
  if (profileUpdate) {
    memory.profile = { ...memory.profile, ...profileUpdate };
  }
  await writeMemory(memory);
  return memory;
}

export async function updateProfile(
  userId: string,
  patch: Partial<ClientProfile>,
): Promise<UserMemory> {
  const memory = await getMemory(userId);
  memory.profile = { ...memory.profile, ...patch };
  await writeMemory(memory);
  return memory;
}

export async function clearMemory(userId: string): Promise<void> {
  try {
    await fs.unlink(memoryPath(userId));
  } catch {
    // нет файла — нечего удалять
  }
}

/**
 * Подготовка короткой выжимки памяти, которая инжектится в системный промпт.
 * Не передаём в Gemini весь raw-историю — а только: профиль, last 3 заказа, summary прошлых сессий.
 */
export function summarizeMemoryForPrompt(memory: UserMemory): string | null {
  const hasAnything =
    Object.values(memory.profile).some(Boolean) ||
    memory.orders.length > 0 ||
    memory.sessions.length > 1;

  if (!hasAnything) return null;

  const lines: string[] = ["=== ПАМЯТЬ О ЭТОМ КЛИЕНТЕ ==="];
  lines.push(
    "Это НЕ первый разговор. Используй информацию ниже, чтобы персонализировать ответы — поприветствуй по имени, ссылайся на прошлые заказы, помни предпочтения.",
  );

  const p = memory.profile;
  if (p.name || p.phone || (p.knownFacts && p.knownFacts.length > 0)) {
    lines.push("\n• Профиль клиента:");
    if (p.name) lines.push(`  - Имя: ${p.name}`);
    if (p.phone) lines.push(`  - Телефон: ${p.phone}`);
    if (p.email) lines.push(`  - Email: ${p.email}`);
    if (p.knownFacts && p.knownFacts.length > 0) {
      lines.push(`  - Известные факты: ${p.knownFacts.join("; ")}`);
    }
  }

  if (memory.orders.length > 0) {
    lines.push(`\n• Прошлые заказы (${memory.orders.length} шт., последние ${Math.min(5, memory.orders.length)}):`);
    const recent = memory.orders.slice(-5).reverse();
    for (const o of recent) {
      const date = new Date(o.createdAt).toLocaleDateString("ru-RU");
      const recipient = o.recipientName ? ` для «${o.recipientName}»` : "";
      const total = o.total ? `, ${o.total.toLocaleString("ru-RU")} ₸` : "";
      const occ = o.occasion ? ` (${o.occasion})` : "";
      lines.push(`  - ${date}${recipient}${occ}: ${o.bouquetSummary.slice(0, 120)}${total}`);
    }
  }

  // Прошлые сессии (кроме текущей последней) — короткое описание
  const pastSessions = memory.sessions.slice(0, -1);
  if (pastSessions.length > 0) {
    lines.push(`\n• Предыдущие диалоги (${pastSessions.length}):`);
    const recent = pastSessions.slice(-3).reverse();
    for (const s of recent) {
      const date = new Date(s.startedAt).toLocaleDateString("ru-RU");
      const firstUserMsg = s.messages.find((m) => m.role === "user");
      const lastAssistantMsg = [...s.messages].reverse().find((m) => m.role === "assistant");
      const userPart = firstUserMsg
        ? firstUserMsg.content.slice(0, 100).replace(/\n/g, " ")
        : "(нет сообщений)";
      const aiPart = lastAssistantMsg
        ? " → AI рекомендовал: " + lastAssistantMsg.content.slice(0, 120).replace(/\n/g, " ")
        : "";
      lines.push(`  - ${date}: «${userPart}»${aiPart}`);
    }
  }

  lines.push(
    "\nКАК ИСПОЛЬЗОВАТЬ ЭТУ ПАМЯТЬ:",
    "- Если знаешь имя клиента — поприветствуй по имени.",
    "- Если у клиента уже были заказы для конкретной девушки/мамы — переспроси: «Снова для Анны?»",
    "- Не предлагай те же букеты, что заказывал недавно — предлагай разнообразие.",
    "- Если повод повторяется (ссора, годовщина) — мягко обрати внимание, но без осуждения.",
  );

  return lines.join("\n");
}
