
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User, PlusCircle, ChevronsUpDown, Loader2 } from "lucide-react";

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
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export function MainHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentFamily, setCurrentFamily] = useState("Miller Family");
  const [isSwitching, setIsSwitching] = useState(false);

  const handleFamilySwitch = (familyName: string) => {
    if (familyName === currentFamily) return;

    setIsSwitching(true);
    // Simulate an API call to fetch new family data
    setTimeout(() => {
      setCurrentFamily(familyName);
      setIsSwitching(false);
    }, 1500);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };


  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image
                src="/fam_360_logo.png"
                alt="fam360 logo"
                width={150}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            
            {/* Family Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between">
                  {currentFamily}
                  <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[180px]" align="end">
                <DropdownMenuLabel>Switch Family</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleFamilySwitch("Miller Family")}>
                    <span>Miller Family</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFamilySwitch("Smith Household")}>
                    <span>Smith Household</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
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
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                    <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'No email'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Loading Dialog */}
       <Dialog open={isSwitching}>
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
