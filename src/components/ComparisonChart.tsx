import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { runFIFO, runLRU, runOptimal, runClock } from "@/utils/pageReplacementAlgorithms";

interface ComparisonChartProps {
  referenceString: string;
  frameCount: number;
}

export const ComparisonChart = ({ referenceString, frameCount }: ComparisonChartProps) => {
  // Parse reference string
  const pages = referenceString
    .split(",")
    .map((s) => parseInt(s.trim()))
    .filter((n) => !isNaN(n));

  if (pages.length === 0) {
    return null;
  }

  // Run all algorithms
  const fifoSteps = runFIFO(pages, frameCount);
  const lruSteps = runLRU(pages, frameCount);
  const optimalSteps = runOptimal(pages, frameCount);
  const clockSteps = runClock(pages, frameCount);

  // Calculate stats for each
  const calculateStats = (steps: any[]) => {
    const faults = steps.filter((s) => s.pageFault).length;
    const hits = steps.filter((s) => !s.pageFault).length;
    return { faults, hits, total: steps.length };
  };

  const fifoStats = calculateStats(fifoSteps);
  const lruStats = calculateStats(lruSteps);
  const optimalStats = calculateStats(optimalSteps);
  const clockStats = calculateStats(clockSteps);

  const chartData = [
    {
      algorithm: "FIFO",
      pageFaults: fifoStats.faults,
      pageHits: fifoStats.hits,
      hitRatio: (fifoStats.hits / fifoStats.total) * 100,
    },
    {
      algorithm: "LRU",
      pageFaults: lruStats.faults,
      pageHits: lruStats.hits,
      hitRatio: (lruStats.hits / lruStats.total) * 100,
    },
    {
      algorithm: "Optimal",
      pageFaults: optimalStats.faults,
      pageHits: optimalStats.hits,
      hitRatio: (optimalStats.hits / optimalStats.total) * 100,
    },
    {
      algorithm: "Clock",
      pageFaults: clockStats.faults,
      pageHits: clockStats.hits,
      hitRatio: (clockStats.hits / clockStats.total) * 100,
    },
  ];

  const chartConfig = {
    pageFaults: {
      label: "Page Faults",
      color: "hsl(var(--destructive))",
    },
    pageHits: {
      label: "Page Hits",
      color: "hsl(var(--success))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Algorithm Comparison</CardTitle>
        <p className="text-sm text-muted-foreground">
          Performance comparison of all page replacement algorithms
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bar Chart */}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="algorithm" className="text-xs" />
              <YAxis 
                label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey="pageFaults"
                fill="var(--color-pageFaults)"
                radius={[8, 8, 0, 0]}
                name="Page Faults"
              />
              <Bar
                dataKey="pageHits"
                fill="var(--color-pageHits)"
                radius={[8, 8, 0, 0]}
                name="Page Hits"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Summary Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium">Algorithm</th>
                <th className="text-right py-2 px-4 font-medium">Page Faults</th>
                <th className="text-right py-2 px-4 font-medium">Page Hits</th>
                <th className="text-right py-2 px-4 font-medium">Hit Ratio</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row) => (
                <tr key={row.algorithm} className="border-b hover:bg-muted/50">
                  <td className="py-2 px-4 font-medium">{row.algorithm}</td>
                  <td className="text-right py-2 px-4 text-destructive">{row.pageFaults}</td>
                  <td className="text-right py-2 px-4 text-success">{row.pageHits}</td>
                  <td className="text-right py-2 px-4 text-primary font-semibold">
                    {row.hitRatio.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
