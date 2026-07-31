import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, Save, X, ArrowLeft, Bold, Italic, List, Code, Quote, Heading, Tag as TagIcon, ChevronDown } from "lucide-react";
import { useBlog } from "../context/BlogContext";
import MarkdownRenderer from "../components/MarkdownRenderer";
import ImageUploader from "../components/ImageUploader";
import { generateExcerpt } from "../utils/storage";

export default function Editor() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const editId = id || searchParams.get("id");
  const navigate = useNavigate();
  const { getArticle, addArticle, updateArticle, getTagColor, tagMetas, addTagMeta } = useBlog();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [published, setPublished] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);

  useEffect(() => {
    if (editId) {
      const article = getArticle(editId);
      if (article) {
        setTitle(article.title);
        setContent(article.content);
        setTags(article.tags);
        setCoverImage(article.coverImage);
        setPublished(article.published);
      }
    }
  }, [editId]);

  const insertText = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || placeholder;
    const newText = content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      const pos = start + before.length + selected.length + after.length;
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + text);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = content.substring(0, start) + text + content.substring(end);
    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      const pos = start + text.length;
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  const handleTagAdd = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      // Auto-create tag meta if it doesn't exist
      if (!tagMetas.some((t) => t.name === tag)) {
        const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#06b6d4", "#2563eb", "#f59e0b", "#ef4444", "#ec4899"];
        addTagMeta({ name: tag, color: colors[Math.floor(Math.random() * colors.length)], description: "" });
      }
    }
    setTagInput("");
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("请输入文章标题");
      return;
    }
    if (!content.trim()) {
      alert("请输入文章内容");
      return;
    }

    const articleData = {
      title: title.trim(),
      content,
      excerpt: generateExcerpt(content),
      tags,
      coverImage,
      published,
    };

    if (editId) {
      updateArticle(editId, articleData);
      navigate(`/article/${editId}`);
    } else {
      const newArticle = addArticle(articleData);
      navigate(`/article/${newArticle.id}`);
    }
  };

  const toolbarButtons = [
    { icon: Heading, onClick: () => insertText("## ", "", "标题"), title: "标题" },
    { icon: Bold, onClick: () => insertText("**", "**", "粗体"), title: "粗体" },
    { icon: Italic, onClick: () => insertText("*", "*", "斜体"), title: "斜体" },
    { icon: Quote, onClick: () => insertText("> ", "", "引用"), title: "引用" },
    { icon: List, onClick: () => insertText("- ", "", "列表项"), title: "列表" },
    { icon: Code, onClick: () => insertText("\n```\n", "\n```\n", "代码"), title: "代码块" },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm hover:text-primary transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <ArrowLeft size={16} /> 返回
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-border hover:bg-surface-hover transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <Eye size={14} />
            {showPreview ? "编辑" : "预览"}
          </button>
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-border cursor-pointer hover:bg-surface-hover transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="hidden"
            />
            <span className={`w-3 h-3 rounded-full ${published ? "bg-green-500" : "bg-gray-400"}`} />
            {published ? "已发布" : "草稿"}
          </label>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ background: "var(--color-primary)" }}
          >
            <Save size={14} />
            保存
          </button>
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="文章标题..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-bold px-4 py-3 mb-4 rounded-xl border border-border bg-surface outline-none focus:border-primary transition-colors"
        style={{ color: "var(--color-text)" }}
      />

      {/* Cover image upload */}
      <div className="mb-4">
        {coverImage ? (
          <div className="relative">
            <img src={coverImage} alt="cover" className="w-full aspect-video object-cover rounded-xl" />
            <button
              onClick={() => setCoverImage(null)}
              className="absolute top-2 right-2 p-2 rounded-lg bg-black/60 text-white hover:bg-black/80"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <CoverUploader onUpload={setCoverImage} />
        )}
      </div>

      {/* Tags */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => {
            const color = getTagColor(tag);
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: color + "20", color }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                {tag}
                <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:opacity-70 ml-0.5">
                  <X size={10} />
                </button>
              </span>
            );
          })}
          <div className="relative inline-flex">
            <button
              onClick={() => setShowTagPicker(!showTagPicker)}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-border hover:border-primary transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <TagIcon size={12} />
              添加标签
              <ChevronDown size={10} />
            </button>
            {showTagPicker && (
              <div className="absolute top-full mt-1 left-0 z-20 bg-surface rounded-xl shadow-lg border border-border p-2 min-w-[200px] animate-fade-in">
                {/* Existing tags */}
                {tagMetas.filter((t) => !tags.includes(t.name)).map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => {
                      setTags([...tags, tag.name]);
                      setShowTagPicker(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-hover transition-colors text-left"
                  >
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: tag.color }} />
                    <span className="text-sm flex-1" style={{ color: "var(--color-text)" }}>{tag.name}</span>
                    {tag.description && (
                      <span className="text-xs truncate max-w-[80px]" style={{ color: "var(--color-text-muted)" }}>{tag.description}</span>
                    )}
                  </button>
                ))}
                {/* Divider */}
                <div className="my-1 border-t border-border" />
                {/* Custom input */}
                <div className="flex items-center gap-1 px-1 py-1">
                  <input
                    type="text"
                    placeholder="自定义标签..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleTagAdd();
                      }
                    }}
                    className="flex-1 text-xs px-2 py-1 rounded border border-border bg-transparent outline-none focus:border-primary"
                    style={{ color: "var(--color-text)" }}
                    autoFocus
                  />
                  <button
                    onClick={handleTagAdd}
                    className="px-2 py-1 rounded text-xs text-white"
                    style={{ background: "var(--color-primary)" }}
                  >
                    添加
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <div className="bg-surface rounded-xl p-6 min-h-[500px]" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <MarkdownRenderer content={content} />
        </div>
      ) : (
        <div className="bg-surface rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          {/* Toolbar */}
          <div className="flex items-center gap-1 p-2 border-b border-border flex-wrap">
            {toolbarButtons.map((btn, i) => {
              const Icon = btn.icon;
              return (
                <button
                  key={i}
                  onClick={btn.onClick}
                  title={btn.title}
                  className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <Icon size={16} />
                </button>
              );
            })}
            <div className="w-px h-5 bg-border mx-1" />
            <ImageUploader onInsert={insertAtCursor} />
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在此输入 Markdown 内容..."
            className="w-full px-4 py-4 min-h-[500px] resize-y outline-none font-mono text-sm leading-relaxed bg-transparent"
            style={{ color: "var(--color-text)" }}
          />
        </div>
      )}
    </div>
  );
}

function CoverUploader({ onUpload }: { onUpload: (base64: string) => void }) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("请上传图片文件");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("图片大小不能超过 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <label className="flex flex-col items-center justify-center gap-2 w-full aspect-video rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors"
      style={{ color: "var(--color-text-muted)" }}
    >
      <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <span className="text-sm">点击上传封面图片</span>
      <span className="text-xs opacity-60">支持 JPG, PNG, GIF (最大 5MB)</span>
    </label>
  );
}
