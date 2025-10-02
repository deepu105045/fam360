
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getFamilyById, addFamilyMember, getUserByEmail } from "@/lib/firebase-helpers";
import { Family } from "@/lib/types";

interface FamilyDashboardProps {
  familyIds: string[];
}

const FamilyDashboard = ({ familyIds }: FamilyDashboardProps) => {
  const { user } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  useEffect(() => {
    const fetchFamilies = async () => {
      const familyData = await Promise.all(
        familyIds.map((id) => getFamilyById(id))
      );
      setFamilies(familyData.filter((f) => f !== null) as Family[]);
    };
    fetchFamilies();
  }, [familyIds]);

  useEffect(() => {
    if (families.length > 0) {
      setSelectedFamily(families[0]);
    }
  }, [families]);

  const handleAddMember = async () => {
    if (user && selectedFamily && newMemberEmail) {
        const newMember = await getUserByEmail(newMemberEmail);
        if(newMember){
            await addFamilyMember(selectedFamily.id, newMember.uid);
            // TODO: show confirmation message and update family members list
            setNewMemberEmail("");
        }else{
            // TODO: show an error message that the user was not found
        }

    }
  };

  if (!selectedFamily) {
    return <div>Loading family data...</div>;
  }

  return (
    <div>
      {families.length > 1 && (
        <select
          onChange={(e) =>
            setSelectedFamily(families.find((f) => f.id === e.target.value) || null)
          }
        >
          {families.map((family) => (
            <option key={family.id} value={family.id}>
              {family.name}
            </option>
          ))}
        </select>
      )}
      <h2>{selectedFamily.name}</h2>
      <ul>
        {selectedFamily.members.map((member) => (
          <li key={member.uid}>{member.uid} - {member.role}</li>
        ))}
      </ul>
      <div>
        <input
          type="email"
          placeholder="New member's email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
        />
        <button onClick={handleAddMember}>Add member</button>
      </div>
    </div>
  );
};

export default FamilyDashboard;
