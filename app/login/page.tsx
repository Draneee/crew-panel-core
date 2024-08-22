import Link from 'next/link';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SubmitButton } from './submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

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
    <div className='relative flex flex-col justify-center flex-1 w-full gap-2 px-8 mx-auto sm:max-w-md'>
      <header className='absolute inset-x-0 flex items-center justify-center gap-2 top-10'>
        <section>
          <img
            className='size-16'
            src='https://res.cloudinary.com/dnpu9jffh/image/upload/v1722537513/Group_11_oapusr.svg'
            alt=''
          />
        </section>
        <blockquote className='mt-3 text-2xl italic font-semibold text-center text-white'>
          <span className='relative inline-block before:block before:absolute before:-inset-0.5 before:-skew-y-6  before:bg-white before:-me-1'>
            <span className='relative text-3xl text-black'>CREW </span>
          </span>
          <br />
          Core
        </blockquote>
      </header>
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
