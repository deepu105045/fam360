
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex w-full max-w-md flex-col items-center justify-center space-y-8">
        <div className="text-center">
          <Image
            src="/fam_360_logo.png"
            alt="fam360 logo"
            width={250}
            height={250}
            className="mx-auto"
            priority
          />
        </div>
        <div className="w-full space-y-4">
          <Button asChild variant="secondary" className="w-full" size="lg">
            <Link href="/dashboard">Continue as Guest</Link>
          </Button>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
