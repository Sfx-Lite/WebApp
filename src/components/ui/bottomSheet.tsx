"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type BottomSheetAction = {
  label: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
};

type BottomSheetProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  actions?: BottomSheetAction[];
  className?: string;
};

function BottomSheet({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
  className,
}: BottomSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger>{trigger}</SheetTrigger>}
      <SheetContent
        side="bottom"
        className={cn(
          "max-h-[85vh] rounded-t-radius-sheet bg-sfx-card text-sfx-ink shadow-brand",
          className,
        )}
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-sfx-muted/30" />

        {(title || description) && (
          <SheetHeader>
            {title && <SheetTitle className="text-sfx-ink">{title}</SheetTitle>}
            {description && (
              <SheetDescription className="text-sfx-muted">
                {description}
              </SheetDescription>
            )}
          </SheetHeader>
        )}

        <div className="flex-1 overflow-y-auto px-4">{children}</div>

        {actions && actions.length > 0 && (
          <SheetFooter className="flex-row gap-2">
            {actions.map(action => (
              <Button
                key={action.label}
                variant={action.variant ?? "default"}
                onClick={action.onClick}
                className="flex-1"
              >
                {action.label}
              </Button>
            ))}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export { BottomSheet, type BottomSheetAction };
