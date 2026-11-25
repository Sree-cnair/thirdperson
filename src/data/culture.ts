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
    slug: 'cinema',
    label: 'Cinema',
    description: 'Films, filmmakers and the stories that keep audiences in their seats.',
    categories: ['Cinema'],
    image: {
      src: 'https://images.pexels.com/photos/3692641/pexels-photo-3692641.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'A man filming with a vintage camera in a black and white setting',
    },
  },
  {
    slug: 'football',
    label: 'Football',
    description: 'Terraces, tactics and the people who give the game its meaning.',
    categories: ['Football'],
    image: {
      src: 'https://images.pexels.com/photos/4038906/pexels-photo-4038906.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'Black and white image of a crowd watching a match from the stadium',
    },
  },
  {
    slug: 'world-society',
    label: 'World & Society',
    description: 'Cities, communities and the questions shaping how we live together.',
    categories: ['Society', 'World Affairs'],
    image: {
      src: 'https://images.pexels.com/photos/17928231/pexels-photo-17928231.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'A traditional houseboat cruising through the Kerala backwaters',
    },
  },
  {
    slug: 'fashion-design',
    label: 'Fashion & Design',
    description: 'Visual culture, graphic experiments and the way we dress our ideas.',
    categories: ['Fashion', 'Design'],
    image: {
      src: 'https://images.pexels.com/photos/31528815/pexels-photo-31528815.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'Artistic black and white studio portrait of a man',
    },
  },
];

export function getCultureCategory(slug: string | null): CultureCategory | undefined {
  return CULTURE_CATEGORIES.find((category) => category.slug === slug);
}
