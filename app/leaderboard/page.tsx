"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Medal, Search, Swords, Trophy, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  currentUserStanding,
  leaderboard,
  type RichLeaderboardEntry,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type ScopeFilter = "global" | "weekly" | "language";

const PODIUM_STYLES = [
  {
    // Rank 1 — gold
    ring: "border-amber-400/60",
    glow: "shadow-glow-gold",
    text: "text-amber-300",
    gradient: "from-amber-500/25 via-amber-500/5 to-transparent",
    label: "Champion",
  },
  {
    // Rank 2 — silver
    ring: "border-zinc-300/50",
    glow: "shadow-[0_0_24px_-4px_rgba(212,212,216,0.4)]",
    text: "text-zinc-200",
    gradient: "from-zinc-400/20 via-zinc-400/5 to-transparent",
    label: "Runner-up",
  },
  {
    // Rank 3 — bronze
    ring: "border-orange-600/50",
    glow: "shadow-[0_0_24px_-4px_rgba(234,88,12,0.4)]",
    text: "text-orange-400",
    gradient: "from-orange-600/20 via-orange-600/5 to-transparent",
    label: "Third Place",
  },
] as const;

const LANGUAGE_OPTIONS = ["All", "JavaScript", "Python", "C++", "Rust", "Go"] as const;

function PodiumCard({
  entry,
  position,
}: {
  entry: RichLeaderboardEntry;
  position: 0 | 1 | 2;
}) {
  const style = PODIUM_STYLES[position];
  const isFirst = position === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: position * 0.15, ease: "easeOut" }}
      className={cn(
        "glass relative flex flex-col items-center rounded-2xl border bg-gradient-to-b p-6 text-center",
        style.ring,
        style.glow,
        style.gradient,
        isFirst && "md:-mt-6 md:scale-105"
      )}
    >
      {isFirst && (
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-5"
        >
          <Crown className="h-9 w-9 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
        </motion.div>
      )}

      <span
        className={cn(
          "mb-3 mt-2 flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-3xl",
          style.ring
        )}
      >
        {entry.user.avatar}
      </span>

      <span className={cn("font-mono text-xs font-bold uppercase tracking-widest", style.text)}>
        #{entry.rank} · {style.label}
      </span>
      <h3 className="mt-1 text-lg font-black text-zinc-100">{entry.user.username}</h3>
      <p className="text-[11px] text-zinc-400">{entry.user.rankTitle}</p>

      <div className="mt-4 grid w-full grid-cols-3 gap-2 border-t border-white/[0.08] pt-4 text-center">
        <div>
          <p className={cn("font-mono text-sm font-bold", style.text)}>
            {entry.user.elo}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">ELO</p>
        </div>
        <div>
          <p className="font-mono text-sm font-bold text-emerald-400">
            {entry.user.winRate}%
          </p>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Win rate</p>
        </div>
        <div>
          <p className="font-mono text-sm font-bold text-cyan-300">{entry.wins}</p>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Wins</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState<ScopeFilter>("global");
  const [languageFilter, setLanguageFilter] =
    useState<(typeof LANGUAGE_OPTIONS)[number]>("All");

  const topThree = leaderboard.slice(0, 3);

  const tableEntries = useMemo(() => {
    let entries = leaderboard.slice(3); // ranks 4–100

    if (scope === "weekly") {
      entries = [...entries].sort((a, b) => b.weeklyPoints - a.weeklyPoints);
    }
    if (scope === "language" && languageFilter !== "All") {
      entries = entries.filter((e) => e.favoriteLanguage === languageFilter);
    }
    const query = search.trim().toLowerCase();
    if (query) {
      entries = entries.filter((e) =>
        e.user.username.toLowerCase().includes(query)
      );
    }
    return entries;
  }, [search, scope, languageFilter]);

  return (
    <div className="bg-arena-grid relative flex-1 pb-28">
      <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <Badge variant="amber" className="mb-4 inline-flex">
            <Trophy className="h-3 w-3" />
            Season 4 Rankings
          </Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Hall of <span className="text-gradient-brand">Legends</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            The top 100 duelists in the arena. Win ranked matches to climb — or
            get farmed for ELO.
          </p>
        </div>

        {/* Top 3 podium */}
        <div className="mx-auto mb-12 grid max-w-4xl gap-4 md:grid-cols-3 md:items-start">
          <div className="md:order-2">
            <PodiumCard entry={topThree[0]} position={0} />
          </div>
          <div className="md:order-1 md:mt-8">
            <PodiumCard entry={topThree[1]} position={1} />
          </div>
          <div className="md:order-3 md:mt-8">
            <PodiumCard entry={topThree[2]} position={2} />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search players…"
              className="pl-9"
              aria-label="Search players"
            />
          </div>

          <div className="flex items-center gap-2">
            {(["global", "weekly", "language"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setScope(option)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-xs font-semibold capitalize transition-all",
                  scope === option
                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300 shadow-glow-cyan"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                )}
              >
                {option}
              </button>
            ))}

            {scope === "language" && (
              <Select
                value={languageFilter}
                onValueChange={(value) =>
                  setLanguageFilter(value as (typeof LANGUAGE_OPTIONS)[number])
                }
              >
                <SelectTrigger className="h-[34px] w-[130px] text-xs" aria-label="Language filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang} value={lang} className="text-xs">
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Rankings table */}
        <div className="glass overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-[11px] uppercase tracking-wider text-zinc-500">
                  <th className="px-4 py-3 font-semibold">Rank</th>
                  <th className="px-4 py-3 font-semibold">Player</th>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    {scope === "weekly" ? "Weekly Pts" : "Points"}
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">ELO</th>
                  <th className="px-4 py-3 text-right font-semibold">Matches</th>
                  <th className="px-4 py-3 text-right font-semibold">Wins</th>
                  <th className="px-4 py-3 text-right font-semibold">Win %</th>
                  <th className="px-4 py-3 font-semibold">Language</th>
                </tr>
              </thead>
              <tbody>
                {tableEntries.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-zinc-500">
                      No players match your filters.
                    </td>
                  </tr>
                ) : (
                  tableEntries.map((entry, idx) => (
                    <tr
                      key={entry.user.id}
                      className="border-b border-white/[0.04] transition-colors last:border-0 hover:bg-cyan-500/[0.04]"
                    >
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 font-mono font-bold text-zinc-400">
                          {entry.rank <= 10 && (
                            <Medal className="h-3.5 w-3.5 text-amber-400/80" />
                          )}
                          #{scope === "weekly" ? idx + 4 : entry.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-zinc-800/80 text-sm">
                            {entry.user.avatar}
                          </span>
                          <span className="font-semibold text-zinc-100">
                            {entry.user.username}
                          </span>
                          {entry.user.isPremium && (
                            <Zap className="h-3.5 w-3.5 text-purple-400" />
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {entry.user.rankTitle}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-cyan-300">
                        {(scope === "weekly"
                          ? entry.weeklyPoints
                          : entry.points
                        ).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-zinc-300">
                        {entry.user.elo}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-zinc-400">
                        {entry.matchesPlayed}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-zinc-400">
                        {entry.wins}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={cn(
                            "font-mono font-semibold",
                            entry.user.winRate >= 65
                              ? "text-emerald-400"
                              : entry.user.winRate >= 50
                                ? "text-zinc-300"
                                : "text-red-400"
                          )}
                        >
                          {entry.user.winRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="purple" className="normal-case">
                          {entry.favoriteLanguage}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sticky footer — your standing */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-cyan-500/25 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <span className="flex items-center gap-2 font-mono text-lg font-black text-cyan-300">
            #{currentUserStanding.rank}
          </span>
          <span className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-base shadow-glow-cyan">
              {currentUserStanding.user.avatar}
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold text-zinc-100">
                {currentUserStanding.user.username}{" "}
                <span className="font-normal text-zinc-500">(You)</span>
              </span>
              <span className="block text-[11px] text-zinc-400">
                {currentUserStanding.user.rankTitle}
              </span>
            </span>
          </span>

          <span className="ml-auto hidden items-center gap-6 font-mono text-xs text-zinc-400 md:flex">
            <span>
              <span className="font-bold text-cyan-300">
                {currentUserStanding.points.toLocaleString()}
              </span>{" "}
              pts
            </span>
            <span>
              <span className="font-bold text-zinc-200">
                {currentUserStanding.user.elo}
              </span>{" "}
              ELO
            </span>
            <span>
              <span className="font-bold text-emerald-400">
                {currentUserStanding.user.winRate}%
              </span>{" "}
              WR
            </span>
          </span>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-zinc-950 transition-all hover:bg-cyan-400 hover:shadow-glow-cyan"
          >
            <Swords className="h-3.5 w-3.5" />
            Climb Higher
          </Link>
        </div>
      </div>
    </div>
  );
}
