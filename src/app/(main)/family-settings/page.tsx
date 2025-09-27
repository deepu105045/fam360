
"use client";

import { useState } from "react";
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
import { PlusCircle, User, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type Member = {
  id: number;
  name: string;
  avatar: string;
};

const initialMembers: Member[] = [
  { id: 1, name: "You", avatar: "/avatars/01.png" },
  { id: 2, name: "Mom", avatar: "/avatars/02.png" },
  { id: 3, name: "Dad", avatar: "/avatars/03.png" },
];

export default function FamilySettingsPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { toast } = useToast();


  const handleAddMember = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember: Member = {
      id: Math.max(...members.map(m => m.id), 0) + 1,
      name: newMemberName,
      avatar: `/avatars/0${(members.length % 5) + 1}.png`, // Cycle through avatars
    };
    setMembers([...members, newMember]);
    setNewMemberName("");
    setAddDialogOpen(false);
    toast({ title: "Success", description: "Family member added." });
  };

  const handleEditMember = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingMember || !editingMember.name.trim()) return;

    setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
    setEditDialogOpen(false);
    setEditingMember(null);
    toast({ title: "Success", description: "Family member updated." });
  };
  
  const handleDeleteMember = (memberId: number) => {
    // Prevent deleting the main user
    if (memberId === 1) {
        toast({ title: "Error", description: "You cannot remove yourself from the family.", variant: "destructive" });
        return;
    }
    setMembers(members.filter(m => m.id !== memberId));
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
                <Label htmlFor="name">Member Name</Label>
                <Input id="name" name="name" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit">Add Member</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Family Members</CardTitle>
          <CardDescription>A list of all members in your family group.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{member.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(member)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                   <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteMember(member.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
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
                    value={editingMember?.name || ''} 
                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, name: e.target.value } : null)} 
                    required 
                />
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
