import { type ReactNode, useState } from "react";
import Navbar from "./Navbar";
import ThemeCustomizer from "./ThemeCustomizer";

export default function Layout({ children }: { children: ReactNode }) {
  const [customizerOpen, setCustomizerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      <Navbar onOpenCustomizer={() => setCustomizerOpen(true)} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <footer className="border-t border-border py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
          <p>
            © {new Date().getFullYear()} dolihame · Built with React & Tailwind CSS
          </p>
        </div>
      </footer>
      {customizerOpen && <ThemeCustomizer onClose={() => setCustomizerOpen(false)} />}
    </div>
  );
}
