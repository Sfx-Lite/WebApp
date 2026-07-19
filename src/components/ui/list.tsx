import * as React from "react";

import { cn } from "@/lib/utils";

type ListItemProps = {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
} & React.ComponentProps<"div">;

function ListItem({
  leading,
  title,
  subtitle,
  trailing,
  className,
  ...props
}: ListItemProps) {
  return (
    <div
      data-slot="list-item"
      className={cn(
        "flex items-center gap-3 rounded-radius-card bg-sfx-card p-[14px] shadow-brand",
        className,
      )}
      {...props}
    >
      {leading && (
        <div data-slot="list-item-leading" className="flex shrink-0 items-center justify-center">
          {leading}
        </div>
      )}

      <div data-slot="list-item-content" className="flex min-w-0 flex-1 flex-col">
        <span className="font-rh-sb text-sm text-sfx-ink truncate">
          {title}
        </span>
        {subtitle && (
          <span className="font-rh-r text-xs text-sfx-muted truncate">
            {subtitle}
          </span>
        )}
      </div>

      {trailing && (
        <div data-slot="list-item-trailing" className="flex shrink-0 items-center gap-2">
          {trailing}
        </div>
      )}
    </div>
  );
}

export { ListItem };
