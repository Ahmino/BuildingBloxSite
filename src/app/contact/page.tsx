"use client";

import { PageShell, PageHeader } from "@/components/layout";
import { Card, Button } from "@/components/ui";
import { ContactForm } from "@/components/forms";
import useContactForm from "@/hooks/useContactForm";

const contactChannels = [
  {
    title: "Brand Partnerships",
    description: "Want to bring your brand into Roblox? We create custom in-game experiences for global brands.",
    email: "partnerships@buildingblox.gg",
  },
  {
    title: "Careers",
    description: "We\u2019re always looking for talented developers, artists, and creators to join our growing team.",
    email: "careers@buildingblox.gg",
  },
  {
    title: "General Inquiries",
    description: "For all other questions, reach out via the form or email us directly.",
    email: "hello@buildingblox.gg",
  },
];

export default function ContactPage() {
  const { form, errors, submitted, updateField, submit, reset } = useContactForm();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Info */}
          <div>
            <PageHeader
              title="Get in Touch"
              description="Interested in working with BuildingBlox? Whether you're a brand looking for a Roblox partnership, a developer wanting to join our team, or just want to say hello — we'd love to hear from you."
            />
            <div className="space-y-6">
              {contactChannels.map((ch) => (
                <Card key={ch.title}>
                  <h3 className="font-semibold">{ch.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">{ch.description}</p>
                  <p className="mt-2 text-sm text-brand-400">{ch.email}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <Card className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-2xl">
                  &#10003;
                </div>
                <h2 className="text-xl font-semibold">Message Sent</h2>
                <p className="mt-2 text-gray-400">
                  Thanks for reaching out! We&apos;ll get back to you within 24-48 hours.
                </p>
                <Button variant="secondary" onClick={reset} className="mt-6">
                  Send Another
                </Button>
              </Card>
            ) : (
              <ContactForm form={form} errors={errors} onUpdate={updateField} onSubmit={submit} />
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
