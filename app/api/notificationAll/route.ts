import { createClient } from '@/lib/supabase/server';
import { Console } from 'console';
import { type NextRequest, NextResponse } from 'next/server';
import webPush from 'web-push';

interface dataReq {
  title: string;
  message: string;
}

export const POST = async (req: NextRequest) => {
  const { subscription, data, user_source } = (await req.json()) as {
    subscription: webPush.PushSubscription;
    data: dataReq;
    user_source: string | null;
  };

  const supabase = createClient();

  let subscriptions = supabase.from('subscription_notifications').select();

  if (typeof user_source === 'string')
    subscriptions = subscriptions.eq('user_source', user_source);

  if (
    !process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ||
    !process.env.WEB_PUSH_EMAIL ||
    !process.env.WEB_PUSH_PRIVATE_KEY
  ) {
    throw new Error('Environment variables supplied not sufficient.');
  }

  try {
    webPush.setVapidDetails(
      `mailto:${process.env.WEB_PUSH_EMAIL}`,
      process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      process.env.WEB_PUSH_PRIVATE_KEY
    );
    const sub = await subscriptions;
    const results = await Promise.allSettled(
      sub.data?.map((d) => {
        return webPush.sendNotification(d.subscription, JSON.stringify(data));
      }) || []
    );

    const failedNotifications = results.filter(
      (result) => result.status === 'rejected'
    );

    if (failedNotifications.length > 0) {
      console.log('Some notifications failed:', failedNotifications);
    }

    return new NextResponse('Notifications sent', {
      status: 200,
    });
  } catch (err) {
    if (err instanceof webPush.WebPushError) {
      return new NextResponse(err.body, {
        status: err.statusCode,
        headers: err.headers,
      });
    }
    console.log(err);
    return new NextResponse('Internal Server Error', {
      status: 500,
    });
  }
};
