import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Tag as TagIcon, ArrowLeft, FileText, Settings } from "lucide-react";
import { useBlog } from "../context/BlogContext";
import ArticleCard from "../components/ArticleCard";
import TagManager from "../components/TagManager";

export default function Tags() {
  const { articles, tagMetas, getTagColor } = useBlog();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTagManager, setShowTagManager] = useState(false);
  const selectedTag = searchParams.get("tag");

  const tagData = useMemo(() => {
    const map = new Map<string, number>();
    articles.forEach((a) => {
      if (!a.published) return;
      a.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1));
    });
    return Array.from(map.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (!selectedTag) return [];
    return articles
      .filter((a) => a.published && a.tags.includes(selectedTag))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [articles, selectedTag]);

  const getTagDescription = (name: string) => tagMetas.find((t) => t.name === name)?.description;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-center flex-1" style={{ color: "var(--color-text)" }}>
          标签分类
        </h1>
        <button
          onClick={() => setShowTagManager(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-border hover:bg-surface-hover transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
          title="管理标签"
        >
          <Settings size={14} />
          管理标签
        </button>
      </div>

      {!selectedTag ? (
        <>
          {/* Tag cards */}
          {tagData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {tagData.map(({ tag, count }) => {
                const color = getTagColor(tag);
                const desc = getTagDescription(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => setSearchParams({ tag })}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border hover:shadow-md transition-all text-left group"
                    style={{ borderColor: color + "40" }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + "20" }}>
                      <TagIcon size={18} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: "var(--color-text)" }}>{tag}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: color + "20", color }}>
                          {count} 篇
                        </span>
                      </div>
                      {desc && (
                        <p className="text-xs mt-1 truncate" style={{ color: "var(--color-text-muted)" }}>{desc}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
              <TagIcon size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-lg">暂无标签</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Filtered articles */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/tags"
              className="inline-flex items-center gap-1 text-sm hover:text-primary transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <ArrowLeft size={16} /> 全部标签
            </Link>
            <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: "var(--color-text)" }}>
              <span className="w-3 h-3 rounded-full" style={{ background: getTagColor(selectedTag) }} />
              #{selectedTag}
              <span className="ml-1 text-sm font-normal" style={{ color: "var(--color-text-muted)" }}>
                {filteredArticles.length} 篇文章
              </span>
            </h2>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
              <FileText size={48} className="mx-auto mb-3 opacity-30" />
              <p>该标签下暂无文章</p>
            </div>
          )}
        </>
      )}

      {showTagManager && <TagManager onClose={() => setShowTagManager(false)} />}
    </div>
  );
}
