import React, { Dispatch, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';

import { supportedTranslationLangs } from '../helpers/supportedLangs';
import { useTranslations } from 'next-intl';

interface TransLangsElmPros {
  selectedTransLangs: Array<string>;
  setSelectedTransLangs: Dispatch<Array<string>>;
}

const TransLangsElm = ({
  selectedTransLangs,
  setSelectedTransLangs,
}: TransLangsElmPros) => {
  const t = useTranslations('meet');

  return (
    <div className='flex items-center justify-between'>
      <label
        htmlFor='language'
        className='w-auto pr-4 text-sm dark:text-darkText'
      >
        {t('speech-services.translation-langs-label')}
      </label>
      <Listbox
        value={selectedTransLangs}
        onChange={setSelectedTransLangs}
        multiple={true}
      >
        <div className='relative mt-1 w-[150px] sm:w-[250px]'>
          <Listbox.Button className='relative min-h-[36px] w-full cursor-default rounded-md border border-gray-300 bg-transparent py-1 pl-3 pr-7 text-left text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-darkText dark:text-darkText'>
            <span className='block'>
              {selectedTransLangs
                .map((l) => {
                  if (!l) return [];
                  return supportedTranslationLangs.filter(
                    (lang) => lang.code === l
                  )[0].name;
                })
                .join(', ')}
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 '>
              <i className='pnm-updown primaryColor text-xl dark:text-darkText' />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='scrollBar scrollBar4 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {supportedTranslationLangs.map((l) => (
                <Listbox.Option
                  key={`trans_${l.code}`}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-7 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={l.code}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {l.name}
                      </span>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-1 text-amber-600'>
                          <i className='pnm-check h-4 w-4' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default TransLangsElm;
