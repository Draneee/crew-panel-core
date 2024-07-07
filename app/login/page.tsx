import Link from 'next/link';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SubmitButton } from './submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/dashboard');
  }

  const signIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/dashboard');
  };

  return (
    <div className='flex flex-col justify-center flex-1 w-full gap-2 px-8 mx-auto sm:max-w-md'>
      <form className='flex flex-col justify-center flex-1 w-full gap-2 animate-in text-foreground'>
        <Label htmlFor='email'>Email</Label>
        <Input
          className='px-4 py-2 mb-6 border rounded-md bg-inherit'
          name='email'
          placeholder='you@example.com'
          required
        />
        <Label htmlFor='password'>Password</Label>
        <Input
          className='px-4 py-2 mb-6 border rounded-md bg-inherit'
          type='password'
          name='password'
          placeholder='••••••••'
          required
        />
        <SubmitButton
          formAction={signIn}
          className='px-4 py-2 mb-2 rounded-md'
          pendingText='Signing In...'
        >
          Sign In
        </SubmitButton>
        {searchParams?.message && (
          <p className='p-4 mt-4 text-center bg-foreground/10 text-foreground'>
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
