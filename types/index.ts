export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProblemCategory = "Algorithms" | "Cryptography" | "CTF";

export type MatchStatus = "active" | "finished";

export type SupportedLanguage = "javascript" | "python" | "cpp";

export interface User {
  id: string;
  username: string;
  /** Emoji or image URL used as the player's avatar. */
  avatar: string;
  elo: number;
  rankTitle: string;
  isPremium: boolean;
  /** Win rate as a percentage, 0–100. */
  winRate: number;
}

export interface SampleIO {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: ProblemCategory;
  /** Markdown-formatted problem statement. */
  description: string;
  constraints: string[];
  sampleInputs: SampleIO[];
  testCases: TestCase[];
  /** Starter code shown in the editor, keyed by language. */
  starterCode: Record<SupportedLanguage, string>;
  /** Reference solution revealed post-match (premium feature). */
  optimalSolution: {
    language: SupportedLanguage;
    code: string;
    timeComplexity: string;
    spaceComplexity: string;
    explanation: string;
  };
}

export interface Match {
  id: string;
  player1: User;
  player2: User;
  problem: Problem;
  timeRemainingSeconds: number;
  status: MatchStatus;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
  matchesPlayed: number;
  wins: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  /** Pre-formatted timestamp label, e.g. "12:04". */
  timestamp: string;
  isSystem?: boolean;
}

export interface OpponentActivityEvent {
  id: string;
  /** Seconds into the match at which the event fires. */
  atSecond: number;
  label: string;
  type: "info" | "progress" | "warning" | "success";
}

export interface TestRunResult {
  testCaseId: string;
  label: string;
  passed: boolean;
  executionTimeMs: number;
  stdout: string;
  expected: string;
  received: string;
}

export interface MatchResult {
  outcome: "victory" | "defeat";
  eloDelta: number;
  completionTime: string;
  testsPassed: number;
  totalTests: number;
}
