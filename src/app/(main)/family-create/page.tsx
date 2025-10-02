"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { createFamily } from "@/lib/families";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function FamilyCreatePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [familyName, setFamilyName] = useState("");
  const [busy, setBusy] = useState(false);

  const handleCreate = async () => {
    if (!user || !familyName.trim()) return;
    setBusy(true);
    try {
      const familyId = await createFamily({ familyName: familyName.trim(), createdBy: user.uid });
      localStorage.setItem("fam360_selected_family", familyId);
      router.push("/dashboard");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-xl">
      <Card className="shadow-modern">
        <CardHeader>
          <CardTitle>Create a Family</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Family name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
          />
          <Button disabled={!familyName.trim() || busy} onClick={handleCreate} className="w-full">
            Create & Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


