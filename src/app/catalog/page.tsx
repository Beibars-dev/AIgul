"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FLOWERS, FlowerProduct } from "@/lib/knowledge-base";

const CATEGORIES = [
  { id: "all", label: "Все" },
  { id: "пионы", label: "Пионы" },
  { id: "розы", label: "Розы" },
  { id: "тюльпаны", label: "Тюльпаны" },
  { id: "композиции", label: "Композиции" },
  { id: "альстромерии", label: "Альстромерии" },
  { id: "экзотика", label: "Экзотика" },
];

function priceRange(f: FlowerProduct) {
  const prices = f.bouquetPrices.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return `${min.toLocaleString("ru-RU")} ₸`;
  return `${min.toLocaleString("ru-RU")} – ${max.toLocaleString("ru-RU")} ₸`;
}

export default function CatalogPage() {
  const [active, setActive] = useState("all");
  const filtered =
    active === "all" ? FLOWERS : FLOWERS.filter((f) => f.category === active);

  return (
    <main className="min-h-screen">
      <Header />

      <section className="mx-auto max-w-7xl px-6 pt-12 pb-20">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-rose-deep"
        >
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-serif text-5xl font-semibold tracking-tight md:text-6xl">
              Каталог
            </h1>
            <p className="mt-3 max-w-xl text-foreground/60">
              Не уверены, что выбрать? Лучше{" "}
              <Link href="/#chat" className="text-rose-deep underline-offset-4 hover:underline">
                спросите AI-флориста
              </Link>{" "}
              — она подберёт под вашу ситуацию.
            </p>
          </div>

          <Link href="/#chat" className="btn-primary">
            <Sparkles className="h-4 w-4" />
            Помоги выбрать
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                active === c.id
                  ? "bg-rose-deep text-white shadow-md"
                  : "bg-white/70 text-foreground/70 hover:bg-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f, i) => (
            <motion.article
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group glass-card overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
                <Image
                  src={f.image}
                  alt={f.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-wider text-foreground/70 backdrop-blur-sm">
                  {f.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl font-semibold leading-tight">
                  {f.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-foreground/60">
                  {f.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {f.vibe.slice(0, 3).map((v) => (
                    <span
                      key={v}
                      className="rounded-full bg-sage-50 px-2.5 py-1 text-[11px] text-sage-800"
                    >
                      {v}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-foreground/50">от</p>
                    <p className="font-serif text-2xl font-semibold text-rose-deep">
                      {priceRange(f)}
                    </p>
                  </div>
                  <Link
                    href="/#chat"
                    className="rounded-full border border-rose-deep px-4 py-2 text-xs font-medium text-rose-deep transition-all hover:bg-rose-deep hover:text-white"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
