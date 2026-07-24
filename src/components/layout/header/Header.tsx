"use client";

import HeaderActions from "./HeaderActions";
import HeaderBreadcrumb from "./HeaderBreadcrumb";
import HeaderSearch from "./HeaderSearch";
import HeaderUser from "./HeaderUser";

import { HeaderProps } from "./types";
import { headerVariants } from "./variants";

const Header = ({
  title = "Dashboard",
  greeting = false,
  breadcrumbs = [],
  user,
  backHref,
  backLabel,

  searchPlaceholder,
  showSearch = true,
  showSettings = true,
  showNotification = true,

  onSearch,
  onSettingsClick,
  onNotificationClick,
  onLogout,

  actions,
  className,
}: HeaderProps) => {
  const hour = new Date().getHours();

  const greetingText =
    hour < 12
      ? "Good Morning"
      : hour < 17
        ? "Good Afternoon"
        : hour < 21
          ? "Good Evening"
          : "Good Night";

  return (
    <header className={`${headerVariants()} ${className ?? ""}`}>
      {/* Left */}
      <div className="min-w-0 flex-1">
        {greeting ? (
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Hello, {user?.firstName ?? "User"} {user?.lastName}
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {greetingText}
            </p>
          </div>
        ) : (
          <HeaderBreadcrumb
            title={title}
            breadcrumbs={breadcrumbs}
            backHref={backHref}
            backLabel={backLabel}
          />
        )}
      </div>

      {/* Center */}
      {showSearch && (
        <div className="hidden flex-1 justify-center lg:flex">
          <HeaderSearch placeholder={searchPlaceholder} onSearch={onSearch} />
        </div>
      )}

      {/* Right */}
      <div className="ml-auto flex items-center gap-3">
        <HeaderActions
          showSettings={showSettings}
          showNotification={showNotification}
          onSettingsClick={onSettingsClick}
          onNotificationClick={onNotificationClick}
          notificationCount={3}
        />

        {user && <HeaderUser user={user} onLogout={onLogout} />}

        {actions}
      </div>
    </header>
  );
};

export default Header;
