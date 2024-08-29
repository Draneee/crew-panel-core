import React from 'react';
import CourierContainer from '@/containers/dashboard/courier/page';
import { supabase } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import { USER_BLOCK } from '@/consts/user-block';

const CourierPage = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/dashboard');

  const haveRestriction = USER_BLOCK[user?.email ?? ''] ? true : false;
  if (haveRestriction && user.email) {
    const { layout } = USER_BLOCK?.[user.email];
    if (layout.courier) {
      return <CourierContainer />;
    }
  }

  return <CourierContainer />;
};

export default CourierPage;
