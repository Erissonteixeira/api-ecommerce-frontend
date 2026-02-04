import { createContext, useContext, type ReactNode } from "react";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

type ToastContextValue = ReturnType<typeof useToast>;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const value = useToast();

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast items={value.items} onClose={value.close} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastContext deve ser usado dentro de <ToastProvider />");
  return ctx;
}
