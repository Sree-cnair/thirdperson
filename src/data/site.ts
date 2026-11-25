import { Instagram, Twitter, Youtube } from 'lucide-react';

export const SITE_NAME = 'OTHER PEOPLE';
export const TAGLINE = 'People. Ideas. Culture. Everything else.';
export const CONTACT_EMAIL = 'hello@pakaram.in';

export const NAV_LINKS = [
  { label: 'Stories', to: '/stories' },
  { label: 'Opinion', to: '/opinion' },
  { label: 'Culture', to: '/culture' },
  { label: 'Fashion', to: '/fashion' },
  { label: 'Store', to: '/store' },
  { label: 'Contribute', to: '/contribute' },
] as const;

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'X', href: '#', icon: Twitter },
  { label: 'YouTube', href: '#', icon: Youtube },
] as const;

export const FOOTER_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Contribute', to: '/contribute' },
  { label: 'Store', to: '/store' },
] as const;

export const POLICY_LINKS = [
  { label: 'Privacy', to: '/about#policies' },
  { label: 'Contributions', to: '/about#policies' },
  { label: 'Store and returns', to: '/about#policies' },
] as const;
