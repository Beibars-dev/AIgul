"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "aigul_user_id";

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Стабильный анонимный ID клиента, лежит в localStorage.
 * Используется как ключ для memory AI-агента и истории заказов.
 */
export function useUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(STORAGE_KEY, id);
    }
    setUserId(id);
  }, []);

  return userId;
}

export function clearLocalUserId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
