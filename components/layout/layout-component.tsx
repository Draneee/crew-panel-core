'use client';
import Image from 'next/image';
import Sidebar from './Sidebar';
import Searchbar from './Searchbar';
import React from 'react';
import { AppShell, AppShellContent, AppShellSidebar } from './AppShell';
import { cn } from '@/lib/utils';
import { Inter as FontSans } from 'next/font/google';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const LayoutComponent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AppShell>
      <AppShellSidebar width='280px'>
        <Sidebar />
      </AppShellSidebar>
      <main className='flex flex-col w-full'>
        <Searchbar />
        <AppShellContent>
          <section className='overflow-auto'>
            <div className='relative overflow-auto'>{children}</div>
          </section>
        </AppShellContent>
      </main>
    </AppShell>
  );
};

export default LayoutComponent;