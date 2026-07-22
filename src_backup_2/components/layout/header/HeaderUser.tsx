"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";

import { HeaderUser as HeaderUserType } from "./types";
import { avatarVariants } from "./variants";

interface HeaderUserProps {
  user: HeaderUserType;
  onClick?: () => void;
}

const HeaderUser = ({ user, onClick }: HeaderUserProps) => {
  const initials = `${user.firstName?.charAt(0) ?? ""}${
    user.lastName?.charAt(0) ?? ""
  }`.toUpperCase();

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        items-center
        gap-3
        rounded-3xl
        bg-transparent
        px-2
        py-1
        transition-all
        duration-200
        hover:bg-primary/10
      "
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

        <p className="text-xs text-slate-500">{user.role ?? "User"}</p>
      </div>

      {/* Arrow
      <ChevronDown
        size={16}
        className="hidden text-slate-400 lg:block"
      /> */}
    </button>
  );
};

export default HeaderUser;
