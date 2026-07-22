"use client";

import { motion } from "framer-motion";
import { Keyboard, Swords, TimerIcon } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn, formatClock } from "@/lib/utils";
import type { User } from "@/types";

interface ArenaHeaderProps {
  timeRemaining: number;
  player: User;
  opponent: User;
  playerTestsPassed: number;
  opponentTestsPassed: number;
  totalTests: number;
  opponentStatusLabel: string;
}

export function ArenaHeader({
  timeRemaining,
  player,
  opponent,
  playerTestsPassed,
  opponentTestsPassed,
  totalTests,
  opponentStatusLabel,
}: ArenaHeaderProps) {
  const isDanger = timeRemaining < 120;

  return (
    <div className="glass-strong z-10 grid grid-cols-1 items-center gap-3 rounded-2xl px-4 py-3 lg:grid-cols-[1fr_auto_1fr]">
      {/* You */}
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-lg shadow-glow-cyan">
          {player.avatar}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="truncate text-sm font-bold text-cyan-300">
              {player.username}
            </span>
            <span className="font-mono text-[11px] text-zinc-500">
              {player.elo} ELO
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Progress
              value={playerTestsPassed}
              max={totalTests}
              className="h-1.5 max-w-[180px]"
              indicatorClassName="bg-gradient-to-r from-cyan-500 to-emerald-400"
            />
            <span className="whitespace-nowrap font-mono text-[11px] text-zinc-400">
              You: {playerTestsPassed}/{totalTests} tests passed
            </span>
          </div>
        </div>
      </div>

      {/* Countdown timer */}
      <div className="flex flex-col items-center justify-self-center">
        <motion.div
          key={isDanger ? "danger" : "normal"}
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-5 py-2 font-mono text-2xl font-black tabular-nums tracking-widest transition-colors",
            isDanger
              ? "animate-pulse-danger border-red-500/60 text-red-400 shadow-glow-crimson"
              : "border-cyan-500/40 bg-cyan-500/5 text-cyan-300 shadow-glow-cyan"
          )}
        >
          <TimerIcon
            className={cn("h-5 w-5", isDanger ? "text-red-400" : "text-cyan-400")}
          />
          {formatClock(timeRemaining)}
        </motion.div>
        <span className="mt-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
          <Swords className="h-3 w-3" /> Ranked Duel
        </span>
      </div>

      {/* Opponent */}
      <div className="flex flex-row-reverse items-center gap-3 lg:justify-self-end">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-500/40 bg-purple-500/10 text-lg shadow-glow-purple">
          {opponent.avatar}
        </span>
        <div className="min-w-0 flex-1 text-right">
          <div className="flex items-baseline justify-end gap-2">
            <span className="font-mono text-[11px] text-zinc-500">
              {opponent.elo} ELO
            </span>
            <span className="truncate text-sm font-bold text-purple-300">
              {opponent.username}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-end gap-2">
            <span className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] text-zinc-400">
              <Keyboard className="h-3 w-3 animate-blink text-purple-400" />
              {opponentStatusLabel}
            </span>
            <Progress
              value={opponentTestsPassed}
              max={totalTests}
              className="h-1.5 max-w-[180px] flex-1"
              indicatorClassName="bg-gradient-to-r from-purple-500 to-fuchsia-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
