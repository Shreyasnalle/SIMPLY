import type { Metadata } from "next";
import "./globals.css";
import HashRouteHandler from "@/components/HashRouteHandler";

export const metadata: Metadata = {
  title: "Simply - AI Video Learning Assistant",
  description: "Simply is an AI teaching assistant that reads video captions in real time, summarizes content, and answers your questions directly within your browser.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
      </head>
      <body className="bg-simply-dark text-simply-coral antialiased min-h-screen">
        <HashRouteHandler />
        {children}
      </body>
    </html>
  );
}
