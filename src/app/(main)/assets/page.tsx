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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Banknote } from "lucide-react";

type Asset = {
  id: number;
  name: string;
  value: number;
  category: string;
};

const initialAssets: Asset[] = [
  { id: 1, name: "Family Home", value: 350000, category: "Real Estate" },
  { id: 2, name: "Savings Account", value: 25000, category: "Bank Account" },
  { id: 3, name: "Stock Portfolio", value: 75000, category: "Investment" },
  { id: 4, name: "Toyota Camry", value: 18000, category: "Vehicle" },
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const totalNetWorth = assets.reduce((sum, asset) => sum + asset.value, 0);

  const handleAddAsset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newAsset: Asset = {
      id: assets.length + 1,
      name: formData.get("name") as string,
      value: parseFloat(formData.get("value") as string),
      category: "General",
    };
    setAssets([newAsset, ...assets]);
    setDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Asset Management</h1>
          <p className="text-muted-foreground">
            An overview of your family&apos;s assets and net worth.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAsset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Current Value</Label>
                <Input id="value" name="value" type="number" step="0.01" required />
              </div>
              <DialogFooter>
                <Button type="submit">Add Asset</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Total Net Worth</CardTitle>
          <CardDescription>The total estimated value of all your assets.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold tracking-tight text-primary">
            ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium font-headline">{asset.name}</CardTitle>
              <Banknote className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">{asset.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
