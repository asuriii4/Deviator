"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "kodeon-premium";

interface PremiumContextValue {
  isPremium: boolean;
  unlockPremium: () => void;
}

const PremiumContext = createContext<PremiumContextValue>({
  isPremium: false,
  unlockPremium: () => {},
});

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);

  // Hydrate from localStorage after mount so SSR markup stays deterministic.
  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY) === "true") {
      setIsPremium(true);
    }
  }, []);

  const unlockPremium = useCallback(() => {
    setIsPremium(true);
    window.localStorage.setItem(STORAGE_KEY, "true");
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
