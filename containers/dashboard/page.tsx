'use client';
import { User } from '@supabase/supabase-js';
import React from 'react';
import ModalNotifications from './components/modal-notifications';
import useAnuelAA from '@/hooks/useAnuelAA';
import FilterSection from './components/filter-section';
import CardRender, { WebEngageV1InfoAirports } from './components/card-render';
import ModalDetail from './components/modal-detail';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from 'sonner';
import TabsDashboard from './components/tabs';
const ContainerDashboard = (props: IPropsDashboard) => {
  console.log(props);
  const {
    setOpenCard,
    openCard,
    data,
    isLoading,
    handleSearch,
    tabSelected,
    setTabSelected,
  } = useAnuelAA(props);
  const dataSelected = data.find((d) => d.id === openCard);
  return (
    <div className='relative overflow-auto'>
      <TabsDashboard
        tabSelected={tabSelected}
        setTabSelected={setTabSelected}
      />
      <section className='flex-1 w-full max-w-2xl p-4 pb-12 mx-auto space-y-4 overflow-auto'>
        <FilterSection handleSearch={handleSearch} />
        <section className='mb-12 space-y-4 overflow-auto'>
          {!isLoading ? (
            data.map((r: WebEngageV1InfoAirports) => (
              <CardRender
                key={r.id}
                {...{ ...r, data: dataSelected, setOpenCard }}
              />
            ))
          ) : (
            <section className='space-y-4 overflow-hidden'>
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton
                  key={i}
                  className='h-[200px] sm:h-[264px] '
                ></Skeleton>
              ))}
            </section>
          )}
        </section>
        <ModalNotifications {...props} />
        <ModalDetail
          {...{
            data: dataSelected,
            openCard,
            setOpenCard,
            ...props,
          }}
        />
      </section>
      <Toaster />
    </div>
  );
};

export default ContainerDashboard;

export interface IPropsDashboard {
  user: User;
}
