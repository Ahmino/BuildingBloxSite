/* ─── Auth ───────────────────────────────────────────────── */

export interface AuthState {
  isAdmin: boolean;
  username: string | null;
}

export interface AuthActions {
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export type AuthContextType = AuthState & AuthActions;

/* ─── Games ──────────────────────────────────────────────── */

export type GameStatus = "live" | "beta" | "development";

export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  ccu: number;
  mau: number;
  genre: string;
  status: GameStatus;
}

export type GameFormData = Omit<Game, "id">;

/* ─── Finances ───────────────────────────────────────────── */

export interface MonthlyFinance {
  id: string;
  month: string;
  year: number;
  revenue: number;
  expenses: number;
}

export type FinanceFormData = Omit<MonthlyFinance, "id">;

/* ─── Team ───────────────────────────────────────────────── */

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

/* ─── UI Helpers ─────────────────────────────────────────── */

export type Variant = "primary" | "secondary" | "danger" | "ghost";

export interface NavLink {
  href: string;
  label: string;
}
