"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Info,
  MessageSquare,
  Send,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatClock } from "@/lib/utils";
import type {
  ChatMessage,
  Difficulty,
  OpponentActivityEvent,
  Problem,
  User,
} from "@/types";

const DIFFICULTY_VARIANT: Record<Difficulty, "emerald" | "amber" | "crimson"> = {
  Easy: "emerald",
  Medium: "amber",
  Hard: "crimson",
};

const ACTIVITY_ICON: Record<
  OpponentActivityEvent["type"],
  { icon: typeof Info; className: string }
> = {
  info: { icon: Info, className: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  progress: { icon: TrendingUp, className: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  warning: { icon: AlertTriangle, className: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  success: { icon: CheckCircle2, className: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
};

interface ProblemPanelProps {
  problem: Problem;
  player: User;
  opponent: User;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  activityLog: OpponentActivityEvent[];
  elapsedSeconds: number;
}

export function ProblemPanel({
  problem,
  player,
  opponent,
  messages,
  onSendMessage,
  activityLog,
  elapsedSeconds,
}: ProblemPanelProps) {
  const [draft, setDraft] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    onSendMessage(text);
    setDraft("");
  };

  return (
    <Tabs defaultValue="problem" className="flex h-full min-h-0 flex-col">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="problem" className="flex-1">
          <FileText className="h-3.5 w-3.5" />
          Problem
        </TabsTrigger>
        <TabsTrigger value="chat" className="flex-1">
          <MessageSquare className="h-3.5 w-3.5" />
          Live Chat
          <span className="rounded-full bg-purple-500/20 px-1.5 font-mono text-[10px] text-purple-300">
            {messages.filter((m) => !m.isSystem).length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="opponent" className="flex-1">
          <Activity className="h-3.5 w-3.5" />
          Opponent
        </TabsTrigger>
      </TabsList>

      {/* -------- Tab 1: Problem statement -------- */}
      <TabsContent
        value="problem"
        className="glass min-h-0 flex-1 overflow-y-auto rounded-xl p-5"
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="mr-auto text-lg font-bold text-zinc-100">
            {problem.title}
          </h2>
          <Badge variant={DIFFICULTY_VARIANT[problem.difficulty]}>
            {problem.difficulty}
          </Badge>
          <Badge variant="cyan">{problem.category}</Badge>
        </div>

        <div className="problem-markdown">
          <ReactMarkdown>{problem.description}</ReactMarkdown>
        </div>

        <h3 className="mb-2 mt-6 text-sm font-bold uppercase tracking-wider text-cyan-400">
          Constraints
        </h3>
        <ul className="space-y-1.5">
          {problem.constraints.map((constraint) => (
            <li
              key={constraint}
              className="flex items-start gap-2 text-sm text-zinc-300"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
              <code className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[13px] text-zinc-300">
                {constraint}
              </code>
            </li>
          ))}
        </ul>

        <h3 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wider text-cyan-400">
          Examples
        </h3>
        <div className="space-y-4">
          {problem.sampleInputs.map((sample, idx) => (
            <div
              key={`${problem.id}-sample-${idx}`}
              className="overflow-hidden rounded-xl border border-white/[0.08]"
            >
              <div className="border-b border-white/[0.06] bg-zinc-900/80 px-4 py-2 text-xs font-semibold text-zinc-400">
                Example {idx + 1}
              </div>
              <div className="space-y-3 bg-zinc-950/60 p-4">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Input
                  </p>
                  <pre className="overflow-x-auto rounded-lg bg-zinc-900/80 p-3 font-mono text-xs text-cyan-200">
                    {sample.input}
                  </pre>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Output
                  </p>
                  <pre className="overflow-x-auto rounded-lg bg-zinc-900/80 p-3 font-mono text-xs text-emerald-300">
                    {sample.output}
                  </pre>
                </div>
                {sample.explanation && (
                  <p className="text-xs leading-relaxed text-zinc-400">
                    <span className="font-semibold text-zinc-300">
                      Explanation:
                    </span>{" "}
                    {sample.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* -------- Tab 2: Live chat -------- */}
      <TabsContent
        value="chat"
        className="glass flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl"
      >
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((message) => {
            if (message.isSystem) {
              return (
                <div key={message.id} className="flex justify-center">
                  <span className="rounded-full border border-white/[0.08] bg-zinc-900/80 px-3 py-1 text-[11px] text-zinc-400">
                    {message.text}
                  </span>
                </div>
              );
            }
            const isMe = message.senderId === player.id;
            return (
              <div
                key={message.id}
                className={cn("flex", isMe ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2",
                    isMe
                      ? "rounded-br-sm border border-cyan-500/30 bg-cyan-500/10"
                      : "rounded-bl-sm border border-purple-500/30 bg-purple-500/10"
                  )}
                >
                  <div className="mb-0.5 flex items-baseline gap-2">
                    <span
                      className={cn(
                        "text-[11px] font-bold",
                        isMe ? "text-cyan-300" : "text-purple-300"
                      )}
                    >
                      {isMe ? "You" : message.senderName}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {message.timestamp}
                    </span>
                  </div>
                  <p className="text-sm leading-snug text-zinc-200">
                    {message.text}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        <div className="flex items-center gap-2 border-t border-white/[0.06] p-3">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder={`Message ${opponent.username}…`}
            aria-label="Chat message"
          />
          <Button size="icon" onClick={handleSend} aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </TabsContent>

      {/* -------- Tab 3: Opponent status -------- */}
      <TabsContent
        value="opponent"
        className="glass min-h-0 flex-1 overflow-y-auto rounded-xl p-4"
      >
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-purple-500/30 bg-purple-500/5 p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/40 bg-purple-500/10 text-lg">
            {opponent.avatar}
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-purple-300">
              {opponent.username}
            </p>
            <p className="text-[11px] text-zinc-400">
              {opponent.rankTitle} · {opponent.elo} ELO · {opponent.winRate}% WR
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live
          </span>
        </div>

        {activityLog.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            Waiting for opponent activity…
          </p>
        ) : (
          <ol className="relative ml-2 space-y-4 border-l border-white/[0.08] pl-5">
            {activityLog.map((event) => {
              const meta = ACTIVITY_ICON[event.type];
              const Icon = meta.icon;
              return (
                <li key={event.id} className="relative animate-fade-up">
                  <span
                    className={cn(
                      "absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border",
                      meta.className
                    )}
                  >
                    <Icon className="h-3 w-3" />
                  </span>
                  <p className="text-sm text-zinc-200">{event.label}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-zinc-500">
                    T+{formatClock(event.atSecond)}
                  </p>
                </li>
              );
            })}
          </ol>
        )}

        <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          Feed refreshed T+{formatClock(elapsedSeconds)}
        </p>
      </TabsContent>
    </Tabs>
  );
}
