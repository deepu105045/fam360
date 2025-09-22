"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, Settings, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const logoSrc = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNMTc1IDIwMEg1MHYtNDcuMDMxTDc4LjA5NCAxMjVINDIuNVYxMDBIMTB2LTUwQzEwIDIyLjM4NiAzMi4zODYgMCA2MCAwczUwIDIyLjM4NiA1MCA1MHY1MGgtMzIuNVYxMjVIMTUwVjE1Mi45NjlMMTc1IDIwMHoiIGZpbGw9IiMwMTAxMDEiLz4KICAgIDxwYXRoIGQ9Ik0xMjEuNjg4IDYyLjVjMCAxLjcxOC0xLjM5IDMuMTA5LTMuMTA5IDMuMTA5cy0zLjEwOS0xLjM5LTMuMTA5LTMuMTA5IDEuMzktMy4xMDkgMy4xMDktMy4xMDkgMy4xMDkgMS4zOSAzLjEwOSAzLjEwOXptLTguMjgxIDB2Mi4zNDRoLTguMjgxdi0yLjM0NGgtMi4zNDR2Mi4zNDRoLTguMjgxdjguMjgxaDIuMzQ0di01LjkzOEgxMDV2NS45MzhjMCAxLjI5Ny45MzcgMi4zNDQgMi4yMTkgMi4zNDRoMi4zNDRjMS4yODIgMCAyLjA2My0xLjA0NyAyLjA2My0yLjM0NHYtNS45MzhjMS4zNzUgMCAyLjM0NC0uOTY5IDIuMzQ0LTIuMjE5VjYyLjVIMTEzLjQwN3ptLTM0LjU3OCAyLjM0NGMyLjE4OC0xLjggMy43NS0yLjYyNSA2LjU2My0yLjYyNSA0LjA2MyAwIDUuOTM4IDEuNTkzIDUuOTM4IDQuNjg4cy0xLjg3NSA0LjY4OC01LjkzOCA0LjY4OGMtMi44MTMgMC00LjM3NS0uODQ0LTYuNTYzLTIuNjU3djUuOTY5SDc4LjgyOFY1OS4zNzVoMi45Njl2NS40Njl6bS00LjY4Ny0xNC4wNjNjLTIuMjUgMS45NjktMy41OTQgMy4xNTYtMy41OTQgNS43MTkgMCAzLjA2MiAyLjA2MyA0LjYyNSA0LjYyNSA0LjYyNWMyLjU5NCAwIDQuNTYyLTEuNTYzIDQuNTYyLTQuNjI1cy0yLjA2My00LjYyNS00LjUyMy00LjYyNWMtLjgzNiAwLTEuNjg4LjM3NS0yLjI4MS44NzV2LTEuMTI1aC0xLjM0NHptLTMxLjEwMSAxOS44NDRsMi42NTYtNS4wOTRoMTAuMDQ3bDIuNjU2IDUuMDk0SDU0LjMwNHptNS4wOTQtNy4yODFsLTIuMjgxIDQuMjE5aDQuNTYzbC0yLjI4MS00LjIxOXptMzcuMTE3LTIuODU5YzAtMi4yMTktMS40MDYtMy4zNDQtMy4zNDQtMy4zNDRzLTMuMzQ0IDEuMTI1LTMuMzQ0IDMuMzQ0IDEuNDA2IDMuMzQ0IDMuMzQ0IDMuMzQ0IDMuMzQ0LTEuMTI1IDMuMzQ0LTMuMzQ0em0tMTIuNS0zLjMzNmgtMi4yMTl2MTEuMjVoMi4yMTl2LTQuMDYzbDEuODQ0IDEuNjA5IDIuMzQ0LTEuODEzbC0xLjc1LTIuMTE3IDItMi4zNDRsLTIuNDY5LTEuNzE5LTEuNjI1IDIuMTg4VjY0LjY4OHptLTkuNzUtMTEuNjA5YzEuNS4zNzUgMi42MjUuNjg4IDIuNjI1IDEuNjU2IDAgMS4wNjItLjg3NSAxLjYyNS0yLjMxMyAxLjYyNXMtMi4yNS0uNjU2LTIuMjUtMS44MTJjMC0uOTA2LjU2My0xLjQwNiAxLjY1Ni0xLjczNEw4MCA1My4xMjVoNC4wNjN2My4zNDRIMzIuMTU2di0uNzM0YzEuNzE5LS42MjUgMi43NS0xLjQwNiAyLjc1LTIuNzE5IDAtMS4xODgtLjg3NS0yLjA5NC0yLjI1LTIuNDY5VjQ5LjM3NWgxLjY4OGMuNjU2IDAgMS4wOTQuNTYyIDEuMDk0IDEuMjgxLS4wMzEgMS4yODEgMS4yMTkgMi4xMjUgMi42NTYgMi4xMjVoLjAwOGMuNDY5IDAgLjg5OC0uMjg5IDEuMDkzLS43MDMgMS4yODEgMCAyLjM0NC0xLjE4NyAyLjM0NC0yLjY1NmgtLjAwOGMtLjU2MyAwLS45ODQtLjQ2OS0uOTg0LTEuMDYyIDAtMS4yMTkgMS4wNi0xLjkzOCAyLjQ2OS0xLjkzOGgyLjI1YzEuMjgxIDAgMi4zNDQgMS4xMjUgMi4zNDQgMi41OTRzLTEuMDMxIDIuNTMxLTIuNDY5IDIuNTMxYy0xLjQ2OSAwLTIuNS0xLjEwMi0yLjUtMi40NjdBNi41NjYgNi41NjYgMCAwIDEgODggNDkuMzc1aDEuMTI1YzEuNjU2IDAgMyAxLjQwNiAzIDMuMTU2cy0xLjM0NCAzLjE1Ni0zIDMuMTU2SDg4YzAgLjkzNy0uNzE5IDEuNjg4LTEuNjg4IDEuNjg4cy0xLjY4OC0uNzUtMS42ODgtMS42ODhjLTEuMzEzIDAtMi4zNDQtMS4wMy0yLjM0NC0yLjM0NCAwLTEuMjgxLjkwNi0yLjQxNCAyLjM0NC0yLjQxNGMuMDYzIDAgLjA5NCAwIC4xMjUtLjAwOC4xMjUtMS4wOTQgMS4wMy0xLjk2MSAyLjA5NC0xLjk2MWgxLjg3NWMxLjQ2OSAwIDIuNjg4IDEuMjE5IDIuNjg4IDIuNjg4IDAgMS40NjgtMS4yMTkgMi42ODgtMi42ODggMi42ODhzLTIuNjg4LTEuMjItMi42ODgtMi42ODhjLTEuNSAwLTIuNjg4IDEuMjE5LTIuNjg4IDIuNjg4cy0xLjIxOSAyLjY4OC0yLjY4OCAyLjY4OGMtMS41IDAtMi42ODgtMS4yMi0yLjY4OC0yLjY4OCAwLS43NS4zMTMtMS40NjkuODM2LTIuMDA4LTEuMDYyLS41NjMtMS44MTMtMS41OTQtMS44MTMtMi43ODIgMC0xLjU5NCAxLjIxOS0yLjk2OSAyLjc1LTMuMDYydjEuNjg4YzAgMS4zMTMgMS4xODcgMi4zNDQgMi41IDIuMzQ0czIuNS0xLjA2MiAyLjUtMi4zNDR2LTEuODQ0YzEuMTg4LS4wOTQgMi4xMjUgMS4xNTYgMi4xMjUgMi4zMTMgMCAuNzUtLjQ2OSAxLjQzOC0xLjE1NiAxLjgxMy0xLjQzOC43ODEtMi41IDEuOTg0LTIuNSAzLjQ2OVM4MS45NTMgNzAgODMuMjgxIDcwaC4wMDF6bTUuOTM4IDExLjI1aC0xMy41di00LjY4OEg4MS4zOTh2NC4wNjNsMi40MDYtMy4zNDQgMi43NSAzLjM0NHYtNC4wNjNoOC4wOTR2NC42ODh6bS00MC42ODgtNy45N2MuMzEzLS4xODcuNjU2LS4zMTIuOTY5LS4zMTJzLjY1Ni4xMjUuOTY5LjMxMmMuMzEzLjE4OC41LjUwOC41Ljg1OSAwIC4zNDQtLjE4Ny42NzItLjUuODU5bC0uOTY5LjU4Ni0uOTY5LS41ODZjLS4zMTMtLjE4Ny0uNS0uNTItLjUtLjg1OSAwLS4zNTIuMTg4LS42Ny41LS44NTl6bTUuNjI1LTUuNjI1aDIuMjE5djExLjI1SDQ4LjU2MlY3My41OTRoNS45Mzh2Ljc4MWgtNS45Mzh2Mi4xODhoNS45Mzh2Ljc1SDQ4LjU2MlY4MC41aDUuOTM4di43MTlINDAuMDQ3di0xNS43NWgyLjIxdjQuMDYzbDEuODQ0LTEuNjA5IDIuMzQ0IDEuODEzbC0xLjc1IDIuMTE3IDItMi4zNDQtMi40NjktMS43MTktMS42MjUgMi4xODh2LTIuNDY5ek0zMC4wNjIgNjQuNjg4aDIuMjE5djExLjI1SDMwLjA2MlY2NC42ODh6bTYxLjI5Ny0xNS4xMDlsLTEuNjU2IDMuMTU2LTcuMjE5LS43MTktMy4yMTktMi40NjlsMi4yNS0yLjI1bC0uNjg4LTQuNzgxIDIuNjU2LTQuMjgxIDEwLjg0NCA4LjkzOHptLTMuMjUtMjAuNjg3Yy0yLjA5NC0xLjgxMy00LjQzOC0zLjM3NS04LjEyNS0zLjM3NS0zLjY4OCAwLTUuNjU2IDEuNjU2LTUuNjU2IDQuNDY5IDAgMy4wMzEgMi42NTYgNC4zMTMgNi4wOTQgNC4zMTMgMi45NjkgMCA0Ljg3NS0xLjI4MSA2LjY1Ni0yLjgxM2wtMi4xMjUtMi4xMjUtMS4xMjUgMS4xNTZzLS43NS43NS0xLjY1Ni43NWMtMS45MDYgMC0yLjM0NC0xLjM3NS0yLjM0NC0yLjI4MSAwLTEtLjA5NC0yLjI1IDIuMjgxLTIuMjUgMS4xNTYgMCAxLjc1LjY4OCAxLjc1LjY4OEw5MS4wMSA0MS43NSAyLjk2OSAyLjgwNXYtMi4xMjVsMi4wMzEtMS44NDRsMi4xMjUgMi4xMjUtMS4xMjUtMS4xNTZzLS43NS0uNzUtMS42NTYtLjc1Yy0xLjkwNiAwLTIuMzQ0IDEuMzc1LTIuMzQ0IDIuMjgxIDAgMSAuMDk0IDIuMjUtMi4yODEgMi4yNS0xLjE1NiAwLTEuNzUtLjY4OC0xLjc1LS42ODhMMjQuNjU2IDI4LjQzbDIuOTY5LTIuODA1di0yLjEyNWwyLjAzMS0xLjg0NHptLTQ1LjU0Ny05LjA2M2MtMi4wOTQtMS44MTMtNC40MzgtMy4zNzUtOC4xMjUtMy4zNzUtMy42ODggMC01LjY1NiAxLjY1Ni01LjY1NiA0LjQ2OSAwIDMuMDMxIDIuNjU2IDQuMzEzIDYuMDk0IDQuMzEzIDIuOTY5IDAgNC44NzUtMS4yODEgNi42NTYtMi44MTNsLTIuMTI1LTIuMTI1LTEuMTI1IDEuMTU2cy0uNzUuNzUtMS42NTYuNzVjLTEuOTA2IDAtMi4zNDQtMS4zNzUtMi4zNDQtMi4yODEgMC0xLS4wOTQtMi4yNSAyLjI4MS0yLjI1JzAgMS4wMy4wOTQgMi4yNS0yLjI4MSAyLjI1LTEuMTU2IDAtMS43NS0uNjg4LTEuNzUtLjY4OGwyLjA5NC0yLjE1NmwyLjk2OSAyLjgwNXYtMi4xMjVsMi4wMzEtMS44NDQtMi4xMjUtMi4xMjUtMS4xMjUgMS4xNTZzLS43NS43NS0xLjY1Ni43NWMtMS45MDYgMC0yLjM0NC0xLjM3NS0yLjM0NC0yLjI4MXptLTYyLjUgMTUuMTg4bDEuMTg4LTEuNjU2LTEuMTg4LTEuMjE5LTMuMzc1IDQuMDYyIDEuNTMxIDIuNSA0LjI4MS0zLjYyNWgtLjMyOGwtMy4yNSAzLjAzMWwtLjY1Ni0xLjI1IDEuODc1LTIuMzQ0IDEuMTg4IDEuMjE5LTEuMTU2IDEuNjg4aDEuNDM4bDEuOTY5LTIuMzQ0aDEuMTg4bC0yLjM0NCAzLjAzMS0xLjg3NS0uNjU2IDEuNDY5LTIuMzQ0aC0yLjAxNkwxMC4wNDcgMjAuNjI1SDExLjVsMS4zNDQgMi4yMTkgMi4zMTMtMi4yMTloMS4xNTZsLTEuOTM4IDMuMDk0IDEuOTM4IDIuMjgxSDExLjg5MUwxMC43NSA0MC4yMnptLTMuODc1IDEuMTg4TDkuMDMxIDM5LjVsMy4xMjUgMS44NzUgMS4wMzEtMS4wOTQtMi42NTYtMi42NTZoLTEuODQ0di0yLjQ2OWgtMi4xMjV2My43NWgxLjA5NFoiIGZpbGw9IiM2Q0IxNEIiLz4KPC9zdmc+`;

export function MainHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src={logoSrc}
              alt="fam360 logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="inline-block font-bold font-headline">fam360</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
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
