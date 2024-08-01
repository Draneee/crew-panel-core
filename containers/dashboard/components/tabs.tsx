import useDeviceInfo from '@/hooks/useDeviceInfo';
import { cn } from '@/lib/utils';
import { ArchiveIcon, CheckIcon, DramaIcon } from 'lucide-react';
import React from 'react';
export const TABS = {
  'En vivo': {
    value: 'live',
    icon: DramaIcon,
  },
  Completados: {
    value: 'completed',
    icon: ArchiveIcon,
  },
};

const TabsDashboard = (props: IProps) => {
  const device = useDeviceInfo();
  console.log(device);
  const isBrowser = device?.deviceType === 'browser';
  return (
    <header
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 grid w-full h-12 max-w-2xl grid-cols-2 mx-auto bg-black',
        isBrowser ? 'h-9' : 'h-12'
      )}
    >
      {Object.entries(TABS).map(([k, v]) => (
        <article
          key={v.value}
          className={cn(
            'flex text-sm text-center bg-white/10 justify-center gap-2',
            props.tabSelected === v.value
              ? 'bg-white/20'
              : 'cursor-pointer text-white/30',
            isBrowser ? 'items-start pt-2 ' : 'items-center'
          )}
          onClick={() => props.setTabSelected(v.value)}
        >
          <v.icon className='size-5' /> {k}
        </article>
      ))}
    </header>
  );
};

export default TabsDashboard;

interface IProps {
  tabSelected: string;
  setTabSelected: React.Dispatch<React.SetStateAction<string>>;
}
