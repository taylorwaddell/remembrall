import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist_Mono } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Remembrall",
  description: "Intentional notes.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistMono.variable}`}>
      <body className="root">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
