import * as React from "react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn("size-4 shrink-0 cursor-pointer rounded border border-input bg-transparent accent-white", className)}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";
