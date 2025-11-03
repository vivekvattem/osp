export type AlgorithmType = "FIFO" | "LRU" | "Optimal" | "Clock";

export interface PageFrame {
  page: number | null;
  isHit: boolean;
  isNew: boolean;
  lastUsed?: number;
  referenceBit?: number;
}

export interface SimulationStep {
  referenceString: number;
  frames: PageFrame[];
  pageFault: boolean;
  description: string;
  clockPointer?: number;
}

export interface SimulationStats {
  totalReferences: number;
  pageFaults: number;
  pageHits: number;
  hitRatio: number;
  faultRatio: number;
}
