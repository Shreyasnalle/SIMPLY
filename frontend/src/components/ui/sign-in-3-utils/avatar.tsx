import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full bg-muted", className)}
      {...props}
    />
  );
}
export function AvatarImage({ className, alt = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} className={cn("absolute inset-0 size-full object-cover", className)} {...props} />;
}
export function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("flex size-full items-center justify-center text-sm", className)} {...props} />;
}
