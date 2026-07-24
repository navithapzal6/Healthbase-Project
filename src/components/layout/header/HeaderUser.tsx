"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";

import { Button, Popover } from "@/src/components/ui";

import { HeaderUser as HeaderUserType } from "./types";
import { avatarVariants } from "./variants";

interface HeaderUserProps {
  user: HeaderUserType;
  onLogout?: () => void;
}

const HeaderUser = ({ user, onLogout }: HeaderUserProps) => {
  const initials = `${user.firstName?.charAt(0) ?? ""}${
    user.lastName?.charAt(0) ?? ""
  }`.toUpperCase();

  return (
    <Popover
      align="end"
      trigger={(triggerProps) => (
        <Button unstyled
          ref={triggerProps.ref}
          type="button"
          onClick={triggerProps.onClick}
          aria-expanded={triggerProps["aria-expanded"]}
          aria-haspopup={triggerProps["aria-haspopup"]}
          className="flex items-center gap-3 rounded-3xl bg-transparent px-2 py-1 transition-all duration-200 hover:bg-primary/10"
        >
          {/* Avatar */}
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.firstName}
              width={42}
              height={42}
              className="h-[42px] w-[42px] rounded-full object-cover"
            />
          ) : (
            <div className={`${avatarVariants()} h-[40px] w-[40px] text-sm`}>
              {initials || "U"}
            </div>
          )}

          {/* User Info */}
          <div className="hidden text-left lg:block">
            <h4 className="max-w-[150px] truncate text-sm font-semibold text-slate-800">
              {user.firstName} {user.lastName}
            </h4>

            <p className="max-w-[170px] truncate text-xs text-slate-500">
              {user.role ?? "User"}
            </p>
          </div>
        </Button>
      )}
    >
      {(close) => (
        <div>
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-slate-800">
              {user.firstName} {user.lastName}
            </p>
            {user.email && (
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {user.email}
              </p>
            )}
          </div>

          <div className="my-1 h-px bg-slate-100" />

          <Button unstyled
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              onLogout?.();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout
          </Button>
        </div>
      )}
    </Popover>
  );
};

export default HeaderUser;
