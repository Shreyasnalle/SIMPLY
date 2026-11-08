import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "link" | "ghost";
type Size = "default" | "lg" | "icon-xs";

const variants: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-input bg-transparent hover:bg-white/5",
  ghost: "hover:bg-white/5",
  link: "text-primary underline-offset-4 hover:underline",
};
const sizes: Record<Size, string> = {
  default: "h-9 px-4 text-sm",
  lg: "h-10 px-4 text-sm",
  "icon-xs": "size-6",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Render as the given element (e.g. a next/link) instead of a <button>. */
  render?: React.ReactElement<{ className?: string; children?: React.ReactNode }>;
  nativeButton?: boolean;
}

export function Button({
  variant = "default",
  size = "default",
  className,
  render,
  nativeButton: _nativeButton,
  children,
  ...props
}: ButtonProps) {
  const cls = cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
    variants[variant],
    sizes[size],
    className,
  );
  if (render) {
    return React.cloneElement(
      render,
      { ...(props as object), className: cn(cls, render.props.className) } as never,
      children,
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
