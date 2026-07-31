import { useRef, useState } from "react";
import { Upload, X, Link2, Image as ImageIcon } from "lucide-react";

interface Props {
  onInsert: (markdown: string) => void;
}

export default function ImageUploader({ onInsert }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const fileName = file.name.replace(/\.[^.]+$/, "");
        onInsert(`\n\n![${fileName}](${base64})\n\n`);
        setUploading(false);
      };
      reader.onerror = () => {
        alert("图片读取失败");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert("上传失败");
      setUploading(false);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUrlInsert = () => {
    if (!urlInput.trim()) return;
    onInsert(`\n\n![图片](${urlInput.trim()})\n\n`);
    setUrlInput("");
    setShowUrlInput(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-surface-hover transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
          title="上传图片"
        >
          {uploading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Upload size={14} />
          )}
          上传图片
        </button>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-surface-hover transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
          title="通过URL插入图片"
        >
          <Link2 size={14} />
          URL
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {showUrlInput && (
        <div className="absolute top-full mt-1 left-0 z-10 bg-surface rounded-lg shadow-lg border border-border p-2 flex items-center gap-2 animate-fade-in" style={{ minWidth: "320px" }}>
          <ImageIcon size={16} style={{ color: "var(--color-text-muted)" }} />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlInsert()}
            placeholder="https://example.com/image.png"
            className="flex-1 px-2 py-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--color-text)" }}
            autoFocus
          />
          <button
            onClick={handleUrlInsert}
            className="px-2 py-1 rounded text-xs text-white"
            style={{ background: "var(--color-primary)" }}
          >
            插入
          </button>
          <button
            onClick={() => setShowUrlInput(false)}
            className="p-1 rounded hover:bg-surface-hover"
            style={{ color: "var(--color-text-muted)" }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
