"use client";

import { useEffect } from "react";

export interface BrowserInteractionGuardProps {
  disableContextMenu?: boolean;
  disableDeveloperShortcuts?: boolean;
}

const developerShortcutKeys = new Set(["c", "i", "j", "k"]);

/**
 * Application-wide browser interaction guard.
 *
 * This prevents the context menu and the common keyboard shortcuts that open
 * browser developer tools. It is a UI-level deterrent only; authorization and
 * sensitive-data protection must still be enforced by the backend.
 */
const BrowserInteractionGuard = ({
  disableContextMenu = true,
  disableDeveloperShortcuts = true,
}: BrowserInteractionGuardProps) => {
  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => {
      if (disableContextMenu) event.preventDefault();
    };

    const preventDeveloperShortcuts = (event: KeyboardEvent) => {
      if (!disableDeveloperShortcuts) return;
      if (typeof event.key !== "string") return;      
      const key = event.key.toLowerCase();
      const isFunctionKey = event.key === "F12";
      const isWindowsShortcut =
        event.ctrlKey &&
        ((event.shiftKey && developerShortcutKeys.has(key)) || key === "u");
      const isMacShortcut =
        event.metaKey &&
        ((event.altKey && developerShortcutKeys.has(key)) || key === "u");

      if (!isFunctionKey && !isWindowsShortcut && !isMacShortcut) return;

      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener(
      "keydown",
      preventDeveloperShortcuts,
      true,
    );

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener(
        "keydown",
        preventDeveloperShortcuts,
        true,
      );
    };
  }, [disableContextMenu, disableDeveloperShortcuts]);

  return null;
};

export default BrowserInteractionGuard;
