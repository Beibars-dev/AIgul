import Link from "next/link";
import { Flower2, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-cream-200 bg-white/40 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rose-custom to-rose-deep text-white">
                <Flower2 className="h-4 w-4" />
              </span>
              <span className="font-serif text-xl font-semibold">AIgul</span>
            </Link>
            <p className="mt-3 text-sm text-foreground/60">
              AI-флорист, который понимает мужчин и подбирает идеальные букеты для их женщин.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/60">
              Магазин
            </h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><Link href="/catalog" className="hover:text-rose-deep">Каталог</Link></li>
              <li><Link href="/#chat" className="hover:text-rose-deep">AI-помощник</Link></li>
              <li><Link href="/checkout" className="hover:text-rose-deep">Оформить заказ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/60">
              Контакты
            </h4>
            <ul className="space-y-2.5 text-sm text-foreground/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-rose-deep" />
                +7 (727) 000-00-00
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-deep" />
                Алматы, ул. Достык 89
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-rose-deep" />
                Ежедневно 9:00 – 22:00
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/60">
              Доставка
            </h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>Алматы — 90 минут</li>
              <li>Бесплатно от 10 000 ₸</li>
              <li>Kaspi Pay · Карта · Наличные</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-cream-200 pt-6 text-center text-xs text-foreground/40">
          © 2026 AIgul · Сделано с любовью в Алматы · Powered by Google Gemini
        </div>
      </div>
    </footer>
  );
}
