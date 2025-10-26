
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Plus, ArrowLeft, Pencil, Trash2, Wallet } from "lucide-react";
import { useFamily } from "../hooks/use-family";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Asset, AssetType } from "../lib/types";
import { deleteAsset } from "../lib/assets";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { useToast } from "../hooks/use-toast";
import AddAssetForm from "./add-asset-form";
import EditAssetForm from "./edit-asset-form";

export default function AssetManagementPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);
    const [isEditAssetDialogOpen, setIsEditAssetDialogOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<string | null>(null);
    const { currentFamily } = useFamily();
    const familyId = currentFamily?.id;
    const navigate = useNavigate();
    const { toast } = useToast();

    const fetchAssets = async () => {
        if (!familyId) return;
        const env = process.env.NODE_ENV || 'dev';
        const assetsCollection = collection(db, `fam360/${env}/families`, familyId, "assets");
        const q = query(assetsCollection);
        const querySnapshot = await getDocs(q);
        const fetchedAssets = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
            updatedAt: doc.data().updatedAt.toDate(),
        } as Asset));
        setAssets(fetchedAssets);
    };

    useEffect(() => {
        if (familyId) {
            fetchAssets();
        }
    }, [familyId]);

    const handleEdit = (asset: Asset) => {
        setEditingAsset(asset);
        setIsEditAssetDialogOpen(true);
    };

    const handleDelete = (assetId: string) => {
        setAssetToDelete(assetId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!familyId || !assetToDelete) return;
        try {
            await deleteAsset(familyId, assetToDelete);
            toast({ title: "Success", description: "Asset deleted successfully." });
            fetchAssets();
        } catch (error) {
            console.error("Error deleting asset: ", error);
            toast({ title: "Error", description: "Could not delete asset. Please try again.", variant: "destructive" });
        } finally {
            setIsDeleteDialogOpen(false);
            setAssetToDelete(null);
        }
    };

    const totalAssetValue = assets.reduce((total, asset) => total + asset.amount, 0);

    const groupedAssets = assets.reduce((acc, asset) => {
        if (!acc[asset.type]) {
            acc[asset.type] = [];
        }
        acc[asset.type].push(asset);
        return acc;
    }, {} as Record<AssetType, Asset[]>);

    return (
        <div className="container mx-auto p-4 relative min-h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
                <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-headline">Asset Management</h1>
                <div />
            </div>

            <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Asset Value</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{new Intl.NumberFormat('en-IN').format(totalAssetValue)}</div>
                    <p className="text-xs text-muted-foreground">
                        Across {Object.keys(groupedAssets).length} asset types
                    </p>
                </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {Object.entries(groupedAssets).map(([type, assets]) => {
                    const groupTotal = assets.reduce((acc, asset) => acc + asset.amount, 0);
                    return (
                        <AccordionItem value={type} key={type} className="border-none">
                            <AccordionTrigger className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                                <div className="flex justify-between w-full pr-4">
                                    <h2 className="text-lg font-semibold capitalize font-headline">{type.replace(/_/g, ' ')}</h2>
                                    <span className="text-lg font-semibold">{new Intl.NumberFormat('en-IN').format(groupTotal)}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {assets.map(asset => (
                                        <li key={asset.id} className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
                                            <div className="w-full flex items-center justify-between p-6 space-x-6">
                                                <div className="flex-1 truncate">
                                                    <div className="flex items-center space-x-3">
                                                        <h3 className="text-gray-900 dark:text-gray-100 text-sm font-medium truncate">{asset.name}</h3>
                                                    </div>
                                                    <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm truncate">{new Intl.NumberFormat('en-IN').format(asset.amount)}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="-mt-px flex divide-x divide-gray-200 dark:divide-gray-700">
                                                    <div className="w-0 flex-1 flex">
                                                        <button onClick={() => handleEdit(asset)} className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 dark:text-gray-300 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 dark:hover:text-gray-400">
                                                            <Pencil className="w-5 h-5 text-gray-400" />
                                                            <span className="ml-3">Edit</span>
                                                        </button>
                                                    </div>
                                                    <div className="-ml-px w-0 flex-1 flex">
                                                        <button onClick={() => handleDelete(asset.id)} className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 dark:text-gray-300 font-medium border border-transparent rounded-br-lg hover:text-gray-500 dark:hover:text-gray-400">
                                                            <Trash2 className="w-5 h-5 text-gray-400" />
                                                            <span className="ml-3">Delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>

            <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50">
                <Button onClick={() => setIsAddAssetDialogOpen(true)} size="lg" className="rounded-full shadow-lg px-6 flex items-center gap-2">
                    <Plus className="h-6 w-6" />
                    <span>Add Asset</span>
                </Button>
            </div>

            <Dialog open={isAddAssetDialogOpen} onOpenChange={setIsAddAssetDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Asset</DialogTitle>
                        <DialogDescription>Fill in the details of your new asset.</DialogDescription>
                    </DialogHeader>
                    <AddAssetForm familyId={familyId!} onAssetAdded={() => {
                        setIsAddAssetDialogOpen(false);
                        fetchAssets();
                    }} />
                </DialogContent>
            </Dialog>

            {editingAsset && (
                <Dialog open={isEditAssetDialogOpen} onOpenChange={setIsEditAssetDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Asset</DialogTitle>
                            <DialogDescription>Update the details of your asset.</DialogDescription>
                        </DialogHeader>
                        <EditAssetForm familyId={familyId!} asset={editingAsset} onAssetUpdated={() => {
                            setIsEditAssetDialogOpen(false);
                            fetchAssets();
                        }} />
                    </DialogContent>
                </Dialog>
            )}

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this asset.
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
