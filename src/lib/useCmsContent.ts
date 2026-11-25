import { useEffect, useState } from 'react';
import { ARTICLES } from '@/data/articles';
import { PRODUCTS } from '@/data/products';
import type { Article, Product } from '@/data/types';
import { cmsSupabase } from '@/lib/cmsSupabase';

function mapArticle(row: any): Article {
  const typeCategory: Record<string, Article['category']> = {
    culture: 'Cinema', fashion: 'Fashion', opinion: 'Opinion', football: 'Football',
    world_affairs: 'World Affairs', community: 'Other',
  };
  return {
    id: row.id,
    featured: Boolean(row.featured),
    slug: row.slug,
    title: row.title,
    dek: row.dek || row.excerpt || '',
    excerpt: row.excerpt || row.dek || '',
    section: (row.section || 'stories') as Article['section'],
    category: (row.categories?.name === 'World Affairs' ? 'World Affairs' : row.categories?.name || typeCategory[row.content_type] || 'Other') as Article['category'],
    author: { name: row.author_name || 'PAKARAM', role: row.author_role || 'Contributor' },
    date: (row.published_at || row.created_at || new Date().toISOString()).slice(0, 10),
    readingTime: row.reading_time || 5,
    image: { src: row.cover_image_url || ARTICLES[0].image.src, alt: row.image_alt || row.title },
    body: (row.body || '').split(/\n\s*\n/).map((part: string) => part.trim()).filter(Boolean),
  };
}

function mapProduct(row: any): Product {
  const gallery = Array.isArray(row.gallery) ? row.gallery : [];
  const images = gallery.length
    ? gallery.map((image: any) => ({ src: image.src, alt: image.alt || row.name }))
     : row.image_url ? [{ src: row.image_url, alt: row.name }] : PRODUCTS[0].images;
  return {
    id: row.id,
    productKind: row.product_kind || 'physical',
    slug: row.slug,
    name: row.name,
    category: (row.category || (row.product_type === 'accessory' ? 'Totes' : 'Tees')) as Product['category'],
    price: Number(row.price || 0),
    tagline: row.tagline || '',
    description: row.description || '',
    fabric: Array.isArray(row.fabric) ? row.fabric : [],
    fit: Array.isArray(row.fit) ? row.fit : [],
    sizes: Array.isArray(row.sizes) && row.sizes.length ? row.sizes : ['One size'],
    images,
  };
}

export function usePublishedArticles(): Article[] {
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  useEffect(() => {
    let active = true;
    if (!cmsSupabase) return;
    cmsSupabase.from('articles').select('*, categories(name)').eq('status', 'published').order('published_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active || error || !data?.length) return;
        setArticles(data.map(mapArticle));
      });
    return () => { active = false; };
  }, []);
  return articles;
}

export function useActiveProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  useEffect(() => {
    let active = true;
    if (!cmsSupabase) return;
    cmsSupabase.from('products').select('*').eq('status', 'active').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active || error) return;
        setProducts((data ?? []).map(mapProduct));
      });
    return () => { active = false; };
  }, []);
  return products;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<{ hero_eyebrow?: string; hero_title?: string; hero_description?: string; featured_article_id?: string | null } | null>(null);
  useEffect(() => {
    let active = true;
    if (!cmsSupabase) return;
    cmsSupabase.from('site_settings').select('*').eq('id', 1).maybeSingle().then(({ data, error }) => {
      if (active && !error && data) setSettings(data);
    });
    return () => { active = false; };
  }, []);
  return settings;
}
