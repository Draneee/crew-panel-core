import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Providers from '../containers/providers';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import '@/styles/global.css';
import { Toaster } from 'sonner';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});
const APP_NAME = 'Crew Panel BC';
const APP_DESCRIPTION = 'Crew Panel to manage user';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: '%s - NJS App',
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: '/favicon.ico',
    apple: [{ url: '/icons/icon-512x512.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
  minimumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' dir='ltr'>
      <body
        className={cn(fontSans.className, 'dark min-h-screen bg-background')}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
