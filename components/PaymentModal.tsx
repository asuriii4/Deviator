"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  Crown,
  Loader2,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PAYMENT_TOKEN,
  PREMIUM_PRICE_USD,
  formatToken,
  mockTransactionSignature,
  usdToToken,
} from "@/lib/payment";
import { usePremium } from "@/lib/premium";
import { cn } from "@/lib/utils";

type PaymentStep = "review" | "processing" | "success";

const PROCESSING_STATUSES = [
  "Connecting to wallet…",
  "Awaiting signature…",
  "Broadcasting transaction…",
  `Confirming on ${PAYMENT_TOKEN.network}…`,
] as const;

const PERKS = [
  "Optimal solution breakdowns after every match",
  "Time & space complexity analysis",
  "Exclusive PREMIUM profile badge",
  "Priority ranked queue",
] as const;

/** Deterministic PRNG so the mock QR pattern is stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Decorative QR-style code for the simulated crypto checkout. */
function MockQrCode() {
  const cells = useMemo(() => {
    const rand = mulberry32(50);
    const size = 21;
    const grid: boolean[][] = [];
    const inFinder = (r: number, c: number) =>
      (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);

    for (let r = 0; r < size; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < size; c++) {
        row.push(!inFinder(r, c) && rand() > 0.52);
      }
      grid.push(row);
    }
    return grid;
  }, []);

  const finderCorners: Array<[number, number]> = [
    [0, 0],
    [0, 14],
    [14, 0],
  ];

  return (
    <svg
      viewBox="0 0 21 21"
      className="h-36 w-36 rounded-lg bg-white p-1.5"
      role="img"
      aria-label="Payment QR code (simulated)"
    >
      {cells.map((row, r) =>
        row.map(
          (filled, c) =>
            filled && (
              <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#09090b" />
            )
        )
      )}
      {finderCorners.map(([y, x]) => (
        <g key={`${y}-${x}`}>
          <rect x={x} y={y} width={7} height={7} fill="#09090b" />
          <rect x={x + 1} y={y + 1} width={5} height={5} fill="#ffffff" />
          <rect x={x + 2} y={y + 2} width={3} height={3} fill="#09090b" />
        </g>
      ))}
    </svg>
  );
}

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentModal({ open, onOpenChange }: PaymentModalProps) {
  const { unlockPremium } = usePremium();
  const [step, setStep] = useState<PaymentStep>("review");
  const [statusIndex, setStatusIndex] = useState(0);
  const [txSignature, setTxSignature] = useState("");
  const [copied, setCopied] = useState(false);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const tokenAmount = usdToToken(PREMIUM_PRICE_USD);
  const totalToken = tokenAmount + PAYMENT_TOKEN.networkFee;

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // Reset the flow whenever the modal is reopened.
  useEffect(() => {
    if (open) {
      setStep("review");
      setStatusIndex(0);
      setCopied(false);
    }
    return clearTimers;
  }, [open]);

  const startPayment = () => {
    setStep("processing");
    setStatusIndex(0);
    PROCESSING_STATUSES.forEach((_, idx) => {
      if (idx === 0) return;
      timersRef.current.push(setTimeout(() => setStatusIndex(idx), idx * 1100));
    });
    timersRef.current.push(
      setTimeout(() => {
        setTxSignature(mockTransactionSignature());
        unlockPremium();
        setStep("success");
      }, PROCESSING_STATUSES.length * 1100 + 600)
    );
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_TOKEN.merchantAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — ignore.
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) clearTimers();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-md gap-0 p-0" hideClose={step === "processing"}>
        <AnimatePresence mode="wait" initial={false}>
          {step === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-t-2xl bg-gradient-to-b from-purple-500/20 via-purple-500/5 to-transparent px-6 pb-4 pt-8 text-center">
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/50 bg-purple-500/15 shadow-glow-purple">
                  <Crown className="h-6 w-6 text-purple-300" />
                </span>
                <DialogHeader className="space-y-1.5 text-center sm:text-center">
                  <DialogTitle className="text-xl font-black tracking-tight">
                    Unlock <span className="text-gradient-brand">Kodeon Premium</span>
                  </DialogTitle>
                  <DialogDescription>
                    One-time payment · pay with {PAYMENT_TOKEN.name} (
                    {PAYMENT_TOKEN.symbol})
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="space-y-4 px-6 py-4">
                <ul className="space-y-1.5">
                  {PERKS.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      {perk}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4">
                  <MockQrCode />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Amount
                      </p>
                      <p className="font-mono text-2xl font-black text-cyan-300">
                        ${PREMIUM_PRICE_USD.toFixed(2)}
                      </p>
                      <p className="font-mono text-xs text-purple-300">
                        ≈ {formatToken(tokenAmount)} {PAYMENT_TOKEN.symbol}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Send to
                      </p>
                      <button
                        onClick={copyAddress}
                        className="group flex w-full items-center gap-1.5 text-left"
                        title="Copy address"
                      >
                        <span className="truncate font-mono text-[11px] text-zinc-300 group-hover:text-cyan-300">
                          {PAYMENT_TOKEN.merchantAddress}
                        </span>
                        {copied ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 shrink-0 text-zinc-500 group-hover:text-cyan-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3 font-mono text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Kodeon Premium (lifetime)</span>
                    <span>
                      {formatToken(tokenAmount)} {PAYMENT_TOKEN.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Network fee</span>
                    <span>
                      {PAYMENT_TOKEN.networkFee} {PAYMENT_TOKEN.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-white/[0.08] pt-1.5 font-bold text-zinc-100">
                    <span>Total</span>
                    <span className="text-cyan-300">
                      {formatToken(totalToken)} {PAYMENT_TOKEN.symbol}
                    </span>
                  </div>
                </div>

                <p className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Simulated checkout — no real {PAYMENT_TOKEN.symbol} is transferred in this MVP.
                </p>
              </div>

              <div className="border-t border-white/[0.06] px-6 py-4">
                <Button
                  variant="premium"
                  className="w-full animate-shimmer bg-[linear-gradient(110deg,#a855f7,45%,#06b6d4,55%,#a855f7)] bg-[length:200%_100%] font-bold"
                  size="lg"
                  onClick={startPayment}
                >
                  <Wallet className="h-4 w-4" />
                  Pay {formatToken(totalToken)} {PAYMENT_TOKEN.symbol} (${PREMIUM_PRICE_USD})
                </Button>
              </div>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center px-6 py-14 text-center"
            >
              <DialogTitle className="sr-only">Processing payment</DialogTitle>
              <div className="relative mb-6">
                <span className="absolute inset-0 animate-ping rounded-full bg-purple-500/20" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-purple-500/50 bg-purple-500/15 shadow-glow-purple">
                  <Loader2 className="h-7 w-7 animate-spin text-purple-300" />
                </span>
              </div>
              <p className="font-mono text-sm font-semibold text-zinc-100">
                {PROCESSING_STATUSES[statusIndex]}
              </p>
              <p className="mt-2 font-mono text-xs text-zinc-500">
                {formatToken(totalToken)} {PAYMENT_TOKEN.symbol} · {PAYMENT_TOKEN.network}
              </p>
              <div className="mt-6 flex gap-1.5">
                {PROCESSING_STATUSES.map((status, idx) => (
                  <span
                    key={status}
                    className={cn(
                      "h-1.5 w-8 rounded-full transition-colors duration-500",
                      idx <= statusIndex ? "bg-purple-400" : "bg-zinc-800"
                    )}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex flex-col items-center px-6 py-10 text-center"
            >
              <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/50 bg-emerald-500/15 shadow-glow-emerald">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </span>
              <DialogTitle asChild>
                <h2 className="text-2xl font-black tracking-tight text-emerald-400 [text-shadow:0_0_24px_rgba(16,185,129,0.5)]">
                  Payment Confirmed
                </h2>
              </DialogTitle>
              <Badge variant="premium" className="mt-3">
                <Sparkles className="h-3 w-3" />
                Premium Active
              </Badge>
              <p className="mt-4 max-w-xs text-sm text-zinc-400">
                Welcome to the inner circle. Optimal solutions and complexity
                breakdowns are now unlocked on every match.
              </p>

              <div className="mt-5 w-full rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Transaction signature
                </p>
                <p className="mt-1 break-all font-mono text-[10px] leading-relaxed text-cyan-300/80">
                  {txSignature}
                </p>
              </div>

              <Button
                variant="success"
                className="mt-6 w-full font-bold"
                onClick={() => onOpenChange(false)}
              >
                Back to the Arena
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
