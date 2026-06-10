import type { Metadata,Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { BottomNavbar } from "@/components/bottom-navbar";
import {Toaster} from "@/components/ui/sonner";
const cairo = Cairo({
  subsets: ["arabic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export const metadata: Metadata = {
  title: "Life Sense",
  description: "ترجمة لغة الإشارة إلى صوت ونص",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        "no-scrollbar",
        cairo.className
      )}
    >
      <body className="h-full bg-background">
        <div className="relative h-full">
          {children}

          <BottomNavbar />
          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  );
}