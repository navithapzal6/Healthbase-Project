"use client";

import { Bell, Settings } from "lucide-react";
import { Button } from "@/src/components/ui";
import { iconButtonVariants } from "./variants";

interface HeaderActionsProps {
  showSettings?: boolean;
  showNotification?: boolean;
  onSettingsClick?: () => void;
  onNotificationClick?: () => void;
  notificationCount?: number;
}

const HeaderActions = ({
  showSettings = true,
  showNotification = true,
  onSettingsClick,
  onNotificationClick,
  notificationCount = 0,
}: HeaderActionsProps) => {
  return (
    <div className="flex items-center gap-3">
      {/* Settings */}
      {showSettings && (
        <Button unstyled
          type="button"
          aria-label="Settings"
          onClick={onSettingsClick}
          className={iconButtonVariants()}
        >
          <Settings size={20} strokeWidth={2} />
        </Button>
      )}

      {/* Notification */}
      {showNotification && (
        <Button unstyled
          type="button"
          aria-label="Notifications"
          onClick={onNotificationClick}
          className={`${iconButtonVariants()} relative`}
        >
          <Bell size={20} strokeWidth={2} />

          {notificationCount > 0 && (
            <>
              {/* Notification Dot */}
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />

              {/* Count (Optional) */}
              {notificationCount <= 9 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {notificationCount}
                </span>
              )}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default HeaderActions;
