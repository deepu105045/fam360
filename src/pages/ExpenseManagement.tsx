
"use client";

import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowDown, ArrowUp, Scale, History, X, ArrowLeft, ChevronLeft, ChevronRight, Pencil, Trash2, EllipsisVertical } from "lucide-react";
import type { Transaction, TransactionType } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { useFamily } from "@/hooks/use-family";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteTransaction, updateTransaction } from "@/lib/transactions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

type CategorySpending = {
  category: string;
  total: number;
  percentage: number;
};

export default function ExpenseManagementPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { currentFamily } = useFamily();
  const familyId = currentFamily?.id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

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
    const env = import.meta.env.VITE_FIREBASE_ENV || 'dev';
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

  const categorySpending = useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    const spending: Record<string, number> = {};
    let totalSpending = 0;

    transactions
        .filter(t => t.type === 'expense')
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
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

  }, [transactions, selectedDate]);

  const incomeCategorySpending = useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    const spending: Record<string, number> = {};
    let totalSpending = 0;

    transactions
        .filter(t => t.type === 'income')
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
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

  }, [transactions, selectedDate]);

  const investmentCategorySpending = useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    const spending: Record<string, number> = {};
    let totalSpending = 0;

    transactions
        .filter(t => t.type === 'investment')
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
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

  }, [transactions, selectedDate]);

  const totalCurrentMonthSpending = useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    return transactions
        .filter(t => t.type === 'expense')
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}, [transactions, selectedDate]);

const totalCurrentMonthInvestment = useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    return transactions
        .filter(t => t.type === 'investment')
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}, [transactions, selectedDate]);

const totalCurrentMonthIncome = useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    return transactions
        .filter(t => t.type === 'income')
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}, [transactions, selectedDate]);


  const currentMonthTransactions = useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
    });
}, [transactions, selectedDate]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!familyId || !transactionToDelete) return;
    try {
      await deleteTransaction(familyId, transactionToDelete);
      toast({ title: "Success", description: "Transaction deleted successfully." });
      fetchTransactions(); // Refetch transactions after deleting
    } catch (error) {
      console.error("Error deleting transaction: ", error);
      toast({ title: "Error", description: "Could not delete transaction. Please try again.", variant: "destructive" });
    } finally {
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!familyId || !editingTransaction) return;

    const updatedData: Partial<Transaction> = {
        ...editingTransaction
    };

    try {
        await updateTransaction(familyId, editingTransaction.id, updatedData);
        toast({ title: "Success", description: "Transaction updated successfully." });
        setIsEditDialogOpen(false);
        setEditingTransaction(null);
        fetchTransactions(); // Refetch transactions after updating
    } catch (error) {
        console.error("Error updating transaction: ", error);
        toast({ title: "Error", description: "Could not update transaction. Please try again.", variant: "destructive" });
    }
  };


  return (
    <div className="container mx-auto p-4 relative min-h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
            <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="space-y-1 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-headline">Expense Management</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <EllipsisVertical className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsDrawerOpen(true)}>
                  View Transactions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/spending-analysis')}>
                  Spending Analysis
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

        <div className="flex flex-row gap-2 mb-6 sm:mb-8">
            <Card className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-medium">Spending</CardTitle>
                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xl font-bold tracking-tight text-primary">
                    {totalCurrentMonthSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </CardContent>
            </Card>
            <Card className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-medium">Income</CardTitle>
                    <ArrowUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xl font-bold tracking-tight text-primary">
                    {totalCurrentMonthIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </CardContent>
            </Card>
            <Card className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-medium">Investment</CardTitle>
                    <Scale className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xl font-bold tracking-tight text-primary">
                    {totalCurrentMonthInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight font-headline">Category Breakdown</h2>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TransactionType)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="expense">Expense</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="investment">Investment</TabsTrigger>
                </TabsList>
                <TabsContent value="expense">
                    {categorySpending.length > 0 ? (
                        categorySpending.map(({ category, total, percentage }) => (
                            <Card key={category} className="mt-2">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-medium">{category}</p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                </TabsContent>
                <TabsContent value="income">
                    {incomeCategorySpending.length > 0 ? (
                        incomeCategorySpending.map(({ category, total, percentage }) => (
                            <Card key={category} className="mt-2">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-medium">{category}</p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <Progress value={percentage} className="h-2" />
                                    <p className="text-right text-xs text-muted-foreground mt-1">{percentage.toFixed(1)}% of total</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center py-8">No income recorded for this month.</p>
                    )}
                </TabsContent>
                <TabsContent value="investment">
                    {investmentCategorySpending.length > 0 ? (
                        investmentCategorySpending.map(({ category, total, percentage }) => (
                            <Card key={category} className="mt-2">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-medium">{category}</p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <Progress value={percentage} className="h-2" />
                                    <p className="text-right text-xs text-muted-foreground mt-1">{percentage.toFixed(1)}% of total</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center py-8">No investments recorded for this month.</p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
        
        <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50">
            <Button asChild size="lg" className="rounded-full shadow-lg px-6">
                <Link to="/add-transaction" className="flex items-center gap-2">
                    <Plus className="h-6 w-6" />
                    <span>Add Transaction</span>
                </Link>
            </Button>
        </div>

        {isDrawerOpen && (
             <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsDrawerOpen(false)}>
                <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-lg z-50 flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-bold">Current Month Transactions</h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)}>
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                    <div className="p-4 overflow-y-auto">
                        {currentMonthTransactions.length > 0 ? (
                            <ul className="space-y-4">
                                {currentMonthTransactions.map(t => (
                                    <li key={t.id} className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="mr-4">
                                                <p className="font-medium">{t.description}</p>
                                                <p className="text-sm text-muted-foreground">{t.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                                {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{new Date(t.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex ml-4">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No transactions for this month.</p>
                        )}
                    </div>
                </div>
            </div>
        )}

        {editingTransaction && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                        <DialogDescription>Update the details of your transaction.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Input id="edit-category" value={editingTransaction.category} onChange={(e) => setEditingTransaction({...editingTransaction, category: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-amount">Amount</Label>
                            <Input id="edit-amount" type="number" value={editingTransaction.amount} onChange={(e) => setEditingTransaction({...editingTransaction, amount: parseFloat(e.target.value) || 0})} />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        )}

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this transaction.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
