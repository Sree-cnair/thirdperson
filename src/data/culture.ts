import type { ArticleCategory } from '@/data/types';

export interface CultureCategory {
  slug: string;
  label: string;
  description: string;
  categories: ArticleCategory[];
  image: { src: string; alt: string };
}

export const CULTURE_CATEGORIES: CultureCategory[] = [
  {
    slug: 'family-society',
    label: 'Family & Society',
    description: 'The rules we inherit, the roles we are handed and the expectations that follow us into adulthood.',
    categories: ['Society', 'Relationships', 'Work & ambition'],
    image: {
      src: 'https://images.pexels.com/photos/17928231/pexels-photo-17928231.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'A traditional houseboat cruising through the Kerala backwaters',
    },
  },
  {
    slug: 'identity-expression',
    label: 'Identity & Expression',
    description: 'Clothes, choices, language and the many ways we decide to show up in the world.',
    categories: ['Identity', 'Objects & expression'],
    image: {
      src: 'https://images.pexels.com/photos/31528815/pexels-photo-31528815.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'Artistic black and white studio portrait',
    },
  },
  {
    slug: 'digital-life',
    label: 'Digital Life',
    description: 'Group chats, forwarded messages, online performance and the social lives we lead through screens.',
    categories: ['Digital culture'],
    image: {
      src: 'https://images.pexels.com/photos/18089547/pexels-photo-18089547.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'A narrow city alley with people walking in black and white',
    },
  },
  {
    slug: 'everyday-absurdities',
    label: 'Everyday Absurdities',
    description: 'Small encounters, familiar habits and the funny contradictions hiding in ordinary days.',
    categories: ['Everyday life'],
    image: {
      src: 'https://images.pexels.com/photos/3692641/pexels-photo-3692641.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'A man filming with a vintage camera in a black and white setting',
    },
  },
];

export function getCultureCategory(slug: string | null): CultureCategory | undefined {
  return CULTURE_CATEGORIES.find((category) => category.slug === slug);
}
