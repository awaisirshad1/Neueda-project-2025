"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";

import { MortgageForm } from "@/components/mortgage/mortgage-form";
import { MortgageResultsCard } from "@/components/mortgage/mortgage-results-card";
import { AmortizationChart } from "@/components/mortgage/amortization-chart";
import {
  calculateMonthlyPayment,
  generateAmortizationSchedule,
  calculateTotalInterestPaid,
  calculateTotalAmountPaid,
  type AmortizationDataPoint,
} from "@/lib/mortgage";
import type { MortgageFormValues } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

interface MortgageCalculations {
  monthlyPayment: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  amortizationSchedule: AmortizationDataPoint[];
  loanAmountAfterDownPayment: number;
  loanTermInYears: number;
}

export default function MortgageMaestroPage() {
  const [calculations, setCalculations] = useState<MortgageCalculations | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = (values: MortgageFormValues) => {
    try {
      const loanAmount = values.loanAmount;
      const downPayment = values.downPayment || 0;
      const loanAmountAfterDownPayment = loanAmount - downPayment;

      if (loanAmountAfterDownPayment <= 0) {
        toast({
          title: "Error",
          description: "Loan amount after down payment must be positive.",
          variant: "destructive",
        });
        setCalculations(null);
        return;
      }
      
      const annualInterestRate = values.interestRate;
      const loanTermInYears = values.loanTerm;

      const monthlyPayment = calculateMonthlyPayment(
        loanAmountAfterDownPayment,
        annualInterestRate,
        loanTermInYears
      );

      if (isNaN(monthlyPayment) || !isFinite(monthlyPayment) || monthlyPayment <=0) {
         toast({
          title: "Calculation Error",
          description: "Could not calculate monthly payment. Please check inputs.",
          variant: "destructive",
        });
        setCalculations(null);
        return;
      }


      const amortizationSchedule = generateAmortizationSchedule(
        loanAmountAfterDownPayment,
        annualInterestRate,
        loanTermInYears,
        monthlyPayment
      );
      
      const totalInterestPaid = calculateTotalInterestPaid(amortizationSchedule);
      const totalAmountPaid = calculateTotalAmountPaid(loanAmountAfterDownPayment, totalInterestPaid);

      setCalculations({
        monthlyPayment,
        totalInterestPaid,
        totalAmountPaid,
        amortizationSchedule,
        loanAmountAfterDownPayment,
        loanTermInYears,
      });
    } catch (error) {
        toast({
          title: "Calculation Error",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
        setCalculations(null);
    }
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
        <div className="md:col-span-1">
          <MortgageForm onSubmit={handleFormSubmit} />
        </div>

        {calculations && (
          <div className="md:col-span-2 space-y-6 md:space-y-8">
            <MortgageResultsCard
              monthlyPayment={calculations.monthlyPayment}
              totalInterestPaid={calculations.totalInterestPaid}
              totalAmountPaid={calculations.totalAmountPaid}
              loanAmountAfterDownPayment={calculations.loanAmountAfterDownPayment}
            />
            <AmortizationChart data={calculations.amortizationSchedule} loanTermInYears={calculations.loanTermInYears} />
          </div>
        )}
        {!calculations && (
            <div className="md:col-span-2 space-y-6 md:space-y-8">
                 <AmortizationChart data={[]} loanTermInYears={0} />
            </div>
        )}
      </div>
      <footer className="text-center mt-12 md:mt-16 text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} Mortgage Maestro. All rights reserved.</p>
      </footer>
    </main>
  );
}
