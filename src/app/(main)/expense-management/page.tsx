
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { useFamily } from "@/hooks/use-family";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type CategorySpending = {
  category: string;
  total: number;
  percentage: number;
};

export default function ExpenseManagementPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { currentFamily } = useFamily();
  const familyId = currentFamily?.id;

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!familyId) {
        console.log("No familyId found.");
        return;
      }
      console.log("Fetching transactions for familyId:", familyId);
      const env = process.env.NEXT_PUBLIC_FIREBASE_ENV || 'dev';
      const transactionsCollection = collection(db, `fam360/${env}/families`, familyId, "transactions");
      const q = query(transactionsCollection);
      const querySnapshot = await getDocs(q);
      const fetchedTransactions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          date: data.date.toDate(),
        } as Transaction;
      });
      console.log("Fetched Transactions:", fetchedTransactions);
      setTransactions(fetchedTransactions);
    };

    fetchTransactions();
  }, [familyId]);

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
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions
        .filter(t => t.type === 'expense')
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}, [transactions]);

  const totalCurrentMonthIncome = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions
        .filter(t => t.type === 'income')
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalCurrentMonthSavings = totalCurrentMonthIncome - totalCurrentMonthSpending;

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 relative min-h-[calc(100vh-8rem)]">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Expense Management</h1>
            <p className="text-muted-foreground">
                Your income, expenses, and savings for the current month.
            </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-8 mb-8">
            <Card>
                <CardHeader>
                    <CardTitle>Total Monthly Income</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold tracking-tight text-primary">
                    ${totalCurrentMonthIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total Monthly Spending</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold tracking-tight text-primary">
                    ${totalCurrentMonthSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total Monthly Savings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold tracking-tight text-primary">
                    ${totalCurrentMonthSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </CardContent>
            </Card>
        </div>

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
