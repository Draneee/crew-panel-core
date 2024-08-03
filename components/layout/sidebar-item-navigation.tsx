import { IconProps } from '@radix-ui/react-icons/dist/types';
import Link from 'next/link';
import React from 'react';

const SidebarItemNavigation = ({
  id,
  icon: Icon,
  label,
  isActive,
  keyGroup,
  path,
}: IProps) => {
  console.log(path);
  return (
    <div
      key={id}
      className={`transition group rounded ${
        isActive ? 'bg-organizationPrimary' : 'hover:bg-organizationPrimary/40 '
      } `}
    >
      <Link
        href={path ?? ''}
        className='flex items-center w-full h-full gap-2 px-3 py-1 '
      >
        <Icon
          className={`w-4 h-4 transition  text-gray-500 ${
            isActive ? 'text-white' : 'group-hover:text-white'
          }`}
        />
        <span
          className={`transition text-gray-500 whitespace-nowrap text-sm ${
            isActive ? 'text-white' : 'group-hover:text-white'
          }`}
        >
          {/* {props.label ?? 'hola'} */}
          {label}
        </span>
      </Link>
    </div>
  );
};

export default SidebarItemNavigation;

interface IProps {
  id: string;
  icon: (props: IconProps) => JSX.Element;
  label: string;
  isActive: boolean;
  keyGroup: string;
  path: string;
}
