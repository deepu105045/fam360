import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LayoutDashboard, Wallet, Home, ClipboardList, MessagesSquare, DollarSign, PieChart, Users } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expense-management", label: "Expense Management", icon: PieChart },
  { href: "/add-transaction", label: "Add Transaction", icon: Wallet },
  { href: "/transactions", label: "All Transactions", icon: DollarSign },
  { href: "/assets", label: "Assets", icon: Home },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/chat", label: "Chat", icon: MessagesSquare },
  { href: "/family-settings", label: "Family Settings", icon: Users },
];

export function SidebarNav() {
  const location = useLocation();

  const renderNavLinks = (isMobile: boolean = false) => (
    <nav className={cn("flex flex-col gap-2", isMobile ? "p-4" : "p-2 pt-4")}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: location.pathname === item.href ? "default" : "ghost" }),
            "justify-start"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r bg-background">
        {renderNavLinks()}
      </aside>
    </>
  );
}
