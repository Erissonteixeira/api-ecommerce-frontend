import { useCallback, useMemo, useState } from "react";
import type { ToastItem, ToastType } from "../components/Toast";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type ShowArgs = {
  type: ToastType;
  title: string;
  message?: string;
  durationMs?: number;
};

export function useToast() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const close = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    ({ type, title, message, durationMs = 2600 }: ShowArgs) => {
      const id = uid();
      const item: ToastItem = { id, type, title, message };
      setItems((prev) => [item, ...prev].slice(0, 3));

      window.setTimeout(() => close(id), durationMs);
    },
    [close]
  );

  const api = useMemo(
    () => ({
      success: (title: string, message?: string) => show({ type: "success", title, message }),
      error: (title: string, message?: string) => show({ type: "error", title, message }),
      info: (title: string, message?: string) => show({ type: "info", title, message }),
      show,
    }),
    [show]
  );

  return { items, close, toast: api };
}
