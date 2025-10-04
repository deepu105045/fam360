
"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";
import { getFamily } from "@/lib/families";
import { Family } from "@/lib/types";

interface FamilyContextType {
  families: Array<{ id: string; data: Family }>;
  currentFamily: { id: string; data: Family } | null;
  isLoading: boolean;
  switchFamily: (familyId: string) => void;
  refreshFamilies: () => void;
}

const FamilyContext = createContext<FamilyContextType | null>(null);

export const FamilyProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, memberships, loading: authLoading } = useAuth();
  const router = useRouter();
  const [families, setFamilies] = useState<Array<{ id: string; data: Family }>>([]);
  const [currentFamily, setCurrentFamily] = useState<{ id: string; data: Family } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFamilies = useCallback(async () => {
    if (!user || memberships.length === 0) {
        setIsLoading(false);
        if(!authLoading && !user) router.push("/");
        else if (!authLoading) router.push("/family/create");
        return;
    }
    setIsLoading(true);
    try {
      const familyPromises = memberships.map(async (membership) => {
        const familyData = await getFamily(membership.familyId);
        return familyData ? { id: membership.familyId, data: familyData } : null;
      });

      const userFamilies = (await Promise.all(familyPromises)).filter(f => f !== null) as Array<{ id: string; data: Family }>;
      setFamilies(userFamilies);

      if (userFamilies.length > 0) {
        const lastFamilyId = localStorage.getItem("currentFamilyId");
        const familyToSelect = userFamilies.find(f => f.id === lastFamilyId) || userFamilies[0];
        setCurrentFamily(familyToSelect);
        localStorage.setItem("currentFamilyId", familyToSelect.id);
      } else if (!authLoading) {
        router.push("/family/create");
      }
    } catch (error) {
      console.error("Error fetching families:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, memberships, router, authLoading]);

  useEffect(() => {
    if (!authLoading) {
        fetchFamilies();
    }
  }, [fetchFamilies, authLoading]);

  const switchFamily = (familyId: string) => {
    const family = families.find((f) => f.id === familyId);
    if (family) {
      setCurrentFamily(family);
      localStorage.setItem("currentFamilyId", family.id);
      router.push("/dashboard");
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
