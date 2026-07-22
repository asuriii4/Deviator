"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  ChevronRight,
  Flag,
  KeyRound,
  Swords,
  Timer,
  Users,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { opponentUser, problems } from "@/lib/mock-data";
import type { Difficulty, ProblemCategory } from "@/types";

const DIFFICULTY_VARIANT: Record<Difficulty, "emerald" | "amber" | "crimson"> = {
  Easy: "emerald",
  Medium: "amber",
  Hard: "crimson",
};

const CATEGORY_META: Record<
  ProblemCategory,
  { icon: typeof BrainCircuit; accent: string }
> = {
  Algorithms: { icon: BrainCircuit, accent: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10" },
  Cryptography: { icon: KeyRound, accent: "text-purple-400 border-purple-500/40 bg-purple-500/10" },
  CTF: { icon: Flag, accent: "text-red-400 border-red-500/40 bg-red-500/10" },
};

export default function HomePage() {
  return (
    <div className="bg-arena-grid relative flex-1">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950" />

      <div className="relative mx-auto max-w-screen-xl px-4 py-14 sm:px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge variant="cyan" className="mb-5 inline-flex">
            <Zap className="h-3 w-3" />
            Season 4 — Ranked Queue Live
          </Badge>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Enter the <span className="text-gradient-brand">Coding Arena</span>.
            <br />
            Outcode. Outrank. <span className="neon-text-purple">Dominate.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-zinc-400 sm:text-lg">
            Real-time 1v1 duels across algorithms, cryptography, and CTF
            challenges. 10 minutes on the clock. Winner takes the ELO.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="group">
              <Link href={`/arena/${problems[0].id}`}>
                <Swords className="h-5 w-5 transition-transform group-hover:rotate-12" />
                Quick Match
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>

          {/* Live stats strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              2,431 coders online
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-400" /> 187 matches in progress
            </span>
            <span className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-purple-400" /> Avg queue: 8s
            </span>
          </div>
        </motion.div>

        {/* Problem lobby */}
        <div className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Tonight&apos;s Featured Duels
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Pick a battlefield — you&apos;ll be matched against{" "}
                <span className="font-semibold text-purple-300">
                  {opponentUser.username}
                </span>{" "}
                ({opponentUser.elo} ELO)
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {problems.map((problem, i) => {
              const meta = CATEGORY_META[problem.category];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                >
                  <Link
                    href={`/arena/${problem.id}`}
                    className="glass group flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-glow-cyan"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${meta.accent}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <Badge variant={DIFFICULTY_VARIANT[problem.difficulty]}>
                        {problem.difficulty}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-100 transition-colors group-hover:text-cyan-300">
                      {problem.title}
                    </h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {problem.category}
                    </p>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
                      {problem.description.split("\n")[0].replace(/[`*#]/g, "")}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Timer className="h-3.5 w-3.5" /> 10:00 duel
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-cyan-400 transition-transform group-hover:translate-x-1">
                        Enter Arena <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
