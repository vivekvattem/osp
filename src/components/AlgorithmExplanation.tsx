import { AlgorithmType } from "@/types/pageReplacement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AlgorithmExplanationProps {
  algorithm: AlgorithmType;
}

const explanations: Record<AlgorithmType, { title: string; description: string }> = {
  FIFO: {
    title: "FIFO (First In First Out)",
    description:
      "The simplest page replacement algorithm. It maintains a queue of pages in memory. When a page fault occurs, the oldest page (first page that entered) is replaced. Easy to implement but doesn't consider page usage patterns, which can lead to suboptimal performance.",
  },
  LRU: {
    title: "LRU (Least Recently Used)",
    description:
      "Replaces the page that has not been used for the longest period of time. Based on the principle that pages used recently are likely to be used again soon. Requires tracking the time of last use for each page. Generally performs better than FIFO but requires more overhead.",
  },
  Optimal: {
    title: "Optimal Page Replacement",
    description:
      "The theoretical best algorithm that replaces the page that will not be used for the longest time in the future. Impossible to implement in practice (requires future knowledge), but serves as a benchmark to compare other algorithms. Guarantees the lowest possible page fault rate.",
  },
  Clock: {
    title: "Clock Algorithm (Second Chance)",
    description:
      "An approximation of LRU that uses a reference bit for each page. A circular list (clock) with a pointer is maintained. When a page fault occurs, the algorithm checks the reference bit: if 1, it's given a second chance (bit set to 0), if 0, the page is replaced. More efficient than LRU with lower overhead.",
  },
};

export const AlgorithmExplanation = ({ algorithm }: AlgorithmExplanationProps) => {
  const { title, description } = explanations[algorithm];

  return (
    <Card className="bg-gradient-card">
      <CardHeader>
        <CardTitle className="text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};
