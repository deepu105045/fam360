
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getUserFamilies } from "@/lib/firebase-helpers";
import CreateFamily from "./create-family";
import FamilyDashboard from "./family-dashboard";

const FamilyGate = () => {
  const { user, loading: authLoading } = useAuth();
  const [families, setFamilies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (user) {
      getUserFamilies(user.uid).then((familyIds) => {
        setFamilies(familyIds);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center">
        <p>Please log in or sign up to access your family dashboard.</p>
      </div>
    );
  }

  if (families.length === 0) {
    return <CreateFamily />;
  }

  return <FamilyDashboard familyIds={families} />;
};

export default FamilyGate;
