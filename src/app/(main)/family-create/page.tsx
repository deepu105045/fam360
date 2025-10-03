"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { createFamily } from "@/lib/families";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export default function FamilyCreatePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [familyName, setFamilyName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberEmails, setMemberEmails] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const handleAddMember = () => {
    if (memberEmail && !memberEmails.includes(memberEmail)) {
      setMemberEmails([...memberEmails, memberEmail]);
      setMemberEmail("");
    }
  };

  const handleRemoveMember = (emailToRemove: string) => {
    setMemberEmails(memberEmails.filter(email => email !== emailToRemove));
  };

  const handleCreate = async () => {
    if (!user || !familyName.trim()) return;
    setBusy(true);
    try {
      const familyId = await createFamily({
        familyName: familyName.trim(),
        createdBy: user.uid,
        memberEmails: memberEmails,
      });
      // The useFamily hook now handles family selection and local storage
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create family:", error);
      // Handle error, maybe show a toast
    }
    finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-xl">
      <Card className="shadow-modern">
        <CardHeader>
          <CardTitle>Create a Family</CardTitle>
          <CardDescription>Give your family a name and invite members.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Input
              placeholder="Family name"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Invite Members</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Member's email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
              />
              <Button onClick={handleAddMember} variant="outline">Add</Button>
            </div>
            <div className="space-y-2">
              {memberEmails.map((email) => (
                <div key={email} className="flex items-center justify-between rounded-md bg-secondary px-3 py-2 text-sm">
                  <span>{email}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(email)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button disabled={!familyName.trim() || busy} onClick={handleCreate} className="w-full">
            {busy ? "Creating..." : "Create & Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
