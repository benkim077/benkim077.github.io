export interface PostMetadata {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  created_at: Date;
}

export interface SiteMetadata {
  title: string;
  title_for_sharing: string;
  description: string;
  url: string;
}
