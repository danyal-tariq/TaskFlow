"use client";

import { useEffect } from "react";
import { CommandPalette } from "./command-palette";
import { useUIStore } from "@/stores/ui-store";

export function CommandPaletteWrapper() {
  const { openCommandPalette, openCreateIssue } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const activeElement = document.activeElement;
      const isTyping =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.getAttribute("contenteditable") === "true";

      // Cmd+K or Ctrl+K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openCommandPalette();
        return;
      }

      // C to create issue (only if not typing)
      if (e.key === "c" && !isTyping && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        openCreateIssue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openCommandPalette, openCreateIssue]);

  return <CommandPalette />;
}
