import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React Demo Site",
  description: "React機能デモサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <nav
          style={{
            display: "flex",
            gap: "1.5rem",
            padding: "1rem 2rem",
            borderBottom: "1px solid #ddd",
            backgroundColor: "#fafafa",
            fontFamily: "sans-serif",
          }}
        >
          <Link href="/" style={{ fontWeight: "bold" }}>Home</Link>
          <Link href="/counter">カウンター</Link>
          <Link href="/darkmode">ダークモード</Link>
          <Link href="/cart">カート</Link>
          <Link href="/books">本リスト</Link>
          <Link href="/about">自己紹介</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
