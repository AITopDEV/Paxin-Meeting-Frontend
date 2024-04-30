'use client';

// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import useSWR from 'swr';

import { FlowCard } from '@/components/stream/flow/flow-card';
import { FlowCardSkeleton } from '@/components/stream/flow/flow-card-skeleton';
// import { Button } from '@/components/ui/button';
// import { scrollToTransition } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
// import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
export interface FlowProps {
  data: Array<FlowSkeletonData>;
}
export interface FlowSkeletonData {
  id: string;
  title: string;
  publisherId: string;
  roomId: string;
}

export default function FlowSection({ data }: FlowProps) {
  const t = useTranslations('main');
  const searchParams = useSearchParams();

  return (
    <div className='w-full'>
      <div className='grid w-full grid-cols-1 place-items-center gap-4 pb-8 pt-[0px] md:mt-[120px] md:grid-cols-2 lg:grid-cols-3'>
        {data ? (
          data?.length > 0 ? (
            data.map((flow: FlowSkeletonData) => (
              <FlowCard
                key={flow.id}
                {...flow}
                // callbackURL={encodeURIComponent(
                //   `/home?mode=flow&scrollPos=${scrollPos}${searchParams.toString() ? '&' : ''}${searchParams.toString()}`
                // )}
                callbackURL=''
              />
            ))
          ) : (
            <div className='flex h-[50vh] w-full items-center justify-center rounded-lg bg-secondary md:col-span-2 lg:col-span-3'>
              <div className='flex flex-col items-center'>
                <Image
                  src={'/images/home/empty-search-result.svg'}
                  width={200}
                  height={200}
                  alt='Empty Search Result'
                />
                <p className='text-center text-lg font-bold'>
                  {t('empty_search_result')}
                </p>
              </div>
            </div>
          )
        ) : (
          <>
            <FlowCardSkeleton />
            <FlowCardSkeleton className='hidden md:block' />
            <FlowCardSkeleton className='hidden lg:block' />
          </>
        )}
      </div>
    </div>
  );
}
