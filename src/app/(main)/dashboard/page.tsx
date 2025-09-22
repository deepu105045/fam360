import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, Home, ClipboardList, MessagesSquare } from "lucide-react";

const features = [
  {
    title: "Expense Management",
    description: "Track and categorize family spending.",
    href: "/expenses",
    icon: <Wallet className="h-8 w-8 text-primary" />,
  },
  {
    title: "Asset Management",
    description: "Keep a record of family assets.",
    href: "/assets",
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
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Guest! Here&apos;s your family overview.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
