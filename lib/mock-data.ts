import type {
  ChatMessage,
  LeaderboardEntry,
  Match,
  OpponentActivityEvent,
  Problem,
  User,
} from "@/types";

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

export const currentUser: User = {
  id: "u-001",
  username: "NullPointerX",
  avatar: "🦾",
  elo: 1540,
  rankTitle: "Diamond II",
  isPremium: false,
  winRate: 63,
};

export const opponentUser: User = {
  id: "u-002",
  username: "SegFaultSlayer",
  avatar: "👾",
  elo: 1512,
  rankTitle: "Diamond III",
  isPremium: true,
  winRate: 58,
};

/* ------------------------------------------------------------------ */
/* Problems                                                            */
/* ------------------------------------------------------------------ */

export const problems: Problem[] = [
  {
    id: "p-algo-01",
    title: "Shortest Signal Path",
    difficulty: "Medium",
    category: "Algorithms",
    description: `A mesh network has \`n\` relay nodes labeled \`0\` to \`n - 1\` and a list of bidirectional links \`edges[i] = [u, v, w]\`, where \`w\` is the latency of the link in milliseconds.

Given a source node \`src\` and a target node \`dst\`, return the **minimum total latency** of any path from \`src\` to \`dst\`. If no path exists, return \`-1\`.

## Input Format

- Line 1: three integers \`n\`, \`m\`, and two node ids \`src dst\`
- Next \`m\` lines: three integers \`u v w\` describing each link

## Output Format

A single integer — the minimum total latency, or \`-1\` if the target is unreachable.

> Tip: with up to \`10^5\` edges, a naive search will blow past the time limit. Think priority queues.`,
    constraints: [
      "2 <= n <= 10^4",
      "1 <= m <= 10^5",
      "0 <= u, v < n and u != v",
      "1 <= w <= 10^3",
      "src != dst",
    ],
    sampleInputs: [
      {
        input: "5 6 0 4\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3",
        output: "7",
        explanation: "The cheapest route is 0 → 2 → 1 → 3 → 4 with total latency 1 + 2 + 1 + 3 = 7.",
      },
      {
        input: "3 1 0 2\n0 1 10",
        output: "-1",
        explanation: "Node 2 is disconnected from the source, so no path exists.",
      },
    ],
    testCases: [
      { id: "t-algo-1", input: "5 6 0 4\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3", expectedOutput: "7", hidden: false },
      { id: "t-algo-2", input: "3 1 0 2\n0 1 10", expectedOutput: "-1", hidden: false },
      { id: "t-algo-3", input: "4 4 0 3\n0 1 1\n1 2 1\n2 3 1\n0 3 5", expectedOutput: "3", hidden: true },
    ],
    starterCode: {
      javascript: `/**
 * @param {number} n - number of nodes
 * @param {number[][]} edges - [u, v, w] latency links
 * @param {number} src
 * @param {number} dst
 * @returns {number} minimum latency or -1
 */
function shortestSignalPath(n, edges, src, dst) {
  // Your code here
  return -1;
}
`,
      python: `def shortest_signal_path(n: int, edges: list[list[int]], src: int, dst: int) -> int:
    """Return the minimum latency from src to dst, or -1 if unreachable."""
    # Your code here
    return -1
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int shortestSignalPath(int n, vector<array<int, 3>>& edges, int src, int dst) {
    // Your code here
    return -1;
}
`,
    },
    optimalSolution: {
      language: "python",
      code: `import heapq

def shortest_signal_path(n, edges, src, dst):
    # Build adjacency list: node -> [(neighbor, weight)]
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))

    # Dijkstra with a min-heap keyed on accumulated latency
    dist = [float("inf")] * n
    dist[src] = 0
    heap = [(0, src)]

    while heap:
        d, node = heapq.heappop(heap)
        if node == dst:
            return d          # first pop of dst is optimal
        if d > dist[node]:
            continue          # stale entry, skip
        for nxt, w in graph[node]:
            nd = d + w
            if nd < dist[nxt]:
                dist[nxt] = nd
                heapq.heappush(heap, (nd, nxt))

    return -1`,
      timeComplexity: "O((n + m) log n)",
      spaceComplexity: "O(n + m)",
      explanation:
        "Classic Dijkstra. The min-heap always expands the closest unsettled node, so the first time the target is popped its distance is provably optimal. Stale heap entries are skipped with the `d > dist[node]` guard instead of a decrease-key operation.",
    },
  },
  {
    id: "p-crypto-01",
    title: "XOR Cipher Heist",
    difficulty: "Medium",
    category: "Cryptography",
    description: `An intercepted transmission was encrypted with a **repeating-key XOR cipher**. Each byte of the plaintext was XOR'd with a byte of the key, cycling through the key repeatedly.

You know two things:

1. The key length is exactly \`3\`.
2. The plaintext is ASCII English text, and the most frequent byte in the plaintext is the **space character** (\`0x20\`).

Given the ciphertext as a hex string, recover and return the **plaintext**.

## Input Format

A single line containing the ciphertext encoded as a lowercase hex string (even length, up to 4096 hex chars).

## Output Format

The decrypted plaintext string.

> For each of the 3 key positions, find the most frequent ciphertext byte in that position's slice — XOR it with \`0x20\` to reveal that key byte.`,
    constraints: [
      "Key length is exactly 3 bytes",
      "Ciphertext length is a multiple of 2 (valid hex)",
      "Plaintext contains only printable ASCII + spaces",
      "Space (0x20) is the most frequent plaintext byte in every key slice",
    ],
    sampleInputs: [
      {
        input: "1c0d094816090b17091c",
        output: "the secret",
        explanation: 'With key bytes [0x68, 0x65, 0x6c] ("hel"), XOR-ing each ciphertext byte with the cycling key recovers "the secret".',
      },
    ],
    testCases: [
      { id: "t-cry-1", input: "1c0d094816090b17091c", expectedOutput: "the secret", hidden: false },
      { id: "t-cry-2", input: "0e090d0f45041d0b1849", expectedOutput: "flag hunt!", hidden: true },
      { id: "t-cry-3", input: "1a", expectedOutput: "r", hidden: true },
    ],
    starterCode: {
      javascript: `/**
 * @param {string} hexCiphertext - repeating-key XOR ciphertext (key length 3)
 * @returns {string} recovered plaintext
 */
function breakXorCipher(hexCiphertext) {
  // Your code here
  return "";
}
`,
      python: `def break_xor_cipher(hex_ciphertext: str) -> str:
    """Recover the plaintext from a repeating-key XOR cipher (key length 3)."""
    # Your code here
    return ""
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

string breakXorCipher(const string& hexCiphertext) {
    // Your code here
    return "";
}
`,
    },
    optimalSolution: {
      language: "python",
      code: `from collections import Counter

KEY_LEN = 3

def break_xor_cipher(hex_ciphertext):
    data = bytes.fromhex(hex_ciphertext)

    # Recover each key byte via frequency analysis:
    # the most common byte in each slice must be an
    # encrypted space (0x20).
    key = bytearray()
    for offset in range(KEY_LEN):
        chunk = data[offset::KEY_LEN]
        if not chunk:
            key.append(0)
            continue
        most_common_byte = Counter(chunk).most_common(1)[0][0]
        key.append(most_common_byte ^ 0x20)

    # Decrypt by XOR-ing with the cycling key
    plaintext = bytes(
        b ^ key[i % KEY_LEN] for i, b in enumerate(data)
    )
    return plaintext.decode("ascii")`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      explanation:
        "XOR is self-inverse, so recovering the key breaks the cipher. Slicing the ciphertext by key position reduces the problem to 3 independent single-byte XOR ciphers, each cracked instantly with the space-frequency heuristic.",
    },
  },
  {
    id: "p-ctf-01",
    title: "Operation Backdoor: Log Forensics",
    difficulty: "Hard",
    category: "CTF",
    description: `A compromised server left behind an access log. The attacker exfiltrated a flag **one character at a time** — each log line encodes one character, but only lines from the attacker's session are relevant.

## The Log Format

Each line looks like: \`<timestamp> <session_id> <status_code> <payload>\`

Recover the flag using these rules:

1. Only lines where \`session_id\` ends in \`"x7"\` belong to the attacker.
2. Only lines with \`status_code == 200\` carried data.
3. The \`payload\` on each matching line is a **decimal number** — take it modulo \`128\` and interpret it as an ASCII code.
4. Concatenate the characters **in order of timestamp** (timestamps are integers; they may appear out of order in the log).

## Input Format

- Line 1: integer \`k\` — number of log lines
- Next \`k\` lines: \`timestamp session_id status_code payload\`

## Output Format

The recovered flag string, e.g. \`FLAG{...}\`.`,
    constraints: [
      "1 <= k <= 10^4",
      "0 <= timestamp <= 10^9 (all matching timestamps are unique)",
      "session_id is alphanumeric, 4-12 chars",
      "0 <= payload <= 10^9",
      "The recovered flag is printable ASCII",
    ],
    sampleInputs: [
      {
        input: "5\n30 ab9x7 200 198\n10 ab9x7 200 70\n99 zz1q4 200 88\n20 ab9x7 200 332\n40 ab9x7 404 65",
        output: "FLF",
        explanation:
          "Attacker lines with status 200, sorted by timestamp: t=10 (70 % 128 = 70 = 'F'), t=20 (332 % 128 = 76 = 'L'), t=30 (198 % 128 = 70 = 'F'). The 404 line and foreign session are ignored.",
      },
    ],
    testCases: [
      { id: "t-ctf-1", input: "5\n30 ab9x7 200 198\n10 ab9x7 200 70\n99 zz1q4 200 88\n20 ab9x7 200 332\n40 ab9x7 404 65", expectedOutput: "FLF", hidden: false },
      { id: "t-ctf-2", input: "3\n2 kx7 200 105\n1 kx7 200 104\n3 kx7 200 33", expectedOutput: "hi!", hidden: true },
      { id: "t-ctf-3", input: "1\n5 q9x7 500 70", expectedOutput: "", hidden: true },
    ],
    starterCode: {
      javascript: `/**
 * @param {string} rawLog - full log input (first line is the line count)
 * @returns {string} the recovered flag
 */
function recoverFlag(rawLog) {
  // Your code here
  return "";
}
`,
      python: `def recover_flag(raw_log: str) -> str:
    """Parse the access log and reconstruct the exfiltrated flag."""
    # Your code here
    return ""
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

string recoverFlag(const string& rawLog) {
    // Your code here
    return "";
}
`,
    },
    optimalSolution: {
      language: "python",
      code: `def recover_flag(raw_log):
    lines = raw_log.strip().split("\\n")
    k = int(lines[0])

    events = []
    for line in lines[1 : k + 1]:
        ts, session, status, payload = line.split()
        # Rule 1 + 2: attacker session AND successful request
        if session.endswith("x7") and status == "200":
            events.append((int(ts), int(payload) % 128))

    # Rule 4: reorder by timestamp before decoding
    events.sort()
    return "".join(chr(code) for _, code in events)`,
      timeComplexity: "O(k log k)",
      spaceComplexity: "O(k)",
      explanation:
        "Filter first, decode later. Applying the session and status filters up front keeps the sort small, and sorting by timestamp before joining guarantees the characters come out in exfiltration order regardless of log ordering.",
    },
  },
];

export function getProblemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

/* ------------------------------------------------------------------ */
/* Matches                                                             */
/* ------------------------------------------------------------------ */

export const MATCH_DURATION_SECONDS = 600;

export function createMatch(problemId: string): Match {
  const problem = getProblemById(problemId) ?? problems[0];
  return {
    id: `m-${problem.id}`,
    player1: currentUser,
    player2: opponentUser,
    problem,
    timeRemainingSeconds: MATCH_DURATION_SECONDS,
    status: "active",
  };
}

/* ------------------------------------------------------------------ */
/* Chat + opponent activity                                            */
/* ------------------------------------------------------------------ */

export const initialChatMessages: ChatMessage[] = [
  { id: "c-1", senderId: "system", senderName: "System", text: "Match found! Both players locked in. GLHF ⚔️", timestamp: "00:00", isSystem: true },
  { id: "c-2", senderId: "u-002", senderName: "SegFaultSlayer", text: "gl hf, hope you warmed up 😏", timestamp: "00:12" },
  { id: "c-3", senderId: "u-001", senderName: "NullPointerX", text: "you too. no hidden test case excuses this time", timestamp: "00:25" },
];

export const opponentActivityScript: OpponentActivityEvent[] = [
  { id: "oa-1", atSecond: 5, label: "Opponent opened the problem statement", type: "info" },
  { id: "oa-2", atSecond: 18, label: "Opponent switched language to Python", type: "info" },
  { id: "oa-3", atSecond: 35, label: "Opponent is typing…", type: "info" },
  { id: "oa-4", atSecond: 70, label: "Opponent ran tests — 0/3 passed", type: "warning" },
  { id: "oa-5", atSecond: 110, label: "Opponent is typing furiously 🔥", type: "info" },
  { id: "oa-6", atSecond: 160, label: "Opponent ran tests — 1/3 passed", type: "progress" },
  { id: "oa-7", atSecond: 220, label: "Opponent paused… reading constraints again", type: "info" },
  { id: "oa-8", atSecond: 290, label: "Opponent ran tests — 2/3 passed", type: "progress" },
  { id: "oa-9", atSecond: 380, label: "Opponent hit a runtime error on the hidden case", type: "warning" },
  { id: "oa-10", atSecond: 450, label: "Opponent is one edge case away — hurry!", type: "success" },
];

/* ------------------------------------------------------------------ */
/* Leaderboard                                                         */
/* ------------------------------------------------------------------ */

const RANK_TITLES: [threshold: number, title: string][] = [
  [2400, "Grandmaster"],
  [2200, "Master"],
  [2000, "Diamond I"],
  [1800, "Diamond II"],
  [1600, "Platinum I"],
  [1400, "Platinum II"],
  [1200, "Gold"],
  [1000, "Silver"],
  [0, "Bronze"],
];

function rankTitleForElo(elo: number): string {
  const entry = RANK_TITLES.find(([threshold]) => elo >= threshold);
  return entry ? entry[1] : "Bronze";
}

const USERNAME_POOL = [
  "ByteViper", "Qu4ntumQueen", "StackSm4sher", "AsyncAssassin", "HexHavoc",
  "L4mbdaLord", "CipherPhantom", "KernelKrusher", "R3gexRogue", "TuringTempest",
  "OpcodeOracle", "Nu11Division", "PacketPirate", "GreedyGoblin", "MutexMarauder",
  "BloomBandit", "TrieTitan", "HeapHermit", "DPDemon", "GraphGhoul",
  "BitflipBaron", "SaltedShadow", "PrimePredator", "VectorVandal", "CacheCorsair",
  "ShellShocker", "TokenTyrant", "LatencyLegend", "EntropyElf", "FuzzFatale",
  "MallocMenace", "PivotPhoenix", "RansomRonin", "SegtreeSage", "WombatWizard",
  "ZeroDayZed", "ApexArray", "BinaryBanshee", "CodeCoyote", "DeltaDrifter",
  "EchoEnigma", "ForkFury", "GlitchGuru", "HashHornet", "IndexImp",
  "JitterJack", "KeyloggerKid", "LoopLancer", "MemoMantis", "NodeNinja",
] as const;

const LANGUAGES = ["JavaScript", "Python", "C++", "Rust", "Go"] as const;

/** Deterministic PRNG so server and client render identical mock data. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const AVATARS = ["🐉", "🦊", "🤖", "👻", "🐺", "🦅", "🐍", "🎃", "⚡", "🔮", "🛰️", "🧠", "💀", "🕶️", "🚀"] as const;

export interface RichLeaderboardEntry extends LeaderboardEntry {
  favoriteLanguage: (typeof LANGUAGES)[number];
  weeklyPoints: number;
}

function buildLeaderboard(): RichLeaderboardEntry[] {
  const rand = mulberry32(1337);
  const entries: RichLeaderboardEntry[] = [];

  const topThree: Array<Pick<User, "username" | "avatar"> & { elo: number }> = [
    { username: "V0idWalker", avatar: "👑", elo: 2841 },
    { username: "Cryptomancer", avatar: "🧙", elo: 2764 },
    { username: "D34dlock", avatar: "🥷", elo: 2698 },
  ];

  let elo = 2650;
  for (let rank = 1; rank <= 100; rank++) {
    const isTop3 = rank <= 3;
    const base = isTop3 ? topThree[rank - 1] : null;

    if (!isTop3) {
      elo -= Math.floor(rand() * 22) + 4;
    }

    const username = base
      ? base.username
      : `${USERNAME_POOL[(rank - 4) % USERNAME_POOL.length]}${rank > USERNAME_POOL.length + 3 ? `_${rank}` : ""}`;
    const userElo = base ? base.elo : elo;
    const matchesPlayed = 80 + Math.floor(rand() * 420);
    const winRate = Math.min(92, Math.max(38, Math.round(48 + (userElo - 1500) / 40 + rand() * 10)));
    const wins = Math.round((matchesPlayed * winRate) / 100);

    entries.push({
      rank,
      user: {
        id: `lb-${rank}`,
        username,
        avatar: base ? base.avatar : AVATARS[Math.floor(rand() * AVATARS.length)],
        elo: userElo,
        rankTitle: rankTitleForElo(userElo),
        isPremium: rand() > 0.55,
        winRate,
      },
      points: userElo * 10 + Math.floor(rand() * 500),
      matchesPlayed,
      wins,
      favoriteLanguage: LANGUAGES[Math.floor(rand() * LANGUAGES.length)],
      weeklyPoints: Math.floor(rand() * 900) + 50,
    });
  }

  return entries;
}

export const leaderboard: RichLeaderboardEntry[] = buildLeaderboard();

/** The logged-in user's own leaderboard standing (shown in the sticky footer). */
export const currentUserStanding: RichLeaderboardEntry = {
  rank: 47,
  user: currentUser,
  points: currentUser.elo * 10 + 218,
  matchesPlayed: 212,
  wins: 134,
  favoriteLanguage: "JavaScript",
  weeklyPoints: 385,
};
