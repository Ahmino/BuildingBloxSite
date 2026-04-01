import type { NavLink } from "@/types";

/* ─── Navigation ─────────────────────────────────────────── */

export const PUBLIC_LINKS: NavLink[] = [
  { href: "/home", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export const ADMIN_LINKS: NavLink[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/games", label: "Manage Games" },
  { href: "/admin/finances", label: "Finances" },
  { href: "/admin/overlay", label: "Overlay Tool" },
  { href: "/admin/insights", label: "AI Insights" },
];

/* ─── Finance ────────────────────────────────────────────── */

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/* ─── Game Statuses ──────────────────────────────────────── */

export const GAME_STATUS_OPTIONS = [
  { value: "live", label: "Live" },
  { value: "beta", label: "Beta" },
  { value: "development", label: "In Development" },
] as const;

export const STATUS_STYLES = {
  live: "bg-green-500/10 text-green-400 border-green-500/20",
  beta: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  development: "bg-gray-500/10 text-gray-400 border-gray-500/20",
} as const;

export const STATUS_LABELS = {
  live: "Live",
  beta: "Beta",
  development: "In Dev",
} as const;

/* ─── Contact Subjects ───────────────────────────────────── */

export const CONTACT_SUBJECTS = [
  { value: "", label: "Select a subject" },
  { value: "partnership", label: "Brand Partnership" },
  { value: "careers", label: "Careers" },
  { value: "development", label: "Game Development Inquiry" },
  { value: "meeting", label: "Book a Meeting" },
  { value: "other", label: "Other" },
] as const;
