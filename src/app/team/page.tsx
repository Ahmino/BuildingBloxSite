"use client";

import { PageShell, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui";
import { teamMembers } from "@/data/team";

const avatarColors = [
  "bg-brand-600",
  "bg-purple-600",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
];

export default function TeamPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <PageHeader
          title="Our Team"
          description="Meet the talented people behind BuildingBlox. Our leadership team brings together years of Roblox development experience, creative vision, and business expertise."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, i) => (
            <Card key={member.name}>
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColors[i % avatarColors.length]}`}
                >
                  {member.avatar}
                </div>
                <div>
                  <h2 className="font-semibold">{member.name}</h2>
                  <p className="text-sm text-brand-400">{member.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">{member.bio}</p>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
