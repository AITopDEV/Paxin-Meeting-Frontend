import AboutSection from '@/components/main/about';
import FeatureSection from '@/components/main/feature';
import HeroSection from '@/components/main/hero';
import JoinUsSection from '@/components/main/joinus';
import NavigateSection from '@/components/main/navigate';
import ServicesSection from '@/components/main/services';
import TestimonialSection from '@/components/main/testimonial';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import '@/styles/main.css';

export default function LandingPage({
  params,
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = useTranslations('main');
  return (
    <section className='container grid items-center gap-0 px-0 pb-8'>
      <HeroSection />
      <FeatureSection />
      <NavigateSection />
      <TestimonialSection />
      <AboutSection />
      <ServicesSection />
      <JoinUsSection />
    </section>
  );
}