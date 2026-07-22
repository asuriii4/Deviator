"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { MatchResultModal } from "@/components/MatchResultModal";
import { ArenaHeader } from "@/components/arena/ArenaHeader";
import { CodeWorkspace } from "@/components/arena/CodeWorkspace";
import { ProblemPanel } from "@/components/arena/ProblemPanel";
import {
  MATCH_DURATION_SECONDS,
  initialChatMessages,
  opponentActivityScript,
} from "@/lib/mock-data";
import { formatClock } from "@/lib/utils";
import type {
  ChatMessage,
  Match,
  MatchResult,
  MatchStatus,
  SupportedLanguage,
  TestRunResult,
} from "@/types";

const OPPONENT_REPLIES = [
  "less typing, more compiling 😤",
  "my solution is already O(n)… probably",
  "did you just google that?",
  "2 tests down. it's over for you",
  "ok that hidden test case is evil",
  "gg incoming, watch this",
];

interface ArenaClientProps {
  match: Match;
}

export function ArenaClient({ match }: ArenaClientProps) {
  const { problem, player1: player, player2: opponent } = match;
  const totalTests = problem.testCases.length;

  /* ----- match clock ----- */
  const [timeRemaining, setTimeRemaining] = useState(match.timeRemainingSeconds);
  const [status, setStatus] = useState<MatchStatus>(match.status);
  const elapsedSeconds = MATCH_DURATION_SECONDS - timeRemaining;

  /* ----- code workspace ----- */
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [codeByLanguage, setCodeByLanguage] = useState<
    Record<SupportedLanguage, string>
  >(() => ({ ...problem.starterCode }));
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestRunResult[] | null>(null);
  const [stdoutLines, setStdoutLines] = useState<string[]>([]);
  const runCountRef = useRef(0);
  const runTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ----- chat ----- */
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const replyIndexRef = useRef(0);

  /* ----- result modal ----- */
  const [result, setResult] = useState<MatchResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const playerTestsPassed = useMemo(
    () => testResults?.filter((r) => r.passed).length ?? 0,
    [testResults]
  );

  /* Opponent simulation is driven by the scripted activity feed. */
  const firedActivity = useMemo(
    () => opponentActivityScript.filter((e) => e.atSecond <= elapsedSeconds),
    [elapsedSeconds]
  );
  const opponentTestsPassed = useMemo(
    () => Math.min(totalTests, firedActivity.filter((e) => e.type === "progress").length),
    [firedActivity, totalTests]
  );
  const opponentStatusLabel =
    firedActivity.length > 0
      ? `Opponent: ${opponentTestsPassed}/${totalTests} tests passed`
      : "Opponent: Typing…";

  const finishMatch = useCallback(
    (outcome: MatchResult["outcome"], testsPassed: number) => {
      setStatus("finished");
      setResult({
        outcome,
        eloDelta: outcome === "victory" ? 25 : -25,
        completionTime: formatClock(MATCH_DURATION_SECONDS - timeRemaining),
        testsPassed,
        totalTests,
      });
      setModalOpen(true);
    },
    [timeRemaining, totalTests]
  );

  /* Countdown ticker — auto-defeat at zero. */
  useEffect(() => {
    if (status !== "active") return;
    const interval = setInterval(() => {
      setTimeRemaining((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (timeRemaining === 0 && status === "active") {
      finishMatch(
        playerTestsPassed === totalTests ? "victory" : "defeat",
        playerTestsPassed
      );
    }
  }, [timeRemaining, status, playerTestsPassed, totalTests, finishMatch]);

  useEffect(() => () => {
    if (runTimeoutRef.current) clearTimeout(runTimeoutRef.current);
  }, []);

  /* Mock test execution: editing your code makes progress each run. */
  const runTests = useCallback(() => {
    if (isRunning || status !== "active") return;
    setIsRunning(true);

    runTimeoutRef.current = setTimeout(() => {
      const code = codeByLanguage[language];
      const codeChanged = code.trim() !== problem.starterCode[language].trim();
      if (codeChanged) runCountRef.current += 1;
      const passCount = codeChanged
        ? Math.min(totalTests, runCountRef.current)
        : 0;

      const results: TestRunResult[] = problem.testCases.map((testCase, idx) => {
        const passed = idx < passCount;
        return {
          testCaseId: testCase.id,
          label: `Test ${idx + 1}${testCase.hidden ? " (hidden)" : ""}`,
          passed,
          executionTimeMs: Math.floor(Math.random() * 38) + 4,
          stdout: passed ? testCase.expectedOutput : "",
          expected: testCase.expectedOutput,
          received: passed ? testCase.expectedOutput : codeChanged ? "≠ expected" : "<no output>",
        };
      });

      setStdoutLines([
        `$ kodeon run --lang ${language} --suite ${problem.id}`,
        codeChanged
          ? `> compiled in ${Math.floor(Math.random() * 220) + 90}ms — running ${totalTests} test cases…`
          : "> warning: submission matches starter code — write your solution first!",
      ]);
      setTestResults(results);
      setIsRunning(false);
    }, 1400);
  }, [codeByLanguage, isRunning, language, problem, status, totalTests]);

  const submitSolution = useCallback(() => {
    if (status !== "active") return;
    finishMatch(
      playerTestsPassed === totalTests ? "victory" : "defeat",
      playerTestsPassed
    );
  }, [finishMatch, playerTestsPassed, status, totalTests]);

  const sendMessage = useCallback(
    (text: string) => {
      const now = formatClock(elapsedSeconds);
      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          senderId: player.id,
          senderName: player.username,
          text,
          timestamp: now,
        },
      ]);

      const reply = OPPONENT_REPLIES[replyIndexRef.current % OPPONENT_REPLIES.length];
      replyIndexRef.current += 1;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `c-${Date.now()}-reply`,
            senderId: opponent.id,
            senderName: opponent.username,
            text: reply,
            timestamp: now,
          },
        ]);
      }, 2200);
    },
    [elapsedSeconds, opponent, player]
  );

  const handleRematch = useCallback(() => {
    setModalOpen(false);
    setResult(null);
    setStatus("active");
    setTimeRemaining(MATCH_DURATION_SECONDS);
    setCodeByLanguage({ ...problem.starterCode });
    setTestResults(null);
    setStdoutLines([]);
    setMessages(initialChatMessages);
    runCountRef.current = 0;
  }, [problem.starterCode]);

  return (
    <div className="bg-arena-grid flex h-[calc(100vh-4rem)] flex-col gap-3 overflow-hidden p-3 sm:p-4">
      <ArenaHeader
        timeRemaining={timeRemaining}
        player={player}
        opponent={opponent}
        playerTestsPassed={playerTestsPassed}
        opponentTestsPassed={opponentTestsPassed}
        totalTests={totalTests}
        opponentStatusLabel={opponentStatusLabel}
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="min-h-[420px] lg:min-h-0">
          <ProblemPanel
            problem={problem}
            player={player}
            opponent={opponent}
            messages={messages}
            onSendMessage={sendMessage}
            activityLog={firedActivity}
            elapsedSeconds={elapsedSeconds}
          />
        </div>

        <div className="min-h-[520px] lg:min-h-0">
          <CodeWorkspace
            language={language}
            onLanguageChange={setLanguage}
            code={codeByLanguage[language]}
            onCodeChange={(code) =>
              setCodeByLanguage((prev) => ({ ...prev, [language]: code }))
            }
            onReset={() =>
              setCodeByLanguage((prev) => ({
                ...prev,
                [language]: problem.starterCode[language],
              }))
            }
            onRunTests={runTests}
            onSubmit={submitSolution}
            isRunning={isRunning}
            testResults={testResults}
            stdoutLines={stdoutLines}
          />
        </div>
      </div>

      <MatchResultModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        result={result}
        problem={problem}
        user={player}
        onRematch={handleRematch}
      />
    </div>
  );
}
