import type { Metadata } from 'next';
import SendNotification from './send-notification';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Home',
};

export default function Page() {
  redirect('/login');
  return (
    <>
      <h1>Next.js + Serwist</h1>
      <SendNotification />
    </>
  );
}
