import * as React from "react";
import { cn } from "@/lib/utils";

export interface FancyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "default" | "lg";
}

export function FancyButton({ className, size = "default", ...props }: FancyButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-b from-white to-zinc-300 font-semibold text-black shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 hover:from-white hover:to-zinc-200 active:translate-y-0",
        size === "lg" ? "h-10 px-5 text-sm" : "h-9 px-4 text-sm",
        className,
      )}
      {...props}
    />
  );
}
