import { MainHeader } from "@/components/main-header";
import { SidebarNav } from "@/components/sidebar-nav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
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
