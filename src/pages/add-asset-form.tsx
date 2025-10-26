import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useFamily } from '../hooks/use-family';
import { addAsset } from '../lib/assets';
import { useState } from 'react';

export default function AddAssetForm({ familyId, onAssetAdded }: { familyId: string, onAssetAdded: () => void }) {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addAsset(familyId, {
      name,
      value: parseFloat(value),
      purchaseDate,
      category,
    });
    setName('');
    setValue('');
    setPurchaseDate('');
    setCategory('');
    onAssetAdded();
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
      <Button type="submit">Add Asset</Button>
    </form>
  );
}
