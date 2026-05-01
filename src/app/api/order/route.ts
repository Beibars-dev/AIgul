import { NextRequest, NextResponse } from "next/server";
import { appendOrder } from "@/lib/memory";

type OrderPayload = {
  userId?: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  recipient: {
    name?: string;
    phone?: string;
    address: string;
    city: string;
  };
  delivery: {
    date: string;
    time: string;
  };
  cardMessage?: string;
  bouquetSummary: string;
  occasion?: string;
  conversationContext?: string;
  total: number;
};

/**
 * Stub-эндпоинт оформления заказа.
 * В продакшене сюда подключается CRM магазина / Kaspi Pay / Telegram-бот менеджера.
 * Здесь же сохраняем заказ в memory клиента — чтобы AI помнил его на следующий раз.
 */
export async function POST(req: NextRequest) {
  let body: OrderPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Невалидный JSON" }, { status: 400 });
  }

  if (!body.customer?.name || !body.customer?.phone) {
    return NextResponse.json({ error: "Укажите имя и телефон" }, { status: 400 });
  }
  if (!body.recipient?.address) {
    return NextResponse.json({ error: "Укажите адрес доставки" }, { status: 400 });
  }

  const orderId = `AIG-${Date.now().toString(36).toUpperCase()}`;
  const now = new Date().toISOString();

  console.log("📦 Новый заказ:", { orderId, ...body });

  // Сохраняем в memory клиента
  if (body.userId) {
    try {
      await appendOrder(
        body.userId,
        {
          orderId,
          createdAt: now,
          bouquetSummary: body.bouquetSummary || "(не указано)",
          recipientName: body.recipient.name,
          recipientAddress: `${body.recipient.city}, ${body.recipient.address}`,
          occasion: body.occasion,
          total: body.total,
          cardMessage: body.cardMessage,
        },
        {
          name: body.customer.name,
          phone: body.customer.phone,
          email: body.customer.email,
        },
      );
    } catch (err) {
      console.warn("Не удалось сохранить заказ в memory:", err);
    }
  }

  return NextResponse.json({
    success: true,
    orderId,
    message:
      "Заказ принят! Менеджер свяжется в течение 5 минут для подтверждения.",
  });
}
