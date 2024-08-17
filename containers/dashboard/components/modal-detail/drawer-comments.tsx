'use client';
import React, { useEffect } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { MessageCircleDashed, SendHorizonal } from 'lucide-react';
import {
  DataDashboard,
  Message,
  WebEngageV1InfoAirports,
} from '../card-render';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { mutate } from 'swr';
import { URL_FETCH_DASHBOARD } from '@/hooks/useAnuelAA';
import { useInfoGlobally } from '@/hooks/useData';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  message: z.string(),
});

const DrawerComments = (props: IProps) => {
  const [inputMessage, setInputMessage] = React.useState('');
  const supabase = createClient();
  const data = props.data;
  const user = props.user;

  const infoGlobally = useInfoGlobally();

  const dataUpdate = (msg: string) => {
    const message = {
      date: new Date(),
      message: msg,
      user: user.email ?? '',
    };
    return {
      ...data,
      chat: [...(data?.chat ?? []), message],
    };
  };

  const sendMessage = async (msg: string) => {
    if (!Array.isArray(infoGlobally?.info)) return;

    const optimisticData = {
      ...infoGlobally?.info,
      data: [
        ...infoGlobally?.info?.filter((d) => d.id !== props.openCard),
        dataUpdate(msg),
      ],
    };

    await mutate(
      URL_FETCH_DASHBOARD,
      sendMessageReq(dataUpdate(msg), optimisticData),
      {
        optimisticData,
        rollbackOnError: true,
        revalidate: false,
      }
    );
  };
  console.log(props.data?.id);
  // console.log(data.chat);
  const sendMessageReq = async (data: any, optimisticData: any) => {
    await supabase
      .from('panel')
      .update({
        chat: data.chat,
      })
      .eq('id', props.data?.id)
      .select()
      .then((res) => {
        console.log(res);
      });

    return optimisticData;
  };

  console.log(data?.chat);

  // FORM

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    if (values.message.length) {
      sendMessage(values.message);
      form.setValue('message', '');
    }
  }

  const itsMe = (email: string) => user.email === email;

  // scroll chat

  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  // Hook para mantener el scroll al final del contenedor
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [data?.chat]);
  return (
    <Drawer>
      <DrawerTrigger className='absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground p-0 h-fit'>
        {' '}
        <MessageCircleDashed className='size-5' />
        <span className='sr-only'>Message</span>
      </DrawerTrigger>
      <DrawerContent className='w-full max-w-2xl p-4 mx-auto h-dvh'>
        <DrawerHeader>
          <DrawerTitle>Inbox Chat #{data?.id}</DrawerTitle>
        </DrawerHeader>
        <section className='flex flex-col justify-end flex-1 gap-1 py-4 overflow-auto'>
          {data?.chat?.length == 0 ? (
            <section className='grid my-8 text-sm text-center text-muted-foreground place-items-center'>
              No messages
            </section>
          ) : (
            <div
              className='flex flex-col gap-1 pb-1 overflow-auto pe-1'
              ref={chatContainerRef}
            >
              {data?.chat?.map((d, i) => {
                const isMeMessage = itsMe(d.user);
                return (
                  <section
                    key={i}
                    className={cn(
                      'flex',
                      isMeMessage ? 'justify-end text-right' : ''
                    )}
                  >
                    <article
                      className={cn(
                        'px-2 pt-0 pb-1 rounded-md w-fit max-w-[85%] ',
                        isMeMessage ? 'bg-white text-black' : 'bg-muted '
                      )}
                    >
                      <span
                        className={cn(
                          'text-[10px]  mt-0.5 block',
                          isMeMessage
                            ? 'text-black/60'
                            : 'text-muted-foreground'
                        )}
                      >
                        {CATALOG_USERS[d.user] ?? d.user}
                      </span>

                      <p className='text-sm text-pretty'>{d.message}</p>
                    </article>
                  </section>
                );
              })}
            </div>
          )}
        </section>
        <DrawerFooter className='flex flex-row p-0 pt-4 pb-3'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex w-full gap-3'
            >
              <FormField
                control={form.control}
                name='message'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl className=''>
                      <Input
                        className='rounded-full bg-input'
                        placeholder='Type message...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='p-0 rounded-full size-9'>
                <SendHorizonal className='size-4' />
              </Button>
            </form>
          </Form>{' '}
          {/* <Button onClick={() => sendMessage()}>Submit</Button> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerComments;

type openCardInfo = WebEngageV1InfoAirports | undefined;

interface IProps {
  data: openCardInfo;
  user: User;
  openCard: number | undefined;
}

const CATALOG_USERS: Record<string, string> = {
  // 'admin-pc@crew.co': 'Adrian Macbook',
  'jesuscastano101@gmail.com': 'Petrosky',
  'pichaloca9009@gmail.com': 'El chico de la Z800',
};
