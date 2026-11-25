import type { Article, Product } from '@/data/types';

export function matchesQuery(query: string, fields: string[]): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = fields.join(' ').toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

export function articleFields(article: Article): string[] {
  return [article.title, article.dek, article.excerpt, article.category, article.author.name];
}

export function productFields(product: Product): string[] {
  return [product.name, product.description, product.category, product.tagline];
}
