'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useFamily } from '@/hooks/use-family';
import { createFamily } from '@/lib/families';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Loader2 } from 'lucide-react';

export default function FamilyCreatePage() {
  const { user, userDoc } = useAuth();
  const { refreshFamilies } = useFamily();
  const navigate = useNavigate();
  const [familyName, setFamilyName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberEmails, setMemberEmails] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleAddMember = () => {
    if (memberEmail && !memberEmails.includes(memberEmail)) {
      setMemberEmails([...memberEmails, memberEmail]);
      setMemberEmail('');
    }
  };

  const handleRemoveMember = (emailToRemove: string) => {
    setMemberEmails(memberEmails.filter((email) => email !== emailToRemove));
  };

  const handleCreate = async () => {
    if (!user || !userDoc || !familyName.trim() || !userDoc.email) return;
    setBusy(true);
    setStatusMessage('Creating family...');

    const finalMemberEmails = [...new Set([userDoc.email, ...memberEmails])];

    const payload = {
        familyName: familyName.trim(),
        createdBy: user.uid,
        memberEmails: finalMemberEmails,
      };

    try {
      await createFamily(payload);
      await refreshFamilies();
      setStatusMessage('Family created! Redirecting to dashboard...');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create family:', error);
      setStatusMessage('Failed to create family. Please try again.');
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
              disabled={busy}
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
                disabled={busy}
              />
              <Button onClick={handleAddMember} variant="outline" disabled={busy}>
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {memberEmails.map((email) => (
                <div key={email} className="flex items-center justify-between rounded-md bg-secondary px-3 py-2 text-sm">
                  <span>{email}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(email)} disabled={busy}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button disabled={!familyName.trim() || busy} onClick={handleCreate} className="w-full">
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {busy ? 'Please wait' : 'Create & Continue'}
          </Button>
          {statusMessage && <p className="text-center text-sm text-muted-foreground mt-4">{statusMessage}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
