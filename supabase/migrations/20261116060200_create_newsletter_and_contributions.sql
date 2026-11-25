/*
# Create newsletter and contributor submission tables

Plain-English summary: adds two public intake tables for the PAKARAM website. Visitors can sign up for the newsletter and independent writers can submit articles for editorial review. Visitors can add entries but cannot read, change or delete anyone else's entries.

1. New Tables
- `newsletter_subscribers`: one row per email address that signs up. `email` is unique so the same address cannot be stored twice.
- `contributions`: one row per article submission, including author name and email, article title, category, bio, article text, optional link, and the originality confirmation. `status` starts as `pending` and is set by the editorial team.

2. Security
- Row level security is enabled on both tables.
- The public (anon and signed-in roles) can INSERT only. There are no SELECT, UPDATE or DELETE policies, so submitted data is not visible through the website.
- Column-level length and format checks reject empty or oversized values at the database level.

3. Important notes
- No existing tables are modified.
- Editorial review of contributions happens outside the public website.
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (char_length(email) BETWEEN 5 AND 254 AND position('@' in email) > 1),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254 AND position('@' in email) > 1),
  article_title text NOT NULL CHECK (char_length(article_title) BETWEEN 3 AND 200),
  category text NOT NULL CHECK (category IN ('Cinema', 'Football', 'Fashion', 'Design', 'Society', 'World Affairs', 'Opinion', 'Other')),
  author_bio text NOT NULL CHECK (char_length(author_bio) BETWEEN 10 AND 600),
  article_text text NOT NULL CHECK (char_length(article_text) BETWEEN 200 AND 30000),
  reference_link text CHECK (reference_link IS NULL OR char_length(reference_link) <= 500),
  originality_confirmed boolean NOT NULL CHECK (originality_confirmed = true),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'published', 'declined')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON newsletter_subscribers TO anon, authenticated;
GRANT INSERT ON contributions TO anon, authenticated;

DROP POLICY IF EXISTS "public_subscribe_newsletter" ON newsletter_subscribers;
CREATE POLICY "public_subscribe_newsletter" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "public_submit_contribution" ON contributions;
CREATE POLICY "public_submit_contribution" ON contributions FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');
