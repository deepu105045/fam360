
"use client";

import { MainHeader } from "@/components/main-header";
import { SidebarNav } from "@/components/sidebar-nav";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login page
    // Allow guest access by checking if the user is explicitly null after loading
    if (!loading && !user && localStorage.getItem('auth_user') === null) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Allow guest access if user is null but loading is false
  const isGuest = !user;

  // Show a loading screen while checking auth state
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Authenticating...</div>;
  }
  
  // If no user, but we're not redirecting (e.g. guest mode enabled by direct navigation),
  // we can optionally show a restricted view or just let them through.
  // For now, we let them through to the dashboard, which has a guest message.

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <div className="flex flex-1">
        <SidebarNav />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
