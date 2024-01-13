export interface PostMetadata {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  created_at: Date;
  is_published: Boolean;
}

export interface Post extends PostMetadata {
  content: string;
}

export interface SiteMetadata {
  title: string;
  title_for_sharing: string;
  description: string;
  url: string;
}

export interface HtmlTemplateVariables {
  site: SiteMetadata;
  posts?: PostMetadata[];
  post?: PostMetadata;
}
