"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles, Brain } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUserId } from "@/lib/use-user-id";

type FormState = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  recipientName: string;
  recipientPhone: string;
  city: string;
  address: string;
  date: string;
  time: string;
  cardMessage: string;
  bouquetSummary: string;
};

const today = new Date().toISOString().slice(0, 10);

const TIME_SLOTS = [
  "10:00 – 12:00",
  "12:00 – 14:00",
  "14:00 – 16:00",
  "16:00 – 18:00",
  "18:00 – 20:00",
  "20:00 – 22:00",
];

export default function CheckoutPage() {
  const userId = useUserId();
  const [form, setForm] = useState<FormState>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    recipientName: "",
    recipientPhone: "",
    city: "Алматы",
    address: "",
    date: today,
    time: TIME_SLOTS[2],
    cardMessage: "",
    bouquetSummary: "",
  });
  const [chatContext, setChatContext] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ orderId: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autofilled, setAutofilled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = localStorage.getItem("aigul_chat_context") ?? "";
      setChatContext(ctx);
      const lastAssistantBlock = ctx
        .split("\n\n")
        .reverse()
        .find((b) => b.startsWith("AI-флорист:"));
      if (lastAssistantBlock) {
        setForm((prev) => ({
          ...prev,
          bouquetSummary: lastAssistantBlock.replace("AI-флорист:", "").trim().slice(0, 400),
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/memory?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.hasMemory) return;
        let didFill = false;
        setForm((prev) => {
          const next = { ...prev };
          if (data.profile?.name && !next.customerName) {
            next.customerName = data.profile.name;
            didFill = true;
          }
          if (data.profile?.phone && !next.customerPhone) {
            next.customerPhone = data.profile.phone;
            didFill = true;
          }
          if (data.profile?.email && !next.customerEmail) {
            next.customerEmail = data.profile.email;
            didFill = true;
          }
          if (data.lastOrder?.recipientName && !next.recipientName) {
            next.recipientName = data.lastOrder.recipientName;
            didFill = true;
          }
          return next;
        });
        if (didFill) setAutofilled(true);
      })
      .catch(() => {});
  }, [userId]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          customer: {
            name: form.customerName,
            phone: form.customerPhone,
            email: form.customerEmail,
          },
          recipient: {
            name: form.recipientName,
            phone: form.recipientPhone,
            address: form.address,
            city: form.city,
          },
          delivery: { date: form.date, time: form.time },
          cardMessage: form.cardMessage,
          bouquetSummary: form.bouquetSummary,
          conversationContext: chatContext,
          total: 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess({ orderId: data.orderId, message: data.message });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Не удалось оформить заказ");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-sage-200">
            <Check className="h-10 w-10 text-sage-800" />
          </div>
          <h1 className="mt-6 font-serif text-4xl font-semibold md:text-5xl">
            Заказ принят!
          </h1>
          <p className="mt-4 text-foreground/70">{success.message}</p>
          <p className="mt-2 text-sm text-foreground/50">
            Номер заказа: <span className="font-mono text-foreground">{success.orderId}</span>
          </p>
          <Link href="/" className="btn-primary mt-8">
            На главную
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="mx-auto max-w-5xl px-6 pt-12 pb-20">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-rose-deep"
        >
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>

        <h1 className="font-serif text-5xl font-semibold tracking-tight md:text-6xl">
          Оформление заказа
        </h1>
        <p className="mt-3 max-w-xl text-foreground/60">
          {chatContext
            ? "Мы автоматически перенесли контекст из чата с Айгуль ниже. Проверьте и заполните данные доставки."
            : "Заполните данные — менеджер свяжется с вами в течение 5 минут."}
        </p>

        {autofilled && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-rose-custom/30 bg-rose-custom/10 px-3.5 py-1.5 text-xs text-rose-deep">
            <Brain className="h-3.5 w-3.5" />
            Часть полей заполнена из вашего профиля — отредактируйте, если нужно
          </div>
        )}

        <form onSubmit={submit} className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="glass-card p-6 md:p-8">
              <h2 className="font-serif text-2xl font-semibold">Ваши данные</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/70">
                    Имя <span className="text-rose-deep">*</span>
                  </label>
                  <input
                    required
                    value={form.customerName}
                    onChange={(e) => update("customerName", e.target.value)}
                    className="input-field"
                    placeholder="Алмас"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/70">
                    Телефон <span className="text-rose-deep">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => update("customerPhone", e.target.value)}
                    className="input-field"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-foreground/70">
                    Email (для чека)
                  </label>
                  <input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => update("customerEmail", e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="glass-card p-6 md:p-8">
              <h2 className="font-serif text-2xl font-semibold">Кому доставить</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/70">
                    Имя получателя
                  </label>
                  <input
                    value={form.recipientName}
                    onChange={(e) => update("recipientName", e.target.value)}
                    className="input-field"
                    placeholder="Анна"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/70">
                    Телефон получателя
                  </label>
                  <input
                    type="tel"
                    value={form.recipientPhone}
                    onChange={(e) => update("recipientPhone", e.target.value)}
                    className="input-field"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/70">
                    Город
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className="input-field"
                  >
                    <option>Алматы</option>
                    <option>Астана</option>
                    <option>Шымкент</option>
                    <option>Караганда</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/70">
                    Адрес <span className="text-rose-deep">*</span>
                  </label>
                  <input
                    required
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className="input-field"
                    placeholder="ул. Достык 89, кв. 12"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/70">
                    Дата
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/70">
                    Время
                  </label>
                  <select
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                    className="input-field"
                  >
                    {TIME_SLOTS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-foreground/70">
                    Текст открытки (необязательно)
                  </label>
                  <textarea
                    rows={3}
                    value={form.cardMessage}
                    onChange={(e) => update("cardMessage", e.target.value)}
                    className="input-field resize-none"
                    placeholder="Прости меня. Ты — лучшее, что со мной случилось."
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="glass-card sticky top-24 p-6">
              <div className="flex items-center gap-2 text-rose-deep">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Рекомендация Айгуль
                </span>
              </div>
              <textarea
                rows={8}
                value={form.bouquetSummary}
                onChange={(e) => update("bouquetSummary", e.target.value)}
                placeholder="Опишите букет или скопируйте рекомендацию из чата с AI-флористом"
                className="input-field mt-3 resize-none text-sm"
              />
              {!chatContext && (
                <Link
                  href="/#chat"
                  className="mt-3 block text-center text-xs text-rose-deep hover:underline"
                >
                  Получить рекомендацию AI →
                </Link>
              )}

              {error && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary mt-5 w-full"
              >
                {submitting ? "Отправляем…" : "Подтвердить заказ"}
              </button>

              <p className="mt-3 text-center text-[11px] text-foreground/40">
                Нажимая «Подтвердить», вы соглашаетесь с правилами магазина.
                Менеджер свяжется в течение 5 минут.
              </p>
            </div>
          </aside>
        </form>
      </section>

      <Footer />
    </main>
  );
}
