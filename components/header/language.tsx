'use client';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaxContext } from '@/context/context';
import { useContext } from 'react';

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const { locale, setLocale } = useContext(PaxContext);

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('locale', lang);
    setLocale(lang);
    console.log(i18n.language);
  };

  return (
    <Select
      defaultValue={i18n.language}
      onValueChange={(value) => {
        changeLang(value);
      }}
    >
      <SelectTrigger
        className={`w-[150px] gap-2 rounded-full bg-transparent pl-5 ${className ? className : ''}`}
      >
        <SelectValue placeholder='Select a language' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='en'>
            <div className='flex items-center'>
              <Image
                src='/images/us.svg'
                alt='en'
                width={24}
                height={24}
                className='mr-2 h-auto w-5'
              />
              English
            </div>
          </SelectItem>
          <SelectItem value='ru'>
            <div className='flex items-center'>
              <Image
                src='/images/ru.svg'
                alt='ru'
                width={24}
                height={24}
                className='mr-2 h-auto w-5'
              />
              Russian
            </div>
          </SelectItem>
          <SelectItem value='ka'>
            <div className='flex items-center'>
              <Image
                src='/images/ge.svg'
                alt='ge'
                width={24}
                height={24}
                className='mr-2 h-auto w-5'
              />
              Georgian
            </div>
          </SelectItem>
          <SelectItem value='es'>
            <div className='flex items-center'>
              <Image
                src='/images/es.svg'
                alt='es'
                width={24}
                height={24}
                className='mr-2 h-auto w-5'
              />
              Spanish
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
