import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Tag as TagIcon } from "lucide-react";
import { useBlog } from "../context/BlogContext";
import type { TagMeta } from "../types";

const DEFAULT_COLORS = [
  "#3b82f6", "#8b5cf6", "#10b981", "#06b6d4", "#2563eb",
  "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#6366f1",
  "#f97316", "#84cc16", "#0ea5e9", "#d946ef",
];

export default function TagManager({ onClose }: { onClose: () => void }) {
  const { tagMetas, addTagMeta, updateTagMeta, deleteTagMeta, articles } = useBlog();
  const [editingName, setEditingName] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<TagMeta, never>>({
    name: "",
    color: DEFAULT_COLORS[0],
    description: "",
  });

  const resetForm = () => {
    setForm({ name: "", color: DEFAULT_COLORS[0], description: "" });
    setEditingName(null);
    setIsAdding(false);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert("请输入标签名称");
      return;
    }
    if (editingName) {
      updateTagMeta(editingName, form);
    } else {
      if (tagMetas.some((t) => t.name === form.name)) {
        alert("该标签已存在");
        return;
      }
      addTagMeta(form);
    }
    resetForm();
  };

  const startEdit = (tag: TagMeta) => {
    setEditingName(tag.name);
    setIsAdding(false);
    setForm({ name: tag.name, color: tag.color, description: tag.description });
  };

  const getTagCount = (name: string) => articles.filter((a) => a.tags.includes(name)).length;

  return (
    <div className="fixed inset-0 bg-black/40 z-[100] animate-fade-in flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold text-lg flex items-center gap-2" style={{ color: "var(--color-text)" }}>
            <TagIcon size={20} style={{ color: "var(--color-primary)" }} />
            标签管理
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-hover" style={{ color: "var(--color-text-secondary)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Add button */}
          {!isAdding && !editingName && (
            <button
              onClick={() => {
                setIsAdding(true);
                setEditingName(null);
                setForm({ name: "", color: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)], description: "" });
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-border hover:border-primary text-sm font-medium transition-colors mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <Plus size={16} />
              新建标签
            </button>
          )}

          {/* Form */}
          {(isAdding || editingName) && (
            <div className="mb-4 p-4 bg-surface-hover rounded-xl animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                  {editingName ? "编辑标签" : "新建标签"}
                </h3>
                <button onClick={resetForm} className="p-1 rounded hover:bg-surface" style={{ color: "var(--color-text-muted)" }}>
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>标签名称</label>
                  <input
                    type="text"
                    placeholder="例如：技术、随笔..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    disabled={!!editingName}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary disabled:opacity-60"
                    style={{ color: "var(--color-text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>标签描述</label>
                  <input
                    type="text"
                    placeholder="简要描述这个标签"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:border-primary"
                    style={{ color: "var(--color-text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>标签颜色</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {DEFAULT_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setForm({ ...form, color })}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          form.color === color ? "scale-110" : "border-transparent hover:scale-105"
                        }`}
                        style={{
                          background: color,
                          borderColor: form.color === color ? "var(--color-text)" : "transparent",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border border-border"
                    />
                    <input
                      type="text"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="px-2 py-1 text-xs rounded border border-border bg-surface w-24"
                      style={{ color: "var(--color-text)" }}
                    />
                    {/* Preview */}
                    <span
                      className="inline-flex items-center gap-0.5 text-xs px-2 py-1 rounded-full ml-auto"
                      style={{ background: form.color + "20", color: form.color }}
                    >
                      <TagIcon size={10} />
                      {form.name || "预览"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: "var(--color-primary)" }}
                >
                  <Check size={14} />
                  {editingName ? "更新标签" : "创建标签"}
                </button>
              </div>
            </div>
          )}

          {/* Tag list */}
          <div className="space-y-2">
            {tagMetas.map((tag) => {
              const count = getTagCount(tag.name);
              if (editingName === tag.name) return null;
              return (
                <div
                  key={tag.name}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:shadow-sm transition-all group"
                >
                  {/* Color dot */}
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: tag.color }} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm" style={{ color: "var(--color-text)" }}>
                        {tag.name}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{ background: tag.color + "20", color: tag.color }}
                      >
                        {count} 篇
                      </span>
                    </div>
                    {tag.description && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-text-muted)" }}>
                        {tag.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(tag)}
                      className="p-1.5 rounded-lg hover:bg-surface-hover"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`确定删除标签「${tag.name}」吗？文章中的标签不会被移除。`)) {
                          deleteTagMeta(tag.name);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {tagMetas.length === 0 && !isAdding && (
            <div className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>
              <TagIcon size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">暂无自定义标签</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
          标签颜色会在文章卡片、标签页和筛选器中显示
        </div>
      </div>
    </div>
  );
}
