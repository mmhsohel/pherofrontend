"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;
  const dark = theme === "studiodark";
  return (
    <button aria-label="Toggle theme" className="btn btn-ghost btn-circle"
      onClick={() => setTheme(dark ? "studiolight" : "studiodark")}>
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}