
"use client";

import { useState, useEffect } from "react";
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getFamiliesForUser, getFamilyMembers, addFamilyMember } from "@/lib/families";
import { getUserByEmail } from "@/lib/users";
import { User } from "@/lib/types";

export default function FamilySettingsPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const { toast } = useToast();

  // Assuming the first member is the admin, this needs to be revisited for a more robust role management
  const isCurrentUserAdmin = members.length > 0 && members[0].email === user?.email;

  useEffect(() => {
    if (!user?.email) return;

    const fetchFamilyData = async () => {
      try {
        const families = await getFamiliesForUser(user.email!);
        if (families.length > 0) {
          const currentFamilyId = families[0].id;
          setFamilyId(currentFamilyId);
          const memberEmails = await getFamilyMembers(currentFamilyId);
          const membersWithUserData = await Promise.all(
            memberEmails.map(async (email) => {
              return await getUserByEmail(email);
            })
          );
          setMembers(membersWithUserData.filter(m => m !== null) as User[]);
        }
      } catch (error) {
        console.error("Error fetching family data:", error);
        toast({ title: "Error", description: "Could not load family members.", variant: "destructive" });
      }
    };

    fetchFamilyData();
  }, [user, toast, user?.email]);

  const handleAddMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isCurrentUserAdmin) {
      toast({ title: "Error", description: "Only admins can add members.", variant: "destructive" });
      return;
    }
    if (!newMemberEmail.trim() || !familyId) return;

    try {
      await addFamilyMember(familyId, newMemberEmail);
      const memberEmails = await getFamilyMembers(familyId);
      const membersWithUserData = await Promise.all(
        memberEmails.map(async (email) => {
            return await getUserByEmail(email);
        })
      );
      setMembers(membersWithUserData.filter(m => m !== null) as User[]);
      setNewMemberEmail("");
      setAddDialogOpen(false);
      toast({ title: "Success", description: "Family member added." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEditMember = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isCurrentUserAdmin) {
      toast({ title: "Error", description: "Only admins can edit members.", variant: "destructive" });
      return;
    }
    if (!editingMember) return;
    toast({ title: "Success", description: "Family member updated." });
    setEditDialogOpen(false);
  };
  
  const handleDeleteMember = (memberId: string) => {
    if (!isCurrentUserAdmin) {
      toast({ title: "Error", description: "Only admins can remove members.", variant: "destructive" });
      return;
    }
    if (memberId === user?.uid) {
        toast({ title: "Error", description: "You cannot remove yourself from the family.", variant: "destructive" });
        return;
    }
    setMembers(members.filter(m => m.uid !== memberId));
    toast({ title: "Success", description: "Family member removed." });
  }

  const openEditDialog = (member: User) => {
    setEditingMember({ ...member });
    setEditDialogOpen(true);
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4 sm:gap-0">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Family Settings</h1>
          <p className="text-muted-foreground">
            Manage your family members.
          </p>
        </div>
        {isCurrentUserAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Family Member</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Member Email</Label>
                  <Input id="email" name="email" type="email" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} required />
                </div>
                <DialogFooter>
                  <Button type="submit">Add Member</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Family Members</CardTitle>
          <CardDescription>A list of all members in your family group.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.uid} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.photoURL} />
                    <AvatarFallback>{member.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.displayName}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                {isCurrentUserAdmin && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(member)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteMember(member.uid)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

       {/* Edit Dialog */}
       <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Family Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditMember} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Member Name</Label>
                <Input 
                    id="edit-name" 
                    name="edit-name" 
                    value={editingMember?.displayName || ''} 
                    readOnly
                />
              </div>
               <div className="space-y-2">
                <Label>Role</Label>
                 {/* This needs a more robust role management system */}
                 <p className="text-sm text-muted-foreground p-2">Member</p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  );
}
