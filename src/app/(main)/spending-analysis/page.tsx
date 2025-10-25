
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
import { PieChart, Pie, Cell } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

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

  const spendingByMember = useMemo(() => {
    const spending: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!spending[t.paidBy]) {
          spending[t.paidBy] = 0;
        }
        spending[t.paidBy] += t.amount;
      });
    return Object.entries(spending).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  const incomeByMember = useMemo(() => {
    const income: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'income')
      .forEach(t => {
        if (!income[t.paidBy]) {
          income[t.paidBy] = 0;
        }
        income[t.paidBy] += t.amount;
      });
    return Object.entries(income).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  const investmentByMember = useMemo(() => {
    const investment: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'investment')
      .forEach(t => {
        if (!investment[t.paidBy]) {
          investment[t.paidBy] = 0;
        }
        investment[t.paidBy] += t.amount;
      });
    return Object.entries(investment).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);


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
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight font-headline">Member Spending Distribution</h2>
            <Card>
                <CardContent className="p-4 flex justify-center">
                    <ChartContainer config={{}} className="min-h-[300px] max-w-[400px]">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Pie data={spendingByMember} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {spendingByMember.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-2 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight font-headline">Member Income Distribution</h2>
            <Card>
                <CardContent className="p-4 flex justify-center">
                    <ChartContainer config={{}} className="min-h-[300px] max-w-[400px]">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Pie data={incomeByMember} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {incomeByMember.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-2 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight font-headline">Member Investment Distribution</h2>
            <Card>
                <CardContent className="p-4 flex justify-center">
                    <ChartContainer config={{}} className="min-h-[300px] max-w-[400px]">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Pie data={investmentByMember} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {investmentByMember.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
