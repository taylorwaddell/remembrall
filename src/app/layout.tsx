import "../../globals.css";

import { type Metadata } from "next";
import { Funnel_Display } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Remembrall",
  description: "Intentional notes.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel-display",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${funnelDisplay.variable} dark:bg-zinc-800 dark:text-zinc-200`}
    >
      <body className="root">
        <Toaster />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
