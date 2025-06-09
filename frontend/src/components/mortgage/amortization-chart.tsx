"use client";

import type { AmortizationDataPoint } from "@/lib/mortgage";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChartIcon } from "lucide-react";

interface AmortizationChartProps {
  data: AmortizationDataPoint[];
  loanTermInYears: number;
}

const aggregateDataByYear = (data: AmortizationDataPoint[], loanTermInYears: number): any[] => {
  if (!data || data.length === 0) return [];

  const yearlyData: { [year: number]: { principalPaid: number; interestPaid: number } } = {};

  data.forEach(point => {
    const year = Math.ceil(point.month / 12);
    if (!yearlyData[year]) {
      yearlyData[year] = { principalPaid: 0, interestPaid: 0 };
    }
    yearlyData[year].principalPaid += point.principalPaid;
    yearlyData[year].interestPaid += point.interestPaid;
  });
  
  return Object.entries(yearlyData).map(([year, values]) => ({
    name: `Year ${year}`,
    principal: parseFloat(values.principalPaid.toFixed(2)),
    interest: parseFloat(values.interestPaid.toFixed(2)),
  }));
};


export function AmortizationChart({ data, loanTermInYears }: AmortizationChartProps) {
  const chartData = aggregateDataByYear(data, loanTermInYears);

  const chartConfig = {
    principal: {
      label: "Principal Paid",
      color: "hsl(var(--chart-1))",
    },
    interest: {
      label: "Interest Paid",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  if (!data || data.length === 0) {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center">
                    <BarChartIcon className="mr-2 h-6 w-6 text-primary" />
                    Payment Breakdown Over Time
                </CardTitle>
                <CardDescription>
                    Yearly principal and interest payments.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-96 text-muted-foreground">
                    Enter loan details to see the amortization chart.
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
            <BarChartIcon className="mr-2 h-6 w-6 text-primary" />
            Payment Breakdown Over Time
        </CardTitle>
        <CardDescription>
            Yearly principal and interest payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // interval={Math.max(0, Math.floor(loanTermInYears / 10) -1)} // Adjust interval for readability
            />
            <YAxis
              tickFormatter={(value) => `$${value / 1000}k`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="principal" stackId="a" fill="var(--color-principal)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="interest" stackId="a" fill="var(--color-interest)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
