
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getFamilyMembers, addFamilyMember } from "@/lib/families";
import { Family, Membership, User } from "@/lib/types";
import { getUser } from "@/lib/users";

export default function FamilyPageClient({
  initialFamily,
  initialMembers,
  familyId,
}: {
  initialFamily: Family | null;
  initialMembers: (Membership & { user: User | null })[];
  familyId: string;
}) {
  const { user } = useAuth();
  const [family] = useState<Family | null>(initialFamily);
  const [members, setMembers] = useState<(Membership & { user: User | null })[]>(
    initialMembers
  );
  const [error, setError] = useState<string | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const handleAddMember = async () => {
    if (!user) {
      setError("You must be logged in to add a member.");
      return;
    }
    if (!newMemberEmail.trim()) {
      setError("Email cannot be empty.");
      return;
    }

    try {
      await addFamilyMember(familyId as string, newMemberEmail);
      setNewMemberEmail("");
      // Refetch members
      const memberData = await getFamilyMembers(familyId as string);
      const membersWithUserData = await Promise.all(
        memberData.map(async (member) => {
          const user = await getUser(member.userId);
          return { ...member, user };
        })
      );
      setMembers(membersWithUserData);
    } catch (err: any) {
      console.error("Error adding member:", err);
      setError(err.message || "Failed to add member. Please try again.");
    }
  };

  if (!family) {
    return <div>Family not found.</div>;
  }

  return (
    <div className="w-full max-w-4xl p-8 mx-auto">
      <h2 className="text-3xl font-bold">{family?.familyName}</h2>
      <div className="mt-8">
        <h3 className="text-2xl font-bold">Members</h3>
        <ul className="mt-4 space-y-2">
          {members.map((member) => (
            <li
              key={member.userId}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
            >
              <div>
                <p className="font-semibold">{member.user?.displayName}</p>
                <p className="text-sm text-gray-500">{member.user?.email}</p>
              </div>
              <p className="text-sm text-gray-500">{member.role}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-bold">Add Member</h3>
        <div className="flex mt-4 space-x-4">
          <input
            type="email"
            placeholder="Enter email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
          />
          <button
            onClick={handleAddMember}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Member
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
