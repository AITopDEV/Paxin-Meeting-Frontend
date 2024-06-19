import * as React from 'react';
import { BiSolidCategory } from 'react-icons/bi';

import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export interface CategoryCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  categories: string[];
}

function CategoryCard({ categories }: CategoryCardProps) {
  const t = useTranslations('main');
  const searchParams = useSearchParams();

  const queries: { [key: string]: string } = {};

  for (let [key, value] of searchParams.entries()) {
    queries[key] = value;
  }

  return (
    <div className='border-badge group relative w-full rounded-xl border border-[#ffffff2b] bg-[#9c9c9c1a] p-2 transition-all duration-300 hover:border-primary'>
      <div className='absolute inset-0 size-full bg-gradient-to-b from-transparent to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
      <div className='flex items-center gap-1'>
        <BiSolidCategory className='size-5 text-gray-500 dark:text-white' />
        <span className='pl-1'>{t('category')}</span>
      </div>
      <div className='mb-0 h-[1.5px] w-2/3 rounded-lg bg-gradient-to-r from-muted-foreground to-transparent'></div>
      <div className='flex w-full flex-wrap gap-1 md:text-md xl:text-base text-xs'>
        {categories.map((category, i) => (
          <Link
            href={{ query: { ...queries, category, page: 1 } }}
            key={i}
            className='z-10 cursor-pointer'
          >
            <Badge
              key={i}
              variant='outline'
              className='w-fit rounded-xl border-[#6060602b] p-2'
            >
              {category}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}

export { CategoryCard };
