import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemInstruction } from "@/lib/system-prompt";
import {
  appendChatTurn,
  getMemory,
  summarizeMemoryForPrompt,
} from "@/lib/memory";
import { getStems } from "@/lib/excel-loader";

export const runtime = "nodejs";

type ClientMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY не задан. Создайте файл .env.local в корне проекта и добавьте GEMINI_API_KEY=ваш_ключ. Получить ключ можно бесплатно на https://aistudio.google.com/app/apikey",
      },
      { status: 500 },
    );
  }

  let body: { messages?: ClientMessage[]; userId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Невалидный JSON" }, { status: 400 });
  }

  const messages = body.messages ?? [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "Нет сообщений" }, { status: 400 });
  }

  const userId = body.userId;

  // Подтягиваем память (если есть userId), формируем выжимку для системного промпта
  const memory = userId ? await getMemory(userId) : null;
  const memoryContext = memory ? summarizeMemoryForPrompt(memory) : null;

  const stems = await getStems();
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
  const systemInstruction = buildSystemInstruction(memoryContext, stems);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction,
    generationConfig: {
      temperature: 0.85,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });

  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== "user") {
    return NextResponse.json(
      { error: "Последнее сообщение должно быть от пользователя" },
      { status: 400 },
    );
  }

  const historyMessages = messages.slice(0, -1);
  const firstUserIdx = historyMessages.findIndex((m) => m.role === "user");
  const trimmedHistory =
    firstUserIdx === -1 ? [] : historyMessages.slice(firstUserIdx);

  const history = trimmedHistory.map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  }));

  // Считаем число пользовательских сообщений в текущем запросе.
  // Если == 1, значит это начало новой сессии в memory.
  const userTurnsInCurrentChat = messages.filter(
    (m) => m.role === "user",
  ).length;
  const isNewSession = userTurnsInCurrentChat === 1;

  try {
    const chat = model.startChat({ history });
    let result = await chat.sendMessage(lastMessage.content);
    let text = result.response.text();

    // Если модель упёрлась в лимит токенов — просим продолжить, чтобы клиент получил законченное сообщение.
    // Делаем максимум 2 «дозапроса», чтобы не зациклиться.
    let attempts = 0;
    while (
      result.response.candidates?.[0]?.finishReason === "MAX_TOKENS" &&
      attempts < 2
    ) {
      attempts += 1;
      result = await chat.sendMessage(
        "продолжай ровно с того места, не повторяйся",
      );
      text += result.response.text();
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        {
          error:
            "Модель вернула пустой ответ. Попробуйте ещё раз или поменяйте GEMINI_MODEL в .env.local на gemini-2.5-flash.",
        },
        { status: 500 },
      );
    }

    if (userId) {
      const now = new Date().toISOString();
      await appendChatTurn(userId, isNewSession, {
        role: "user",
        content: lastMessage.content,
        ts: now,
      });
      await appendChatTurn(userId, false, {
        role: "assistant",
        content: text,
        ts: now,
      });
    }

    return NextResponse.json({ message: text, hasMemory: !!memoryContext });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Неизвестная ошибка";
    return NextResponse.json(
      {
        error: `Ошибка Gemini API: ${errorMessage}. Проверьте корректность API ключа.`,
      },
      { status: 500 },
    );
  }
}
