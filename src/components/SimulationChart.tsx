import { SimulationStep } from "@/types/pageReplacement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

interface SimulationChartProps {
  steps: SimulationStep[];
  currentStep: number;
}

export const SimulationChart = ({ steps, currentStep }: SimulationChartProps) => {
  // Create chart data with cumulative faults and hits
  const chartData = steps.slice(0, currentStep + 1).map((step, index) => {
    const faultsUpToNow = steps.slice(0, index + 1).filter(s => s.pageFault).length;
    const hitsUpToNow = steps.slice(0, index + 1).filter(s => !s.pageFault).length;
    
    return {
      step: index + 1,
      reference: step.referenceString,
      faults: faultsUpToNow,
      hits: hitsUpToNow,
      isFault: step.pageFault ? 1 : 0,
      isHit: !step.pageFault ? 1 : 0,
    };
  });

  const chartConfig = {
    faults: {
      label: "Page Faults",
      color: "hsl(var(--destructive))",
    },
    hits: {
      label: "Page Hits",
      color: "hsl(var(--success))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="step" 
                label={{ value: 'Step', position: 'insideBottom', offset: -5 }}
                className="text-xs"
              />
              <YAxis 
                label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="faults"
                stroke="var(--color-faults)"
                strokeWidth={2}
                dot={{ fill: "var(--color-faults)", r: 4 }}
                activeDot={{ r: 6 }}
                name="Page Faults"
              />
              <Line
                type="monotone"
                dataKey="hits"
                stroke="var(--color-hits)"
                strokeWidth={2}
                dot={{ fill: "var(--color-hits)", r: 4 }}
                activeDot={{ r: 6 }}
                name="Page Hits"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
