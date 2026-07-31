import { useState, useMemo } from "react";
import { Search, FileText } from "lucide-react";
import { useBlog } from "../context/BlogContext";
import ArticleCard from "../components/ArticleCard";

export default function Home() {
  const { articles, theme, site, getTagColor } = useBlog();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach((a) => a.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles
      .filter((a) => a.published)
      .filter((a) => {
        if (selectedTag && !a.tags.includes(selectedTag)) return false;
        if (search) {
          const q = search.toLowerCase();
          return a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q));
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [articles, search, selectedTag]);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="mb-10 text-center py-8">
        {site.logoImage ? (
          <img
            src={site.logoImage}
            alt={site.siteName}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl object-cover shadow-lg"
          />
        ) : (
          <div
            className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg"
            style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))` }}
          >
            {site.siteName.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
          {site.siteName}
        </h1>
        <p className="text-base" style={{ color: "var(--color-text-secondary)" }}>
          {site.description}
        </p>
      </section>

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
          <input
            type="text"
            placeholder="搜索文章..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary transition-colors"
            style={{ color: "var(--color-text)" }}
          />
        </div>
      </div>

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !selectedTag ? "text-white" : "hover:bg-surface-hover"
            }`}
            style={{
              background: !selectedTag ? "var(--color-primary)" : "var(--color-surface)",
              color: !selectedTag ? "white" : "var(--color-text-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            全部
          </button>
          {allTags.map((tag) => {
            const color = getTagColor(tag);
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isActive ? null : tag)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
                style={{
                  background: isActive ? color : color + "15",
                  color: isActive ? "white" : color,
                  border: `1px solid ${color}40`,
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Article list */}
      {filteredArticles.length > 0 ? (
        <div className={theme.layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-4"}>
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
          <FileText size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">暂无文章</p>
          <p className="text-sm mt-1">
            {search || selectedTag ? "没有找到匹配的文章" : "点击右上角「写文章」开始创作"}
          </p>
        </div>
      )}
    </div>
  );
}
