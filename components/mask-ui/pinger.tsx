import { cn } from '@/lib/utils';
import React from 'react';
interface IProps {
  softColor: string;
  hardColor: string;
}
const Pinger = (props: IProps) => {
  return (
    <span className='relative flex size-3'>
      <span
        className={cn(
          'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
          props.softColor
        )}
      ></span>
      <span
        className={cn(
          'relative inline-flex rounded-full size-3',
          props.hardColor
        )}
      ></span>
    </span>
  );
};

export default Pinger;
