import { NextRequest, NextResponse } from "next/server";
import { clearMemory, getMemory } from "@/lib/memory";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Нужен userId" }, { status: 400 });
  }
  try {
    const memory = await getMemory(userId);
    return NextResponse.json({
      hasMemory:
        Object.values(memory.profile).some(Boolean) ||
        memory.orders.length > 0 ||
        memory.sessions.length > 0,
      profile: memory.profile,
      ordersCount: memory.orders.length,
      sessionsCount: memory.sessions.length,
      lastOrder: memory.orders.at(-1) ?? null,
      orders: memory.orders.slice(-5).reverse(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ошибка чтения памяти" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Нужен userId" }, { status: 400 });
  }
  try {
    await clearMemory(userId);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ошибка очистки памяти" },
      { status: 500 },
    );
  }
}
