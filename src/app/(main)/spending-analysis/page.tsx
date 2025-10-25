
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { useFamily } from "@/hooks/use-family";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartConfig
} from "@/components/ui/chart";

const chartConfig = {
    expense: {
      label: "Expense",
      color: "#ef4444",
    },
    income: {
      label: "Income",
      color: "#22c55e",
    },
    investment: {
      label: "Investment",
      color: "#3b82f6",
    },
  } satisfies ChartConfig;

export default function SpendingAnalysisPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { currentFamily } = useFamily();
  const familyId = currentFamily?.id;
  const router = useRouter();

  const handlePrevMonth = () => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

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

  useEffect(() => {
    fetchTransactions();
  }, [familyId]);

  const spendingByPaidBy = useMemo(() => {
    const spending: Record<string, { expense: number; income: number; investment: number }> = {};

    transactions
      .forEach(t => {
        if (!spending[t.paidBy]) {
          spending[t.paidBy] = { expense: 0, income: 0, investment: 0 };
        }
        spending[t.paidBy][t.type] += t.amount;
      });

    return Object.entries(spending).map(([paidBy, values]) => ({
      paidBy,
      ...values,
    }));
  }, [transactions, selectedDate]);


  return (
    <div className="container mx-auto p-4 relative min-h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
            <Button variant="outline" size="icon" onClick={() => router.push('/expense-management')}>
                <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="space-y-1 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-headline">Spending Analysis</h1>
            </div>
            <div/>
        </div>

        <div className="flex justify-center items-center mb-4">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="text-lg font-semibold mx-4">
                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="w-6 h-6" />
            </Button>
        </div>

        <div className="space-y-2 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight font-headline">Spending by Member</h2>
            <Card>
                <CardContent className="p-4">
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <BarChart data={spendingByPaidBy}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="paidBy"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
                            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                            <Bar dataKey="investment" fill="var(--color-investment)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
