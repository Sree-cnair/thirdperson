export type ArticleSection = 'stories' | 'opinion' | 'culture' | 'fashion';

export type ArticleCategory = 'Cinema' | 'Football' | 'Fashion' | 'Design' | 'Society' | 'World Affairs' | 'Opinion' | 'Other';

export interface Author {
  name: string;
  role: string;
}

export interface Article {
  id?: string;
  featured?: boolean;
  slug: string;
  title: string;
  dek: string;
  excerpt: string;
  section: ArticleSection;
  category: ArticleCategory;
  author: Author;
  date: string;
  readingTime: number;
  image: { src: string; alt: string };
  body: string[];
}

export interface ProductImage {
  src: string;
  alt: string;
}

export type ProductCategory = 'Tees' | 'Totes';

export interface Product {
  id?: string;
  productKind?: 'physical' | 'digital';
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  tagline: string;
  description: string;
  fabric: string[];
  fit: string[];
  sizes: string[];
  images: ProductImage[];
}
