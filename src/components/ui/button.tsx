"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@/lib/utils";

/** Base UI behaviour with only the shared styling this guide actually uses. */
export function Button({ className, ...props }: ButtonPrimitive.Props) {
  return (
    <ButtonPrimitive
      className={cn(
        "inline-flex shrink-0 items-center justify-center border border-transparent text-sm font-medium whitespace-nowrap disabled:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}
