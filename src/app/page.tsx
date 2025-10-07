
"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle, guestSignIn, guestSignIn2 } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Check if user has a family and redirect accordingly
      // This logic will be revisited once the family data is available in the auth context
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // The useEffect will handle the redirect when user state changes
    } catch (error: any) {
      console.error("Google login error:", error);
      if (error.code === 'auth/popup-blocked') {
        toast({
          title: "Login Error",
          description: "Pop-up blocked. Please allow pop-ups for this site and try again.",
          variant: "destructive",
        });
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast({
          title: "Login Cancelled",
          description: "Google login was cancelled. Please try again.",
          variant: "destructive",
        });
      } else {
         toast({
          title: "Login Error",
          description: "Could not log in with Google. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleGuestLogin = async () => {
    try {
      await guestSignIn();
      // The useEffect will handle the redirect when user state changes
    } catch (error: any) {
      console.error("Guest login error:", error);
      toast({
        title: "Login Error",
        description: "Could not log in as guest. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGuestLogin2 = async () => {
    try {
      await guestSignIn2();
      // The useEffect will handle the redirect when user state changes
    } catch (error: any) {
      console.error("Guest login error:", error);
      toast({
        title: "Login Error",
        description: "Could not log in as guest. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

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
          <Button onClick={handleGoogleLogin} variant="outline" className="w-full" size="lg" disabled={loading}>
            <GoogleIcon className="mr-2 h-5 w-5" />
            {loading ? 'Logging in...' : 'Login with Google'}
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
          <Button onClick={handleGuestLogin} variant="secondary" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Logging in...' : 'Guest'}
          </Button>
          <Button onClick={handleGuestLogin2} variant="secondary" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Logging in...' : 'Guest 2'}
          </Button>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
