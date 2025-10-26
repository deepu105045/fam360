
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Calendar as CalendarIcon, PlusCircle, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Transaction, TransactionType } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useFamily } from "@/hooks/use-family";
import { addTransaction } from "@/lib/transactions";
import { getQuickCategories, QuickCategories } from "@/lib/config";
import { Textarea } from "@/components/ui/textarea";

export default function AddTransactionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentFamily, isLoading: isFamilyLoading } = useFamily();
  const [activeTab, setActiveTab] = useState<TransactionType>("expense");

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [description, setDescription] = useState("");
  const [quickCategories, setQuickCategories] = useState<QuickCategories | null>(null);

  useEffect(() => {
    if (!isFamilyLoading && user?.email && currentFamily?.data?.memberEmails?.includes(user.email)) {
      setPaidBy(user.email);
    }
  }, [user, currentFamily, isFamilyLoading]);

  useEffect(() => {
    const fetchQuickCategories = async () => {
      const categories = await getQuickCategories();
      setQuickCategories(categories);
    };
    fetchQuickCategories();
  }, []);


  const resetForm = () => {
    setDate(new Date());
    setCategory("");
    setAmount("");
    setPaidBy(user?.email || "");
    setDescription("");
  };

  const handleAddTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!date || !amount || !paidBy) {
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

    if (!currentFamily) {
        toast({
            title: "Error",
            description: "No family selected. Please select a family first.",
            variant: "destructive"
        })
        return;
    }
    
    const newTransaction: Omit<Transaction, 'id'> = {
      familyId: currentFamily.id,
      type: activeTab,
      date,
      category: category || activeTab, // Default category to type if empty
      amount: parsedAmount,
      paidBy,
      description,
    };

    try {
      await addTransaction(newTransaction);
      toast({
          title: "Success!",
          description: `Your ${activeTab} has been added.`,
      })
      router.push('/expense-management');
    } catch (error) {
      console.error("Error adding transaction: ", error);
      toast({
          title: "Error",
          description: "Could not add transaction. Please try again.",
          variant: "destructive"
      })
    }
  };

  const renderQuickCategoryButtons = (categories: string[] | undefined) => {
    if (!categories) {
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    }
    return categories.map((cat) => (
      <Button
        type="button"
        variant="outline"
        size="sm"
        key={cat}
        onClick={() => setCategory(cat)}
      >
        {cat}
      </Button>
    ));
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
                <Label htmlFor="paidBy">Paid By / Member</Label>
                <Select onValueChange={setPaidBy} value={paidBy} >
                    <SelectTrigger id="paidBy">
                        <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                        {isFamilyLoading ? (
                            <div className="flex items-center justify-center p-2">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>Loading...</span>
                            </div>
                        ) : (
                            (currentFamily?.data?.memberEmails || []).map((email) => (
                                <SelectItem key={email} value={email}>
                                    {email}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
        </div>

        <div className="space-y-2 pt-4">
          <Label>Quick Categories</Label>
          <div className="flex flex-wrap gap-2">
            {activeTab === 'expense' && renderQuickCategoryButtons(quickCategories?.expense)}
            {activeTab === 'income' && renderQuickCategoryButtons(quickCategories?.income)}
            {activeTab === 'investment' && renderQuickCategoryButtons(quickCategories?.investment)}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <div className="flex items-center mb-8 relative">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="absolute left-0">
                <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex-grow text-center">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Add Transaction</h1>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>New Transaction</CardTitle>
                <CardDescription>Select the transaction type and fill in the details.</CardDescription>
            </CardHeader>
            <CardContent className="pb-20">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TransactionType)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="expense">Expense</TabsTrigger>
                        <TabsTrigger value="income">Income</TabsTrigger>
                        <TabsTrigger value="investment">Investment</TabsTrigger>
                    </TabsList>
                    <form onSubmit={handleAddTransaction} className="space-y-4 mt-6">
                        {renderFormFields()}
                        <div className="fixed bottom-8 right-8 z-50">
                            <Button type="submit" size="lg" className="rounded-full h-16 w-48 shadow-lg flex items-center justify-center">
                                <PlusCircle className="mr-2 h-6 w-6"/>
                                <span className="text-lg">Add Transaction</span>
                            </Button>
                        </div>
                    </form>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
