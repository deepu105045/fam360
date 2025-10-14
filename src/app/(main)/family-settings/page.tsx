
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
import { getUser } from "@/lib/users";
import { Membership, User } from "@/lib/types";

type Member = Membership & { user: User | null };

export default function FamilySettingsPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { toast } = useToast();

  const currentUserRole = members.find(m => m.userId === user?.uid)?.role;
  const isCurrentUserAdmin = currentUserRole === 'admin';

  useEffect(() => {
    if (!user?.email) return;

    const fetchFamilyData = async () => {
      try {
        const families = await getFamiliesForUser(user.email!);
        if (families.length > 0) {
          const currentFamilyId = families[0].id;
          setFamilyId(currentFamilyId);
          const memberData = await getFamilyMembers(currentFamilyId);
          const membersWithUserData = await Promise.all(
            memberData.map(async (member) => {
              const userData = await getUser(member.userId);
              return { ...member, user: userData };
            })
          );
          setMembers(membersWithUserData);
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
      const memberData = await getFamilyMembers(familyId);
      const membersWithUserData = await Promise.all(
        memberData.map(async (member) => {
          const userData = await getUser(member.userId);
          return { ...member, user: userData };
        })
      );
      setMembers(membersWithUserData);
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
    setMembers(members.filter(m => m.userId !== memberId));
    toast({ title: "Success", description: "Family member removed." });
  }

  const openEditDialog = (member: Member) => {
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
              <div key={member.userId} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.user?.photoURL} />
                    <AvatarFallback>{member.user?.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.user?.displayName}</p>
                    <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                  </div>
                </div>
                {isCurrentUserAdmin && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(member)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteMember(member.userId)}>
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
                    value={editingMember?.user?.displayName || ''} 
                    readOnly
                />
              </div>
               <div className="space-y-2">
                <Label>Role</Label>
                 <p className="text-sm text-muted-foreground p-2">{editingMember?.role}</p>
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
