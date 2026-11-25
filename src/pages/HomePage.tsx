import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { HomeHero, LatestStories } from '@/components/home/HomeSections';
import { OpinionFeature } from '@/components/home/OpinionFeature';
import { CultureBlocks } from '@/components/home/CultureBlocks';
import { FashionBanner } from '@/components/home/FashionBanner';
import { CommunityBanner } from '@/components/home/CommunityBanner';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export function HomePage() {
  useDocumentMeta(
    'OTHER PEOPLE | Another Way of Seeing Things',
    'Stories, opinions and ideas on cinema, football, fashion, society and design from Kerala, India and beyond.',
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
