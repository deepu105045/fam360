
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons';
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error during Google login:", error);
      toast({
        title: "Login Failed",
        description: "Could not log in with Google. Please try again.",
        variant: "destructive",
      });
    }
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
          <Button onClick={handleGoogleLogin} className="w-full" size="lg">
            <GoogleIcon className="mr-2 h-5 w-5" />
            Login with Google
          </Button>
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
