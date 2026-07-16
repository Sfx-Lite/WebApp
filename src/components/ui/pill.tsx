import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { pillVariants } from "@/utils/functions";

function Pill({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof pillVariants>) {
  return (
    <span
      data-slot="pill"
      className={cn(pillVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Pill };
