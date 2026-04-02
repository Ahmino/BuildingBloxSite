/* ─── Field Schema ───────────────────────────────────────── */

export type FieldType = "text" | "number" | "date" | "select" | "textarea" | "email";
export type FieldWidth = "half" | "full";

export interface ContractField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  hint?: string;
  width?: FieldWidth;
}

export type ContractCategory = "hiring" | "game" | "legal" | "financial";

export interface ContractConfig {
  id: string;
  label: string;
  description: string;
  icon: string;
  category: ContractCategory;
  fields: ContractField[];
}

export type ContractFormData = Record<string, string>;

/* ─── Contract Definitions ───────────────────────────────── */

export const CONTRACTS: ContractConfig[] = [
  /* ── Full-time Employment ──────────────────────────────── */
  {
    id: "fulltime",
    label: "Full-time Employment",
    description: "Permanent or fixed-term employment contract for full-time staff.",
    icon: "👔",
    category: "hiring",
    fields: [
      { key: "employeeFirstName", label: "Employee First Name", type: "text", placeholder: "Jane", required: true, width: "half" },
      { key: "employeeLastName", label: "Employee Last Name", type: "text", placeholder: "Doe", required: true, width: "half" },
      { key: "employeeEmail", label: "Employee Email", type: "email", placeholder: "jane@example.com", required: true, width: "half" },
      { key: "jobTitle", label: "Job Title", type: "text", placeholder: "Game Developer", required: true, width: "half" },
      { key: "department", label: "Department", type: "text", placeholder: "Development", width: "half" },
      { key: "managerName", label: "Reporting Manager", type: "text", placeholder: "John Smith", width: "half" },
      { key: "startDate", label: "Start Date", type: "date", required: true, width: "half" },
      { key: "annualSalary", label: "Annual Salary (USD)", type: "number", placeholder: "60000", required: true, width: "half" },
      { key: "hoursPerWeek", label: "Hours per Week", type: "number", placeholder: "40", required: true, width: "half" },
      { key: "probationMonths", label: "Probation Period (months)", type: "number", placeholder: "3", width: "half" },
      {
        key: "contractDuration", label: "Contract Duration", type: "select", required: true, width: "half",
        options: [
          { value: "permanent", label: "Permanent" },
          { value: "12months", label: "12 Months Fixed" },
          { value: "24months", label: "24 Months Fixed" },
          { value: "other", label: "Other (specify in notes)" },
        ],
      },
      { key: "benefits", label: "Benefits & Perks", type: "textarea", placeholder: "e.g. Health insurance, remote work, annual leave...", width: "full" },
      { key: "notes", label: "Additional Notes", type: "textarea", placeholder: "Any special terms or conditions...", width: "full" },
    ],
  },

  /* ── Part-time Employment ──────────────────────────────── */
  {
    id: "parttime",
    label: "Part-time Employment",
    description: "Employment contract for part-time or casual team members.",
    icon: "🕐",
    category: "hiring",
    fields: [
      { key: "employeeFirstName", label: "Employee First Name", type: "text", placeholder: "Jane", required: true, width: "half" },
      { key: "employeeLastName", label: "Employee Last Name", type: "text", placeholder: "Doe", required: true, width: "half" },
      { key: "employeeEmail", label: "Employee Email", type: "email", placeholder: "jane@example.com", required: true, width: "half" },
      { key: "jobTitle", label: "Job Title", type: "text", placeholder: "UI Designer", required: true, width: "half" },
      { key: "startDate", label: "Start Date", type: "date", required: true, width: "half" },
      { key: "endDate", label: "End Date (if fixed)", type: "date", width: "half" },
      { key: "hourlyRate", label: "Hourly Rate (USD)", type: "number", placeholder: "25", required: true, width: "half" },
      { key: "hoursPerWeek", label: "Hours per Week", type: "number", placeholder: "20", required: true, width: "half" },
      { key: "paymentSchedule", label: "Payment Schedule", type: "select", width: "half",
        options: [
          { value: "weekly", label: "Weekly" },
          { value: "biweekly", label: "Bi-weekly" },
          { value: "monthly", label: "Monthly" },
        ],
      },
      { key: "notes", label: "Additional Notes", type: "textarea", placeholder: "Any special terms...", width: "full" },
    ],
  },

  /* ── Freelancer Agreement ──────────────────────────────── */
  {
    id: "freelancer",
    label: "Freelancer Agreement",
    description: "Service agreement for independent contractors and freelancers.",
    icon: "💼",
    category: "hiring",
    fields: [
      { key: "freelancerName", label: "Freelancer Full Name", type: "text", placeholder: "Alex Johnson", required: true, width: "half" },
      { key: "freelancerEmail", label: "Freelancer Email", type: "email", placeholder: "alex@freelance.com", required: true, width: "half" },
      { key: "projectName", label: "Project / Engagement Name", type: "text", placeholder: "Game UI Redesign", required: true, width: "full" },
      { key: "serviceDescription", label: "Services to be Provided", type: "textarea", placeholder: "Describe the scope of work...", required: true, width: "full" },
      { key: "startDate", label: "Start Date", type: "date", required: true, width: "half" },
      { key: "deadline", label: "Deadline / End Date", type: "date", required: true, width: "half" },
      { key: "paymentAmount", label: "Total Payment (USD)", type: "number", placeholder: "5000", required: true, width: "half" },
      {
        key: "paymentStructure", label: "Payment Structure", type: "select", required: true, width: "half",
        options: [
          { value: "fixed", label: "Fixed Price" },
          { value: "milestone", label: "Milestone-based" },
          { value: "hourly", label: "Hourly Rate" },
        ],
      },
      { key: "hourlyRate", label: "Hourly Rate (if applicable, USD)", type: "number", placeholder: "50", width: "half" },
      { key: "revisions", label: "Number of Revisions Included", type: "number", placeholder: "2", width: "half" },
      {
        key: "ipOwnership", label: "Intellectual Property Ownership", type: "select", required: true, width: "full",
        options: [
          { value: "client", label: "All IP transfers to BuildingBlox upon payment" },
          { value: "freelancer", label: "Freelancer retains IP, grants license" },
          { value: "shared", label: "Shared ownership" },
        ],
      },
      { key: "notes", label: "Additional Terms", type: "textarea", placeholder: "Any additional terms or deliverables...", width: "full" },
    ],
  },

  /* ── NDA ───────────────────────────────────────────────── */
  {
    id: "nda",
    label: "NDA / Confidentiality",
    description: "Non-disclosure agreement to protect proprietary information.",
    icon: "🔒",
    category: "legal",
    fields: [
      { key: "receivingParty", label: "Receiving Party Name", type: "text", placeholder: "Jane Doe / XYZ Company", required: true, width: "half" },
      { key: "receivingPartyEmail", label: "Receiving Party Email", type: "email", placeholder: "contact@company.com", width: "half" },
      { key: "effectiveDate", label: "Effective Date", type: "date", required: true, width: "half" },
      { key: "durationYears", label: "Confidentiality Duration (years)", type: "number", placeholder: "2", required: true, width: "half" },
      {
        key: "ndaType", label: "NDA Type", type: "select", required: true, width: "half",
        options: [
          { value: "unilateral", label: "Unilateral (one-way)" },
          { value: "mutual", label: "Mutual (two-way)" },
        ],
      },
      { key: "purpose", label: "Purpose of Disclosure", type: "text", placeholder: "e.g. Evaluating a potential game acquisition", required: true, width: "full" },
      { key: "confidentialInfo", label: "Description of Confidential Information", type: "textarea", placeholder: "e.g. Source code, financial data, game mechanics, roadmap...", required: true, width: "full" },
      { key: "notes", label: "Additional Clauses", type: "textarea", placeholder: "Any additional restrictions or terms...", width: "full" },
    ],
  },

  /* ── Buy a Game ────────────────────────────────────────── */
  {
    id: "buy-game",
    label: "Game Acquisition",
    description: "Agreement for purchasing and acquiring a Roblox game.",
    icon: "🎮",
    category: "game",
    fields: [
      { key: "gameName", label: "Game Name", type: "text", placeholder: "Epic Adventure", required: true, width: "half" },
      { key: "gamePlaceId", label: "Roblox Place ID", type: "text", placeholder: "1234567890", width: "half" },
      { key: "sellerName", label: "Seller Full Name / Company", type: "text", placeholder: "John Smith", required: true, width: "half" },
      { key: "sellerEmail", label: "Seller Email", type: "email", placeholder: "seller@example.com", width: "half" },
      { key: "purchasePrice", label: "Purchase Price (USD)", type: "number", placeholder: "10000", required: true, width: "half" },
      {
        key: "paymentMethod", label: "Payment Method", type: "select", required: true, width: "half",
        options: [
          { value: "bank-transfer", label: "Bank Transfer" },
          { value: "crypto", label: "Cryptocurrency" },
          { value: "robux", label: "Robux" },
          { value: "installments", label: "Installment Plan" },
        ],
      },
      { key: "transferDate", label: "Transfer / Handover Date", type: "date", required: true, width: "half" },
      { key: "depositAmount", label: "Deposit Amount (USD)", type: "number", placeholder: "2000", width: "half" },
      { key: "assetsIncluded", label: "Assets Included in Sale", type: "textarea", placeholder: "e.g. Full game source code, all assets, group ownership, social media accounts...", required: true, width: "full" },
      { key: "warranties", label: "Seller Warranties", type: "textarea", placeholder: "e.g. Seller warrants full ownership, no outstanding debts...", width: "full" },
      { key: "notes", label: "Additional Terms", type: "textarea", placeholder: "Post-sale support, transition period, etc.", width: "full" },
    ],
  },

  /* ── Sell a Game ───────────────────────────────────────── */
  {
    id: "sell-game",
    label: "Game Sale",
    description: "Agreement for selling and transferring a Roblox game.",
    icon: "💰",
    category: "game",
    fields: [
      { key: "gameName", label: "Game Name", type: "text", placeholder: "Epic Adventure", required: true, width: "half" },
      { key: "gamePlaceId", label: "Roblox Place ID", type: "text", placeholder: "1234567890", width: "half" },
      { key: "buyerName", label: "Buyer Full Name / Company", type: "text", placeholder: "Acme Games Ltd", required: true, width: "half" },
      { key: "buyerEmail", label: "Buyer Email", type: "email", placeholder: "buyer@example.com", width: "half" },
      { key: "salePrice", label: "Sale Price (USD)", type: "number", placeholder: "15000", required: true, width: "half" },
      {
        key: "paymentMethod", label: "Payment Method", type: "select", required: true, width: "half",
        options: [
          { value: "bank-transfer", label: "Bank Transfer" },
          { value: "crypto", label: "Cryptocurrency" },
          { value: "robux", label: "Robux" },
          { value: "installments", label: "Installment Plan" },
        ],
      },
      { key: "transferDate", label: "Transfer / Handover Date", type: "date", required: true, width: "half" },
      { key: "supportDays", label: "Post-Sale Support (days)", type: "number", placeholder: "30", width: "half" },
      { key: "assetsTransferred", label: "Assets Being Transferred", type: "textarea", placeholder: "e.g. Full source code, all game assets, group admin, social media...", required: true, width: "full" },
      { key: "restrictions", label: "Post-Sale Restrictions", type: "textarea", placeholder: "e.g. BuildingBlox may not create a competing game for 12 months...", width: "full" },
      { key: "notes", label: "Additional Terms", type: "textarea", width: "full" },
    ],
  },

  /* ── Revenue Share ─────────────────────────────────────── */
  {
    id: "revenue-share",
    label: "Revenue Share",
    description: "Revenue sharing agreement between BuildingBlox and a partner.",
    icon: "📊",
    category: "financial",
    fields: [
      { key: "partnerName", label: "Partner Full Name / Company", type: "text", placeholder: "Creator Co.", required: true, width: "half" },
      { key: "partnerEmail", label: "Partner Email", type: "email", placeholder: "partner@example.com", width: "half" },
      { key: "gameName", label: "Game Name", type: "text", placeholder: "Epic Adventure", required: true, width: "half" },
      { key: "gamePlaceId", label: "Roblox Place ID", type: "text", placeholder: "1234567890", width: "half" },
      { key: "startDate", label: "Agreement Start Date", type: "date", required: true, width: "half" },
      { key: "endDate", label: "End Date (or ongoing)", type: "date", width: "half" },
      { key: "buildingBloxShare", label: "BuildingBlox Revenue Share (%)", type: "number", placeholder: "60", required: true, width: "half" },
      { key: "partnerShare", label: "Partner Revenue Share (%)", type: "number", placeholder: "40", required: true, width: "half" },
      {
        key: "paymentSchedule", label: "Payment Schedule", type: "select", required: true, width: "half",
        options: [
          { value: "monthly", label: "Monthly" },
          { value: "quarterly", label: "Quarterly" },
          { value: "biannual", label: "Bi-annual" },
        ],
      },
      { key: "minimumThreshold", label: "Minimum Payout Threshold (USD)", type: "number", placeholder: "100", width: "half" },
      { key: "partnerRole", label: "Partner's Role / Contribution", type: "textarea", placeholder: "e.g. Lead developer, manages updates, community management...", required: true, width: "full" },
      { key: "notes", label: "Additional Terms", type: "textarea", placeholder: "Dispute resolution, audit rights, termination conditions...", width: "full" },
    ],
  },
];

export const CATEGORY_LABELS: Record<ContractCategory, string> = {
  hiring: "Hiring",
  game: "Game Deals",
  legal: "Legal",
  financial: "Financial",
};
