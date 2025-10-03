
"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";
import { getFamiliesForUser, upsertUserDoc } from "@/lib/families";
import { FamilyDoc } from "@/lib/types";

interface FamilyContextType {
  families: Array<{ id: string; data: FamilyDoc }>;
  currentFamily: { id: string; data: FamilyDoc } | null;
  isLoading: boolean;
  switchFamily: (familyId: string) => void;
  refreshFamilies: () => void;
}

const FamilyContext = createContext<FamilyContextType | null>(null);

export const FamilyProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [families, setFamilies] = useState<Array<{ id: string; data: FamilyDoc }>>([]);
  const [currentFamily, setCurrentFamily] = useState<{ id: string; data: FamilyDoc } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFamilies = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Process any pending invitations for the user
      await upsertUserDoc(user.uid, { email: user.email });

      const userFamilies = await getFamiliesForUser(user.uid);
      setFamilies(userFamilies);
      if (userFamilies.length > 0) {
        // Check local storage for last selected family
        const lastFamilyId = localStorage.getItem("currentFamilyId");
        const familyToSelect = userFamilies.find(f => f.id === lastFamilyId) || userFamilies[0];
        setCurrentFamily(familyToSelect);
        localStorage.setItem("currentFamilyId", familyToSelect.id);
      } else {
        // No families, redirect to create one
        router.push("/family-create");
      }
    } catch (error) {
      console.error("Error fetching families:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    fetchFamilies();
  }, [fetchFamilies]);

  const switchFamily = (familyId: string) => {
    const family = families.find((f) => f.id === familyId);
    if (family) {
      setIsLoading(true);
      // Simulate a delay for fetching new family data
      setTimeout(() => {
        setCurrentFamily(family);
        localStorage.setItem("currentFamilyId", family.id);
        setIsLoading(false);
        // Optionally, force a reload or redirect to dashboard to refresh data
        router.push("/dashboard");
      }, 1000);
    }
  };

  const refreshFamilies = () => {
    fetchFamilies();
  };

  const value = { families, currentFamily, isLoading, switchFamily, refreshFamilies };

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (context === null) {
    throw new Error("useFamily must be used within a FamilyProvider");
  }
  return context;
};
