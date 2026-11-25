import type { Product } from '@/data/types';
export const PRODUCTS: Product[] = [{
  slug: '2027-calendar', name: '2027 — A Year of Other Plans', category: 'Digital', price: 149,
  tagline: 'A calendar for the plans you make — and the ones you don’t.',
  description: 'A colourful, editorial 2027 calendar with 12 monthly layouts, Monday-start date grids and space for your monthly intentions. Delivered as a 14-page A4 portrait PDF after payment verification.',
  fabric: [], fit: ['14-page PDF', 'A4 portrait layout', 'Monday-start calendar', 'Personal-use digital download'],
  sizes: ['Digital PDF'], images: [{ src: '/products/2027-calendar-cover.svg', alt: '2027 A Year of Other Plans calendar cover' }],
}];
export function getProductBySlug(slug: string): Product | undefined { return PRODUCTS.find((product) => product.slug === slug); }
export interface SizeGuide { headers: string[]; rows: string[][]; }
export const SIZE_GUIDES: Record<'Tees' | 'Totes', SizeGuide> = {
  Tees: { headers: ['Size', 'Chest (cm)', 'Body length (cm)'], rows: [['S','110','68'],['M','116','70'],['L','122','72'],['XL','128','74'],['XXL','134','76']] },
  Totes: { headers: ['Size', 'Width (cm)', 'Height (cm)'], rows: [['One size','38','40']] },
};
