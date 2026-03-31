import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { GamesProvider } from "@/context/GamesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuildingBlox - Roblox Game Development Studio",
  description:
    "Professional Roblox game development studio creating immersive experiences with millions of players worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <GamesProvider>{children}</GamesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
