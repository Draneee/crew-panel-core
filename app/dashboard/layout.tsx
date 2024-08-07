import LayoutComponent from '@/components/layout/layout-component';
import React from 'react';
import { Toaster } from 'sonner';

const Layout = ({ children }: any) => {
  return (
    <LayoutComponent>
      <Toaster richColors />
      {children}
    </LayoutComponent>
  );
};

export default Layout;
