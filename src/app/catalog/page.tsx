import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, FileSpreadsheet } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BOUQUETS } from "@/lib/knowledge-base";
import { getStems, type Stem } from "@/lib/excel-loader";
import CatalogTabs from "@/components/CatalogTabs";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const stems = await getStems();

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
              Готовые букеты и одиночные цветы. Не уверены, что выбрать?{" "}
              <Link href="/#chat" className="text-rose-deep underline-offset-4 hover:underline">
                Спросите AI-флориста
              </Link>{" "}
              — он подберёт под вашу ситуацию.
            </p>
            {stems.length > 0 && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sage-50 px-3 py-1 text-xs text-sage-800">
                <FileSpreadsheet className="h-3 w-3" />
                Каталог одиночных цветов загружен из Excel магазина · {stems.length} позиций
              </p>
            )}
          </div>

          <Link href="/#chat" className="btn-primary">
            <Sparkles className="h-4 w-4" />
            Помоги выбрать
          </Link>
        </div>

        <CatalogTabs
          bouquets={
            <BouquetsGrid />
          }
          stems={
            <StemsTable stems={stems} />
          }
        />
      </section>

      <Footer />
    </main>
  );
}

function BouquetsGrid() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {BOUQUETS.map((b) => (
        <article
          key={b.id}
          className="group glass-card overflow-hidden transition-all hover:shadow-2xl hover:shadow-rose-deep/10"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
            <Image
              src={b.image}
              alt={b.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-wider text-foreground/70 backdrop-blur-sm">
              {b.category}
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-serif text-2xl font-semibold leading-tight">{b.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-foreground/60">{b.description}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {b.vibe.slice(0, 3).map((v) => (
                <span key={v} className="rounded-full bg-sage-50 px-2.5 py-1 text-[11px] text-sage-800">
                  {v}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-end justify-between">
              <p className="font-serif text-2xl font-semibold text-rose-deep">
                {b.price.toLocaleString("ru-RU")} ₸
              </p>
              <Link
                href="/#chat"
                className="rounded-full border border-rose-deep px-4 py-2 text-xs font-medium text-rose-deep transition-all hover:bg-rose-deep hover:text-white"
              >
                Взять этот
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function StemsTable({ stems }: { stems: Stem[] }) {
  if (stems.length === 0) {
    return (
      <div className="mt-8 glass-card p-10 text-center">
        <FileSpreadsheet className="mx-auto mb-4 h-10 w-10 text-foreground/30" />
        <h3 className="font-serif text-2xl font-semibold">Excel-каталог не загружен</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-foreground/60">
          Положите ваш файл в <code className="rounded bg-cream-200/60 px-1.5">data/source/flowers.xlsx</code>
          {" "}— приложение перечитает его автоматически. См. README для шаблона столбцов.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-cream-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-sage-600 text-white">
            <tr>
              <th className="px-3 py-3 text-left font-medium">ID</th>
              <th className="px-3 py-3 text-left font-medium">Название</th>
              <th className="px-3 py-3 text-left font-medium">Цвет</th>
              <th className="px-3 py-3 text-right font-medium">Цена</th>
              <th className="px-3 py-3 text-left font-medium">Повод</th>
              <th className="px-3 py-3 text-left font-medium">Кому</th>
              <th className="px-3 py-3 text-left font-medium">Значение</th>
              <th className="px-3 py-3 text-left font-medium">Сезон</th>
            </tr>
          </thead>
          <tbody>
            {stems.map((s, i) => (
              <tr
                key={s.id}
                className={`border-t border-cream-200 ${
                  s.warning ? "bg-red-50/60" : i % 2 === 0 ? "bg-white" : "bg-cream-50/40"
                }`}
              >
                <td className="px-3 py-3 text-foreground/50">{s.id}</td>
                <td className="px-3 py-3">
                  <div className="font-medium">{s.nameRu}</div>
                  {s.nameKz && (
                    <div className="text-xs text-foreground/40">{s.nameKz}</div>
                  )}
                </td>
                <td className="px-3 py-3 text-foreground/70">{s.color}</td>
                <td className="px-3 py-3 text-right font-semibold text-rose-deep">
                  {s.pricePerStem.toLocaleString("ru-RU")} ₸
                </td>
                <td className="px-3 py-3 text-foreground/70">{s.occasions.join(", ")}</td>
                <td className="px-3 py-3 text-foreground/70">{s.forWhom.join(", ")}</td>
                <td className="px-3 py-3 text-foreground/70">
                  {s.warning ? (
                    <span className="text-red-600">⚠️ {s.warning}</span>
                  ) : (
                    s.meaning
                  )}
                </td>
                <td className="px-3 py-3 text-foreground/60">{s.season}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
