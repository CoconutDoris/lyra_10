import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Calendar, Briefcase, BookOpen, Flag, Heart } from "lucide-react";
import { useBlog } from "../context/BlogContext";
import { formatDate } from "../utils/storage";
import type { TimelineEvent } from "../types";

const CATEGORIES = [
  { value: "work", label: "工作", icon: Briefcase, color: "#f59e0b" },
  { value: "study", label: "学习", icon: BookOpen, color: "#10b981" },
  { value: "milestone", label: "里程碑", icon: Flag, color: "#6366f1" },
  { value: "life", label: "生活", icon: Heart, color: "#ec4899" },
  { value: "other", label: "其他", icon: Calendar, color: "#64748b" },
] as const;

export default function TimelineEditor() {
  const { timelineEvents, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent } = useBlog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<TimelineEvent, "id">>({
    date: new Date().toISOString().split("T")[0],
    title: "",
    description: "",
    category: "milestone",
    color: "#6366f1",
  });

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      title: "",
      description: "",
      category: "milestone",
      color: "#6366f1",
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert("请输入标题");
      return;
    }
    const data = {
      ...formData,
      date: new Date(formData.date).toISOString(),
    };
    if (editingId) {
      updateTimelineEvent(editingId, data);
    } else {
      addTimelineEvent(data);
    }
    resetForm();
  };

  const startEdit = (event: TimelineEvent) => {
    setEditingId(event.id);
    setIsAdding(false);
    setFormData({
      date: event.date.split("T")[0],
      title: event.title,
      description: event.description,
      category: event.category,
      color: event.color,
    });
  };

  return (
    <div className="relative">
      {/* Add button */}
      {!isAdding && !editingId && (
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
          }}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: "var(--color-primary)" }}
        >
          <Plus size={16} />
          添加时间轴事件
        </button>
      )}

      {/* Form */}
      {(isAdding || editingId) && (
        <div className="mb-6 p-4 bg-surface rounded-xl border border-border animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
              {editingId ? "编辑事件" : "新事件"}
            </h3>
            <button onClick={resetForm} className="p-1 rounded hover:bg-surface-hover" style={{ color: "var(--color-text-muted)" }}>
              <X size={16} />
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="事件标题"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-sm outline-none focus:border-primary"
              style={{ color: "var(--color-text)" }}
            />
            <textarea
              placeholder="事件描述"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-sm outline-none focus:border-primary resize-none"
              style={{ color: "var(--color-text)" }}
            />
            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-3 py-2 rounded-lg border border-border bg-transparent text-sm outline-none focus:border-primary"
                style={{ color: "var(--color-text)" }}
              />
              <select
                value={formData.category}
                onChange={(e) => {
                  const cat = CATEGORIES.find((c) => c.value === e.target.value);
                  setFormData({ ...formData, category: e.target.value as TimelineEvent["category"], color: cat?.color || "#6366f1" });
                }}
                className="px-3 py-2 rounded-lg border border-border bg-transparent text-sm outline-none focus:border-primary"
                style={{ color: "var(--color-text)" }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border border-border"
              />
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white ml-auto"
                style={{ background: "var(--color-primary)" }}
              >
                <Check size={14} />
                {editingId ? "更新" : "添加"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-4 top-2 bottom-2 w-0.5"
          style={{ background: "var(--color-border)" }}
        />

        <div className="space-y-6">
          {timelineEvents.map((event) => {
            const cat = CATEGORIES.find((c) => c.value === event.category);
            const Icon = cat?.icon || Calendar;

            if (editingId === event.id) return null;

            return (
              <div key={event.id} className="relative pl-12 animate-slide-up">
                {/* Dot */}
                <div
                  className="absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{ background: event.color }}
                >
                  <Icon size={14} />
                </div>

                {/* Content */}
                <div className="bg-surface rounded-xl border border-border p-4 group hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full text-white"
                          style={{ background: event.color }}
                        >
                          {cat?.label}
                        </span>
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <h4 className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                        {event.title}
                      </h4>
                      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                        {event.description}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(event)}
                        className="p-1.5 rounded-lg hover:bg-surface-hover"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("确定删除此事件？")) deleteTimelineEvent(event.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {timelineEvents.length === 0 && (
          <div className="text-center py-12" style={{ color: "var(--color-text-muted)" }}>
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p>暂无时间轴事件</p>
            <p className="text-xs mt-1">点击上方按钮添加第一个事件</p>
          </div>
        )}
      </div>
    </div>
  );
}
