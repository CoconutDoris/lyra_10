import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Home, FileText, Tag, User, Clock, PenTool, Palette, Menu, X } from "lucide-react";
import { useBlog } from "../context/BlogContext";

export default function Navbar({ onOpenCustomizer }: { onOpenCustomizer?: () => void }) {
  const location = useLocation();
  const { site } = useBlog();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: "/", label: "首页", icon: Home },
    { path: "/tags", label: "标签", icon: Tag },
    { path: "/timeline", label: "时间轴", icon: Clock },
    { path: "/about", label: "关于", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {site.logoImage ? (
              <img
                src={site.logoImage}
                alt={site.siteName}
                className="w-9 h-9 rounded-xl object-cover transition-transform group-hover:scale-110"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))` }}
              >
                {site.siteName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-bold text-lg hidden sm:block" style={{ color: "var(--color-text)" }}>
              {site.siteName}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all-smooth ${
                    isActive(item.path)
                      ? "text-white"
                      : "hover:bg-surface-hover"
                  }`}
                  style={
                    isActive(item.path)
                      ? { background: "var(--color-primary)" }
                      : { color: "var(--color-text-secondary)" }
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
            <div className="w-px h-6 bg-border mx-2" />
            <button
              onClick={onOpenCustomizer}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover transition-all-smooth"
              style={{ color: "var(--color-text-secondary)" }}
              title="主题定制"
            >
              <Palette size={16} />
              <span className="hidden lg:inline">美化</span>
            </button>
            <Link
              to="/editor"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-white transition-all-smooth hover:opacity-90"
              style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))` }}
            >
              <PenTool size={16} />
              写文章
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface-hover"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: "var(--color-text)" }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all-smooth ${
                    isActive(item.path) ? "text-white" : "hover:bg-surface-hover"
                  }`}
                  style={
                    isActive(item.path)
                      ? { background: "var(--color-primary)" }
                      : { color: "var(--color-text-secondary)" }
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenCustomizer?.();
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-surface-hover"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <Palette size={18} />
              主题美化
            </button>
            <Link
              to="/editor"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-white"
              style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))` }}
            >
              <PenTool size={18} />
              写文章
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
