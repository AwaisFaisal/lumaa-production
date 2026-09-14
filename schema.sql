CREATE TABLE subscribers (
  id TEXT PRIMARY KEY,
  first_name TEXT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  interest TEXT NOT NULL DEFAULT 'general',
  consent_text_version TEXT NOT NULL,
  consented_at TEXT NOT NULL,
  signup_source TEXT NOT NULL DEFAULT 'website',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX subscribers_interest_idx
  ON subscribers (interest);

CREATE INDEX subscribers_created_at_idx
  ON subscribers (created_at);

CREATE TABLE moments (
  id TEXT PRIMARY KEY,
  moment_text TEXT NOT NULL,
  first_name TEXT,
  email TEXT,
  publish_anonymously INTEGER NOT NULL DEFAULT 1,
  marketing_consent INTEGER NOT NULL DEFAULT 0,
  consent_text_version TEXT,
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TEXT NOT NULL
);

CREATE INDEX moments_status_idx
  ON moments (moderation_status);

CREATE INDEX moments_submitted_at_idx
  ON moments (submitted_at);
