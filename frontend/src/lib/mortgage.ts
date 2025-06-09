export interface AmortizationDataPoint {
  month: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  totalInterestPaidCumulative: number;
  totalPrincipalPaidCumulative: number;
}

export const calculateMonthlyPayment = (
  loanAmount: number,
  annualInterestRate: number,
  loanTermInYears: number
): number => {
  if (loanAmount <= 0 || annualInterestRate < 0 || loanTermInYears <= 0) {
    return 0;
  }

  const monthlyInterestRate = annualInterestRate / 12 / 100;
  const numberOfPayments = loanTermInYears * 12;

  if (monthlyInterestRate === 0) {
    return loanAmount / numberOfPayments;
  }

  const monthlyPayment =
    (loanAmount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  return monthlyPayment;
};

export const generateAmortizationSchedule = (
  loanAmount: number,
  annualInterestRate: number,
  loanTermInYears: number,
  monthlyPayment: number
): AmortizationDataPoint[] => {
  if (loanAmount <= 0 || annualInterestRate < 0 || loanTermInYears <= 0 || monthlyPayment <= 0) {
    return [];
  }

  const schedule: AmortizationDataPoint[] = [];
  let remainingBalance = loanAmount;
  const monthlyInterestRate = annualInterestRate / 12 / 100;
  const numberOfPayments = loanTermInYears * 12;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;

  for (let i = 1; i <= numberOfPayments; i++) {
    const interestForMonth = remainingBalance * monthlyInterestRate;
    let principalForMonth = monthlyPayment - interestForMonth;

    if (remainingBalance < monthlyPayment) {
      principalForMonth = remainingBalance;
    }

    remainingBalance -= principalForMonth;
    cumulativeInterest += interestForMonth;
    cumulativePrincipal += principalForMonth;

    if (remainingBalance < 0) remainingBalance = 0;

    schedule.push({
      month: i,
      interestPaid: parseFloat(interestForMonth.toFixed(2)),
      principalPaid: parseFloat(principalForMonth.toFixed(2)),
      remainingBalance: parseFloat(remainingBalance.toFixed(2)),
      totalInterestPaidCumulative: parseFloat(cumulativeInterest.toFixed(2)),
      totalPrincipalPaidCumulative: parseFloat(cumulativePrincipal.toFixed(2)),
    });

    if (remainingBalance <= 0) break;
  }

  return schedule;
};

export const calculateTotalInterestPaid = (amortizationSchedule: AmortizationDataPoint[]): number => {
  return amortizationSchedule.reduce((acc, curr) => acc + curr.interestPaid, 0);
};

export const calculateTotalAmountPaid = (loanAmount: number, totalInterestPaid: number): number => {
  return loanAmount + totalInterestPaid;
};


// Backend Integration

export interface MortgageRequest {
  loanAmount: number;
  interestRate: number;
  termYears: number;
  downPayment?: number;
}

export interface MortgageResponse {
  principal: number;
  monthlyPayment: number;
  totalPayments: number;
  totalPaid: number;
}

export async function fetchMortgageCalculation(
  request: MortgageRequest
): Promise<MortgageResponse> {
  const response = await fetch('http://localhost:9002/mortgage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch mortgage calculation');
  }

  return await response.json();
}
