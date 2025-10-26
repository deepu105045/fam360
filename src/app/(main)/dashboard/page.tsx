
"use client";

import { useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useFamily } from '@/hooks/use-family';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, Home, ClipboardList, MessagesSquare, Users, LogOut, Settings, User, PlusCircle, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const features = [
  {
    title: "Expense Management",
    description: "View income, expenses, and savings.",
    href: "/expense-management",
    icon: <Wallet className="h-8 w-8 text-primary" />,
  },
  {
    title: "Asset Management",
    description: "Keep a record of family assets.",
    href: "/asset-management",
    icon: <Home className="h-8 w-8 text-primary" />,
  },
  {
    title: "Task Management",
    description: "Assign and track family chores.",
    href: "/tasks",
    icon: <ClipboardList className="h-8 w-8 text-primary" />,
  },
  {
    title: "Family Chat",
    description: "Communicate with family members.",
    href: "/chat",
    icon: <MessagesSquare className="h-8 w-8 text-primary" />,
  },
  {
    title: "Family Settings",
    description: "Add and manage family members.",
    href: "/family-settings",
    icon: <Users className="h-8 w-8 text-primary" />,
  },
];

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { families, currentFamily, switchFamily, isLoading: familyLoading } = useFamily();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !familyLoading && user && families.length === 0) {
      router.push('/family/create');
    }
  }, [user, families, authLoading, familyLoading, router]);

  const handleFamilySwitch = (familyId: string) => {
    if (familyId === currentFamily?.id) return;
    switchFamily(familyId);
  };

  if (authLoading || familyLoading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <div className="flex items-center space-x-2">
          {/* Family Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-between">
                {currentFamily?.data.familyName || "Select Family"}
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px]" align="end">
              <DropdownMenuLabel>Switch Family</DropdownMenuLabel>
              <DropdownMenuGroup>
                {families.map((family) => (
                  <DropdownMenuItem
                    key={family.id}
                    onClick={() => handleFamilySwitch(family.id)}
                    disabled={familyLoading}
                  >
                    <span>{family.data.familyName}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/family/create")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Create New Family</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "Guest"} />
                  <AvatarFallback>{user?.displayName?.[0] || "G"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName || "Guest"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "guest@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/family-settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Family Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mb-8 space-y-2">
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your family overview.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title}>
            <Card className="h-full transform-gpu transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium font-headline">
                  {feature.title}
                </CardTitle>
                {feature.icon}
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
