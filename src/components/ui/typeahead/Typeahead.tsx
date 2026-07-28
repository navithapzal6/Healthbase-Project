"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { Loader } from "@/src/components/ui/loader";
import { cn } from "@/src/lib/utils";

import type { TypeaheadOption, TypeaheadProps } from "./types";
import { useTypeaheadOptions } from "./use-typeahead-options";

interface MenuPosition {
  left: number;
  width: number;
  maxHeight: number;
  top?: number;
  bottom?: number;
}

const Typeahead = ({
  id,
  label,
  placeholder = "Search and select...",
  value,
  options = [],
  error,
  disabled,
  loading: externalLoading = false,
  loadingMessage = "Loading options...",
  loadingMoreMessage = "Loading more...",
  minimumQueryLength = 0,
  emptyMessage = "No results found",
  pageSize = 10,
  debounceMs = 250,
  loadOptions,
  onSearch,
  onChange,
}: TypeaheadProps) => {
  const generatedId = useId();
  const inputId = id ?? `typeahead-${generatedId}`;
  const listboxId = `${inputId}-listbox`;

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedCacheRef = useRef<Map<string, TypeaheadOption>>(new Map());
  const typingRef = useRef(false);

  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(
    null,
  );

  const {
    options: displayedOptions,
    hasMore,
    loading,
    loadingMore,
    loadError,
    loadMore,
  } = useTypeaheadOptions({
    open,
    query: searchTerm,
    options,
    loadOptions,
    pageSize,
    debounceMs,
    minimumQueryLength,
  });

  const selected = useMemo(() => {
    if (!value) return undefined;

    return (
      options.find((option) => option.value === value) ??
      displayedOptions.find((option) => option.value === value) ??
      selectedCacheRef.current.get(value)
    );
  }, [displayedOptions, options, value]);

  useEffect(() => {
    if (!value || !selected) return;
    selectedCacheRef.current.set(value, selected);

    if (!typingRef.current) {
      setQuery(selected.label);
    }
  }, [selected, value]);

  useEffect(() => {
    if (value || typingRef.current) return;
    setQuery("");
  }, [value]);

  const updateMenuPosition = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;

    const rect = input.getBoundingClientRect();
    const viewportPadding = 12;
    const gap = 6;
    const preferredHeight = 224;
    const spaceBelow =
      window.innerHeight - rect.bottom - gap - viewportPadding;
    const spaceAbove = rect.top - gap - viewportPadding;
    const openAbove = spaceBelow < 160 && spaceAbove > spaceBelow;
    const availableHeight = Math.max(
      96,
      Math.min(
        preferredHeight,
        openAbove ? spaceAbove : spaceBelow,
      ),
    );

    setMenuPosition({
      left: Math.max(
        viewportPadding,
        Math.min(
          rect.left,
          window.innerWidth - viewportPadding - rect.width,
        ),
      ),
      width: rect.width,
      maxHeight: availableHeight,
      ...(openAbove
        ? { bottom: window.innerHeight - rect.top + gap }
        : { top: rect.bottom + gap }),
    });
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    typingRef.current = false;
    setSearchTerm("");

    if (value && selected) {
      setQuery(selected.label);
    } else {
      setQuery("");
      onSearch?.("");
    }
  }, [onSearch, selected, value]);

  const openMenu = useCallback(() => {
    if (disabled) return;
    updateMenuPosition();
    setOpen(true);
  }, [disabled, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      closeMenu();
    };

    const handleViewportChange = () => updateMenuPosition();

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [closeMenu, open, updateMenuPosition]);

  useEffect(() => {
    if (!open || !displayedOptions.length) {
      setActiveIndex(-1);
      return;
    }

    setActiveIndex((currentIndex) => {
      // Keep the currently visible option active when another API chunk is
      // appended. Resetting this to zero makes scrollIntoView jump the menu
      // back to its first option after every 10 records.
      if (
        currentIndex >= 0 &&
        currentIndex < displayedOptions.length
      ) {
        return currentIndex;
      }

      const selectedIndex = displayedOptions.findIndex(
        (option) => option.value === value,
      );
      return selectedIndex >= 0 ? selectedIndex : 0;
    });
  }, [displayedOptions, open, value]);

  useEffect(() => {
    if (activeIndex < 0) return;
    menuRef.current
      ?.querySelector<HTMLElement>(
        `[data-typeahead-index="${activeIndex}"]`,
      )
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const selectOption = (option: TypeaheadOption) => {
    selectedCacheRef.current.set(option.value, option);
    typingRef.current = false;
    setQuery(option.label);
    setSearchTerm("");
    setOpen(false);
    setActiveIndex(-1);
    onChange(option.value, option);
  };

  const clearSelection = () => {
    typingRef.current = false;
    setQuery("");
    setSearchTerm("");
    setActiveIndex(-1);
    onChange("");
    onSearch?.("");
    openMenu();
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const queryTooShort =
    searchTerm.trim().length < Math.max(0, minimumQueryLength);
  const isInitialLoading = externalLoading || loading;
  const showClearButton = Boolean(value || query);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }

      if (
        activeIndex >= displayedOptions.length - 1 &&
        hasMore
      ) {
        void loadMore();
      }
      setActiveIndex((current) =>
        Math.min(current + 1, displayedOptions.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(0, current - 1));
      return;
    }

    if (
      event.key === "Enter" &&
      open &&
      activeIndex >= 0 &&
      displayedOptions[activeIndex]
    ) {
      event.preventDefault();
      selectOption(displayedOptions[activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key === "Tab") {
      closeMenu();
    }
  };

  const menu =
    open && menuPosition && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            aria-label={label ?? placeholder}
            className="fixed z-[200] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
            style={menuPosition}
            onScroll={(event) => {
              const target = event.currentTarget;
              const remaining =
                target.scrollHeight -
                target.scrollTop -
                target.clientHeight;

              if (remaining <= 32 && hasMore && !loadingMore) {
                void loadMore();
              }
            }}
          >
            {queryTooShort ? (
              <p className="px-3 py-5 text-center text-sm text-slate-500">
                Type at least {minimumQueryLength} characters
              </p>
            ) : isInitialLoading ? (
              <div className="flex min-h-20 items-center justify-center gap-2 px-3 text-primary">
                <Loader
                  inline
                  size="sm"
                  tone="primary"
                  label={loadingMessage}
                />
                <span className="text-sm text-slate-500">
                  {loadingMessage}
                </span>
              </div>
            ) : loadError && !displayedOptions.length ? (
              <p className="px-3 py-5 text-center text-sm text-red-600">
                {loadError}
              </p>
            ) : displayedOptions.length ? (
              <>
                {displayedOptions.map((option, index) => {
                  const optionId = `${listboxId}-option-${index}`;
                  const isSelected = option.value === value;
                  const isActive = index === activeIndex;

                  return (
                    <button
                      id={optionId}
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      data-typeahead-index={index}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectOption(option)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                        isActive
                          ? "bg-primary/10"
                          : "hover:bg-primary/5",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-800">
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="block truncate text-xs text-slate-500">
                            {option.description}
                          </span>
                        )}
                      </span>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                      )}
                    </button>
                  );
                })}

                {loadingMore && (
                  <div className="flex items-center justify-center gap-2 px-3 py-3 text-primary">
                    <Loader
                      inline
                      size="sm"
                      tone="primary"
                      label={loadingMoreMessage}
                    />
                    <span className="text-xs text-slate-500">
                      {loadingMoreMessage}
                    </span>
                  </div>
                )}

                {loadError && (
                  <p className="px-3 py-2 text-center text-xs text-red-600">
                    {loadError}
                  </p>
                )}
              </>
            ) : (
              <p className="px-3 py-5 text-center text-sm text-slate-500">
                {emptyMessage}
              </p>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          id={inputId}
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={open}
          aria-invalid={Boolean(error)}
          aria-activedescendant={
            open && activeIndex >= 0
              ? `${listboxId}-option-${activeIndex}`
              : undefined
          }
          value={query}
          disabled={disabled}
          autoComplete="off"
          placeholder={placeholder}
          onFocus={openMenu}
          onKeyDown={handleKeyDown}
          onChange={(event) => {
            const nextQuery = event.target.value;
            typingRef.current = true;
            menuRef.current?.scrollTo({ top: 0 });
            setQuery(nextQuery);
            setSearchTerm(nextQuery);
            setActiveIndex(0);
            openMenu();

            if (value) onChange("");
            onSearch?.(nextQuery);
          }}
          className={cn(
            "h-11 w-full rounded-xl border bg-white pl-10 pr-16 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-destructive" : "border-border",
          )}
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
          {showClearButton && !disabled && (
            <button
              type="button"
              aria-label="Clear selection"
              onMouseDown={(event) => event.preventDefault()}
              onClick={clearSelection}
              className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            aria-label={open ? "Close options" : "Open options"}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              inputRef.current?.focus();
              if (open) closeMenu();
              else openMenu();
            }}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}

      {menu}
    </div>
  );
};

export default Typeahead;
