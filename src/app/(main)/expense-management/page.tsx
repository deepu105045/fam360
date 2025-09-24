
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Utensils, Bus, ShoppingBag, PlusCircle } from "lucide-react";

type TransactionType = "expense" | "income" | "investment";

type Transaction = {
  id: number;
  type: TransactionType;
  date: Date;
  category: string;
  amount: number;
  paidBy: string;
  // Expense specific
  // ...
  // Investment specific
  investmentType?: string;
  institution?: string;
  roi?: number;
  // Income specific
  source?: string;
  frequency?: "one-time" | "recurring";
};

const initialTransactions: Transaction[] = [
  { id: 1, type: "expense", date: new Date("2024-07-20"), category: "Groceries", amount: 150.75, paidBy: "You" },
  { id: 2, type: "income", date: new Date("2024-07-19"), category: "Salary", amount: 2500.00, paidBy: "You", source: "Job" },
  { id: 3, type: "expense", date: new Date("2024-07-18"), category: "Gas Bill", amount: 75.20, paidBy: "You" },
  { id: 4, type: "investment", date: new Date("2024-07-17"), category: "Mutual Funds", amount: 500.00, paidBy: "You", investmentType: "Mutual Fund", institution: "Vanguard" },
];


export default function ExpenseManagementPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [activeTab, setActiveTab] = useState<TransactionType>("expense");

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  
  // Investment state
  const [investmentType, setInvestmentType] = useState("");
  const [institution, setInstitution] = useState("");
  const [roi, setRoi] = useState("");

  // Income state
  const [source, setSource] = useState("");
  const [frequency, setFrequency] = useState<"one-time" | "recurring">("one-time");


  const resetForm = () => {
    setDate(new Date());
    setCategory("");
    setAmount("");
    setPaidBy("");
    setInvestmentType("");
    setInstitution("");
    setRoi("");
    setSource("");
    setFrequency("one-time");
  };

  const handleAddTransaction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!date || !category || !amount || !paidBy) {
        // Basic validation
        alert("Please fill all mandatory fields.");
        return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert("Amount must be a number greater than 0.");
        return;
    }
    
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      type: activeTab,
      date,
      category,
      amount: parsedAmount,
      paidBy,
      ...(activeTab === 'investment' && { investmentType, institution, roi: parseFloat(roi) || undefined }),
      ...(activeTab === 'income' && { source, frequency }),
    };

    setTransactions([newTransaction, ...transactions]);
    resetForm();
  };

  const renderFormFields = () => {
    return (
      <>
        {/* Common Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0.01" step="0.01" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="paidBy">Paid By / Source</Label>
                <Input id="paidBy" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} required />
            </div>
        </div>

        {/* Expense Specific */}
        {activeTab === 'expense' && (
            <div className="space-y-2 pt-4">
                <Label>Quick Categories</Label>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCategory("Food")}><Utensils className="mr-2 h-4 w-4" />Food</Button>
                    <Button variant="outline" size="sm" onClick={() => setCategory("Transport")}><Bus className="mr-2 h-4 w-4" />Transport</Button>
                    <Button variant="outline" size="sm" onClick={() => setCategory("Shopping")}><ShoppingBag className="mr-2 h-4 w-4" />Shopping</Button>
                </div>
            </div>
        )}
        
        {/* Income Specific */}
        {activeTab === 'income' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                 <div className="space-y-2">
                    <Label htmlFor="source">Income Source</Label>
                    <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select onValueChange={(value: "one-time" | "recurring") => setFrequency(value)} defaultValue={frequency}>
                        <SelectTrigger id="frequency">
                            <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="one-time">One-time</SelectItem>
                            <SelectItem value="recurring">Recurring</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        )}

        {/* Investment Specific */}
        {activeTab === 'investment' && (
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="investmentType">Investment Type</Label>
                    <Input id="investmentType" value={investmentType} onChange={(e) => setInvestmentType(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="institution">Institution / Platform</Label>
                    <Input id="institution" value={institution} onChange={(e) => setInstitution(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="roi">Expected Returns / ROI (%)</Label>
                    <Input id="roi" type="number" value={roi} onChange={(e) => setRoi(e.target.value)} />
                </div>
            </div>
        )}
      </>
    );
  };
  
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
            <h1 className="text-3xl font-bold tracking-tight font-headline">Expense Management</h1>
            <p className="text-muted-foreground">
            Track and manage your family's financial transactions.
            </p>
        </div>

        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Add a New Transaction</CardTitle>
                <CardDescription>Select the transaction type and fill in the details.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TransactionType)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="expense">Expense</TabsTrigger>
                        <TabsTrigger value="income">Income</TabsTrigger>
                        <TabsTrigger value="investment">Investment</TabsTrigger>
                    </TabsList>
                    <form onSubmit={handleAddTransaction} className="space-y-4 mt-6">
                        {renderFormFields()}
                        <div className="flex justify-end">
                            <Button type="submit"><PlusCircle className="mr-2 h-4 w-4"/> Add Transaction</Button>
                        </div>
                    </form>
                </Tabs>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Paid By</TableHead>
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

    