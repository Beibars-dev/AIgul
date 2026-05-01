"use client";

import { motion } from "framer-motion";
import { MessagesSquare, Heart, Truck } from "lucide-react";

const steps = [
  {
    icon: MessagesSquare,
    title: "Расскажи о ней",
    text: "AI задаст пару вопросов: повод, сколько вы вместе, её вайб. Без анкет на 10 страниц.",
  },
  {
    icon: Heart,
    title: "Получи персональный букет",
    text: "Не «вот вам каталог», а конкретная рекомендация с объяснением — почему именно это.",
  },
  {
    icon: Truck,
    title: "Оформи за 30 секунд",
    text: "AI сам заполнит данные. Курьер привезёт за 90 минут, оплата Kaspi или карта.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-4xl font-semibold md:text-5xl">
            Как это работает
          </h2>
          <p className="mt-4 text-foreground/60">
            Мы не очередной интернет-магазин с 500 SKU. Мы — твой персональный флорист в кармане.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-card relative p-8"
              >
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-rose-custom/20 to-accent-gold/20">
                  <Icon className="h-7 w-7 text-rose-deep" />
                </div>
                <span className="absolute right-6 top-6 font-serif text-5xl font-semibold text-foreground/10">
                  0{i + 1}
                </span>
                <h3 className="font-serif text-2xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-foreground/60 leading-relaxed">{step.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
