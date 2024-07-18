'use client';

import { MdDashboard } from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { PaxContext } from '@/context/context';
import { ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useContext } from 'react';
import { FaTelegram, FaUser } from 'react-icons/fa';
import { FaUserGear } from 'react-icons/fa6';
import { MdAccountBalanceWallet, MdLockReset } from 'react-icons/md';
import { RiArticleLine } from 'react-icons/ri';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { ChangeNamePopup } from '@/components/profiles/dashboard/change-name-popup';
import { Button } from '@/components/ui/button';
import io from 'socket.io-client';
import axios from 'axios';
import useSWR, {mutate} from 'swr';

const services = [
  {
    icon: RiArticleLine,
    title: 'publications',
    description: 'dashboard_publications_description',
    link: '/profile/posts',
  },
  {
    icon: FaUser,
    title: 'profile',
    description: 'dashboard_profile_description',
    link: '/profile/setting?tab=profile',
  },
  {
    icon: MdAccountBalanceWallet,
    title: 'accounting',
    description: 'dashboard_accounting_description',
    link: '/profile/setting?tab=accounting',
  },
];

const audits = [
  {
    icon: MdLockReset,
    title: 'reset_password',
    description: 'reset_password_description',
    link: '/auth/forgot-password',
  },
  {
    icon: FaUserGear,
    title: 'edit_your_user_account_settings',
    description: 'edit_your_user_account_settings_description',
    link: '/profile/setting?tab=profile',
  },
  {
    icon: RiArticleLine,
    title: 'post_publication',
    description: 'post_publication_description',
    link: '/profile/posts',
  },
  {
    icon: FaTelegram,
    title: 'telegram_profile_setup',
    description: 'telegram_profile_setup_description',
    link: '/profile/setting?tab=telegram',
  },
];

const fetcher = (url: string) => axios.get(url).then((res) => res.data);


export default function DashboardPage() {
  // const socket = io("http://localhost:3001");
  // const { data: session } = useSession();
  // const userId = session?.user?.name || '';
  // console.log(userId)
  
  // useEffect(() => {
  //   socket.on('connect', () => {
  //     console.log('connected to socket')
  //     socket.emit('register', 'userId');
  //   });
  //   socket.on('callMade', async (data) => {
  //     // Here you would handle incoming calls
  //     // For simplicity, we auto-answer them
  //     const { offer } = data;

  //     // This is where you'd handle the WebRTC answer
  //     console.log("Call received, offer:", offer);
  //     // setCallMade(true);

  //     // Simplified - in real scenario, you create an answer and send it back
  //     socket.emit('makeAnswer', { answer: "dummy-answer", to: data.socket });
  //   });

  //   socket.on('answerMade', (data) => {
  //     console.log("Answer received", data);
  //     // Handle the answer
  //   });
  //   return () => {
  //     socket.off('connect');
  //     socket.off('notification');
  //     socket.off('disconnect');
  //     // If necessary, explicitly disconnect (might not be needed depending on use case)
  //     // socket.disconnect();
  //   };

  // }, []);
  const locale = useLocale();

  const {
    data: fetchedData,
    error,
    mutate: profileMutate,
  } = useSWR(`/api/profiles/me?language=${locale}`, fetcher);

  const t = useTranslations('main');
  const { user } = useContext(PaxContext);

  return (
    <div className='mb-[100px] pb-4 px-4 md:mb-[0px]'>
      <Separator className='mb-4' />
      <div className='mb-0 grid grid-cols-2 md:mb-0'>
        <div className='col-span-2 grid gap-3 md:grid-cols-2'>
          <div className='relative flex justify-between rounded-lg bg-white p-6 dark:bg-black md:col-span-2 shadow-md'>
            <div>
            <div className='mt-0 space-y-2 w-full'>
            {fetchedData?.streaming !== null && (
            <div className='mt-0 space-y-2 pb-4'>
                {fetchedData?.streaming?.length > 0 ? (
                  fetchedData?.streaming?.map((stream: any, index: number) => (
                  <Link href={`/stream/${stream.RoomID}/host`} className='flex items-center justify-center gap-2'>
                    <div key={index} className='rounded-lg bg-blue-500 p-4 w-full'>
                      <div className='text-md'>Ваш эфир создан: {stream.Title}</div>
                      <div className='text-sm'>Отркыть</div>
                    </div>
                    </Link>
                  ))
                ) : (
                  <div className='text-sm text-muted-foreground'></div>
                )}
                </div>
              )}
              </div>
              <div className='flex flex-col cursor-pointer items-start text-2xl font-semibold'>
                {t('hello')} {user?.username}
                <ChangeNamePopup>
                  <Button variant='link' size='icon' className='inline w-full'>
                    <div className='flex gap-2'>
                      <div>Cменить имя</div>
                      <MdOutlineDriveFileRenameOutline className='text-2xl' />
                      </div>
                  </Button>
                </ChangeNamePopup>
              </div>
              <div className='text-sm text-muted-foreground'>
                {t('view_all_alerts_description')}
              </div>
              <div className='relative mt-8 flex items-center gap-2'>
                {/* <Separator
                  orientation='vertical'
                  className='relative mx-2 h-14 w-[1px]'
                /> */}
                <div className='cursor-pointer space-y-4 text-center'>
                  <Link
                    href={`/profile/posts?callback=${encodeURIComponent('/profile/dashboard')}`}
                    className='cursor-pointer space-y-4 text-center'
                  >
                    <div className='text-center text-sm text-muted-foreground'>
                      {t('publications')}
                    </div>
                    <div className='text-center text-3xl font-extrabold'>
                      {user?.totalposts || 0}
                    </div>
                  </Link>
                </div>
                <Separator
                  orientation='vertical'
                  className='relative mx-2 h-14 w-[1px]'
                />
                <Link
                  href={`/profile/relationships?callback=${encodeURIComponent('/profile/dashboard')}`}
                  className='cursor-pointer space-y-4 text-center'
                >
                  <div className='text-center text-sm text-muted-foreground'>
                    {t('followers')}
                  </div>
                  <div className='text-center text-3xl font-extrabold'>
                    {user?.followers || 0}
                  </div>
                </Link>
              </div>
            </div>
            <div className='hidden md:block'>
              <Image
                src={'/images/analytic.svg'}
                alt='analytic'
                width={196}
                height={147}
              />
            </div>
          </div>
          <div className='space-y-2'>
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.link}
                className='flex flex-col rounded-lg bg-white p-4 dark:bg-black/40 shadow-md'
              >
                <div className='flex size-8 items-center justify-center rounded-full bg-primary/10'>
                  <service.icon className='size-4 text-primary' />
                </div>
                <div className='text-md my-2 font-semibold'>
                  {t(service.title as keyof IntlMessages['main'])}
                </div>
                <div className='text-xs'>
                  {t(service.description as keyof IntlMessages['main'])}
                </div>
              </Link>
            ))}
          </div>
          <div className='flex size-full max-h-full flex-col rounded-lg bg-white p-4 dark:bg-black/40 shadow-md'>
            <div>
              <div className='text-lg font-semibold'>{t('configure')}</div>
              <div className='text-xs'>{t('configure_description')}</div>
            </div>
            <Separator className='my-2' />
            <div className='size-full '>
              <div>
                {audits.map((audit, index) => (
                  <Link href={audit.link} key={index}>
                    <div className='flex cursor-pointer items-center gap-3 rounded-lg p-2'>
                      <div className='flex size-8 min-w-8 items-center justify-center rounded-full bg-primary/10'>
                        <audit.icon className='size-4 text-primary' />
                      </div>
                      <div>
                        <div className='text-md my-2 line-clamp-1 font-semibold'>
                          {t(audit.title as keyof IntlMessages['main'])}
                        </div>
                        <div className='line-clamp-1 text-xs'>
                          {t(audit.description as keyof IntlMessages['main'])}
                        </div>
                      </div>
                      <ChevronRight className='ml-auto size-4' />
                    </div>
                    <Separator className='my-1' />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
