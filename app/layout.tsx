import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: 'Analytics Dashboard',
  description: 'Comprehensive Analytics Dashboard with Weather, News, and Finance data',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  data-theme="light" className="transition-all duration-800">
      <body>
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
