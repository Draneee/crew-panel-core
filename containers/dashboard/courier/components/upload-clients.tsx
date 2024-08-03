import { Uploadcsv } from '@/components/\u0017upload-csv';
import { useAppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
const UploadClients = () => {
  const { toggleSidebar, isSidebarCollapsed } = useAppShell();

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenChange = (p: boolean) => {
    setOpenModal(p);
    if (!isSidebarCollapsed) toggleSidebar();
  };
  return (
    <AlertDialog onOpenChange={handleOpenChange} open={openModal}>
      <AlertDialogTrigger asChild>
        <Button size={'sm'}>Subir clientes</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='sm:max-w-5xl'>
        <AlertDialogHeader>
          <AlertDialogTitle>Subir clientes</AlertDialogTitle>
          <AlertDialogDescription>
            Aquí puedes subir el archivo CSV con los datos de los clientes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Uploadcsv handleOpenChange={handleOpenChange} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UploadClients;
