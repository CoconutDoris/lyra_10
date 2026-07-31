import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Article,
  TimelineEvent,
  ThemeConfig,
  SiteConfig,
  TagMeta,
  SavedTheme,
} from "../types";
import { loadFromStorage, saveToStorage, generateId, generateExcerpt } from "../utils/storage";
import {
  defaultArticles,
  defaultTimelineEvents,
  defaultTheme,
  defaultSite,
  defaultTagMetas,
} from "../utils/defaultData";

const STORAGE_KEYS = {
  articles: "dolihame-articles",
  timeline: "dolihame-timeline",
  theme: "dolihame-theme",
  site: "dolihame-site",
  tagMetas: "dolihame-tag-metas",
  savedThemes: "dolihame-saved-themes",
};

interface BlogContextType {
  articles: Article[];
  timelineEvents: TimelineEvent[];
  theme: ThemeConfig;
  site: SiteConfig;
  tagMetas: TagMeta[];
  savedThemes: SavedTheme[];

  // Article actions
  addArticle: (article: Omit<Article, "id" | "createdAt" | "updatedAt" | "excerpt">) => Article;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  getArticle: (id: string) => Article | undefined;
  getArticlesByTag: (tag: string) => Article[];

  // Timeline actions
  addTimelineEvent: (event: Omit<TimelineEvent, "id">) => void;
  updateTimelineEvent: (id: string, updates: Partial<TimelineEvent>) => void;
  deleteTimelineEvent: (id: string) => void;

  // Theme actions
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
  saveCurrentTheme: (name: string) => void;
  loadSavedTheme: (id: string) => void;
  deleteSavedTheme: (id: string) => void;

  // Tag meta actions
  addTagMeta: (meta: TagMeta) => void;
  updateTagMeta: (name: string, updates: Partial<TagMeta>) => void;
  deleteTagMeta: (name: string) => void;
  getTagColor: (name: string) => string;

  // Site config actions
  updateSite: (updates: Partial<SiteConfig>) => void;

  // Data management
  exportData: () => string;
  importData: (json: string) => boolean;
  resetAllData: () => void;
}

const BlogContext = createContext<BlogContextType | null>(null);

export function BlogProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(() =>
    loadFromStorage(STORAGE_KEYS.articles, defaultArticles)
  );
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(() =>
    loadFromStorage(STORAGE_KEYS.timeline, defaultTimelineEvents)
  );
  const [theme, setTheme] = useState<ThemeConfig>(() =>
    loadFromStorage(STORAGE_KEYS.theme, defaultTheme)
  );
  const [site, setSite] = useState<SiteConfig>(() =>
    loadFromStorage(STORAGE_KEYS.site, defaultSite)
  );
  const [tagMetas, setTagMetas] = useState<TagMeta[]>(() =>
    loadFromStorage(STORAGE_KEYS.tagMetas, defaultTagMetas)
  );
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>(() =>
    loadFromStorage(STORAGE_KEYS.savedThemes, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.articles, articles);
  }, [articles]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.timeline, timelineEvents);
  }, [timelineEvents]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.theme, theme);
    applyThemeToCSS(theme);
  }, [theme]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.site, site);
  }, [site]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.tagMetas, tagMetas);
  }, [tagMetas]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.savedThemes, savedThemes);
  }, [savedThemes]);

  const applyThemeToCSS = (t: ThemeConfig) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", t.primaryColor);
    root.style.setProperty("--color-primary-light", lightenColor(t.primaryColor, 20));
    root.style.setProperty("--color-primary-dark", darkenColor(t.primaryColor, 20));
    root.style.setProperty("--color-accent", t.accentColor);
    root.style.setProperty("--color-bg", t.backgroundColor);
    root.style.setProperty("--color-surface", t.surfaceColor);
    root.style.setProperty("--color-text", t.textColor);
    root.style.setProperty("--color-text-secondary", t.textColor + "cc");
    root.style.setProperty("--color-text-muted", t.textColor + "88");
    root.style.setProperty("--color-border", t.textColor + "22");
    root.style.setProperty("--color-surface-hover", t.surfaceColor === "#ffffff" ? "#f5f5f5" : darkenColor(t.surfaceColor, 5));

    const fontMap = {
      sans: "'Inter', 'Noto Sans SC', system-ui, sans-serif",
      serif: "'Noto Serif SC', Georgia, serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    };
    root.style.setProperty("--font-body", fontMap[t.fontFamily]);
    root.style.setProperty("--font-heading", fontMap[t.fontFamily]);
    root.style.setProperty("--font-mono", "'JetBrains Mono', 'Fira Code', monospace");
  };

  const addArticle = useCallback((article: Omit<Article, "id" | "createdAt" | "updatedAt" | "excerpt">) => {
    const now = new Date().toISOString();
    const newArticle: Article = {
      ...article,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      excerpt: article.excerpt || generateExcerpt(article.content),
    };
    setArticles((prev) => [newArticle, ...prev]);
    return newArticle;
  }, []);

  const updateArticle = useCallback((id: string, updates: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              ...updates,
              excerpt: updates.content ? updates.excerpt || generateExcerpt(updates.content) : a.excerpt,
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    );
  }, []);

  const deleteArticle = useCallback((id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const getArticle = useCallback((id: string) => articles.find((a) => a.id === id), [articles]);

  const getArticlesByTag = useCallback((tag: string) => articles.filter((a) => a.tags.includes(tag)), [articles]);

  const addTimelineEvent = useCallback((event: Omit<TimelineEvent, "id">) => {
    setTimelineEvents((prev) =>
      [...prev, { ...event, id: generateId() }].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  }, []);

  const updateTimelineEvent = useCallback((id: string, updates: Partial<TimelineEvent>) => {
    setTimelineEvents((prev) =>
      prev
        .map((e) => (e.id === id ? { ...e, ...updates } : e))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }, []);

  const deleteTimelineEvent = useCallback((id: string) => {
    setTimelineEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateTheme = useCallback((updates: Partial<ThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetTheme = useCallback(() => {
    setTheme(defaultTheme);
  }, []);

  const saveCurrentTheme = useCallback((name: string) => {
    const newSaved: SavedTheme = {
      id: generateId(),
      name,
      theme: { ...theme },
    };
    setSavedThemes((prev) => [...prev, newSaved]);
  }, [theme]);

  const loadSavedTheme = useCallback((id: string) => {
    setSavedThemes((prev) => {
      const found = prev.find((t) => t.id === id);
      if (found) setTheme(found.theme);
      return prev;
    });
  }, []);

  const deleteSavedTheme = useCallback((id: string) => {
    setSavedThemes((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addTagMeta = useCallback((meta: TagMeta) => {
    setTagMetas((prev) => {
      if (prev.some((t) => t.name === meta.name)) return prev;
      return [...prev, meta];
    });
  }, []);

  const updateTagMeta = useCallback((name: string, updates: Partial<TagMeta>) => {
    setTagMetas((prev) =>
      prev.map((t) => (t.name === name ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTagMeta = useCallback((name: string) => {
    setTagMetas((prev) => prev.filter((t) => t.name !== name));
  }, []);

  const getTagColor = useCallback((name: string): string => {
    const meta = tagMetas.find((t) => t.name === name);
    return meta?.color || "var(--color-primary)";
  }, [tagMetas]);

  const updateSite = useCallback((updates: Partial<SiteConfig>) => {
    setSite((prev) => ({ ...prev, ...updates }));
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify({ articles, timelineEvents, theme, site, tagMetas, savedThemes }, null, 2);
  }, [articles, timelineEvents, theme, site, tagMetas, savedThemes]);

  const importData = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.articles) setArticles(data.articles);
      if (data.timelineEvents) setTimelineEvents(data.timelineEvents);
      if (data.theme) setTheme(data.theme);
      if (data.site) setSite(data.site);
      if (data.tagMetas) setTagMetas(data.tagMetas);
      if (data.savedThemes) setSavedThemes(data.savedThemes);
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetAllData = useCallback(() => {
    setArticles(defaultArticles);
    setTimelineEvents(defaultTimelineEvents);
    setTheme(defaultTheme);
    setSite(defaultSite);
    setTagMetas(defaultTagMetas);
    setSavedThemes([]);
  }, []);

  return (
    <BlogContext.Provider
      value={{
        articles,
        timelineEvents,
        theme,
        site,
        tagMetas,
        savedThemes,
        addArticle,
        updateArticle,
        deleteArticle,
        getArticle,
        getArticlesByTag,
        addTimelineEvent,
        updateTimelineEvent,
        deleteTimelineEvent,
        updateTheme,
        resetTheme,
        saveCurrentTheme,
        loadSavedTheme,
        deleteSavedTheme,
        addTagMeta,
        updateTagMeta,
        deleteTagMeta,
        getTagColor,
        updateSite,
        exportData,
        importData,
        resetAllData,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used within BlogProvider");
  return ctx;
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * (percent / 100)));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * (percent / 100)));
  const b = Math.min(255, (num & 0xff) + Math.round(255 * (percent / 100)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * (percent / 100)));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * (percent / 100)));
  const b = Math.max(0, (num & 0xff) - Math.round(255 * (percent / 100)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
