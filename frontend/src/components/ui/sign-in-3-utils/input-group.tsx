import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

export function InputGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex w-full items-center rounded-md border border-input transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
        className,
      )}
      {...props}
    />
  );
}

export const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground",
      className,
    )}
    {...props}
  />
));
InputGroupInput.displayName = "InputGroupInput";

export function InputGroupAddon({
  className,
  align: _align = "inline-end",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { align?: "inline-start" | "inline-end" }) {
  return <div className={cn("flex items-center pr-2 text-muted-foreground", className)} {...props} />;
}

export function InputGroupButton(props: ButtonProps) {
  return <Button variant="ghost" {...props} />;
}
