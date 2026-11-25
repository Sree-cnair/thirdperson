export const SITE_NAME = 'THE OTHER PERSON';
export const TAGLINE = 'Who is this other person anyway?';
export const CONTACT_EMAIL = '';

export const NAV_LINKS = [
  { label: 'Stories', to: '/stories' },
  { label: 'Opinion', to: '/opinion' },
  { label: 'Culture', to: '/culture' },
  { label: 'Fashion', to: '/fashion' },
  { label: 'Store', to: '/store' },
  { label: 'Contribute', to: '/contribute' },
] as const;

export const SOCIAL_LINKS = [] as const;

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
