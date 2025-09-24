
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type TransactionType = "expense" | "income" | "investment";

type Transaction = {
  id: number;
  type: TransactionType;
  date: Date;
  category: string;
  amount: number;
  paidBy: string;
  investmentType?: string;
  institution?: string;
  roi?: number;
  source?: string;
  frequency?: "one-time" | "recurring";
};

const initialTransactions: Transaction[] = [
  { id: 1, type: "expense", date: new Date("2024-07-20"), category: "Groceries", amount: 150.75, paidBy: "You" },
  { id: 2, type: "income", date: new Date("2024-07-19"), category: "Salary", amount: 2500.00, paidBy: "You", source: "Job" },
  { id: 3, type: "expense", date: new Date("2024-07-18"), category: "Gas Bill", amount: 75.20, paidBy: "You" },
  { id: 4, type: "investment", date: new Date("2024-07-17"), category: "Mutual Funds", amount: 500.00, paidBy: "You", investmentType: "Mutual Fund", institution: "Vanguard" },
  { id: 5, type: "expense", date: new Date("2024-07-21"), category: "Dinner Out", amount: 85.50, paidBy: "Partner" },
];


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const getBadgeVariant = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return 'default';
      case 'expense':
        return 'destructive';
      case 'investment':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getBadgeClass = (type: TransactionType) => {
    switch (type) {
        case 'income': return 'bg-green-500/20 text-green-700 border-green-500/30';
        case 'expense': return 'bg-red-500/20 text-red-700 border-red-500/30';
        case 'investment': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
        default: return '';
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight font-headline">All Transactions</h1>
            <p className="text-muted-foreground">
                A complete history of your family's financial activities.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Browse through your expenses, income, and investments.</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Paid By / Source</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {transactions.map((t) => (
                    <TableRow key={t.id}>
                    <TableCell>{format(t.date, "PPP")}</TableCell>
                    <TableCell className="font-medium">{t.category}</TableCell>
                    <TableCell>
                        <Badge variant={getBadgeVariant(t.type)} className={cn("capitalize", getBadgeClass(t.type))}>
                            {t.type}
                        </Badge>
                    </TableCell>
                    <TableCell>{t.paidBy}</TableCell>
                    <TableCell className={`text-right font-semibold ${t.type === 'income' ? 'text-green-600' : t.type === 'expense' ? 'text-red-600' : 'text-blue-600'}`}>
                        {t.type === 'expense' && '- '}${t.type === 'income' && '+ '}${t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    </div>
  );
}
