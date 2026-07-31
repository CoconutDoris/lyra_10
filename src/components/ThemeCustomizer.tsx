import { useState } from "react";
import { X, RotateCcw, Download, Upload, Check, Save, Star, Trash2, FolderOpen } from "lucide-react";
import { useBlog } from "../context/BlogContext";

const PRESET_THEMES = [
  { name: "靛蓝", primary: "#6366f1", accent: "#ec4899", bg: "#fafafa", surface: "#ffffff", text: "#1a1a2e" },
  { name: "海洋蓝", primary: "#0ea5e9", accent: "#06b6d4", bg: "#f0f9ff", surface: "#ffffff", text: "#0c4a6e" },
  { name: "森林绿", primary: "#10b981", accent: "#84cc16", bg: "#f0fdf4", surface: "#ffffff", text: "#064e3b" },
  { name: "暖阳橙", primary: "#f59e0b", accent: "#ef4444", bg: "#fffbeb", surface: "#ffffff", text: "#78350f" },
  { name: "暗夜紫", primary: "#8b5cf6", accent: "#d946ef", bg: "#1e1b2e", surface: "#2a2640", text: "#e0e0e0" },
  { name: "石墨黑", primary: "#64748b", accent: "#3b82f6", bg: "#1a1a1a", surface: "#2d2d2d", text: "#e0e0e0" },
  { name: "玫瑰粉", primary: "#e11d48", accent: "#f43f5e", bg: "#fff1f2", surface: "#ffffff", text: "#881337" },
  { name: "青碧色", primary: "#0d9488", accent: "#22d3ee", bg: "#f0fdfa", surface: "#ffffff", text: "#134e4a" },
];

const FONTS = [
  { label: "无衬线", value: "sans" as const },
  { label: "衬线体", value: "serif" as const },
  { label: "等宽体", value: "mono" as const },
];

const CARD_STYLES = [
  { label: "阴影", value: "shadow" as const },
  { label: "边框", value: "border" as const },
  { label: "极简", value: "minimal" as const },
];

export default function ThemeCustomizer({ onClose }: { onClose: () => void }) {
  const { theme, updateTheme, resetTheme, exportData, importData, resetAllData, savedThemes, saveCurrentTheme, loadSavedTheme, deleteSavedTheme, site, updateSite } = useBlog();
  const [activeTab, setActiveTab] = useState<"theme" | "data">("theme");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [themeName, setThemeName] = useState("");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("请上传图片文件"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("图片大小不能超过 5MB"); return; }
    const reader = new FileReader();
    reader.onload = () => updateSite({ logoImage: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dolihame-blog-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const success = importData(reader.result as string);
      alert(success ? "导入成功！" : "导入失败，请检查文件格式");
    };
    reader.readAsText(file);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[100] animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface z-[101] shadow-2xl flex flex-col animate-slide-in-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold text-lg" style={{ color: "var(--color-text)" }}>主题美化</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-hover"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("theme")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "theme" ? "border-b-2 border-primary text-primary" : ""
            }`}
            style={{
              color: activeTab === "theme" ? "var(--color-primary)" : "var(--color-text-muted)",
              borderBottomColor: activeTab === "theme" ? "var(--color-primary)" : "transparent",
            }}
          >
            外观设置
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "data" ? "border-b-2 border-primary text-primary" : ""
            }`}
            style={{
              color: activeTab === "data" ? "var(--color-primary)" : "var(--color-text-muted)",
              borderBottomColor: activeTab === "data" ? "var(--color-primary)" : "transparent",
            }}
          >
            数据管理
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {activeTab === "theme" && (
            <>
              {/* Preset themes */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                  预设主题
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_THEMES.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() =>
                        updateTheme({
                          primaryColor: preset.primary,
                          accentColor: preset.accent,
                          backgroundColor: preset.bg,
                          surfaceColor: preset.surface,
                          textColor: preset.text,
                        })
                      }
                      className="group flex flex-col items-center gap-1 p-2 rounded-lg border border-border hover:border-primary transition-all"
                    >
                      <div className="flex -space-x-1">
                        <div className="w-6 h-6 rounded-full border-2 border-surface" style={{ background: preset.primary }} />
                        <div className="w-6 h-6 rounded-full border-2 border-surface" style={{ background: preset.accent }} />
                      </div>
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Saved themes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                    我的主题
                  </label>
                  <button
                    onClick={() => setShowSaveDialog(!showSaveDialog)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-white"
                    style={{ background: "var(--color-primary)" }}
                  >
                    <Save size={12} />
                    保存当前
                  </button>
                </div>

                {/* Save dialog */}
                {showSaveDialog && (
                  <div className="mb-3 p-3 rounded-lg border border-border bg-surface-hover animate-fade-in">
                    <input
                      type="text"
                      placeholder="主题名称..."
                      value={themeName}
                      onChange={(e) => setThemeName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && themeName.trim()) {
                          saveCurrentTheme(themeName.trim());
                          setThemeName("");
                          setShowSaveDialog(false);
                        }
                      }}
                      className="w-full px-2 py-1.5 text-sm rounded border border-border bg-surface outline-none focus:border-primary mb-2"
                      style={{ color: "var(--color-text)" }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (themeName.trim()) {
                            saveCurrentTheme(themeName.trim());
                            setThemeName("");
                            setShowSaveDialog(false);
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium text-white"
                        style={{ background: "var(--color-primary)" }}
                      >
                        <Check size={12} /> 保存
                      </button>
                      <button
                        onClick={() => { setShowSaveDialog(false); setThemeName(""); }}
                        className="px-3 py-1.5 rounded text-xs border border-border"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}

                {/* Saved themes list */}
                {savedThemes.length > 0 ? (
                  <div className="space-y-2">
                    {savedThemes.map((saved) => (
                      <div
                        key={saved.id}
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-border hover:shadow-sm transition-all group"
                      >
                        <div className="flex -space-x-1 flex-shrink-0">
                          <div className="w-5 h-5 rounded-full border-2 border-surface" style={{ background: saved.theme.primaryColor }} />
                          <div className="w-5 h-5 rounded-full border-2 border-surface" style={{ background: saved.theme.accentColor }} />
                          <div className="w-5 h-5 rounded-full border-2 border-surface" style={{ background: saved.theme.backgroundColor }} />
                        </div>
                        <span className="text-sm flex-1 truncate" style={{ color: "var(--color-text)" }}>{saved.name}</span>
                        <button
                          onClick={() => loadSavedTheme(saved.id)}
                          className="p-1.5 rounded-lg hover:bg-surface-hover opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: "var(--color-primary)" }}
                          title="应用此主题"
                        >
                          <FolderOpen size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`删除主题「${saved.name}」？`)) deleteSavedTheme(saved.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="删除主题"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <Star size={24} className="mx-auto mb-1 opacity-30" />
                    <p>暂无保存的主题</p>
                    <p className="mt-0.5">调整好主题后点击「保存当前」</p>
                  </div>
                )}
              </div>

              {/* Custom colors */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                  自定义颜色
                </label>
                <div className="space-y-3">
                  <ColorRow label="主色调" value={theme.primaryColor} onChange={(v) => updateTheme({ primaryColor: v })} />
                  <ColorRow label="强调色" value={theme.accentColor} onChange={(v) => updateTheme({ accentColor: v })} />
                  <ColorRow label="背景色" value={theme.backgroundColor} onChange={(v) => updateTheme({ backgroundColor: v })} />
                  <ColorRow label="卡片色" value={theme.surfaceColor} onChange={(v) => updateTheme({ surfaceColor: v })} />
                  <ColorRow label="文字色" value={theme.textColor} onChange={(v) => updateTheme({ textColor: v })} />
                </div>
              </div>

              {/* Font */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                  字体风格
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FONTS.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => updateTheme({ fontFamily: font.value })}
                      className={`py-2 rounded-lg text-sm border transition-all ${
                        theme.fontFamily === font.value ? "border-primary bg-primary/10" : "border-border"
                      }`}
                      style={{
                        color: theme.fontFamily === font.value ? "var(--color-primary)" : "var(--color-text-secondary)",
                        borderColor: theme.fontFamily === font.value ? "var(--color-primary)" : "var(--color-border)",
                      }}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card style */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                  卡片样式
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CARD_STYLES.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => updateTheme({ cardStyle: style.value })}
                      className={`py-2 rounded-lg text-sm border transition-all ${
                        theme.cardStyle === style.value ? "border-primary bg-primary/10" : "border-border"
                      }`}
                      style={{
                        color: theme.cardStyle === style.value ? "var(--color-primary)" : "var(--color-text-secondary)",
                        borderColor: theme.cardStyle === style.value ? "var(--color-primary)" : "var(--color-border)",
                      }}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border radius */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                  圆角大小: {theme.borderRadius}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={theme.borderRadius}
                  onChange={(e) => updateTheme({ borderRadius: Number(e.target.value) })}
                  className="w-full"
                  style={{ accentColor: "var(--color-primary)" }}
                />
              </div>

              {/* Logo upload */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                  站点图标 / Logo
                </label>
                <div className="flex items-center gap-3">
                  {site.logoImage ? (
                    <div className="relative">
                      <img src={site.logoImage} alt="logo" className="w-12 h-12 rounded-xl object-cover border border-border" />
                      <button
                        onClick={() => updateSite({ logoImage: null })}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center border-2 border-surface"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))` }}
                    >
                      {site.siteName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <label className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-sm font-medium hover:bg-surface-hover transition-colors cursor-pointer"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <Upload size={14} />
                    {site.logoImage ? "更换图片" : "上传图片"}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-xs mt-1.5" style={{ color: "var(--color-text-muted)" }}>
                  上传后显示在导航栏、首页和关于页面
                </p>
              </div>

              {/* Reset */}
              <button
                onClick={resetTheme}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-surface-hover transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <RotateCcw size={14} />
                恢复默认主题
              </button>
            </>
          )}

          {activeTab === "data" && (
            <>
              <div className="space-y-3">
                <button
                  onClick={handleExport}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
                  style={{ background: "var(--color-primary)" }}
                >
                  <Download size={16} />
                  导出博客数据
                </button>

                <label className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-surface-hover transition-colors cursor-pointer"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <Upload size={16} />
                  导入博客数据
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>

                <div className="pt-4 border-t border-border">
                  <button
                    onClick={() => {
                      if (confirm("确定要重置所有数据吗？此操作不可恢复！")) {
                        resetAllData();
                        alert("已重置为默认数据");
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <RotateCcw size={14} />
                    重置所有数据
                  </button>
                </div>

                <div className="pt-4 text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
                  <p>数据存储在浏览器本地 (localStorage)</p>
                  <p className="mt-1">清除浏览器缓存会导致数据丢失</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-2 py-1 text-xs rounded border border-border bg-transparent"
          style={{ color: "var(--color-text)" }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-border"
        />
      </div>
    </div>
  );
}
