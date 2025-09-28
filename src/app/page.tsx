
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    // Simulate a successful login
    console.log("Simulating Google Login...");
    router.push('/dashboard');
  };

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
          <Button onClick={handleGoogleLogin} variant="outline" className="w-full" size="lg">
            <GoogleIcon className="mr-2 h-5 w-5" />
            Login with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue as
              </span>
            </div>
          </div>
          <Button asChild variant="secondary" className="w-full" size="lg">
            <Link href="/dashboard">Guest</Link>
          </Button>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
