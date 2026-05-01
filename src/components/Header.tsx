"use client";

import Link from "next/link";
import { Flower2, ShoppingBag } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-cream-50/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose-custom to-rose-deep text-white shadow-lg shadow-rose-custom/30 transition-transform group-hover:rotate-12">
            <Flower2 className="h-5 w-5" />
          </span>
          <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            AIgul
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#chat"
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-rose-deep"
          >
            AI-помощник
          </Link>
          <Link
            href="/catalog"
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-rose-deep"
          >
            Каталог
          </Link>
          <Link
            href="/#how"
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-rose-deep"
          >
            Как это работает
          </Link>
          <Link
            href="/checkout"
            className="btn-primary !py-2 !px-5 !text-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            Оформить
          </Link>
        </nav>
      </div>
    </header>
  );
}
