import type { VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { bannerVariants } from "@/utils/functions";

const bannerIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
} as const;

const bannerIconColors = {
  info: "text-sfx-primary",
  success: "text-sfx-success",
  warning: "text-sfx-amber",
  error: "text-sfx-danger",
} as const;

type BannerProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
} & React.ComponentProps<"div"> & VariantProps<typeof bannerVariants>;

function Banner({
  variant = "info",
  title,
  description,
  icon,
  dismissible,
  onDismiss,
  className,
  children,
  ...props
}: BannerProps) {
  const IconComponent = bannerIcons[variant ?? "info"];

  return (
    <div
      data-slot="banner"
      className={cn(bannerVariants({ variant, className }))}
      {...props}
    >
      <div className={cn("mt-0.5 shrink-0", bannerIconColors[variant ?? "info"])}>
        {icon ?? <IconComponent className="size-4" />}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {title && <span className="font-rh-sb text-sm text-sfx-ink">{title}</span>}
        {description && (
          <span className="font-rh-r text-xs text-sfx-muted">{description}</span>
        )}
        {children}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-sfx-muted hover:text-sfx-ink"
        >
          <XCircle className="size-4" />
          <span className="sr-only">Dismiss</span>
        </button>
      )}
    </div>
  );
}

export { Banner };
