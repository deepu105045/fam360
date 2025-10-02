"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { getFamiliesForUser } from "@/lib/families";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FamilySelectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [families, setFamilies] = useState<Array<{ id: string; data: { familyName: string } }>>([]);
  const [selected, setSelected] = useState<string>("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const list = await getFamiliesForUser(user.uid);
      setFamilies(list);
      if (list.length === 1) {
        handleSelect(list[0].id);
        return;
      }
      if (list.length === 0) {
        router.push('/family-create');
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const handleSelect = (familyId: string) => {
    localStorage.setItem("fam360_selected_family", familyId);
    router.push("/dashboard");
  };

  const goCreate = () => router.push("/family-create");

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-xl">
      <Card className="shadow-modern">
        <CardHeader>
          <CardTitle>Select a Family</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {families.length > 0 ? (
            <>
              <select
                className="w-full border rounded-md p-3 bg-background"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="" disabled>
                  Choose your family
                </option>
                {families.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.data.familyName}
                  </option>
                ))}
              </select>
              <Button disabled={!selected || busy} onClick={() => handleSelect(selected)} className="w-full">
                Continue
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">No families found for your account.</p>
              <Button onClick={goCreate} className="w-full">Create a Family</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


