import useDeviceInfo from '@/hooks/useDeviceInfo';
import { cn } from '@/lib/utils';
import { ArchiveIcon, CheckIcon, DramaIcon, HeartIcon } from 'lucide-react';
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
  Favoritos: {
    value: 'favorite',
    icon: HeartIcon,
  },
};

const TabsDashboard = (props: IProps) => {
  const device = useDeviceInfo();
  console.log(device);
  const isBrowser = device?.deviceType === 'browser';
  return (
    <header
      className={cn(
        'fixed bottom-0 z-[100] grid h-12 grid-cols-3 mx-auto flex-1 bg-[#000]',
        isBrowser ? 'h-9' : 'h-12'
      )}
      style={{
        width: '-webkit-fill-available',
      }}
    >
      {Object.entries(TABS).map(([k, v]) => (
        <article
          key={v.value}
          className={cn(
            'flex text-sm text-center bg-[#000] justify-center gap-2',
            props.tabSelected === v.value
              ? 'bg-[#191919]'
              : 'cursor-pointer text-[#bdbdbd]',
            isBrowser ? 'items-center' : 'items-start pt-1'
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
