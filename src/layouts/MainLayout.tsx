"use client";

import { SidebarNav } from "@/components/sidebar-nav";
import { FamilyProvider } from "@/hooks/use-family";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Outlet } from "react-router-dom";

interface MainLayoutProps {}

export default function MainLayout({}: MainLayoutProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">Authenticating...</div>;
  }

  if (location.pathname === '/family-create') {
    return <Outlet />;
  }

  return (
    <FamilyProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <SidebarNav />
          <main className="flex-1"><Outlet /></main>
        </div>
      </div>
    </FamilyProvider>
  );
}
