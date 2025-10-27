
"use client";

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const { user, signInWithGoogle, guestSignIn, guestSignIn2, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold">Welcome to Fam360</h1>
        <p className="text-muted-foreground">Please sign in to continue</p>
        <div className="flex space-x-2">
            <Button onClick={signInWithGoogle}>Sign in with Google</Button>
            <Button onClick={guestSignIn} variant="secondary">
                Sign in as Guest
            </Button>
            <Button onClick={guestSignIn2} variant="secondary">
                Sign in as Guest 2
            </Button>
        </div>
      </div>
    </div>
  );
}
