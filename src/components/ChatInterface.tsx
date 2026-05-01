"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Flower2, ShoppingBag, RefreshCcw, Brain, Eraser } from "lucide-react";
import Link from "next/link";
import { useUserId } from "@/lib/use-user-id";
import { parseAssistantMessage, renderMarkdown } from "@/lib/message-parser";
import BouquetCard from "@/components/BouquetCard";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type MemoryInfo = {
  hasMemory: boolean;
  profile: { name?: string; phone?: string; email?: string };
  ordersCount: number;
  sessionsCount: number;
};

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Привет! Я Айгуль — ваш AI-флорист 🌸\n\nПомогу подобрать букет, который зайдёт ей по-настоящему. Расскажите, для какого повода нужны цветы? Или, если хотите, опишите ситуацию своими словами — например: «Поссорились, нужно мириться, бюджет 10к».",
};

const SUGGESTIONS = [
  "Блин, мы жестко поссорились, мне нужны цветы, чтобы извиниться, бюджет 10к тенге",
  "У нас годовщина, 2 года вместе. Хочу удивить",
  "Первое свидание, не хочу спугнуть",
  "Маме на день рождения, ей 55",
];

export default function ChatInterface() {
  const userId = useUserId();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memory, setMemory] = useState<MemoryInfo | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Подгружаем информацию о памяти, чтобы показать индикатор
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/memory?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.hasMemory) setMemory(data);
      })
      .catch(() => {});
  }, [userId]);

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    setError(null);
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка сервера");
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Что-то пошло не так";
      setError(errorMessage);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function reset() {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
  }

  async function forgetMe() {
    if (!userId) return;
    if (!confirm("Очистить всю память AI о вас (профиль, прошлые чаты, заказы)?")) return;
    await fetch(`/api/memory?userId=${encodeURIComponent(userId)}`, { method: "DELETE" });
    setMemory(null);
    reset();
  }

  function saveContextAndCheckout() {
    const context = messages
      .map((m) => `${m.role === "user" ? "Клиент" : "AI-флорист"}: ${m.content}`)
      .join("\n\n");
    if (typeof window !== "undefined") {
      localStorage.setItem("aigul_chat_context", context);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const showSuggestions = messages.length === 1 && !loading;
  const recommendationGiven = messages.length >= 4 && messages.some((m) =>
    m.role === "assistant" && (m.content.includes("💐") || m.content.toLowerCase().includes("предлагаю")),
  );

  return (
    <section id="chat" className="py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sage-200/40 px-3 py-1 text-xs font-medium uppercase tracking-wider text-sage-800">
            <Sparkles className="h-3 w-3" />
            Live AI Agent · с памятью
          </span>
          <h2 className="mt-4 font-serif text-4xl font-semibold md:text-5xl">
            Поговори с <span className="text-gradient-rose italic">Айгуль</span>
          </h2>
          <p className="mt-3 text-foreground/60">
            Она поймёт контекст, задаст правильные вопросы и подберёт именно то, что нужно.
          </p>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-cream-200/60 bg-white/60 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose-custom to-rose-deep text-white">
                  <Flower2 className="h-5 w-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-sage-400" />
              </div>
              <div>
                <p className="font-medium leading-tight">Айгуль</p>
                <p className="text-xs text-foreground/50">AI-флорист · онлайн</p>
              </div>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-foreground/60 transition-colors hover:bg-cream-100 hover:text-foreground"
              title="Начать новый диалог (память сохраняется)"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Новый диалог
            </button>
          </div>

          {memory && memory.hasMemory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center justify-between gap-3 border-b border-rose-custom/20 bg-rose-custom/10 px-5 py-2.5"
            >
              <div className="flex items-center gap-2 text-xs text-rose-deep">
                <Brain className="h-3.5 w-3.5" />
                <span className="font-medium">
                  {memory.profile.name ? `Помню вас, ${memory.profile.name}!` : "Я вас помню!"}
                </span>
                <span className="text-rose-deep/70">
                  · {memory.ordersCount} {memory.ordersCount === 1 ? "заказ" : "заказов"}
                  {memory.sessionsCount > 0 && ` · ${memory.sessionsCount} ${memory.sessionsCount === 1 ? "диалог" : "диалогов"}`}
                </span>
              </div>
              <button
                onClick={forgetMe}
                className="flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-rose-deep/70 transition-colors hover:bg-white/50 hover:text-rose-deep"
                title="Очистить память AI о вас"
              >
                <Eraser className="h-3 w-3" />
                Забыть меня
              </button>
            </motion.div>
          )}

          <div ref={scrollRef} className="h-[520px] overflow-y-auto px-5 py-6 md:px-8">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                if (msg.role === "user") {
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4 flex justify-end"
                    >
                      <div className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-md bg-rose-deep px-5 py-3 leading-relaxed text-white">
                        {msg.content}
                      </div>
                    </motion.div>
                  );
                }

                const parsed = parseAssistantMessage(msg.content);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 flex justify-start"
                  >
                    <div className="mr-2 mt-1 flex-shrink-0 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-rose-custom to-rose-deep text-white">
                      <Flower2 className="h-4 w-4" />
                    </div>
                    <div className="flex max-w-[85%] flex-col">
                      {parsed.text && (
                        <div
                          className="prose-aigul rounded-3xl rounded-bl-md bg-cream-100 px-5 py-3 leading-relaxed text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdown(parsed.text),
                          }}
                        />
                      )}
                      {parsed.bouquets.map((b, idx) => (
                        <BouquetCard
                          key={`${i}-b-${idx}`}
                          bouquet={b}
                          addon={parsed.addons[idx] ?? parsed.addons[0]}
                          onCheckout={saveContextAndCheckout}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 flex justify-start"
                >
                  <div className="mr-2 mt-1 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-rose-custom to-rose-deep text-white">
                    <Flower2 className="h-4 w-4" />
                  </div>
                  <div className="rounded-3xl rounded-bl-md bg-cream-100 px-5 py-4 text-rose-deep">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <div className="border-t border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          {showSuggestions && (
            <div className="border-t border-cream-200/60 bg-white/40 px-5 py-4">
              <p className="mb-3 text-xs uppercase tracking-wider text-foreground/50">
                Или начните с готового сценария:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-rose-custom/30 bg-white px-3.5 py-2 text-left text-xs text-foreground/80 transition-all hover:border-rose-custom hover:bg-rose-custom/5 hover:shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {recommendationGiven && (
            <div className="border-t border-sage-200/60 bg-sage-50 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-sage-800">
                  ✨ Готовы оформить заказ? Айгуль уже передаст контекст менеджеру.
                </p>
                <Link
                  href="/checkout"
                  onClick={saveContextAndCheckout}
                  className="btn-primary !py-2 !px-4 !text-sm"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Оформить
                </Link>
              </div>
            </div>
          )}

          <div className="border-t border-cream-200/60 bg-white/60 p-4">
            <div className="flex items-end gap-2 rounded-2xl border-2 border-cream-200 bg-white p-2 transition-colors focus-within:border-rose-custom">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Напишите Айгуль…"
                disabled={loading}
                className="flex-1 resize-none bg-transparent px-3 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none disabled:opacity-50"
                style={{ maxHeight: 120 }}
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="grid h-10 w-10 place-items-center rounded-full bg-rose-deep text-white shadow-md transition-all hover:bg-rose-custom hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Отправить"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 px-2 text-[11px] text-foreground/40">
              Powered by Google Gemini · Memory ON · Enter — отправить, Shift+Enter — новая строка
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
