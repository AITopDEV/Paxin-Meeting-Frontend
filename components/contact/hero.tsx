import { useTranslation } from 'next-i18next';

export function HeroSection() {
  const { t } = useTranslation();
  return (
    <div className="flex h-[450px] w-full items-center justify-center bg-[url('/images/contact/hero.png')] bg-cover bg-center bg-no-repeat">
      <div className='ml-8 text-5xl font-bold text-white md:text-7xl'>
        {t('contact_us')}
      </div>
    </div>
  );
}
