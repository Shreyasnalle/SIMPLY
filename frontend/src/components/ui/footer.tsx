import * as React from "react";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  brand?: string;
  copyright?: string;
  productLinks?: FooterLink[];
  companyLinks?: FooterLink[];
  socials?: { label: string; href: string; icon: React.ReactNode }[];
  className?: string;
}

const DEFAULT_PRODUCT: FooterLink[] = [
  { label: "How it works", href: "#working" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

const DEFAULT_COMPANY: FooterLink[] = [
  { label: "About Us", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#" },
];

const DEFAULT_SOCIALS = [
  { label: "X", href: "#", icon: <IconBrandX className="size-5" /> },
  { label: "LinkedIn", href: "#", icon: <IconBrandLinkedin className="size-5" /> },
  { label: "YouTube", href: "#", icon: <IconBrandYoutube className="size-5" /> },
  { label: "Instagram", href: "#", icon: <IconBrandInstagram className="size-5" /> },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-blue-500/60 pb-3 text-sm text-blue-400">
      {children}
    </div>
  );
}

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <ColumnHeading>{title}</ColumnHeading>
      <ul className="mt-6 flex flex-col gap-4">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-lg text-zinc-300 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({
  brand = "Simply",
  copyright = `© ${new Date().getFullYear()} Simply`,
  productLinks = DEFAULT_PRODUCT,
  companyLinks = DEFAULT_COMPANY,
  socials = DEFAULT_SOCIALS,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden border-t border-blue-900/60 bg-[#070b17]",
        className,
      )}
    >
      {/* Base blue wash fading to black at the bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(23,37,84,0.75) 0%, rgba(10,15,35,0.6) 40%, #05070d 100%)",
        }}
      />
      {/* Faint vertical streaks on the left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(59,89,200,0.18) 0 2px, transparent 2px 28px)",
          maskImage: "linear-gradient(180deg, black, transparent 70%)",
          WebkitMaskImage: "linear-gradient(180deg, black, transparent 70%)",
        }}
      />
      {/* Diagonal spotlight beam from the top right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-[8%] h-[130%] w-48 origin-top rotate-[22deg] blur-3xl sm:w-64"
        style={{
          background:
            "linear-gradient(180deg, rgba(70,105,230,0.55) 0%, rgba(55,85,200,0.35) 50%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 pt-24 sm:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.6fr_1fr_1fr] md:gap-16">
          <div>
            <ColumnHeading>{copyright}</ColumnHeading>
            <div className="mt-6 flex gap-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex size-11 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <p className="mt-8 text-lg leading-8 text-zinc-400">
              Simply is your AI video learning assistant.
              <br />
              Learn faster, without the ten tabs.
            </p>
          </div>

          <LinkColumn title="Our Product" links={productLinks} />
          <LinkColumn title="Company" links={companyLinks} />
        </div>

        {/* Oversized wordmark, cropped at the bottom and fading out */}
        <div
          aria-hidden
          className="pointer-events-none mt-16 select-none overflow-hidden sm:mt-24"
          style={{
            maskImage: "linear-gradient(180deg, black 30%, transparent 98%)",
            WebkitMaskImage: "linear-gradient(180deg, black 30%, transparent 98%)",
          }}
        >
          <div
            className="-mb-[0.12em] text-center font-semibold leading-[0.85] tracking-tighter text-[28vw] md:text-[22vw]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #2a45b0 0%, #1b2f7e 55%, #0c1538 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {brand}
          </div>
        </div>
      </div>
    </footer>
  );
}
