import React from 'react';
import { getServerSession } from 'next-auth';
import { useLocale } from 'next-intl';
import PaxMeet from '@/components/meet';
import MeetHeader from '@/components/meet/newHeader';
// import { SiteHeader } from '@/components/header/site-header';
// import Sidebar from '@/components/profiles/sidebar';
import authOptions from '@/lib/authOptions';
import { headers } from 'next/headers';
import cookie from 'cookie'; 

async function getData(locale: string) {
  const session = await getServerSession(authOptions);
  let accessToken = session?.accessToken;
  if (!accessToken) {
    const cookies = headers().get('cookie') || '';
    const parsedCookies = cookie.parse(cookies);
    accessToken = parsedCookies.access_token;
  }

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/users/me?language=${locale}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function ProfilePageLayout({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const locale = useLocale();
  const data = await getData(locale);


  return (
    <>
      <MeetHeader
        id={params.id}
        user={
          data
            ? {
                email: data.data.user.email,
                avatar: data.data.user.photo,
                username: data.data.user.name,
              }
            : null
        }
      />
      <div className='absolute top-0 mt-[80px] w-full sm:mt-20'>
        <PaxMeet roomId={params.id} />
      </div>
    </>
  );
}
