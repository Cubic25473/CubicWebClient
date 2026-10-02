import type { Metadata } from "next";
import "./globals.css";
import { CubicData } from "@/components/cubic-data";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Cubic — FTC Robotics",
  description: "Meet Cubic: a FIRST Tech Challenge team turning curiosity into robots. Explore our robots and the people behind them.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased"><ThemeProvider><CubicData>{children}<Toaster position="bottom-right"/></CubicData></ThemeProvider></body>
    </html>
  );
}
