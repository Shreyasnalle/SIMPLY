import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const nav = [
  {
    title: "Our Product",
    links: [
      { label: "How it works", href: "/product/how-it-works" },
      { label: "Features", href: "/product/features" },
      { label: "Pricing", href: "/product/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/company/about" },
      { label: "FAQ", href: "/company/faq" },
      { label: "Contact", href: "/company/contact" },
    ],
  },
];

export function DocsLayout({
  title,
  section,
  description,
  children,
}: {
  title: string;
  section: string;
  description: string;
  children: React.ReactNode;
}) {
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        <title>{`${title} - Simply`}</title>
        <meta name="description" content={description} />
      </Head>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="text-sm font-semibold tracking-wider">
              Simply
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Login
            </Link>
          </div>
        </header>

        <div className="mx-auto flex max-w-6xl gap-12 px-6">
          <aside className="hidden w-56 shrink-0 py-10 md:block">
            {nav.map((group) => (
              <div key={group.title} className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.title}
                </p>
                <ul className="space-y-1">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className={`block rounded px-2 py-1 text-sm ${
                          pathname === l.href
                            ? "bg-white/10 text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          <main className="min-w-0 max-w-3xl flex-1 py-10">
            <p className="text-sm text-muted-foreground">{section}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-base text-muted-foreground">{description}</p>
            <div className="mt-8 space-y-4 text-[15px] leading-7 text-foreground/90 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6">
              {children}
            </div>
          </main>
        </div>

        <footer className="mt-10 border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-muted-foreground">
            © Simply. Your AI video learning assistant.
          </div>
        </footer>
      </div>
    </>
  );
}
