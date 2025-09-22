import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex w-full max-w-md flex-col items-center justify-center space-y-8">
        <div className="text-center">
          <LayoutGrid className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            FamCentral
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your all-in-one family management hub.
          </p>
        </div>
        <div className="w-full space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/dashboard">
              <GoogleIcon className="mr-2 h-5 w-5" />
              Login with Google
            </Link>
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
