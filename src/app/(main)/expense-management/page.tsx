
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Utensils, Bus, ShoppingBag, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TransactionType = "expense" | "income" | "investment";

export type Transaction = {
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

export default function ExpenseManagementPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();
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
        toast({
            title: "Error",
            description: "Please fill all mandatory fields.",
            variant: "destructive"
        })
        return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        toast({
            title: "Error",
            description: "Amount must be a number greater than 0.",
            variant: "destructive"
        })
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
    
    toast({
        title: "Success!",
        description: `Your ${activeTab} has been added.`,
    })
    resetForm();
  };

  const renderFormFields = () => {
    return (
      <>
        {/* Common Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCategory("Food")}><Utensils className="mr-2 h-4 w-4" />Food</Button>
                    <Button variant="outline" size="sm" onClick={() => setCategory("Transport")}><Bus className="mr-2 h-4 w-4" />Transport</Button>
                    <Button variant="outline" size="sm" onClick={() => setCategory("Shopping")}><ShoppingBag className="mr-2 h-4 w-4" />Shopping</Button>
                </div>
            </div>
        )}
        
        {/* Income Specific */}
        {activeTab === 'income' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
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
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
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

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Add Transaction</h1>
            <p className="text-muted-foreground">
            Add a new expense, income, or investment to your records.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>New Transaction</CardTitle>
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
                        <div className="flex justify-end pt-4">
                            <Button type="submit"><PlusCircle className="mr-2 h-4 w-4"/> Add Transaction</Button>
                        </div>
                    </form>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
