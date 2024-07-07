import { createClient } from '@/lib/supabase/server';
import { Console } from 'console';
import { type NextRequest, NextResponse } from 'next/server';
import webPush from 'web-push';

interface dataReq {
  title: string;
  message: string;
}

export const POST = async (req: NextRequest) => {
  const supabase = createClient();

  const subscriptions = await supabase
    .from('subscription_notifications')
    .select();

  if (
    !process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ||
    !process.env.WEB_PUSH_EMAIL ||
    !process.env.WEB_PUSH_PRIVATE_KEY
  ) {
    throw new Error('Environment variables supplied not sufficient.');
  }

  const { subscription, data } = (await req.json()) as {
    subscription: webPush.PushSubscription;
    data: dataReq;
  };

  try {
    webPush.setVapidDetails(
      `mailto:${process.env.WEB_PUSH_EMAIL}`,
      process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      process.env.WEB_PUSH_PRIVATE_KEY
    );

    const results = await Promise.allSettled(
      subscriptions.data?.map((d) => {
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
