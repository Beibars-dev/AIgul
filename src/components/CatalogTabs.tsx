"use client";

import { useState, ReactNode } from "react";
import { Flower2, FileSpreadsheet } from "lucide-react";

type Props = {
  bouquets: ReactNode;
  stems: ReactNode;
};

export default function CatalogTabs({ bouquets, stems }: Props) {
  const [tab, setTab] = useState<"bouquets" | "stems">("bouquets");

  return (
    <>
      <div className="mt-10 flex gap-2 border-b border-cream-200">
        <button
          onClick={() => setTab("bouquets")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all ${
            tab === "bouquets"
              ? "border-b-2 border-rose-deep text-rose-deep"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <Flower2 className="h-4 w-4" />
          Готовые букеты
        </button>
        <button
          onClick={() => setTab("stems")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all ${
            tab === "stems"
              ? "border-b-2 border-rose-deep text-rose-deep"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Одиночные цветы (Excel)
        </button>
      </div>

      {tab === "bouquets" ? bouquets : stems}
    </>
  );
}
