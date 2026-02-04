import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options?: { ctrlKey?: boolean; metaKey?: boolean }
) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      // Check if key matches
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      
      // Check if required modifiers are pressed
      const modifierMatches =
        (!options?.ctrlKey || event.ctrlKey) &&
        (!options?.metaKey || event.metaKey);

      // If no modifiers required, ensure no modifiers are pressed
      const noUnwantedModifiers =
        !options?.ctrlKey && !options?.metaKey
          ? !event.ctrlKey && !event.metaKey
          : true;

      if (keyMatches && modifierMatches && noUnwantedModifiers) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, options]);
}