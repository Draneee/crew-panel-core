'use client';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  CircleIcon,
  LaptopIcon,
  MoonIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PanelLeftOpenIcon, PanelRightOpenIcon } from 'lucide-react';
import { useAppShell } from './AppShell';

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  const { toggleSidebar, isSidebarCollapsed } = useAppShell();

  const classIcon = 'size-4 text-muted-foreground';
  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        className={cn(
          'relative h-8 w-full justify-start rounded bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64 hover:bg-background/80'
        )}
        onClick={() => setOpen(true)}
      >
        <span className='hidden lg:inline-flex'>Search</span>
        <span className='inline-flex lg:hidden'>Search</span>
        <kbd className='pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </Button>
      <button onClick={toggleSidebar}>
        {isSidebarCollapsed ? (
          <PanelLeftOpenIcon className={classIcon} />
        ) : (
          <PanelRightOpenIcon className={classIcon} />
        )}
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Type a command or search...' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading='Links'>
            {/* {docsConfig.mainNav
            .filter((navitem) => !navitem.external)
            .map((navItem) => (
              <CommandItem
                key={navItem.href}
                value={navItem.title}
                onSelect={() => {
                  runCommand(() => router.push(navItem.href as string))
                }}
              >
                <FileIcon className="w-4 h-4 mr-2" />
                {navItem.title}
              </CommandItem>
            ))} */}
          </CommandGroup>
          {/* {docsConfig.sidebarNav.map((group) => (
          <CommandGroup key={group.title} heading={group.title}>
            {group.items.map((navItem) => (
              <CommandItem
                key={navItem.href}
                value={navItem.title}
                onSelect={() => {
                  runCommand(() => router.push(navItem.href as string))
                }}
              >
                <div className="flex items-center justify-center w-4 h-4 mr-2">
                  <CircleIcon className="w-3 h-3" />
                </div>
                {navItem.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ))} */}
          <CommandSeparator />
          <CommandGroup heading='Theme'>
            <CommandItem>
              <SunIcon className='w-4 h-4 mr-2' />
              Light
            </CommandItem>
            <CommandItem>
              <MoonIcon className='w-4 h-4 mr-2' />
              Dark
            </CommandItem>
            <CommandItem>
              <LaptopIcon className='w-4 h-4 mr-2' />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
