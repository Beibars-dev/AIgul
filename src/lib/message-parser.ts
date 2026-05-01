import { FLOWERS, GIFT_ADDONS } from "./knowledge-base";

export type ParsedBouquet = {
  flowerId: string;
  stems: number;
  price: number;
};

export type ParsedAddon = {
  addonId: string;
  price: number;
};

export type ParsedMessage = {
  /** Текст без служебных меток */
  text: string;
  /** Извлечённые карточки букетов */
  bouquets: ParsedBouquet[];
  /** Извлечённые карточки дополнений */
  addons: ParsedAddon[];
};

const BOUQUET_RE = /\[BOUQUET:([a-z-]+)\|(\d+)\|(\d+)\]/gi;
const ADDON_RE = /\[ADDON:([a-z-]+)\|(\d+)\]/gi;

/**
 * Извлекает служебные метки из ответа AI и возвращает структурированные данные
 * для рендера красивых карточек товаров.
 */
export function parseAssistantMessage(raw: string): ParsedMessage {
  const bouquets: ParsedBouquet[] = [];
  const addons: ParsedAddon[] = [];

  Array.from(raw.matchAll(BOUQUET_RE)).forEach((m) => {
    const id = m[1];
    if (FLOWERS.some((f) => f.id === id)) {
      bouquets.push({
        flowerId: id,
        stems: parseInt(m[2], 10),
        price: parseInt(m[3], 10),
      });
    }
  });

  Array.from(raw.matchAll(ADDON_RE)).forEach((m) => {
    const id = m[1];
    if (GIFT_ADDONS.some((a) => a.id === id)) {
      addons.push({
        addonId: id,
        price: parseInt(m[2], 10),
      });
    }
  });

  const text = raw
    .replace(BOUQUET_RE, "")
    .replace(ADDON_RE, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { text, bouquets, addons };
}

/**
 * Лёгкий рендерер subset Markdown в безопасный HTML.
 * Поддерживает: **жирный**, *курсив*, `код`, переводы строк, маркированные списки.
 * Не используем react-markdown ради нулевых dep, текст приходит от Gemini, экранируем сами.
 */
export function renderMarkdown(text: string): string {
  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  let html = escapeHtml(text);

  // **bold** (нежадно, чтобы не схватить всё между двумя ** в разных местах)
  html = html.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>");
  // *italic*
  html = html.replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>");
  // `code`
  html = html.replace(
    /`([^`\n]+?)`/g,
    '<code class="rounded bg-cream-200/60 px-1 py-0.5 text-[0.85em]">$1</code>',
  );

  // Списки с маркером "- " или "• " или "* "
  const lines = html.split("\n");
  const out: string[] = [];
  let inList = false;
  for (const line of lines) {
    const m = line.match(/^\s*(?:[-•*])\s+(.*)$/);
    if (m) {
      if (!inList) {
        out.push('<ul class="my-1 ml-4 list-disc space-y-1">');
        inList = true;
      }
      out.push(`<li>${m[1]}</li>`);
    } else {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(line);
    }
  }
  if (inList) out.push("</ul>");

  return out.join("\n").replace(/\n/g, "<br />");
}
