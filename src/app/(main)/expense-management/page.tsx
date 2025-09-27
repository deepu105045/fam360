
"use client";

import { useState, useMemo } from "react";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

// Using sample data. In a real app, this would come from an API.
const initialTransactions: Transaction[] = [
    { id: 1, type: "expense", date: new Date(), category: "Groceries", amount: 150.75, paidBy: "You" },
    { id: 2, type: "income", date: new Date(), category: "Salary", amount: 2500.00, paidBy: "You", source: "Job" },
    { id: 3, type: "expense", date: new Date("2024-06-15"), category: "Gas Bill", amount: 75.20, paidBy: "You" }, // Different month
    { id: 4, type: "expense", date: new Date(), category: "Groceries", amount: 82.30, paidBy: "You" },
    { id: 5, type: "expense", date: new Date(), category: "Dinner Out", amount: 65.00, paidBy: "Partner" },
    { id: 6, type: "expense", date: new Date(), category: "Transport", amount: 45.50, paidBy: "You" },
    { id: 7, type: "expense", date: new Date(), category: "Dinner Out", amount: 120.00, paidBy: "You" },
];

type CategorySpending = {
  category: string;
  total: number;
  percentage: number;
};

export default function ExpenseManagementPage() {
  const [transactions] = useState<Transaction[]>(initialTransactions);

  const categorySpending = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const spending: Record<string, number> = {};
    let totalSpending = 0;

    transactions
        .filter(t => t.type === 'expense')
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
        })
        .forEach(t => {
            if (!spending[t.category]) {
                spending[t.category] = 0;
            }
            spending[t.category] += t.amount;
            totalSpending += t.amount;
        });

    if (totalSpending === 0) return [];
    
    return Object.entries(spending)
        .map(([category, total]) => ({
            category,
            total,
            percentage: (total / totalSpending) * 100,
        }))
        .sort((a, b) => b.total - a.total);

  }, [transactions]);

  const totalCurrentMonthSpending = useMemo(() => {
    return categorySpending.reduce((sum, item) => sum + item.total, 0);
  }, [categorySpending]);

  const getCategoryColor = (percentage: number) => {
    if (percentage > 50) return "bg-red-500";
    if (percentage > 25) return "bg-orange-500";
    return "bg-green-500";
  };
  

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 relative min-h-[calc(100vh-8rem)]">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Expense Summary</h1>
            <p className="text-muted-foreground">
                Your spending for the current month, grouped by category.
            </p>
        </div>

        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Total Monthly Spending</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold tracking-tight text-primary">
                ${totalCurrentMonthSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </CardContent>
        </Card>

        <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight font-headline">Category Breakdown</h2>
            {categorySpending.length > 0 ? (
                 categorySpending.map(({ category, total, percentage }) => (
                    <Card key={category}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-medium">{category}</p>
                                <p className="font-semibold text-foreground">
                                    ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <Progress value={percentage} className="h-2" />
                             <p className="text-right text-xs text-muted-foreground mt-1">{percentage.toFixed(1)}% of total</p>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p className="text-muted-foreground text-center py-8">No expenses recorded for this month.</p>
            )}
        </div>
        
        <div className="fixed bottom-8 right-8">
            <Button asChild size="lg" className="rounded-full h-16 w-16 shadow-lg">
                <Link href="/add-transaction">
                    <Plus className="h-8 w-8" />
                    <span className="sr-only">Add Transaction</span>
                </Link>
            </Button>
        </div>
    </div>
  );
}
