"use client";

import { Search } from "lucide-react";

import { Input } from "@/src/components/ui";
import { searchVariants } from "./variants";

interface HeaderSearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

const HeaderSearch = ({
  placeholder = "Search anything...",
  onSearch,
}: HeaderSearchProps) => {
  return (
    <div className="hidden flex-1 justify-center px-6 lg:flex">
      <div className="w-full max-w-[380px]">
        <div className={searchVariants()}>
          {/* Search Icon */}
          <div className="ml-2 flex h-7 w-7 items-center justify-center rounded-lg bg-secondary transition-colors duration-200">
            <Search size={15} strokeWidth={2.2} className="text-primary" />
          </div>

          {/* Input */}
          <Input unstyled
            type="text"
            placeholder={placeholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className="
          h-full
          w-full
          bg-transparent
          px-3
          text-sm
          text-foreground
          placeholder:text-slate-400
          outline-none
        "
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;
