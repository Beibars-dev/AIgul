"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Truck } from "lucide-react";
import { FLOWERS, GIFT_ADDONS } from "@/lib/knowledge-base";
import type { ParsedBouquet, ParsedAddon } from "@/lib/message-parser";

type Props = {
  bouquet: ParsedBouquet;
  addon?: ParsedAddon;
  onCheckout?: () => void;
};

export default function BouquetCard({ bouquet, addon, onCheckout }: Props) {
  const flower = FLOWERS.find((f) => f.id === bouquet.flowerId);
  if (!flower) return null;

  const addonData = addon
    ? GIFT_ADDONS.find((a) => a.id === addon.addonId)
    : null;

  const total = bouquet.price + (addonData?.price ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="my-3 overflow-hidden rounded-3xl border border-rose-custom/20 bg-white shadow-xl shadow-rose-deep/10"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream-100">
        <Image
          src={flower.image}
          alt={flower.name}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-rose-deep shadow-sm backdrop-blur">
          <Sparkles className="h-3 w-3" />
          Рекомендация Айгуль
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-foreground/85 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {flower.category}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-2xl font-semibold leading-tight">
          {flower.name}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm text-foreground/60">
            {bouquet.stems} {pluralStems(bouquet.stems)}
          </span>
          <span className="text-foreground/30">·</span>
          <span className="font-serif text-2xl font-semibold text-rose-deep">
            {bouquet.price.toLocaleString("ru-RU")} ₸
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-foreground/70">
          {flower.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {flower.vibe.slice(0, 4).map((v) => (
            <span
              key={v}
              className="rounded-full bg-sage-50 px-2.5 py-1 text-[11px] text-sage-800"
            >
              {v}
            </span>
          ))}
        </div>

        {addonData && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <div>
                <p className="text-sm font-medium leading-tight">
                  {addonData.name}
                </p>
                <p className="text-[11px] text-foreground/60">
                  {addonData.description}
                </p>
              </div>
            </div>
            <span className="whitespace-nowrap text-sm font-semibold text-rose-deep">
              +{addonData.price.toLocaleString("ru-RU")} ₸
            </span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-cream-200 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-foreground/50">
              Итого
            </p>
            <p className="font-serif text-2xl font-semibold">
              {total.toLocaleString("ru-RU")} ₸
            </p>
          </div>
          <Link
            href="/checkout"
            onClick={onCheckout}
            className="btn-primary !py-2.5 !px-5 !text-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            Заказать
          </Link>
        </div>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-foreground/40">
          <Truck className="h-3 w-3" />
          Бесплатная доставка по Алматы за 90 минут
        </p>
      </div>
    </motion.div>
  );
}

function pluralStems(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "цветок";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "цветка";
  return "цветков";
}
