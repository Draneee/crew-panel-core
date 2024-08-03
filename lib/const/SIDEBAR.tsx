import {
  CubeIcon,
  GearIcon,
  PersonIcon,
  GlobeIcon,
  DashboardIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import {
  BarcodeIcon,
  MessageSquare,
  PackageIcon,
  RadioIcon,
  ReceiptTextIcon,
} from 'lucide-react';

export const DATA_MENU_LINKS = [
  {
    label: 'Dashboard',
    icon: (props: IconProps) => <RadioIcon {...props} />,
    id: 'dashboard',
    path: '/dashboard',
  },

  {
    label: 'Courier',
    icon: (props: IconProps) => <MessageSquare {...props} />,
    id: 'courier',
    path: '/dashboard/courier',
  },
];

export const DATA_SIDEBAR_BY_SECTIONS = {
  Orders: [
    {
      label: 'All Orders',
      icon: (props: IconProps) => <PackageIcon {...props} />,
      id: 'all-orders',
    },
  ],
  Inventory: [
    {
      label: 'Invoices',
      icon: (props: IconProps) => <ReceiptTextIcon {...props} />,
      id: 'invoices',
    },
    {
      label: 'Stock',
      icon: (props: IconProps) => <CubeIcon {...props} />,
      id: 'stock',
    },
  ],
  Product: [
    {
      label: 'Manage Products',
      icon: (props: IconProps) => <BarcodeIcon {...props} />,
      id: 'manage-products',
    },
  ],
  Others: [
    {
      label: 'Accounts',
      icon: (props: IconProps) => <PersonIcon {...props} />,
      id: 'accounts',
    },
    {
      label: 'Settings',
      icon: (props: IconProps) => <GearIcon {...props} />,
      id: 'settings',
    },
    {
      label: 'Help',
      icon: (props: IconProps) => <InfoCircledIcon {...props} />,
      id: 'help',
    },
  ],
};
