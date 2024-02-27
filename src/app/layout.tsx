"use client";
import "../../styles/globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { ThemeSwitcher } from "./components/theme-switcher";
import { cn } from "./lib/cn";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <main
            className={cn(
              "min-h-screen flex flex-col p-10 items-center bg-[url('/bg-1.png')] dark:bg-[url('/bg-1-invert.png')]"
            )}
          >
            <div className="flex justify-end w-full">
              <ThemeSwitcher />
            </div>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
