"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-rose-custom/30 blur-3xl animate-float" />
        <div className="absolute right-[5%] top-[40%] h-96 w-96 rounded-full bg-accent-gold/20 blur-3xl animate-float [animation-delay:2s]" />
        <div className="absolute left-[40%] bottom-[10%] h-80 w-80 rounded-full bg-sage-200/40 blur-3xl animate-float [animation-delay:4s]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-custom/30 bg-white/60 px-4 py-1.5 text-sm font-medium text-rose-deep backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4" />
          AI-флорист на базе Google Gemini
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl"
        >
          Не знаешь, какие <br />
          <span className="text-gradient-rose italic">цветы</span> ей подарить?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-7 max-w-2xl text-lg text-foreground/70 md:text-xl"
        >
          Расскажи AI-флористу пару деталей о вашей истории — и через минуту получишь
          персональный букет, который точно её зацепит. Никакой банальщины.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a href="#chat" className="btn-primary text-base">
            <Sparkles className="h-4 w-4" />
            Поговорить с AI-флористом
          </a>
          <a href="/catalog" className="btn-secondary text-base">
            Посмотреть каталог
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-12 text-sm text-foreground/60"
        >
          <div className="flex flex-col items-center">
            <span className="font-serif text-3xl font-semibold text-foreground">2 мин</span>
            <span className="mt-1">подбор букета</span>
          </div>
          <div className="h-12 w-px bg-foreground/10" />
          <div className="flex flex-col items-center">
            <span className="font-serif text-3xl font-semibold text-foreground">90 мин</span>
            <span className="mt-1">доставка по Алматы</span>
          </div>
          <div className="hidden h-12 w-px bg-foreground/10 sm:block" />
          <div className="hidden flex-col items-center sm:flex">
            <span className="font-serif text-3xl font-semibold text-foreground">100%</span>
            <span className="mt-1">гарантия замены</span>
          </div>
        </motion.div>

        <motion.a
          href="#chat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 inline-flex flex-col items-center gap-2 text-foreground/40 hover:text-rose-deep"
        >
          <span className="text-xs uppercase tracking-widest">начнём</span>
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
}
