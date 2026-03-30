/**
 * Input validation and sanitization utilities.
 *
 * All user-facing strings are trimmed and length-capped before storage.
 * Numeric inputs are clamped to safe, non-negative ranges.
 */

const MAX_TEXT_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_CURRENCY = 100_000_000; // $100 M

/* ─── Sanitizers ─────────────────────────────────────────── */

/** Trim whitespace and cap length. */
export function sanitizeText(value: string, maxLength = MAX_TEXT_LENGTH): string {
  return value.trim().slice(0, maxLength);
}

/** Sanitize long-form text (descriptions, messages). */
export function sanitizeDescription(value: string): string {
  return sanitizeText(value, MAX_DESCRIPTION_LENGTH);
}

/** Clamp a numeric value to a safe non-negative range. */
export function sanitizePositiveInt(value: number, max = MAX_CURRENCY): number {
  const n = Math.round(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, max);
}

/* ─── Validators ─────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isInRange(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

/* ─── Game form validation ───────────────────────────────── */

export interface GameValidationErrors {
  title?: string;
  genre?: string;
  description?: string;
}

export function validateGameForm(data: {
  title: string;
  genre: string;
  description: string;
}): GameValidationErrors | null {
  const errors: GameValidationErrors = {};

  if (!isNonEmpty(data.title)) errors.title = "Title is required.";
  if (!isNonEmpty(data.genre)) errors.genre = "Genre is required.";
  if (!isNonEmpty(data.description)) errors.description = "Description is required.";

  return Object.keys(errors).length > 0 ? errors : null;
}

/* ─── Finance form validation ────────────────────────────── */

export interface FinanceValidationErrors {
  revenue?: string;
  expenses?: string;
  year?: string;
}

export function validateFinanceForm(data: {
  revenue: number;
  expenses: number;
  year: number;
}): FinanceValidationErrors | null {
  const errors: FinanceValidationErrors = {};

  if (!isInRange(data.year, 2020, 2030)) errors.year = "Year must be between 2020 and 2030.";
  if (data.revenue < 0) errors.revenue = "Revenue cannot be negative.";
  if (data.expenses < 0) errors.expenses = "Expenses cannot be negative.";

  return Object.keys(errors).length > 0 ? errors : null;
}

/* ─── Contact form validation ────────────────────────────── */

export interface ContactValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function validateContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): ContactValidationErrors | null {
  const errors: ContactValidationErrors = {};

  if (!isNonEmpty(data.name)) errors.name = "Name is required.";
  if (!isNonEmpty(data.email)) errors.email = "Email is required.";
  else if (!isValidEmail(data.email)) errors.email = "Enter a valid email address.";
  if (!isNonEmpty(data.subject)) errors.subject = "Please select a subject.";
  if (!isNonEmpty(data.message)) errors.message = "Message is required.";

  return Object.keys(errors).length > 0 ? errors : null;
}
