import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { HomeHero, LatestStories } from '@/components/home/HomeSections';
import { OpinionFeature } from '@/components/home/OpinionFeature';
import { CultureBlocks } from '@/components/home/CultureBlocks';
import { FashionBanner } from '@/components/home/FashionBanner';
import { CommunityBanner } from '@/components/home/CommunityBanner';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export function HomePage() {
  useDocumentMeta(
    'THE OTHER PERSON | You. Me. And the other person.',
    'An Indian culture and ideas platform exploring log kya kahenge, social expectations, identity, everyday absurdities and the things we make.',
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
