export interface User {
  id: string;
  username: string;
  name: string | null;
  verified: boolean;
  bio: string | null;
  location: string | null;
  city: string | null;
  country_code: string | null;
  website_url: string | null;
  avatar_url: string | null;
  x_followers_count: number | null;
  profile_url: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  pitch: string | null;
  url: string;
  slug: string;
  verified: boolean;
  icon_url: string | null;
  ahrefs_domain_rating: number | null;
  project_url: string;
  owner: { id: string; username: string };
  created_at: string;
}

export interface Verification {
  instructions: string;
  meta_tag: string;
  link_tag: string;
  txt_record: { domain: string; value: string } | null;
}

export interface OwnProject extends Project {
  verification: Verification | null;
}

export interface ProjectInput {
  name?: string;
  url?: string;
  pitch?: string | null;
}

export interface Page<T> {
  data: T[];
  has_more: boolean;
  next_cursor: string | null;
}
