import { USER_BLOCK } from '@/consts/user-block';
import ContainerDashboard from '@/containers/dashboard/page';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const haveRestriction = USER_BLOCK[user?.email ?? ''] ? true : false;
  if (haveRestriction && user.email) {
    const { layout } = USER_BLOCK?.[user.email];
    if (layout.dashboard) {
      return <ContainerDashboard user={user} />;
    }
  }
  return <ContainerDashboard user={user} />;
};

export default page;
