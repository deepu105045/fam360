
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createFamily } from "@/lib/firebase-helpers";

const CreateFamily = () => {
  const { user } = useAuth();
  const [familyName, setFamilyName] = useState("");

  const handleCreateFamily = async () => {
    if (user && familyName) {
      const familyId = await createFamily(familyName, user.uid);
      // TODO: Redirect to the family dashboard or show a success message
      console.log("Family created with ID:", familyId);
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
      <button onClick={handleCreateFamily}>Create family</button>
    </div>
  );
};

export default CreateFamily;
