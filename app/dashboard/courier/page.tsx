import React from 'react';
import CourierContainer from '@/containers/dashboard/courier/page';

import { redirect } from 'next/navigation';
import { USER_BLOCK } from '@/consts/user-block';
import { createClient } from '@/lib/supabase/server';

const CourierPage = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser().then((res) => {
    if (!res) {
      redirect('/dashboard');
    }
    return res;
  });

  const haveRestriction = USER_BLOCK[user?.email ?? ''] ? true : false;
  if (haveRestriction && user?.email) {
    const { layout } = USER_BLOCK?.[user.email];
    if (layout.courier) {
      return <CourierContainer />;
    }
  }

  return <CourierContainer />;
};

export default CourierPage;
