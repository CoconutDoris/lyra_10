import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ArticleDetail from "./pages/ArticleDetail";
import Tags from "./pages/Tags";
import About from "./pages/About";
import TimelinePage from "./pages/TimelinePage";
import Editor from "./pages/Editor";
import { useEffect } from "react";
import { useBlog } from "./context/BlogContext";

function ThemeApplier() {
  const { theme } = useBlog();
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primaryColor);
    root.style.setProperty("--color-primary-light", lightenColor(theme.primaryColor, 20));
    root.style.setProperty("--color-primary-dark", darkenColor(theme.primaryColor, 20));
    root.style.setProperty("--color-accent", theme.accentColor);
    root.style.setProperty("--color-bg", theme.backgroundColor);
    root.style.setProperty("--color-surface", theme.surfaceColor);
    root.style.setProperty("--color-text", theme.textColor);
    root.style.setProperty("--color-text-secondary", theme.textColor + "cc");
    root.style.setProperty("--color-text-muted", theme.textColor + "88");
    root.style.setProperty("--color-border", theme.textColor + "22");
    root.style.setProperty("--color-surface-hover", theme.surfaceColor === "#ffffff" || theme.surfaceColor === "#fff" ? "#f5f5f5" : darkenColor(theme.surfaceColor, 5));

    const fontMap: Record<string, string> = {
      sans: "'Inter', 'Noto Sans SC', system-ui, sans-serif",
      serif: "'Noto Serif SC', Georgia, serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    };
    root.style.setProperty("--font-body", fontMap[theme.fontFamily]);
    root.style.setProperty("--font-heading", fontMap[theme.fontFamily]);
    root.style.setProperty("--font-mono", "'JetBrains Mono', 'Fira Code', monospace");
  }, [theme]);
  return null;
}

function lightenColor(hex: string, percent: number): string {
  try {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, (num >> 16) + Math.round(255 * (percent / 100)));
    const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * (percent / 100)));
    const b = Math.min(255, (num & 0xff) + Math.round(255 * (percent / 100)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  } catch {
    return hex;
  }
}

function darkenColor(hex: string, percent: number): string {
  try {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, (num >> 16) - Math.round(255 * (percent / 100)));
    const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * (percent / 100)));
    const b = Math.max(0, (num & 0xff) - Math.round(255 * (percent / 100)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  } catch {
    return hex;
  }
}

export default function App() {
  return (
    <>
      <ThemeApplier />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:id" element={<Editor />} />
        </Routes>
      </Layout>
    </>
  );
}
