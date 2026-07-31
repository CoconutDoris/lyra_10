import { useState, useEffect, useRef } from "react";
import { Edit2, Check, X, Github, Mail, Globe, Upload, Image as ImageIcon } from "lucide-react";
import { useBlog } from "../context/BlogContext";
import MarkdownRenderer from "../components/MarkdownRenderer";

export default function About() {
  const { site, updateSite } = useBlog();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(site.aboutContent);
  const [siteName, setSiteName] = useState(site.siteName);
  const [description, setDescription] = useState(site.description);
  const [github, setGithub] = useState(site.social.github);
  const [email, setEmail] = useState(site.social.email);
  const [website, setWebsite] = useState(site.social.website);
  const [logoImage, setLogoImage] = useState<string | null>(site.logoImage);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContent(site.aboutContent);
    setSiteName(site.siteName);
    setDescription(site.description);
    setGithub(site.social.github);
    setEmail(site.social.email);
    setWebsite(site.social.website);
    setLogoImage(site.logoImage);
  }, [site]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    reader.onload = () => setLogoImage(reader.result as string);
    reader.readAsDataURL(file);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleSave = () => {
    updateSite({
      aboutContent: content,
      siteName,
      description,
      social: { github, email, website },
      logoImage,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setContent(site.aboutContent);
    setSiteName(site.siteName);
    setDescription(site.description);
    setGithub(site.social.github);
    setEmail(site.social.email);
    setWebsite(site.social.website);
    setLogoImage(site.logoImage);
    setEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>关于</h1>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-border hover:bg-surface-hover transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <Edit2 size={14} />
            编辑
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
              style={{ background: "var(--color-primary)" }}
            >
              <Check size={14} />
              保存
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-border hover:bg-surface-hover transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <X size={14} />
              取消
            </button>
          </div>
        )}
      </div>

      {/* Profile card */}
      <div
        className="rounded-2xl p-6 mb-6 text-center"
        style={{
          background: `linear-gradient(135deg, var(--color-primary)10, var(--color-accent)10)`,
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Avatar / Logo */}
        <div className="relative w-24 h-24 mx-auto mb-3">
          {logoImage ? (
            <img
              src={logoImage}
              alt={siteName}
              className="w-24 h-24 rounded-3xl object-cover shadow-lg"
            />
          ) : (
            <div
              className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-lg"
              style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))` }}
            >
              {siteName.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Upload button */}
          {editing && (
            <>
              <button
                onClick={() => logoInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-surface shadow-md flex items-center justify-center border-2 border-surface hover:scale-110 transition-transform"
                style={{ color: "var(--color-primary)" }}
                title="上传Logo/头像"
              >
                <Upload size={14} />
              </button>
              {logoImage && (
                <button
                  onClick={() => setLogoImage(null)}
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center border-2 border-surface hover:scale-110 transition-transform"
                  title="移除图片"
                >
                  <X size={12} />
                </button>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </>
          )}
        </div>
        {editing && (
          <p className="text-xs mb-2 flex items-center justify-center gap-1" style={{ color: "var(--color-text-muted)" }}>
            <ImageIcon size={10} />
            点击右下角按钮上传自定义 Logo / 头像
          </p>
        )}
        {editing ? (
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="text-center text-2xl font-bold bg-transparent border-b border-primary outline-none mb-2"
            style={{ color: "var(--color-text)" }}
          />
        ) : (
          <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--color-text)" }}>{site.siteName}</h2>
        )}
        {editing ? (
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-center text-sm bg-transparent border-b border-primary outline-none w-full max-w-md mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          />
        ) : (
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{site.description}</p>
        )}

        {/* Social links */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {editing ? (
            <>
              <SocialEdit icon={Github} value={github} onChange={setGithub} placeholder="GitHub URL" />
              <SocialEdit icon={Mail} value={email} onChange={setEmail} placeholder="Email" />
              <SocialEdit icon={Globe} value={website} onChange={setWebsite} placeholder="Website" />
            </>
          ) : (
            <>
              {site.social.github && (
                <a href={site.social.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-surface-hover transition-colors" style={{ color: "var(--color-text-secondary)" }}>
                  <Github size={20} />
                </a>
              )}
              {site.social.email && (
                <a href={`mailto:${site.social.email}`} className="p-2 rounded-lg hover:bg-surface-hover transition-colors" style={{ color: "var(--color-text-secondary)" }}>
                  <Mail size={20} />
                </a>
              )}
              {site.social.website && (
                <a href={site.social.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-surface-hover transition-colors" style={{ color: "var(--color-text-secondary)" }}>
                  <Globe size={20} />
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {/* About content */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        {editing ? (
          <>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text)" }}>
              关于内容 (Markdown)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-3 py-2 rounded-lg border border-border bg-transparent text-sm font-mono outline-none focus:border-primary resize-y"
              style={{ color: "var(--color-text)" }}
            />
          </>
        ) : (
          <MarkdownRenderer content={site.aboutContent} />
        )}
      </div>
    </div>
  );
}

function SocialEdit({ icon: Icon, value, onChange, placeholder }: { icon: any; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-border">
      <Icon size={14} style={{ color: "var(--color-text-muted)" }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-xs bg-transparent outline-none w-28"
        style={{ color: "var(--color-text)" }}
      />
    </div>
  );
}
