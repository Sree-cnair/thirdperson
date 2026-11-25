import { useEffect } from 'react';

export function useDocumentMeta(title: string, description: string): void {
  useEffect(() => {
    document.title = title;
    const existing = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const tag = existing ?? document.createElement('meta');
    if (!existing) {
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = description;
  }, [title, description]);
}
