"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { PUBLIC_LINKS, ADMIN_LINKS } from "@/lib/constants";

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-900 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function MobileNavItem({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-900 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin");
  const links = isAdminRoute && isAdmin ? ADMIN_LINKS : PUBLIC_LINKS;
  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href={isAdmin ? "/admin/dashboard" : "/home"} className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold">
            BB
          </div>
          <span className="text-lg font-semibold tracking-tight">BuildingBlox</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavItem key={link.href} {...link} active={pathname === link.href} />
          ))}

          {isAdmin && (
            <>
              <div className="mx-2 h-5 w-px bg-gray-700" />
              {isAdminRoute ? (
                <NavItem href="/home" label="Public Site" active={false} />
              ) : (
                <Link
                  href="/admin/dashboard"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-brand-400 hover:bg-gray-900 hover:text-brand-300"
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}

          <div className="ml-2">
            {isAdmin ? (
              <button
                onClick={logout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-white"
              >
                Logout
              </button>
            ) : (
              <NavItem href="/" label="Login" active={false} />
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-800 px-6 py-4 md:hidden">
          <div className="space-y-1">
            {links.map((link) => (
              <MobileNavItem
                key={link.href}
                {...link}
                active={pathname === link.href}
                onClick={closeMobile}
              />
            ))}

            <div className="my-2 h-px bg-gray-800" />

            {isAdmin && (
              <>
                {isAdminRoute ? (
                  <MobileNavItem href="/home" label="Public Site" active={false} onClick={closeMobile} />
                ) : (
                  <MobileNavItem href="/admin/dashboard" label="Admin Panel" active={false} onClick={closeMobile} />
                )}
                <button
                  onClick={() => { logout(); closeMobile(); }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-400 hover:text-white"
                >
                  Logout
                </button>
              </>
            )}

            {!isAdmin && (
              <MobileNavItem href="/" label="Login" active={false} onClick={closeMobile} />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
