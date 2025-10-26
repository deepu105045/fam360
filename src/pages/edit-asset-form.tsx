import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { updateAsset } from '../lib/assets';
import { Asset } from '../lib/types';
import { useState } from 'react';

export default function EditAssetForm({ asset, familyId, onAssetUpdated }: { asset: Asset, familyId: string, onAssetUpdated: () => void }) {
  const [name, setName] = useState(asset.name);
  const [value, setValue] = useState(asset.amount.toString());
  const [purchaseDate, setPurchaseDate] = useState(asset.purchaseDate);
  const [category, setCategory] = useState(asset.category);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateAsset(familyId, asset.id, {
      name,
      amount: parseFloat(value),
      purchaseDate,
      category,
      type: asset.type,
    });
    onAssetUpdated();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Asset Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="value">Value</Label>
        <Input id="value" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="purchaseDate">Purchase Date</Label>
        <Input id="purchaseDate" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <Button type="submit">Update Asset</Button>
    </form>
  );
}
