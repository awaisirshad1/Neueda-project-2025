"use client";

import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Landmark,
  Percent,
  CalendarDays,
  Wallet,
  CalculatorIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mortgageFormSchema, type MortgageFormValues } from "@/lib/validators";

import { fetchMortgageCalculation } from "@/lib/mortgage";
import type { MortgageRequest, MortgageResponse } from "@/lib/mortgage";

interface MortgageFormProps {
  onSubmit: (values: MortgageResponse) => void;
  defaultValues?: Partial<MortgageFormValues>;
}

export function MortgageForm({ onSubmit, defaultValues }: MortgageFormProps) {
  const form = useForm<MortgageFormValues>({
    resolver: zodResolver(mortgageFormSchema),
    defaultValues: defaultValues || {
      loanAmount: 100000,
      interestRate: 5,
      loanTerm: 30,
      downPayment: 0,
    },
  });

  const handleFormSubmit = async (values: MortgageFormValues) => {
    const request: MortgageRequest = {
      loanAmount: values.loanAmount,
      interestRate: values.interestRate,
      termYears: values.loanTerm,
      ...(values.downPayment ? { downPayment: values.downPayment } : {}),
    };

    try {
      const response = await fetchMortgageCalculation(request);
      onSubmit(response);
    } catch (error) {
      console.error("Mortgage calculation failed:", error);
      // Optional: Display toast or error banner here
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <CalculatorIcon className="mr-2 h-6 w-6 text-primary" />
          Mortgage Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* Changed onSubmit to handleFormSubmit */}
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Landmark className="mr-2 h-4 w-4" />
                    Loan Amount ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 300000"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Percent className="mr-2 h-4 w-4" />
                    Interest Rate (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 5.25"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loanTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Loan Term (Years)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 30"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="downPayment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4" />
                    Down Payment ($) (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 20000"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
              Calculate Mortgage
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
