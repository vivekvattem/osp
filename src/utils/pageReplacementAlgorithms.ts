import { SimulationStep, PageFrame } from "@/types/pageReplacement";

export const runFIFO = (referenceString: number[], frameCount: number): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  const frames: (number | null)[] = new Array(frameCount).fill(null);
  let nextFrameIndex = 0;

  referenceString.forEach((page, index) => {
    const frameIndex = frames.indexOf(page);
    const isHit = frameIndex !== -1;

    if (isHit) {
      steps.push({
        referenceString: page,
        frames: frames.map((p, i) => ({
          page: p,
          isHit: i === frameIndex,
          isNew: false,
        })),
        pageFault: false,
        description: `Page ${page} found in frame ${frameIndex} (HIT)`,
      });
    } else {
      const emptyIndex = frames.indexOf(null);
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page;
        steps.push({
          referenceString: page,
          frames: frames.map((p, i) => ({
            page: p,
            isHit: false,
            isNew: i === emptyIndex,
          })),
          pageFault: true,
          description: `Page ${page} loaded into empty frame ${emptyIndex} (PAGE FAULT)`,
        });
      } else {
        const replacedPage = frames[nextFrameIndex];
        frames[nextFrameIndex] = page;
        steps.push({
          referenceString: page,
          frames: frames.map((p, i) => ({
            page: p,
            isHit: false,
            isNew: i === nextFrameIndex,
          })),
          pageFault: true,
          description: `Page ${page} replaced page ${replacedPage} in frame ${nextFrameIndex} (PAGE FAULT)`,
        });
        nextFrameIndex = (nextFrameIndex + 1) % frameCount;
      }
    }
  });

  return steps;
};

export const runLRU = (referenceString: number[], frameCount: number): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  const frames: (number | null)[] = new Array(frameCount).fill(null);
  const lastUsed: number[] = new Array(frameCount).fill(-1);

  referenceString.forEach((page, index) => {
    const frameIndex = frames.indexOf(page);
    const isHit = frameIndex !== -1;

    if (isHit) {
      lastUsed[frameIndex] = index;
      steps.push({
        referenceString: page,
        frames: frames.map((p, i) => ({
          page: p,
          isHit: i === frameIndex,
          isNew: false,
          lastUsed: lastUsed[i],
        })),
        pageFault: false,
        description: `Page ${page} found in frame ${frameIndex} (HIT)`,
      });
    } else {
      const emptyIndex = frames.indexOf(null);
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page;
        lastUsed[emptyIndex] = index;
        steps.push({
          referenceString: page,
          frames: frames.map((p, i) => ({
            page: p,
            isHit: false,
            isNew: i === emptyIndex,
            lastUsed: lastUsed[i],
          })),
          pageFault: true,
          description: `Page ${page} loaded into empty frame ${emptyIndex} (PAGE FAULT)`,
        });
      } else {
        let lruIndex = 0;
        let minLastUsed = lastUsed[0];
        for (let i = 1; i < frameCount; i++) {
          if (lastUsed[i] < minLastUsed) {
            minLastUsed = lastUsed[i];
            lruIndex = i;
          }
        }
        const replacedPage = frames[lruIndex];
        frames[lruIndex] = page;
        lastUsed[lruIndex] = index;
        steps.push({
          referenceString: page,
          frames: frames.map((p, i) => ({
            page: p,
            isHit: false,
            isNew: i === lruIndex,
            lastUsed: lastUsed[i],
          })),
          pageFault: true,
          description: `Page ${page} replaced LRU page ${replacedPage} in frame ${lruIndex} (PAGE FAULT)`,
        });
      }
    }
  });

  return steps;
};

export const runOptimal = (referenceString: number[], frameCount: number): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  const frames: (number | null)[] = new Array(frameCount).fill(null);

  referenceString.forEach((page, index) => {
    const frameIndex = frames.indexOf(page);
    const isHit = frameIndex !== -1;

    if (isHit) {
      steps.push({
        referenceString: page,
        frames: frames.map((p, i) => ({
          page: p,
          isHit: i === frameIndex,
          isNew: false,
        })),
        pageFault: false,
        description: `Page ${page} found in frame ${frameIndex} (HIT)`,
      });
    } else {
      const emptyIndex = frames.indexOf(null);
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page;
        steps.push({
          referenceString: page,
          frames: frames.map((p, i) => ({
            page: p,
            isHit: false,
            isNew: i === emptyIndex,
          })),
          pageFault: true,
          description: `Page ${page} loaded into empty frame ${emptyIndex} (PAGE FAULT)`,
        });
      } else {
        let farthestIndex = -1;
        let farthestDistance = -1;
        
        for (let i = 0; i < frameCount; i++) {
          const currentPage = frames[i];
          let nextUse = -1;
          
          for (let j = index + 1; j < referenceString.length; j++) {
            if (referenceString[j] === currentPage) {
              nextUse = j;
              break;
            }
          }
          
          if (nextUse === -1) {
            farthestIndex = i;
            break;
          }
          
          if (nextUse > farthestDistance) {
            farthestDistance = nextUse;
            farthestIndex = i;
          }
        }
        
        const replacedPage = frames[farthestIndex];
        frames[farthestIndex] = page;
        steps.push({
          referenceString: page,
          frames: frames.map((p, i) => ({
            page: p,
            isHit: false,
            isNew: i === farthestIndex,
          })),
          pageFault: true,
          description: `Page ${page} replaced optimal victim ${replacedPage} in frame ${farthestIndex} (PAGE FAULT)`,
        });
      }
    }
  });

  return steps;
};

export const runClock = (referenceString: number[], frameCount: number): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  const frames: (number | null)[] = new Array(frameCount).fill(null);
  const referenceBits: number[] = new Array(frameCount).fill(0);
  let clockPointer = 0;

  referenceString.forEach((page) => {
    const frameIndex = frames.indexOf(page);
    const isHit = frameIndex !== -1;

    if (isHit) {
      referenceBits[frameIndex] = 1;
      steps.push({
        referenceString: page,
        frames: frames.map((p, i) => ({
          page: p,
          isHit: i === frameIndex,
          isNew: false,
          referenceBit: referenceBits[i],
        })),
        pageFault: false,
        description: `Page ${page} found in frame ${frameIndex}, reference bit set to 1 (HIT)`,
        clockPointer,
      });
    } else {
      const emptyIndex = frames.indexOf(null);
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page;
        referenceBits[emptyIndex] = 1;
        clockPointer = (emptyIndex + 1) % frameCount;
        steps.push({
          referenceString: page,
          frames: frames.map((p, i) => ({
            page: p,
            isHit: false,
            isNew: i === emptyIndex,
            referenceBit: referenceBits[i],
          })),
          pageFault: true,
          description: `Page ${page} loaded into empty frame ${emptyIndex} (PAGE FAULT)`,
          clockPointer,
        });
      } else {
        while (referenceBits[clockPointer] === 1) {
          referenceBits[clockPointer] = 0;
          clockPointer = (clockPointer + 1) % frameCount;
        }
        
        const replacedPage = frames[clockPointer];
        frames[clockPointer] = page;
        referenceBits[clockPointer] = 1;
        const victimFrame = clockPointer;
        clockPointer = (clockPointer + 1) % frameCount;
        
        steps.push({
          referenceString: page,
          frames: frames.map((p, i) => ({
            page: p,
            isHit: false,
            isNew: i === victimFrame,
            referenceBit: referenceBits[i],
          })),
          pageFault: true,
          description: `Page ${page} replaced ${replacedPage} in frame ${victimFrame} (PAGE FAULT)`,
          clockPointer,
        });
      }
    }
  });

  return steps;
};
