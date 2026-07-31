import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Tag as TagIcon, Edit2, Trash2 } from "lucide-react";
import { useBlog } from "../context/BlogContext";
import { formatDate } from "../utils/storage";
import MarkdownRenderer from "../components/MarkdownRenderer";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getArticle, deleteArticle, getTagColor } = useBlog();

  const article = id ? getArticle(id) : undefined;

  if (!article) {
    return (
      <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
        <p className="text-lg font-medium">文章不存在</p>
        <Link to="/" className="inline-flex items-center gap-1 mt-3 text-sm text-primary">
          <ArrowLeft size={14} /> 返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm mb-6 hover:text-primary transition-colors"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <ArrowLeft size={16} /> 返回首页
      </Link>

      {/* Article header */}
      <header className="mb-8">
        {/* Cover image */}
        {article.coverImage && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-6">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight" style={{ color: "var(--color-text)" }}>
          {article.title}
        </h1>

        <div className="flex items-center gap-4 flex-wrap text-sm" style={{ color: "var(--color-text-muted)" }}>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {formatDate(article.createdAt)}
          </span>
          {article.updatedAt !== article.createdAt && (
            <span>更新于 {formatDate(article.updatedAt)}</span>
          )}
          <div className="flex items-center gap-1.5">
            {article.tags.map((tag) => {
              const color = getTagColor(tag);
              return (
                <Link
                  key={tag}
                  to={`/tags?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs hover:opacity-80 transition-opacity"
                  style={{ background: color + "20", color }}
                >
                  <TagIcon size={10} />
                  {tag}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Article content */}
      <article className="bg-surface rounded-2xl p-6 sm:p-8 mb-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <MarkdownRenderer content={article.content} />
      </article>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/editor?id=${article.id}`)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-surface-hover transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Edit2 size={14} />
          编辑文章
        </button>
        <button
          onClick={() => {
            if (confirm("确定删除此文章？此操作不可恢复。")) {
              deleteArticle(article.id);
              navigate("/");
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} />
          删除文章
        </button>
      </div>
    </div>
  );
}
