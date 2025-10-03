
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Settings, User, PlusCircle, ChevronsUpDown, Loader2, ArrowLeft } from "lucide-react";

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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useFamily } from "@/hooks/use-family"; // Assuming you create this hook
import { FamilyDoc } from "@/lib/types";

export function MainHeader() {
  const { user, signOut } = useAuth();
  const { currentFamily, families, switchFamily, isLoading } = useFamily();
  const router = useRouter();
  const pathname = usePathname();

  // Check if we should show the back button (not on dashboard)
  const shouldShowBackButton = pathname !== "/dashboard";

  // Check if we should show the logo (only on dashboard)
  const shouldShowLogo = pathname === "/dashboard";

  const handleFamilySwitch = (familyId: string) => {
    if (familyId === currentFamily?.id) return;
    switchFamily(familyId);
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            {/* Mobile Back Button */}
            {shouldShowBackButton && (
              <Button variant="ghost" size="icon" onClick={handleBackClick} className="md:hidden">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Go back</span>
              </Button>
            )}

            {shouldShowLogo && (
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Image
                  src="/fam_360_logo.png"
                  alt="fam360 logo"
                  width={150}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
            )}
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            {/* Family Switcher */}
            {families.length > 0 && (
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
                        disabled={isLoading}
                      >
                        <span>{family.data.familyName}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/family-create")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Create New Family</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

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
      </header>

      {/* Loading Dialog */}
      <Dialog open={isLoading}>
        <DialogContent hideCloseButton>
          <DialogHeader>
            <DialogTitle className="text-center">Switching Family</DialogTitle>
            <div className="flex items-center justify-center pt-4">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <p>Loading new family data...</p>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
