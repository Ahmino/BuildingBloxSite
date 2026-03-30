"use client";

import { Button, Input, Select, Textarea } from "@/components/ui";
import { CONTACT_SUBJECTS } from "@/lib/constants";
import type { ContactValidationErrors } from "@/lib/validators";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  form: ContactFormData;
  errors: ContactValidationErrors | null;
  onUpdate: (field: keyof ContactFormData, value: string) => void;
  onSubmit: () => boolean;
}

export default function ContactForm({ form, errors, onUpdate, onSubmit }: ContactFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm space-y-4">
      <h2 className="text-lg font-semibold">Send Us a Message</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="contact-name"
          label="Name *"
          value={form.name}
          onChange={(e) => onUpdate("name", e.target.value)}
          placeholder="Your name"
          error={errors?.name}
        />
        <Input
          id="contact-email"
          label="Email *"
          type="email"
          value={form.email}
          onChange={(e) => onUpdate("email", e.target.value)}
          placeholder="you@company.com"
          error={errors?.email}
        />
      </div>

      <Input
        id="contact-company"
        label="Company"
        value={form.company}
        onChange={(e) => onUpdate("company", e.target.value)}
        placeholder="Company name (optional)"
      />

      <Select
        id="contact-subject"
        label="Subject *"
        options={CONTACT_SUBJECTS}
        value={form.subject}
        onChange={(e) => onUpdate("subject", e.target.value)}
        error={errors?.subject}
      />

      <Textarea
        id="contact-message"
        label="Message *"
        value={form.message}
        onChange={(e) => onUpdate("message", e.target.value)}
        rows={5}
        placeholder="Tell us about your project or inquiry..."
        error={errors?.message}
      />

      <Button type="submit" fullWidth>
        Send Message
      </Button>
    </form>
  );
}
