"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronUp,
  Loader2,
  Moon,
  Play,
  RotateCcw,
  Send,
  Sun,
  TerminalSquare,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SupportedLanguage, TestRunResult } from "@/types";

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  javascript: "JavaScript",
  python: "Python",
  cpp: "C++",
};

interface CodeWorkspaceProps {
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  code: string;
  onCodeChange: (code: string) => void;
  onReset: () => void;
  onRunTests: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  testResults: TestRunResult[] | null;
  stdoutLines: string[];
}

export function CodeWorkspace({
  language,
  onLanguageChange,
  code,
  onCodeChange,
  onReset,
  onRunTests,
  onSubmit,
  isRunning,
  testResults,
  stdoutLines,
}: CodeWorkspaceProps) {
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [terminalOpen, setTerminalOpen] = useState(false);

  const passedCount = testResults?.filter((r) => r.passed).length ?? 0;
  const totalCount = testResults?.length ?? 0;

  const handleRun = () => {
    setTerminalOpen(true);
    onRunTests();
  };

  return (
    <div className="glass flex h-full min-h-0 flex-col overflow-hidden rounded-xl">
      {/* Workspace header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-3 py-2">
        <div className="flex items-center gap-2">
          <Select
            value={language}
            onValueChange={(value) => onLanguageChange(value as SupportedLanguage)}
          >
            <SelectTrigger className="h-8 w-[140px] text-xs" aria-label="Programming language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((lang) => (
                <SelectItem key={lang} value={lang} className="text-xs">
                  {LANGUAGE_LABELS[lang]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              setEditorTheme((t) => (t === "vs-dark" ? "light" : "vs-dark"))
            }
            title="Toggle editor theme"
            aria-label="Toggle editor theme"
          >
            {editorTheme === "vs-dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={onReset}
            title="Reset to starter code"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </div>

      {/* Monaco editor */}
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={language}
          theme={editorTheme}
          value={code}
          onChange={(value) => onCodeChange(value ?? "")}
          loading={
            <div className="flex h-full items-center justify-center gap-2 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
              Booting editor…
            </div>
          }
          options={{
            fontSize: 14,
            fontFamily:
              "var(--font-mono), ui-monospace, 'Cascadia Code', Menlo, monospace",
            minimap: { enabled: false },
            lineNumbers: "on",
            tabCompletion: "on",
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            padding: { top: 14, bottom: 14 },
            renderLineHighlight: "all",
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>

      {/* Terminal drawer */}
      <div className="border-t border-white/[0.06]">
        <button
          onClick={() => setTerminalOpen((open) => !open)}
          className="flex w-full items-center justify-between px-4 py-2 text-xs font-semibold text-zinc-400 transition-colors hover:bg-white/[0.03] hover:text-zinc-200"
          aria-expanded={terminalOpen}
        >
          <span className="flex items-center gap-2">
            <TerminalSquare className="h-4 w-4 text-cyan-400" />
            Terminal Output
            {testResults && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-mono text-[10px] font-bold",
                  passedCount === totalCount
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-red-500/15 text-red-300"
                )}
              >
                {passedCount}/{totalCount} passed
              </span>
            )}
          </span>
          <ChevronUp
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              terminalOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {terminalOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="max-h-52 overflow-y-auto border-t border-white/[0.06] bg-zinc-950/90 p-4 font-mono text-xs">
                {isRunning ? (
                  <p className="flex items-center gap-2 text-cyan-300">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Compiling &amp; executing test suite…
                  </p>
                ) : !testResults ? (
                  <p className="text-zinc-600">
                    $ Awaiting execution — hit{" "}
                    <span className="text-cyan-400">Run Tests</span> to see
                    output here.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {stdoutLines.map((line, idx) => (
                      <p key={`stdout-${idx}`} className="text-zinc-400">
                        {line}
                      </p>
                    ))}
                    {testResults.map((result) => (
                      <div
                        key={result.testCaseId}
                        className={cn(
                          "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-3 py-2",
                          result.passed
                            ? "border-emerald-500/25 bg-emerald-500/5"
                            : "border-red-500/25 bg-red-500/5"
                        )}
                      >
                        {result.passed ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                        )}
                        <span
                          className={cn(
                            "font-bold",
                            result.passed ? "text-emerald-300" : "text-red-300"
                          )}
                        >
                          {result.label} — {result.passed ? "PASSED" : "FAILED"}
                        </span>
                        <span className="text-zinc-500">
                          {result.executionTimeMs}ms
                        </span>
                        {!result.passed && (
                          <span className="w-full text-[11px] text-zinc-400">
                            expected{" "}
                            <span className="text-emerald-300">
                              {result.expected || '""'}
                            </span>{" "}
                            · received{" "}
                            <span className="text-red-300">
                              {result.received || '""'}
                            </span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] bg-zinc-950/50 px-4 py-3">
        <Button
          variant="outline"
          onClick={handleRun}
          disabled={isRunning}
          className="min-w-[120px]"
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Run Tests
        </Button>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="success"
            onClick={onSubmit}
            disabled={isRunning}
            className="min-w-[160px] font-bold"
          >
            <Send className="h-4 w-4" />
            Submit Solution
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
