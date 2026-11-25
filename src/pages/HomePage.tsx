import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { HomeHero, LatestStories } from '@/components/home/HomeSections';
import { OpinionFeature } from '@/components/home/OpinionFeature';
import { CultureBlocks } from '@/components/home/CultureBlocks';
import { FashionBanner } from '@/components/home/FashionBanner';
import { CommunityBanner } from '@/components/home/CommunityBanner';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export function HomePage() {
  useDocumentMeta(
    'Who is this other person anyway? | THE OTHER PERSON',
    'Stories, opinions and creative work about the invisible audience shaping Indian everyday life — and the choices we make around them.',
  );

  return (
    <>
      <HomeHero />
      <LatestStories />
      <OpinionFeature />
      <CultureBlocks />
      <FashionBanner />
      <CommunityBanner />
      <NewsletterSection />
    </>
  );
}
