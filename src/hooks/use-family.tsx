
"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";
import { getFamiliesForUser } from "@/lib/families";
import { Family } from "@/lib/types";

interface FamilyContextType {
  families: Array<{ id: string; data: Family }>;
  currentFamily: { id: string; data: Family } | null;
  isLoading: boolean;
  switchFamily: (familyId: string) => void;
  refreshFamilies: () => Promise<void>;
}

const FamilyContext = createContext<FamilyContextType | null>(null);

export const FamilyProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [families, setFamilies] = useState<Array<{ id: string; data: Family }>>([]);
  const [currentFamily, setCurrentFamily] = useState<{ id: string; data: Family } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFamilies = useCallback(async () => {
    if (!user) {
        setIsLoading(false);
        if(!authLoading) router.push("/");
        return;
    }
    setIsLoading(true);
    try {
      const userFamilies = await getFamiliesForUser(user.email);
      const familiesWithData = userFamilies.map(f => ({ id: f.id, data: f }));
      setFamilies(familiesWithData);

      if (familiesWithData.length > 0) {
        const lastFamilyId = localStorage.getItem("currentFamilyId");
        const familyToSelect = familiesWithData.find(f => f.id === lastFamilyId) || familiesWithData[0];
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
  }, [user, router, authLoading]);

  useEffect(() => {
    if (!authLoading) {
        fetchFamilies();
    }
  }, [user, authLoading, router]);

  const switchFamily = (familyId: string) => {
    const family = families.find((f) => f.id === familyId);
    if (family) {
      setCurrentFamily(family);
      localStorage.setItem("currentFamilyId", family.id);
      router.push("/dashboard");
    }
  };

  const refreshFamilies = async () => {
    await fetchFamilies();
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
