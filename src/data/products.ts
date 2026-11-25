import type { Product } from '@/data/types';

export const PRODUCTS: Product[] = [
  {
    slug: 'pakaram-core-oversized-tee',
    name: 'THE OTHER PERSON Core Oversized Tee',
    category: 'Tees',
    price: 1899,
    tagline: 'A considered everyday essential. Comfortable, relaxed and made to carry an idea.',
    description:
      'The Core is the foundation of the label: a heavyweight oversized tee with a dropped shoulder, a relaxed body and a small THE OTHER PERSON wordmark at the chest. Cut for layering, it works as a standalone piece or under an open shirt.',
    fabric: ['100% combed cotton', '240 GSM heavyweight jersey', 'Garment-washed for a soft hand feel', 'Colour: Ink Black'],
    fit: ['Oversized, dropped shoulder', 'Boxy body with a relaxed sleeve', 'Length sits below the hip'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      {
        src: 'https://images.pexels.com/photos/6342786/pexels-photo-6342786.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        alt: 'Overhead view of a folded pullover with a brand logo on a wooden floor',
      },
      {
        src: 'https://images.pexels.com/photos/8159073/pexels-photo-8159073.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        alt: 'A casually dressed man with tattoos standing in a studio',
      },
    ],
  },
  {
    slug: 'pakaram-abstract-pattern-tee',
    name: 'THE OTHER PERSON Abstract Pattern Tee',
    category: 'Tees',
    price: 1699,
    tagline: 'An abstract repeat for people who like their basics with a little more going on.',
    description:
      'An experiment in pattern. The abstract triangle repeat is drawn from the THE OTHER PERSON accent and printed as a single, all-over graphic across a regular-fit tee. Each print is placed by hand, so no two shirts are identical.',
    fabric: ['100% cotton', '200 GSM single jersey', 'Water-based print that keeps its softness', 'Colour: Warm Cream'],
    fit: ['Regular fit with a crew neck', 'Slightly cropped body length', 'Ribbed collar for shape retention'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      {
        src: 'https://images.pexels.com/photos/8146448/pexels-photo-8146448.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        alt: 'Colourful t-shirts draped over a minimal clothing rack',
      },
      {
        src: 'https://images.pexels.com/photos/19248894/pexels-photo-19248894.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        alt: 'A young woman with curly hair wearing a black t-shirt against a white background',
      },
    ],
  },
  {
    slug: 'pakaram-typography-tee',
    name: 'THE OTHER PERSON Typography Tee',
    category: 'Tees',
    price: 1599,
    tagline: 'A thought worth wearing, set in bold type.',
    description:
      'Part of the typography series. A single line of text, drawn from street signs and film dialogue, printed in condensed capitals. The wearer becomes a reader first, and the phrase starts the conversation.',
    fabric: ['100% cotton', '180 GSM jersey', 'Screen-printed in a single colour', 'Colour: Ink Black'],
    fit: ['Relaxed regular fit', 'Shoulder-to-hem length suited to most heights', 'Double-stitched hem'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      {
        src: 'https://images.pexels.com/photos/19248894/pexels-photo-19248894.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        alt: 'A young woman with curly hair wearing a black t-shirt against a white background',
      },
      {
        src: 'https://images.pexels.com/photos/6342786/pexels-photo-6342786.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        alt: 'Overhead view of a folded pullover with a brand logo on a wooden floor',
      },
    ],
  },
  {
    slug: 'pakaram-everyday-tote',
    name: 'THE OTHER PERSON Everyday Tote',
    category: 'Totes',
    price: 1299,
    tagline: 'For books, errands, plans and everything you carry between them.',
    description:
      'A structured canvas tote with reinforced handles and an interior pocket. The wordmark is printed on one face, and the bag is sized to carry a hardcover book, a laptop sleeve and a water bottle without slumping.',
    fabric: ['100% heavyweight canvas', 'Reinforced cotton handles', 'Interior zip pocket', 'Colour: Natural'],
    fit: ['Approx. 38 cm wide x 40 cm high', 'Shoulder drop of 26 cm', 'Machine washable on a cold cycle'],
    sizes: ['One size'],
    images: [
      {
        src: 'https://images.pexels.com/photos/1214212/pexels-photo-1214212.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        alt: 'A simple black canvas tote bag hanging on a wooden rack',
      },
      {
        src: 'https://images.pexels.com/photos/27100518/pexels-photo-27100518.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        alt: 'A white leather tote bag with brown handles and strap',
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export interface SizeGuide {
  headers: string[];
  rows: string[][];
}

export const SIZE_GUIDES: Record<Product['category'], SizeGuide> = {
  Tees: {
    headers: ['Size', 'Chest (cm)', 'Body length (cm)'],
    rows: [
      ['S', '110', '68'],
      ['M', '116', '70'],
      ['L', '122', '72'],
      ['XL', '128', '74'],
      ['XXL', '134', '76'],
    ],
  },
  Totes: {
    headers: ['Size', 'Width (cm)', 'Height (cm)'],
    rows: [['One size', '38', '40']],
  },
};
