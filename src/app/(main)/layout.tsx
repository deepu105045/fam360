"use client";

import { SidebarNav } from "@/components/sidebar-nav";
import { FamilyProvider } from "@/hooks/use-family";
import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, loading, familyCheckLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Render a loading screen while checking for family association
  if (loading || (user && familyCheckLoading)) {
    return <div className="flex h-screen items-center justify-center">Authenticating...</div>;
  }

  // If the user is on the create family page, don't render the main layout
  if (pathname === '/family-create') {
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
