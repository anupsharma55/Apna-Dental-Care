import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apna Dental Care — A Healthy Smile. A Happier You.",
  description: "Thoughtful family dental care. Explore preventive, cosmetic, restorative and orthodontic treatments, meet the care team and preview your first visit to Apna Dental Care.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
