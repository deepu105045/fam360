
"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, Settings, User, PlusCircle, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const logoSrc = `data:image/png;base64,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`;

export function MainHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src={logoSrc}
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
                Miller Family
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px]" align="end">
              <DropdownMenuLabel>Switch Family</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <span>Miller Family</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
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
                  <AvatarImage src="/avatars/01.png" alt="@guest" />
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Guest User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    guest@example.com
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
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <Link href="/">Log out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
