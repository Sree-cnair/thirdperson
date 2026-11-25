import { isValidHttpUrl } from '@/lib/url';

export const CONTRIBUTION_CATEGORIES = [
  'Cinema',
  'Football',
  'Fashion',
  'Design',
  'Society',
  'World Affairs',
  'Opinion',
  'Other',
] as const;

export interface ContributionValues {
  name: string;
  email: string;
  articleTitle: string;
  category: '' | (typeof CONTRIBUTION_CATEGORIES)[number];
  authorBio: string;
  articleText: string;
  referenceLink: string;
  originalityConfirmed: boolean;
}

export const EMPTY_CONTRIBUTION: ContributionValues = {
  name: '',
  email: '',
  articleTitle: '',
  category: '',
  authorBio: '',
  articleText: '',
  referenceLink: '',
  originalityConfirmed: false,
};

type ContributionErrors = Partial<Record<keyof ContributionValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContribution(values: ContributionValues): ContributionErrors {
  const errors: ContributionErrors = {};

  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (values.articleTitle.trim().length < 3) errors.articleTitle = 'Please give your article a title.';
  if (!values.category) errors.category = 'Please choose a category.';
  if (values.authorBio.trim().length < 10) errors.authorBio = 'Please add a short bio (at least 10 characters).';
  if (values.articleText.trim().length < 200) errors.articleText = 'Your article needs at least 200 characters.';
  if (values.articleText.trim().length > 30000) errors.articleText = 'Please keep your article under 30,000 characters.';
  if (values.referenceLink.trim() && !isValidHttpUrl(values.referenceLink.trim())) {
    errors.referenceLink = 'Please enter a full link starting with https://';
  }
  if (!values.originalityConfirmed) errors.originalityConfirmed = 'Please confirm originality and permission to continue.';

  return errors;
}
