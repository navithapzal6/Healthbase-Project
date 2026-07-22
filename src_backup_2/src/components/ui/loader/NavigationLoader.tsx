"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import Loader from "./Loader";

const NAVIGATION_LOADING_EVENT = "stonebuild:navigation-loading";
const MINIMUM_VISIBLE_TIME = 350;
const SAFETY_TIMEOUT = 10000;

interface NavigationLoadingDetail {
  label?: string;
}

export const startNavigationLoading = (label = "Loading page...") => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<NavigationLoadingDetail>(NAVIGATION_LOADING_EVENT, {
      detail: { label },
    }),
  );
};

const NavigationLoader = () => {
  const pathname = usePathname() || "/";
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("Loading page...");
  const startedAt = useRef(0);
  const startPath = useRef(pathname);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    hideTimer.current = null;
    safetyTimer.current = null;
  }, []);

  const showLoader = useCallback(
    (nextLabel = "Loading page...") => {
      clearTimers();
      startedAt.current = Date.now();
      startPath.current = window.location.pathname;
      setLabel(nextLabel);
      setVisible(true);

      safetyTimer.current = setTimeout(() => {
        setVisible(false);
      }, SAFETY_TIMEOUT);
    },
    [clearTimers],
  );

  useEffect(() => {
    const handleNavigationStart = (event: Event) => {
      const customEvent = event as CustomEvent<NavigationLoadingDetail>;
      showLoader(customEvent.detail?.label);
    };

    const handleInternalLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");

      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      const isInternal = destination.origin === current.origin;
      const changesPath = destination.pathname !== current.pathname;

      if (isInternal && changesPath) {
        const destinationLabel = anchor.textContent?.trim() || "page";
        showLoader(`Loading ${destinationLabel.toLowerCase()}...`);
      }
    };

    window.addEventListener(NAVIGATION_LOADING_EVENT, handleNavigationStart);
    document.addEventListener("click", handleInternalLinkClick, true);

    return () => {
      window.removeEventListener(
        NAVIGATION_LOADING_EVENT,
        handleNavigationStart,
      );
      document.removeEventListener("click", handleInternalLinkClick, true);
      clearTimers();
    };
  }, [clearTimers, showLoader]);

  useEffect(() => {
    if (!visible || pathname === startPath.current) return;

    const elapsed = Date.now() - startedAt.current;
    const remaining = Math.max(0, MINIMUM_VISIBLE_TIME - elapsed);

    hideTimer.current = setTimeout(() => {
      clearTimers();
      setVisible(false);
    }, remaining);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = null;
    };
  }, [clearTimers, pathname, visible]);

  if (!visible) return null;

  return <Loader fullScreen label={label} />;
};

export default NavigationLoader;
