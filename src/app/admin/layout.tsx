"use client";

import { AdminGuard, Navbar, Footer } from "@/components/layout";
import { DataProvider } from "@/context/DataContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <DataProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer admin />
        </div>
      </DataProvider>
    </AdminGuard>
  );
}
