import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArenaClient } from "@/components/arena/ArenaClient";
import { createMatch, getProblemById, problems } from "@/lib/mock-data";

interface ArenaPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return problems.map((problem) => ({ id: problem.id }));
}

export function generateMetadata({ params }: ArenaPageProps): Metadata {
  const problem = getProblemById(params.id);
  return {
    title: problem
      ? `${problem.title} — 1v1 Arena | Kodeon`
      : "1v1 Arena | Kodeon",
  };
}

export default function ArenaPage({ params }: ArenaPageProps) {
  const problem = getProblemById(params.id);
  if (!problem) notFound();

  const match = createMatch(problem.id);
  return <ArenaClient match={match} />;
}
