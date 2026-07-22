import Link from "next/link";
import { Flag, Lock, Swords } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "CTF Challenges — Kodeon",
};

export default function CtfComingSoonPage() {
  return (
    <div className="bg-arena-grid flex flex-1 items-center justify-center px-4 py-20">
      <div className="glass mx-auto max-w-lg rounded-3xl p-10 text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/40 bg-red-500/10 shadow-glow-crimson">
          <Flag className="h-8 w-8 text-red-400" />
        </span>
        <Badge variant="purple" className="mb-4 inline-flex">
          <Lock className="h-3 w-3" />
          Coming Soon
        </Badge>
        <h1 className="text-3xl font-black tracking-tight">
          CTF <span className="text-gradient-brand">Challenges</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          Team-based capture-the-flag raids, weekly security puzzles, and
          exploit-hunting tournaments are in the works. Sharpen your skills in
          the 1v1 Arena while we finish wiring the mainframe.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            <Swords className="h-4 w-4" />
            Back to the Arena
          </Link>
        </Button>
      </div>
    </div>
  );
}
