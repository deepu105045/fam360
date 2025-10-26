
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addAsset } from "@/lib/assets";
import { AssetType } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

const assetSchema = z.object({
    name: z.string().min(1, "Asset name is required"),
    type: z.nativeEnum(AssetType),
    amount: z.number().min(0, "Current value must be a positive number"),
    accountNumber: z.string().optional(),
    notes: z.string().optional(),
});

type AssetFormData = z.infer<typeof assetSchema>;

interface AddAssetFormProps {
    familyId: string;
    onAssetAdded: () => void;
}

export default function AddAssetForm({ familyId, onAssetAdded }: AddAssetFormProps) {
    const { register, handleSubmit, control, formState: { errors } } = useForm<AssetFormData>({
        resolver: zodResolver(assetSchema),
    });
    const { toast } = useToast();

    const onSubmit = async (data: AssetFormData) => {
        try {
            await addAsset(familyId, data);
            toast({ title: "Success", description: "Asset added successfully." });
            onAssetAdded();
        } catch (error) {
            console.error("Error adding asset: ", error);
            toast({ title: "Error", description: "Could not add asset. Please try again.", variant: "destructive" });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Asset Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="type">Asset Type</Label>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an asset type" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(AssetType).map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="amount">Current Value</Label>
                <Input id="amount" type="number" {...register("amount", { valueAsNumber: true })} />
                {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" {...register("accountNumber")} />
                {errors.accountNumber && <p className="text-red-500 text-xs">{errors.accountNumber.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" {...register("notes")} />
                {errors.notes && <p className="text-red-500 text-xs">{errors.notes.message}</p>}
            </div>

            <Button type="submit">Add Asset</Button>
        </form>
    );
}
