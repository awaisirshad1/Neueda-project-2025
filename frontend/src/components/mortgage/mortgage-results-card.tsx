"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, TrendingUp, Landmark } from "lucide-react";

interface MortgageResultsCardProps {
  monthlyPayment: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  loanAmountAfterDownPayment: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export function MortgageResultsCard({
  monthlyPayment,
  totalInterestPaid,
  totalAmountPaid,
  loanAmountAfterDownPayment,
}: MortgageResultsCardProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <TrendingUp className="mr-2 h-6 w-6 text-primary" />
          Loan Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
          <div className="flex items-center">
            <BadgeDollarSign className="mr-2 h-5 w-5 text-accent" />
            <span className="text-sm font-medium">Monthly Payment</span>
          </div>
          <span className="text-lg font-semibold text-accent">
            {formatCurrency(monthlyPayment)}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
          <div className="flex items-center">
             <Landmark className="mr-2 h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Loan Amount (after Down Payment)</span>
          </div>
          <span className="text-lg font-semibold">
            {formatCurrency(loanAmountAfterDownPayment)}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
          <div className="flex items-center">
            <PercentIcon className="mr-2 h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Total Interest Paid</span>
          </div>
          <span className="text-lg font-semibold">
            {formatCurrency(totalInterestPaid)}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
          <div className="flex items-center">
            <WalletIcon className="mr-2 h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Total Amount Paid</span>
          </div>
          <span className="text-lg font-semibold">
            {formatCurrency(totalAmountPaid)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Placeholder icons if not available in lucide-react or for specific styling
function PercentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" x2="5" y1="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function WalletIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}
