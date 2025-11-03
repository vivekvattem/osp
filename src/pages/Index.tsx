import { useState, useEffect } from "react";
import { AlgorithmType, SimulationStep, SimulationStats } from "@/types/pageReplacement";
import { runFIFO, runLRU, runOptimal, runClock } from "@/utils/pageReplacementAlgorithms";
import { MemoryFrame } from "@/components/MemoryFrame";
import { ControlPanel } from "@/components/ControlPanel";
import { StatisticsPanel } from "@/components/StatisticsPanel";
import { AlgorithmExplanation } from "@/components/AlgorithmExplanation";
import { SimulationChart } from "@/components/SimulationChart";
import { ComparisonChart } from "@/components/ComparisonChart";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const Index = () => {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("FIFO");
  const [referenceString, setReferenceString] = useState("7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1");
  const [frameCount, setFrameCount] = useState(3);
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [stats, setStats] = useState<SimulationStats | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  const calculateStats = (steps: SimulationStep[]): SimulationStats => {
    const pageFaults = steps.filter((step) => step.pageFault).length;
    const pageHits = steps.filter((step) => !step.pageFault).length;
    return {
      totalReferences: steps.length,
      pageFaults,
      pageHits,
      hitRatio: pageHits / steps.length,
      faultRatio: pageFaults / steps.length,
    };
  };

  const handleStart = () => {
    try {
      const pages = referenceString
        .split(",")
        .map((s) => parseInt(s.trim()))
        .filter((n) => !isNaN(n));

      if (pages.length === 0) {
        toast.error("Please enter a valid reference string");
        return;
      }

      let simulationSteps: SimulationStep[];
      switch (algorithm) {
        case "FIFO":
          simulationSteps = runFIFO(pages, frameCount);
          break;
        case "LRU":
          simulationSteps = runLRU(pages, frameCount);
          break;
        case "Optimal":
          simulationSteps = runOptimal(pages, frameCount);
          break;
        case "Clock":
          simulationSteps = runClock(pages, frameCount);
          break;
      }

      setSteps(simulationSteps);
      setCurrentStep(0);
      setIsSimulating(true);
      setStats(calculateStats(simulationSteps));
      toast.success("Simulation started!");
    } catch (error) {
      toast.error("Error starting simulation");
    }
  };

  const handleReset = () => {
    setCurrentStep(-1);
    setIsSimulating(false);
    setIsPlaying(false);
    setSteps([]);
    setStats(null);
    toast.info("Simulation reset");
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const currentStepData = steps[currentStep];
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white py-8 shadow-elevated">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Page Replacement Simulator</h1>
          <p className="text-white/90">
            Interactive visualization of memory management algorithms
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <ControlPanel
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              referenceString={referenceString}
              setReferenceString={setReferenceString}
              frameCount={frameCount}
              setFrameCount={setFrameCount}
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onReset={handleReset}
              onStart={handleStart}
              speed={speed}
              setSpeed={setSpeed}
              isSimulating={isSimulating}
              canGoNext={currentStep < steps.length - 1}
              canGoPrevious={currentStep > 0}
            />
          </div>

          {/* Right Panel - Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <AlgorithmExplanation algorithm={algorithm} />

            {/* Comparison Chart - Always visible */}
            <ComparisonChart 
              referenceString={referenceString} 
              frameCount={frameCount} 
            />

            {isSimulating && currentStepData && (
              <>
                {/* Progress Bar */}
                <div className="bg-card rounded-lg shadow-card p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Memory Frames */}
                <div className="bg-card rounded-lg shadow-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Memory Frames</h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {currentStepData.frames.map((frame, index) => (
                      <MemoryFrame
                        key={index}
                        frame={frame}
                        frameNumber={index}
                        showClock={algorithm === "Clock"}
                        isClockPointer={
                          algorithm === "Clock" &&
                          currentStepData.clockPointer === index
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Current Step Info */}
                <div className="bg-card rounded-lg shadow-card p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Current Reference: <span className="text-primary text-2xl ml-2">{currentStepData.referenceString}</span>
                      </h3>
                      <div
                        className={`px-4 py-2 rounded-full font-semibold ${
                          currentStepData.pageFault
                            ? "bg-warning/20 text-warning"
                            : "bg-success/20 text-success"
                        }`}
                      >
                        {currentStepData.pageFault ? "PAGE FAULT" : "HIT"}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{currentStepData.description}</p>
                  </div>
                </div>

                {/* Statistics */}
                <StatisticsPanel stats={stats} />

                {/* Chart Visualization */}
                <SimulationChart steps={steps} currentStep={currentStep} />
              </>
            )}

            {!isSimulating && (
              <div className="bg-card rounded-lg shadow-card p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-semibold">Ready to Simulate</h3>
                  <p className="text-muted-foreground">
                    Configure your parameters and click "Start Simulation" to begin
                    visualizing the {algorithm} page replacement algorithm.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
