import { Uploadcsv } from '@/components/\u0017upload-csv';
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

const UploadClients = () => {
  return (
    <Dialog>
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
