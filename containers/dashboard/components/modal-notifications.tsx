import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BellPlus, BellRing } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import SendNotification from '@/app/send-notification';
import { base64ToUint8Array } from '@/lib/utils';
import { IPropsDashboard } from '../page';
import { USER_SOURCE } from '@/consts/user-block';

const ModalNotifications = (props: IPropsDashboard) => {
  const supabase = createClient();
  const [openModal, setOpenModal] = React.useState(false);
  const [acceptLoading, setAcceptLoading] = React.useState(false);
  const [registration, setRegistration] =
    React.useState<ServiceWorkerRegistration | null>(null);

  React.useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.serwist !== undefined
    ) {
      // run only in browser
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then(async (sub) => {
          if (
            sub &&
            !(
              sub.expirationTime &&
              Date.now() > sub.expirationTime - 5 * 60 * 1000
            )
          ) {
            if (!(await endpointAreInDB(sub.endpoint))) setOpenModal(true); // check de endpoint in db and if the endpoint dont exist, return false to can show modal
          } else {
            setOpenModal(true);
          }
        });
        setRegistration(reg);
      });
    }
  }, []);

  const endpointAreInDB = async (endpoint: string) => {
    let res = await supabase
      .from('subscription_notifications')
      .select('*')
      .contains('subscription', {
        endpoint: endpoint,
      });
    return Boolean(res.data?.length);
  };
  const subscribeButtonOnClick: React.MouseEventHandler<
    HTMLButtonElement
  > = async (event) => {
    setAcceptLoading;
    if (!process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY) {
      throw new Error('Environment variables supplied not sufficient.');
    }
    if (!registration) {
      console.error('No SW registration available.');
      return;
    }
    event.preventDefault();
    setAcceptLoading(true);
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(
        process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
      ),
    });

    const user_source = props.user.email
      ? USER_SOURCE?.[props.user.email] ?? null
      : null;

    let body_subscription = {
      subscription: sub,
      user_source,
    };

    await supabase
      .from('subscription_notifications')
      .insert(body_subscription)
      .then((res) => {
        setOpenModal(false);
      });

    setAcceptLoading(false);
  };
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>No has activado las notificaciones</DialogTitle>
          <DialogDescription>
            Debes aceptar los permisos para poder notificarte en tiempo real de
            las nuevas actualizaciones
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2'>
          <Button variant={'secondary'} onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={subscribeButtonOnClick}
            disabled={acceptLoading}
            className='!ms-0'
          >
            <BellPlus className='size-4 me-1.5' /> Activar Notificaciones
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNotifications;

{
  /* <BellPlus className='size-4 me-1' /> Activar Notificaciones */
}
