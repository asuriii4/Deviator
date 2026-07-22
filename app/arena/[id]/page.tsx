import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArenaClient } from "@/components/arena/ArenaClient";
import { createMatch, getProblemById, problems } from "@/lib/mock-data";

interface ArenaPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return problems.map((problem) => ({ id: problem.id }));
}

export async function generateMetadata({
  params,
}: ArenaPageProps): Promise<Metadata> {
  const { id } = await params;
  const problem = getProblemById(id);
  return {
    title: problem
      ? `${problem.title} — 1v1 Arena | Kodeon`
      : "1v1 Arena | Kodeon",
  };
}

export default async function ArenaPage({ params }: ArenaPageProps) {
  const { id } = await params;
  const problem = getProblemById(id);
  if (!problem) notFound();

  const match = createMatch(problem.id);
  return <ArenaClient match={match} />;
}
