import { Link } from "react-router-dom";
import { Calendar, Tag as TagIcon, ArrowRight } from "lucide-react";
import type { Article } from "../types";
import { formatDate } from "../utils/storage";
import { useBlog } from "../context/BlogContext";

interface Props {
  article: Article;
}

export default function ArticleCard({ article }: Props) {
  const { theme, getTagColor } = useBlog();

  const cardClass =
    theme.cardStyle === "shadow"
      ? "shadow-md hover:shadow-xl"
      : theme.cardStyle === "border"
      ? "border-2 hover:border-primary"
      : "border border-border hover:border-primary";

  return (
    <Link
      to={`/article/${article.id}`}
      className={`group block bg-surface rounded-2xl overflow-hidden transition-all-smooth ${cardClass}`}
      style={{ borderRadius: `${theme.borderRadius}px` }}
    >
      {/* Cover image */}
      {article.coverImage && (
        <div className="aspect-video overflow-hidden bg-surface-hover">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-5">
        {/* Tags */}
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          {article.tags.map((tag) => {
            const color = getTagColor(tag);
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full"
                style={{ background: color + "20", color }}
              >
                <TagIcon size={10} />
                {tag}
              </span>
            );
          })}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2" style={{ color: "var(--color-text)" }}>
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm line-clamp-2 mb-3" style={{ color: "var(--color-text-muted)" }}>
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs" style={{ color: "var(--color-text-muted)" }}>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(article.createdAt)}
          </span>
          <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            阅读全文
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
