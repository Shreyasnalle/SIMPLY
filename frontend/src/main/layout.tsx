import type { Metadata } from "next";
import "./global.css";
import HashRouteHandler from "@/components/HashRouteHandler";
import logo from "@/assests/logo.png";

export const metadata: Metadata = {
  title: "Simply - AI Video Learning Assistant",
  description: "Simply is an AI teaching assistant that reads video captions in real time, summarizes content, and answers your questions directly within your browser.",
  icons: {
    icon: logo.src,
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
        <link rel="icon" type="image/png" href={logo.src} />
      </head>
      <body className="bg-simply-dark text-simply-coral antialiased min-h-screen">
        <HashRouteHandler />
        {children}
      </body>
    </html>
  );
}
