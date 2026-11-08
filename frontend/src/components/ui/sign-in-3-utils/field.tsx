import * as React from "react";
import { cn } from "@/lib/utils";

export function FieldGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex w-full flex-col gap-4", className)} {...props} />;
}
export function Field({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex w-full flex-col gap-2", className)} {...props} />;
}
export function FieldLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm leading-none font-medium select-none", className)} {...props} />;
}
