"use client";

import { SidebarNav } from "@/components/sidebar-nav";
import { FamilyProvider } from "@/hooks/use-family";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Render a loading screen while checking for family association
  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">Authenticating...</div>;
  }

  // If the user is on the create family page, don't render the main layout
  if (location.pathname === '/family-create') {
    return <>{children}</>;
  }

  return (
    <FamilyProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <SidebarNav />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </FamilyProvider>
  );
}
