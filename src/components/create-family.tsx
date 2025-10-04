
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createFamily } from "@/lib/families";

const CreateFamily = () => {
  const { user, actions } = useAuth();
  const [familyName, setFamilyName] = useState("");
  const [memberEmails, setMemberEmails] = useState('');

  const handleCreateFamily = async () => {
    if (user && familyName) {
      const members = memberEmails.split(',').map(email => email.trim()).filter(email => email);
      const familyId = await createFamily({
        familyName,
        createdBy: user.uid,
        memberEmails: members,
      });
      console.log("Family created with ID:", familyId);
      actions.refetchFamilies();
    }
  };

  return (
    <div>
      <h2>Create a new family</h2>
      <input
        type="text"
        placeholder="Family name"
        value={familyName}
        onChange={(e) => setFamilyName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Member emails (comma-separated)"
        value={memberEmails}
        onChange={(e) => setMemberEmails(e.target.value)}
      />
      <button onClick={handleCreateFamily}>Create family</button>
    </div>
  );
};

export default CreateFamily;
