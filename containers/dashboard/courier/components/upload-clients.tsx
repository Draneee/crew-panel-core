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

const UploadClients = () => {
  const { toggleSidebar, isSidebarCollapsed } = useAppShell();

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenChange = (p: boolean) => {
    setOpenModal(p);
    if (!isSidebarCollapsed) toggleSidebar();
  };
  return (
    <Dialog onOpenChange={handleOpenChange} open={openModal}>
      <DialogTrigger asChild>
        <Button size={'sm'}>Subir clientes</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[825px]'>
        <DialogHeader>
          <DialogTitle>Subir clientes</DialogTitle>
          <DialogDescription>
            Aquí puedes subir el archivo CSV con los datos de los clientes.
          </DialogDescription>
        </DialogHeader>
        <Uploadcsv />
      </DialogContent>
    </Dialog>
  );
};

export default UploadClients;
