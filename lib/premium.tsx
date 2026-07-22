"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "kodeon-premium";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Sync premium status across browser tabs too.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot() {
  return false;
}

interface PremiumContextValue {
  isPremium: boolean;
  unlockPremium: () => void;
}

const PremiumContext = createContext<PremiumContextValue>({
  isPremium: false,
  unlockPremium: () => {},
});

export function PremiumProvider({ children }: { children: ReactNode }) {
  const isPremium = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const unlockPremium = useCallback(() => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    listeners.forEach((listener) => listener());
  }, []);

  return (
    <PremiumContext.Provider value={{ isPremium, unlockPremium }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}
