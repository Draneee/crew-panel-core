'use client';

import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';

interface AppShellContextValue {
  isSidebarCollapsed: boolean;
  toggleSidebar: VoidFunction;
}

const AppShellContext = createContext({} as AppShellContextValue);

export const useAppShell = () => {
  return useContext(AppShellContext);
};

export const AppShell = (props: PropsWithChildren) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed((s) => !s);
  return (
    <AppShellContext.Provider value={{ isSidebarCollapsed, toggleSidebar }}>
      <div className='relative flex h-full'>{props.children}</div>
    </AppShellContext.Provider>
  );
};

export const AppShellSidebar = (
  props: PropsWithChildren<{ width: string }>
) => {
  const { width } = props;
  const { isSidebarCollapsed, toggleSidebar } = useContext(AppShellContext);
  return (
    <>
      <div className='h-dvh block fixed md:hidden w-0 z-[1000]'>
        <motion.div
          style={{
            width,
            height: '100%',
          }}
          animate={{
            translateX: isSidebarCollapsed ? '-100%' : '0%',
          }}
          transition={{
            type: 'tween',
            duration: 0.2,
          }}
        >
          {props.children}
          <motion.div
            onClick={toggleSidebar}
            style={{
              width: '200dvw',
              height: '200dvh',
            }}
            animate={{
              opacity: !isSidebarCollapsed ? '100%' : '0%',
              display: !isSidebarCollapsed ? '' : 'none',
            }}
            className='absolute top-0 left-0 bg-red-50/60'
          ></motion.div>
        </motion.div>
      </div>
      <div className='hidden h-full md:block z-[10000]'>
        <motion.div
          className='overflow-x-hidden h-dvh'
          animate={{ width: isSidebarCollapsed ? '0px' : width }}
          transition={{
            type: 'spring',
            duration: 0.3,
            bounce: isSidebarCollapsed ? 0 : 0.2,
          }}
        >
          <motion.div
            style={{
              width,
              height: '100%',
            }}
            animate={{
              translateX: isSidebarCollapsed ? '-10%' : '0%',
            }}
          >
            {props.children}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export const AppShellContent = (props: PropsWithChildren) => {
  return <div className='h-full grow'>{props.children}</div>;
};
