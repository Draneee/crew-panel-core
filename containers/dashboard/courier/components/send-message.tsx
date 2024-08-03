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
const SendMessage = () => {
  const { toggleSidebar, isSidebarCollapsed } = useAppShell();

  console.log(isSidebarCollapsed);
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenChange = () => {
    setOpenModal((p) => !p);
    if (isSidebarCollapsed) {
      toggleSidebar();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={openModal}>
      <DialogTrigger asChild>
        <Button size={'sm'}>eEnviar mensaje</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Subir clientes</DialogTitle>
          <DialogDescription>
            Aquí puedes subir el archivo CSV con los datos de los clientes.
          </DialogDescription>
        </DialogHeader>
        <section>test</section>
      </DialogContent>
    </Dialog>
  );
};

export default SendMessage;
