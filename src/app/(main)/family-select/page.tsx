'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function FamilySelectPage() {
  const { user, families, loading, userDoc } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (families.length === 0 && !loading) {
        router.push('/family-create');
    } else if (families.length > 0) {
        const preferredFamily = localStorage.getItem('fam360_selected_family');
        const primaryFamily = userDoc?.primaryFamily;
        if (preferredFamily && families.some(f => f.id === preferredFamily)) {
            setSelected(preferredFamily)
        } else if (primaryFamily && families.some(f => f.id === primaryFamily)) {
            setSelected(primaryFamily);
        } else {
            setSelected(families[0].id);
        }
    }
  }, [families, loading, router, userDoc]);

  const handleSelect = () => {
    if (!selected) return;
    setBusy(true);
    localStorage.setItem('fam360_selected_family', selected);
    router.push('/dashboard');
  };
  
  const goCreate = () => router.push("/family-create");

  if (loading || families.length === 0) {
    return <div className="flex h-screen items-center justify-center">Loading families...</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-xl">
      <Card className="shadow-modern">
        <CardHeader>
          <CardTitle>Select a Family</CardTitle>
          <CardDescription>Choose the family you want to manage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {families.length > 1 ? (
            <>
              <select
                className="w-full border rounded-md p-3 bg-background"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {families.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.data.familyName}
                  </option>
                ))}
              </select>
              <Button disabled={!selected || busy} onClick={handleSelect} className="w-full">
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">You are a member of one family. You will be redirected automatically.</p>
               <Button disabled={busy} onClick={handleSelect} className="w-full">
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue to Dashboard
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
