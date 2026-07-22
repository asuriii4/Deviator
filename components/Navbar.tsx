"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, Crown, Flag, Swords, Trophy, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "1v1 Arena", icon: Swords },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/ctf", label: "CTF Challenges", icon: Flag, comingSoon: true },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 shadow-glow-cyan transition-shadow group-hover:shadow-glow-purple">
            <Code2 className="h-5 w-5 text-cyan-400" />
          </span>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-gradient-brand">KODEON</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/" || pathname.startsWith("/arena")
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.3)]"
                    : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
                {"comingSoon" in link && link.comingSoon && (
                  <Badge variant="purple" className="px-1.5 py-0 text-[9px]">
                    Soon
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile badge */}
        <div className="flex items-center gap-3">
          {currentUser.isPremium ? (
            <Badge
              variant="premium"
              className="hidden animate-shimmer bg-[linear-gradient(110deg,#a855f7,45%,#06b6d4,55%,#a855f7)] bg-[length:200%_100%] sm:inline-flex"
            >
              <Zap className="h-3 w-3" />
              Premium
            </Badge>
          ) : (
            <button className="hidden items-center gap-1 rounded-full border border-purple-500/50 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-purple-300 transition-all hover:bg-purple-500/20 hover:shadow-glow-purple sm:inline-flex">
              <Zap className="h-3 w-3" />
              Go Premium
            </button>
          )}

          <div className="glass flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 transition-shadow hover:shadow-glow-cyan">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/40 bg-purple-500/10 text-base">
              {currentUser.avatar}
            </span>
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-xs font-semibold text-zinc-100">
                {currentUser.username}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                <Crown className="h-3 w-3 text-amber-400" />
                {currentUser.rankTitle}
              </span>
            </div>
            <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-cyan-300">
              {currentUser.elo} ELO
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
