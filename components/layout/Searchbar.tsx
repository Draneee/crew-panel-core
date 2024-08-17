'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CommandMenu } from './command-menu';
import { useRouter } from 'next/navigation';
import { CircleUserRound, LogOutIcon, UserIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import React from 'react';

export default function Searchbar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = React.useState<string>();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  React.useEffect(() => {
    supabase.auth.getUser().then((user) => {
      setUserEmail(user?.data?.user?.email);
    });
  }, []);

  return (
    <header className='h-12 border-b '>
      <nav className='container flex items-center justify-between h-12 '>
        <section>
          <CommandMenu />
        </section>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={'ghost'}
              className='flex gap-2 focus-visible:ring-0 focus-visible:ring-offset-0'
            >
              <CircleUserRound className='size-5' />
              {userEmail ?? 'User'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
