"use client";

import { useState, useCallback } from "react";
import { validateContactForm, sanitizeText, sanitizeDescription } from "@/lib/validators";
import type { ContactValidationErrors } from "@/lib/validators";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: ContactFormData = {
  name: "",
  email: "",
  company: "",
  subject: "",
  message: "",
};

export default function useContactForm() {
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactValidationErrors | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const updateField = useCallback((field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors(null);
  }, []);

  const submit = useCallback(() => {
    const sanitised = {
      name: sanitizeText(form.name),
      email: sanitizeText(form.email),
      company: sanitizeText(form.company),
      subject: form.subject,
      message: sanitizeDescription(form.message),
    };

    const validationErrors = validateContactForm(sanitised);
    if (validationErrors) {
      setErrors(validationErrors);
      return false;
    }

    // In production: POST to an API route here.
    setSubmitted(true);
    return true;
  }, [form]);

  const reset = useCallback(() => {
    setForm(EMPTY_FORM);
    setErrors(null);
    setSubmitted(false);
  }, []);

  return { form, errors, submitted, updateField, submit, reset };
}
