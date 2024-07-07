'use client';
import React from 'react';
import { DeviceInfoProvider } from '../hooks/useDeviceInfo';
import Script from 'next/script';
import { InfoGloballyProvider } from '@/hooks/useData';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <DeviceInfoProvider>
      <InfoGloballyProvider>
        <main className='relative flex flex-col min-h-screen bg-background'>
          {children}
        </main>
      </InfoGloballyProvider>
    </DeviceInfoProvider>
  );
};

export default Providers;
