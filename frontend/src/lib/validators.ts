import * as z from "zod";

export const mortgageFormSchema = z.object({
  loanAmount: z.coerce
    .number({ invalid_type_error: "Loan amount must be a number." })
    .positive({ message: "Loan amount must be greater than 0." }),
  interestRate: z.coerce
    .number({ invalid_type_error: "Interest rate must be a number." })
    .min(0, { message: "Interest rate cannot be negative." })
    .max(100, { message: "Interest rate seems too high." }),
  loanTerm: z.coerce
    .number({ invalid_type_error: "Loan term must be a number." })
    .int({ message: "Loan term must be a whole number of years." })
    .positive({ message: "Loan term must be greater than 0." }),
  downPayment: z.coerce
    .number({ invalid_type_error: "Down payment must be a number." })
    .min(0, { message: "Down payment cannot be negative." })
    .optional(),
}).refine(data => data.downPayment === undefined || data.downPayment < data.loanAmount, {
  message: "Down payment cannot be greater than or equal to loan amount.",
  path: ["downPayment"],
});

export type MortgageFormValues = z.infer<typeof mortgageFormSchema>;
