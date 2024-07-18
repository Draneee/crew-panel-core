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
  return (
    <header className='fixed inset-x-0 bottom-0 z-50 grid w-full max-w-2xl grid-cols-2 mx-auto bg-black h-9'>
      {Object.entries(TABS).map(([k, v]) => (
        <article
          key={v.value}
          className={cn(
            'flex text-sm text-center bg-white/10 justify-center items-center gap-2',
            props.tabSelected === v.value
              ? 'bg-white/20'
              : 'cursor-pointer text-white/30'
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
