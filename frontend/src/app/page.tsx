"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";

import { MortgageForm } from "@/components/mortgage/mortgage-form";
import { MortgageResultsCard } from "@/components/mortgage/mortgage-results-card";
import { AmortizationChart } from "@/components/mortgage/amortization-chart";
import type { MortgageResponse } from "@/lib/mortgage";
import { useToast } from "@/hooks/use-toast";
import { MortgageChatbot } from "@/components/mortgage/mortgage-chatbot";


export default function MortgageMaestroPage() {
  const [result, setResult] = useState<MortgageResponse | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = (data: MortgageResponse) => {
    if (data.principal <= 0 || data.monthlyPayment <= 0 || data.totalPaid <= 0) {
      toast({
        title: "Calculation Error",
        description: "Received invalid data from server.",
        variant: "destructive",
      });
      setResult(null);
      return;
    }

    setResult(data);
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-10 md:mb-16">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary flex items-center justify-center">
          <DollarSign className="mr-3 h-10 w-10" />
          Mortgage Maestro
        </h1>
        <p className="text-lg text-foreground/80 mt-2">
          Calculate and visualize your mortgage payments with ease.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
        <div className="md:col-span-1 space-y-6">
          <MortgageForm onSubmit={handleFormSubmit} />
        </div>

        {result && (
          <div className="md:col-span-2 space-y-6 md:space-y-8">
            <MortgageResultsCard data={result} />
            {/* You can keep AmortizationChart here if backend eventually returns schedule */}
            {/* <AmortizationChart data={...} loanTermInYears={...} /> */}
          </div>
        )}

        {!result && (
          <div className="md:col-span-2 space-y-6 md:space-y-8">
            <AmortizationChart data={[]} loanTermInYears={0} />
            <MortgageChatbot />
          </div>
        )}
      </div>

      <footer className="text-center mt-12 md:mt-16 text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} Mortgage Maestro. All rights reserved.</p>
      </footer>
    </main>
  );
}
