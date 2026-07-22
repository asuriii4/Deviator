"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  Cpu,
  Crown,
  Home,
  Lock,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { MatchResult, Problem, User } from "@/types";

interface MatchResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: MatchResult | null;
  problem: Problem;
  user: User;
  onRematch: () => void;
}

export function MatchResultModal({
  open,
  onOpenChange,
  result,
  problem,
  user,
  onRematch,
}: MatchResultModalProps) {
  if (!result) return null;

  const isVictory = result.outcome === "victory";
  const solution = problem.optimalSolution;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl gap-0 overflow-y-auto p-0">
        {/* Result banner */}
        <div
          className={cn(
            "relative overflow-hidden rounded-t-2xl px-8 pb-6 pt-10 text-center",
            isVictory
              ? "bg-gradient-to-b from-emerald-500/25 via-emerald-500/10 to-transparent"
              : "bg-gradient-to-b from-red-500/25 via-red-500/10 to-transparent"
          )}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <span
              className={cn(
                "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border",
                isVictory
                  ? "border-emerald-500/50 bg-emerald-500/15 shadow-glow-emerald"
                  : "border-red-500/50 bg-red-500/15 shadow-glow-crimson"
              )}
            >
              <Trophy
                className={cn(
                  "h-8 w-8",
                  isVictory ? "text-emerald-400" : "text-red-400"
                )}
              />
            </span>
            <DialogTitle asChild>
              <h2
                className={cn(
                  "text-4xl font-black tracking-[0.2em]",
                  isVictory
                    ? "text-emerald-400 [text-shadow:0_0_30px_rgba(16,185,129,0.6)]"
                    : "text-red-400 [text-shadow:0_0_30px_rgba(239,68,68,0.6)]"
                )}
              >
                {isVictory ? "VICTORY" : "DEFEAT"}
              </h2>
            </DialogTitle>
            <p className="mt-2 text-sm text-zinc-400">
              {isVictory
                ? "Flawless execution. The arena bows to you."
                : "The opponent edged you out this time. Study up and requeue."}
            </p>
          </motion.div>
        </div>

        {/* Match summary */}
        <div className="grid grid-cols-3 gap-3 px-8 py-6">
          <div className="glass rounded-xl p-4 text-center">
            <span className="mb-1 flex items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              {result.eloDelta >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
              )}
              ELO Change
            </span>
            <span
              className={cn(
                "font-mono text-2xl font-bold",
                result.eloDelta >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              {result.eloDelta >= 0 ? `+${result.eloDelta}` : result.eloDelta}
            </span>
            <p className="mt-1 text-[11px] text-zinc-500">
              → {user.elo + result.eloDelta} ELO
            </p>
          </div>

          <div className="glass rounded-xl p-4 text-center">
            <span className="mb-1 flex items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <Clock3 className="h-3.5 w-3.5 text-cyan-400" />
              Time
            </span>
            <span className="font-mono text-2xl font-bold text-cyan-300">
              {result.completionTime}
            </span>
            <p className="mt-1 text-[11px] text-zinc-500">of 10:00 limit</p>
          </div>

          <div className="glass rounded-xl p-4 text-center">
            <span className="mb-1 flex items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
              Tests
            </span>
            <span className="font-mono text-2xl font-bold text-purple-300">
              {result.testsPassed}/{result.totalTests}
            </span>
            <p className="mt-1 text-[11px] text-zinc-500">cases passed</p>
          </div>
        </div>

        {/* Premium solution breakdown */}
        <div className="border-t border-white/[0.06] px-8 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-200">
              <Sparkles className="h-4 w-4 text-purple-400" />
              Optimal Solution Breakdown
            </h3>
            <Badge variant="premium">
              <Crown className="h-3 w-3" />
              Premium
            </Badge>
          </div>

          <div className="mb-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-3 py-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <div className="leading-tight">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Time Complexity
                </p>
                <p className="font-mono text-sm font-bold text-cyan-300">
                  {solution.timeComplexity}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/5 px-3 py-2">
              <Cpu className="h-4 w-4 text-purple-400" />
              <div className="leading-tight">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Space Complexity
                </p>
                <p className="font-mono text-sm font-bold text-purple-300">
                  {solution.spaceComplexity}
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
              <span className="font-mono text-xs text-zinc-500">
                optimal_solution.{solution.language === "python" ? "py" : solution.language === "cpp" ? "cpp" : "js"}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                {solution.language}
              </span>
            </div>

            <pre
              className={cn(
                "max-h-64 overflow-auto p-4 font-mono text-[13px] leading-relaxed text-zinc-300",
                !user.isPremium && "pointer-events-none select-none blur-[6px]"
              )}
              aria-hidden={!user.isPremium}
            >
              <code>{solution.code}</code>
            </pre>

            {!user.isPremium && (
              <div className="absolute inset-x-0 bottom-0 top-9 flex flex-col items-center justify-center gap-3 bg-zinc-950/40 p-6 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-500/50 bg-purple-500/15 shadow-glow-purple">
                  <Lock className="h-5 w-5 text-purple-300" />
                </span>
                <p className="max-w-xs text-xs text-zinc-300">
                  The full annotated solution, complexity walkthrough, and
                  pro-level patterns are waiting behind Premium.
                </p>
                <Button
                  variant="premium"
                  size="sm"
                  className="animate-shimmer bg-[linear-gradient(110deg,#a855f7,45%,#06b6d4,55%,#a855f7)] bg-[length:200%_100%]"
                >
                  <Sparkles className="h-4 w-4" />
                  Unlock Full Solution with Premium
                </Button>
              </div>
            )}
          </div>

          {user.isPremium && (
            <p className="mt-3 rounded-lg border border-white/[0.06] bg-zinc-900/60 p-3 text-xs leading-relaxed text-zinc-400">
              <span className="font-semibold text-purple-300">Why it works:</span>{" "}
              {solution.explanation}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 border-t border-white/[0.06] px-8 py-5 sm:flex-row sm:justify-end">
          <Button asChild variant="ghost">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Lobby
            </Link>
          </Button>
          <Button variant="outline" onClick={onRematch}>
            <RotateCcw className="h-4 w-4" />
            Rematch
          </Button>
          <Button asChild variant={isVictory ? "success" : "default"}>
            <Link href="/leaderboard">
              <Trophy className="h-4 w-4" />
              View Leaderboard
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
