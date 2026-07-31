export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: "work" | "life" | "study" | "milestone" | "other";
  color: string;
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  fontFamily: "sans" | "serif" | "mono";
  borderRadius: number;
  layout: "grid" | "list";
  cardStyle: "shadow" | "border" | "minimal";
}

export interface SiteConfig {
  siteName: string;
  author: string;
  description: string;
  avatar: string | null;
  logoImage: string | null;
  social: {
    github: string;
    email: string;
    website: string;
  };
  aboutContent: string;
}

export interface TagMeta {
  name: string;
  color: string;
  description: string;
}

export interface SavedTheme {
  id: string;
  name: string;
  theme: ThemeConfig;
}

export interface BlogState {
  articles: Article[];
  timelineEvents: TimelineEvent[];
  theme: ThemeConfig;
  site: SiteConfig;
  tagMetas: TagMeta[];
  savedThemes: SavedTheme[];
}
