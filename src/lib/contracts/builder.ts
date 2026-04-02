import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  PageBreak,
  HorizontalPositionAlign,
  PageNumber,
  Footer,
  Header,
} from "docx";
import type { ContractFormData } from "./types";

/* ─── Shared Helpers ─────────────────────────────────────── */

const FONT = "Calibri";
const BODY_SIZE = 22; // 11pt in half-points
const SMALL_SIZE = 18; // 9pt
const COMPANY = "BuildingBlox Studio";
const TODAY = () =>
  new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function h1(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, font: FONT, size: 32, color: "1E3A5F" })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 300 },
  });
}

function h2(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, font: FONT, size: 24, color: "1E3A5F" })],
    spacing: { before: 360, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "C5D8F0", space: 4 },
    },
  });
}

function p(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: BODY_SIZE })],
    spacing: { after: 160 },
  });
}

function bold(text: string): TextRun {
  return new TextRun({ text, bold: true, font: FONT, size: BODY_SIZE });
}

function normal(text: string): TextRun {
  return new TextRun({ text, font: FONT, size: BODY_SIZE });
}

function fieldLine(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [bold(`${label}: `), normal(value || "___________________________")],
    spacing: { after: 120 },
  });
}

function numbered(n: number, text: string): Paragraph {
  return new Paragraph({
    children: [bold(`${n}.  `), normal(text)],
    spacing: { after: 160 },
    indent: { left: 360 },
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    children: [normal(text)],
    bullet: { level: 0 },
    spacing: { after: 100 },
  });
}

function spacer(): Paragraph {
  return new Paragraph({ text: "", spacing: { after: 200 } });
}

function divider(): Paragraph {
  return new Paragraph({
    text: "",
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0", space: 4 } },
    spacing: { before: 200, after: 200 },
  });
}

function signatureBlock(
  party1Label: string,
  party1Name: string,
  party2Label: string,
  party2Name: string,
): Paragraph[] {
  const sigRow = (label: string, name: string) =>
    new Paragraph({
      children: [
        bold(`${label}: `),
        normal("\t"),
        new TextRun({ text: name, font: FONT, size: BODY_SIZE, underline: {} }),
      ],
      spacing: { before: 200, after: 80 },
    });

  const sigLine = () =>
    new Paragraph({
      children: [
        normal("Signature: ____________________________    "),
        normal("Date: _____________________"),
      ],
      spacing: { after: 80 },
    });

  return [
    h2("Signatures"),
    p("By signing below, both parties agree to be bound by the terms of this Agreement."),
    spacer(),
    sigRow(party1Label, party1Name),
    sigLine(),
    spacer(),
    sigRow(party2Label, party2Name),
    sigLine(),
  ];
}

function companyHeader(contractTitle: string): Paragraph[] {
  return [
    new Paragraph({
      children: [new TextRun({ text: COMPANY, bold: true, font: FONT, size: 36, color: "1E3A5F" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Roblox Game Development Studio", font: FONT, size: 20, color: "6B7280" }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),
    divider(),
    h1(contractTitle),
    fieldLine("Date Issued", TODAY()),
    spacer(),
  ];
}

/* ─── Templates ──────────────────────────────────────────── */

function buildFulltime(d: ContractFormData): Paragraph[] {
  const employeeName = `${d.employeeFirstName ?? ""} ${d.employeeLastName ?? ""}`.trim();
  const salary = d.annualSalary ? `$${Number(d.annualSalary).toLocaleString()} USD` : "___________";
  const duration =
    d.contractDuration === "permanent"
      ? "permanent (no fixed end date)"
      : d.contractDuration === "12months"
        ? "12 months fixed term"
        : d.contractDuration === "24months"
          ? "24 months fixed term"
          : d.contractDuration ?? "as agreed";

  return [
    ...companyHeader("FULL-TIME EMPLOYMENT AGREEMENT"),

    h2("Parties"),
    fieldLine("Employer", COMPANY),
    fieldLine("Employee", employeeName),
    fieldLine("Employee Email", d.employeeEmail ?? ""),

    h2("Position"),
    fieldLine("Job Title", d.jobTitle ?? ""),
    fieldLine("Department", d.department ?? ""),
    fieldLine("Reporting To", d.managerName ?? ""),
    fieldLine("Start Date", d.startDate ?? ""),
    fieldLine("Contract Duration", duration),
    ...(d.probationMonths
      ? [fieldLine("Probationary Period", `${d.probationMonths} months`)]
      : []),

    h2("Remuneration"),
    fieldLine("Annual Salary", salary),
    fieldLine("Hours per Week", d.hoursPerWeek ? `${d.hoursPerWeek} hours` : ""),
    p("Salary will be paid monthly via bank transfer to the Employee's nominated account. Payment is subject to applicable tax withholdings."),

    ...(d.benefits
      ? [h2("Benefits & Perks"), p(d.benefits)]
      : []),

    h2("Terms & Conditions"),
    numbered(1, "The Employee agrees to devote their full working time and attention to the duties assigned by the Company."),
    numbered(2, "The Employee shall not, during the term of this Agreement, engage in any competing business activities without prior written consent from the Employer."),
    numbered(3, `Any intellectual property created by the Employee during the course of employment is the exclusive property of ${COMPANY}.`),
    numbered(4, "Either party may terminate this Agreement by providing four (4) weeks written notice, or immediate termination for cause."),
    numbered(5, "The Employee agrees to maintain the confidentiality of all proprietary business information both during and after employment."),
    numbered(6, "This Agreement is governed by and construed in accordance with applicable law."),

    ...(d.notes ? [h2("Additional Notes"), p(d.notes)] : []),

    ...signatureBlock("Employer (BuildingBlox)", COMPANY, "Employee", employeeName),
  ];
}

function buildParttime(d: ContractFormData): Paragraph[] {
  const employeeName = `${d.employeeFirstName ?? ""} ${d.employeeLastName ?? ""}`.trim();
  const rate = d.hourlyRate ? `$${d.hourlyRate} USD/hour` : "___________";

  return [
    ...companyHeader("PART-TIME EMPLOYMENT AGREEMENT"),

    h2("Parties"),
    fieldLine("Employer", COMPANY),
    fieldLine("Employee", employeeName),
    fieldLine("Employee Email", d.employeeEmail ?? ""),

    h2("Position"),
    fieldLine("Job Title", d.jobTitle ?? ""),
    fieldLine("Start Date", d.startDate ?? ""),
    ...(d.endDate ? [fieldLine("End Date", d.endDate)] : []),
    fieldLine("Hours per Week", d.hoursPerWeek ? `${d.hoursPerWeek} hours` : ""),

    h2("Remuneration"),
    fieldLine("Hourly Rate", rate),
    fieldLine("Payment Schedule", d.paymentSchedule ?? "Monthly"),
    p("Hours worked will be tracked and invoiced as agreed. Payment will be made within 7 business days of invoice approval."),

    h2("Terms & Conditions"),
    numbered(1, "This is a part-time employment arrangement and does not guarantee a minimum number of hours beyond those agreed per week."),
    numbered(2, `Any intellectual property created during work hours is the exclusive property of ${COMPANY}.`),
    numbered(3, "Either party may terminate this Agreement with two (2) weeks written notice."),
    numbered(4, "The Employee agrees to maintain confidentiality of all proprietary business information."),
    numbered(5, "This Agreement does not constitute a full-time or permanent employment offer."),

    ...(d.notes ? [h2("Additional Notes"), p(d.notes)] : []),

    ...signatureBlock("Employer (BuildingBlox)", COMPANY, "Employee", employeeName),
  ];
}

function buildFreelancer(d: ContractFormData): Paragraph[] {
  const ipMap: Record<string, string> = {
    client: `All intellectual property created under this Agreement transfers exclusively to ${COMPANY} upon full payment.`,
    freelancer: "The Freelancer retains all intellectual property rights and grants the Client a perpetual, royalty-free license to use the deliverables.",
    shared: "Intellectual property rights are jointly owned by both parties as agreed.",
  };

  return [
    ...companyHeader("FREELANCER SERVICE AGREEMENT"),

    h2("Parties"),
    fieldLine("Client", COMPANY),
    fieldLine("Freelancer", d.freelancerName ?? ""),
    fieldLine("Freelancer Email", d.freelancerEmail ?? ""),

    h2("Engagement"),
    fieldLine("Project Name", d.projectName ?? ""),
    fieldLine("Start Date", d.startDate ?? ""),
    fieldLine("Deadline", d.deadline ?? ""),

    h2("Scope of Work"),
    p(d.serviceDescription ?? "As described and agreed between both parties."),
    ...(d.revisions ? [fieldLine("Revisions Included", d.revisions)] : []),

    h2("Payment"),
    fieldLine(
      "Total Fee",
      d.paymentAmount ? `$${Number(d.paymentAmount).toLocaleString()} USD` : "___________",
    ),
    fieldLine("Payment Structure", d.paymentStructure ?? ""),
    ...(d.hourlyRate ? [fieldLine("Hourly Rate", `$${d.hourlyRate} USD/hour`)] : []),
    p("Payment will be made within 5 business days of delivery and approval of final deliverables."),

    h2("Intellectual Property"),
    p(ipMap[d.ipOwnership] ?? ipMap.client),

    h2("Terms & Conditions"),
    numbered(1, "The Freelancer is an independent contractor and is not an employee of the Client."),
    numbered(2, "The Freelancer shall maintain confidentiality of all project-related information and not disclose it to third parties."),
    numbered(3, "The Client reserves the right to terminate this Agreement with 7 days written notice. Work completed to that date will be compensated."),
    numbered(4, "The Freelancer warrants that all deliverables are original work and do not infringe any third-party rights."),
    numbered(5, "Disputes will be resolved through good-faith negotiation before any formal legal proceedings."),

    ...(d.notes ? [h2("Additional Terms"), p(d.notes)] : []),

    ...signatureBlock("Client (BuildingBlox)", COMPANY, "Freelancer", d.freelancerName ?? ""),
  ];
}

function buildNda(d: ContractFormData): Paragraph[] {
  const isMutual = d.ndaType === "mutual";
  const duration = d.durationYears ? `${d.durationYears} year(s)` : "two (2) years";

  return [
    ...companyHeader("NON-DISCLOSURE AGREEMENT"),

    h2("Parties"),
    fieldLine(isMutual ? "Party A (Disclosing)" : "Disclosing Party", COMPANY),
    fieldLine(isMutual ? "Party B (Disclosing)" : "Receiving Party", d.receivingParty ?? ""),
    fieldLine("Contact Email", d.receivingPartyEmail ?? ""),
    fieldLine("Effective Date", d.effectiveDate ?? TODAY()),
    fieldLine("Agreement Type", isMutual ? "Mutual (both parties)" : "Unilateral (one-way)"),

    h2("Purpose"),
    p(d.purpose ?? "The parties wish to explore a potential business relationship and may disclose confidential information to each other for that purpose."),

    h2("Confidential Information"),
    p("For the purposes of this Agreement, 'Confidential Information' includes, but is not limited to:"),
    p(d.confidentialInfo ?? "Trade secrets, financial data, game concepts, source code, designs, roadmaps, and any other non-public business information."),

    h2("Obligations"),
    numbered(1, "The Receiving Party agrees to keep all Confidential Information strictly confidential and not to disclose it to any third party without prior written consent."),
    numbered(2, "The Receiving Party shall use the Confidential Information solely for the purpose stated above."),
    numbered(3, "The Receiving Party shall protect the Confidential Information with at least the same degree of care used to protect its own confidential information, but no less than reasonable care."),
    numbered(4, `These obligations remain in effect for a period of ${duration} from the Effective Date.`),
    numbered(5, "These obligations do not apply to information that: (a) is or becomes publicly known through no breach of this Agreement, (b) was already known to the Receiving Party, or (c) is independently developed without use of the Confidential Information."),

    h2("Return of Information"),
    p("Upon request or termination of discussions, the Receiving Party shall promptly return or destroy all Confidential Information and any copies thereof."),

    h2("Remedies"),
    p("The parties acknowledge that breach of this Agreement may cause irreparable harm, and the Disclosing Party shall be entitled to seek injunctive relief in addition to all other available remedies."),

    ...(d.notes ? [h2("Additional Clauses"), p(d.notes)] : []),

    ...signatureBlock("Disclosing Party", COMPANY, "Receiving Party", d.receivingParty ?? ""),
  ];
}

function buildBuyGame(d: ContractFormData): Paragraph[] {
  const price = d.purchasePrice ? `$${Number(d.purchasePrice).toLocaleString()} USD` : "___________";
  const deposit = d.depositAmount ? `$${Number(d.depositAmount).toLocaleString()} USD` : "nil";

  return [
    ...companyHeader("GAME ACQUISITION AGREEMENT"),

    h2("Parties"),
    fieldLine("Buyer", COMPANY),
    fieldLine("Seller", d.sellerName ?? ""),
    fieldLine("Seller Email", d.sellerEmail ?? ""),

    h2("Game Details"),
    fieldLine("Game Name", d.gameName ?? ""),
    ...(d.gamePlaceId ? [fieldLine("Roblox Place ID", d.gamePlaceId)] : []),
    fieldLine("Transfer Date", d.transferDate ?? ""),

    h2("Purchase Price & Payment"),
    fieldLine("Total Purchase Price", price),
    fieldLine("Deposit Payable on Signing", deposit),
    fieldLine("Payment Method", d.paymentMethod ?? ""),
    p("The remaining balance shall be paid upon successful transfer of all assets listed below, verified by Buyer."),

    h2("Assets Included"),
    p(d.assetsIncluded ?? "Full game ownership including source code, assets, and Roblox group transfer."),

    h2("Seller Warranties"),
    p(d.warranties ?? "The Seller warrants that: (a) they are the sole owner of the game with full rights to sell, (b) there are no outstanding debts, obligations, or third-party claims on the game, and (c) all provided information is accurate."),

    h2("Transfer Process"),
    numbered(1, "Seller shall initiate transfer of all game assets and Roblox group ownership to Buyer on the Transfer Date."),
    numbered(2, "Buyer shall have 48 hours to verify receipt and completeness of all assets."),
    numbered(3, "Final payment will be released upon Buyer's written confirmation of successful transfer."),
    numbered(4, "Seller shall provide reasonable assistance during the transition period (up to 14 days)."),

    h2("Post-Transfer"),
    numbered(1, "Seller shall not recreate, copy, or release any materially similar game for a period of 12 months after Transfer Date."),
    numbered(2, "Seller relinquishes all claims, rights, and interest in the game upon full payment."),

    ...(d.notes ? [h2("Additional Terms"), p(d.notes)] : []),

    ...signatureBlock("Buyer (BuildingBlox)", COMPANY, "Seller", d.sellerName ?? ""),
  ];
}

function buildSellGame(d: ContractFormData): Paragraph[] {
  const price = d.salePrice ? `$${Number(d.salePrice).toLocaleString()} USD` : "___________";
  const support = d.supportDays ? `${d.supportDays} days` : "30 days";

  return [
    ...companyHeader("GAME SALE AGREEMENT"),

    h2("Parties"),
    fieldLine("Seller", COMPANY),
    fieldLine("Buyer", d.buyerName ?? ""),
    fieldLine("Buyer Email", d.buyerEmail ?? ""),

    h2("Game Details"),
    fieldLine("Game Name", d.gameName ?? ""),
    ...(d.gamePlaceId ? [fieldLine("Roblox Place ID", d.gamePlaceId)] : []),
    fieldLine("Transfer Date", d.transferDate ?? ""),

    h2("Sale Price & Payment"),
    fieldLine("Total Sale Price", price),
    fieldLine("Payment Method", d.paymentMethod ?? ""),
    p("Full payment must be received by the Seller before transfer of any assets. Installment terms (if applicable) are detailed in the Additional Terms section."),

    h2("Assets Being Transferred"),
    p(d.assetsTransferred ?? "All game files, assets, Roblox group ownership, and associated accounts as agreed."),

    h2("Seller Warranties"),
    p(`${COMPANY} warrants that: (a) it is the rightful owner of the game with full authority to sell, (b) the game is free from any outstanding debts or third-party claims, and (c) all information provided is accurate to the best of its knowledge.`),

    h2("Post-Sale"),
    fieldLine("Post-Sale Support Period", support),
    p("During the support period, the Seller will provide reasonable assistance to help the Buyer understand and operate the game."),
    ...(d.restrictions ? [p(d.restrictions)] : []),
    numbered(1, "Upon full payment, Seller transfers all ownership rights, title, and interest in the game to Buyer."),
    numbered(2, "Seller shall have no further claim or interest in the game following completed transfer."),
    numbered(3, "Buyer accepts the game in its current state and acknowledges they have had the opportunity to review it prior to purchase."),

    ...(d.notes ? [h2("Additional Terms"), p(d.notes)] : []),

    ...signatureBlock("Seller (BuildingBlox)", COMPANY, "Buyer", d.buyerName ?? ""),
  ];
}

function buildRevenueShare(d: ContractFormData): Paragraph[] {
  const bbShare = d.buildingBloxShare ? `${d.buildingBloxShare}%` : "____%";
  const partnerShare = d.partnerShare ? `${d.partnerShare}%` : "____%";
  const threshold = d.minimumThreshold
    ? `$${Number(d.minimumThreshold).toLocaleString()} USD`
    : "$100 USD";

  return [
    ...companyHeader("REVENUE SHARE AGREEMENT"),

    h2("Parties"),
    fieldLine("Studio", COMPANY),
    fieldLine("Partner", d.partnerName ?? ""),
    fieldLine("Partner Email", d.partnerEmail ?? ""),

    h2("Game"),
    fieldLine("Game Name", d.gameName ?? ""),
    ...(d.gamePlaceId ? [fieldLine("Roblox Place ID", d.gamePlaceId)] : []),
    fieldLine("Agreement Start Date", d.startDate ?? ""),
    ...(d.endDate ? [fieldLine("End Date", d.endDate)] : [p("This Agreement continues until terminated by either party with 30 days written notice.")]),

    h2("Partner's Role"),
    p(d.partnerRole ?? "The Partner's specific responsibilities and contributions are as agreed between both parties."),

    h2("Revenue Split"),
    fieldLine(`${COMPANY} Share`, bbShare),
    fieldLine("Partner Share", partnerShare),
    p("Revenue is calculated as net revenue received from Roblox after platform fees and applicable taxes. The total split must equal 100%."),

    h2("Payment Terms"),
    fieldLine("Payment Schedule", d.paymentSchedule ?? "Monthly"),
    fieldLine("Minimum Payout Threshold", threshold),
    p("Payments will be made within 15 business days following the end of each payment period. A detailed earnings report will accompany each payment."),
    p("Revenue below the minimum threshold will be carried forward to the next payment period."),

    h2("Audit Rights"),
    p("Each party has the right to request an earnings audit once per calendar year. The auditing party shall bear the cost of any such audit unless significant discrepancies are found."),

    h2("Terms & Conditions"),
    numbered(1, "This Agreement does not constitute an employment relationship. The Partner is an independent collaborator."),
    numbered(2, "Either party may terminate this Agreement with 30 days written notice. Revenue accrued up to the termination date will be paid in the following payment cycle."),
    numbered(3, "Any disputes regarding revenue calculations will be resolved through good-faith negotiation within 30 days before escalation."),
    numbered(4, "This Agreement is personal to the parties and may not be assigned without prior written consent."),

    ...(d.notes ? [h2("Additional Terms"), p(d.notes)] : []),

    ...signatureBlock(COMPANY, COMPANY, "Partner", d.partnerName ?? ""),
  ];
}

/* ─── Template Registry ──────────────────────────────────── */

const TEMPLATES: Record<string, (d: ContractFormData) => Paragraph[]> = {
  fulltime: buildFulltime,
  parttime: buildParttime,
  freelancer: buildFreelancer,
  nda: buildNda,
  "buy-game": buildBuyGame,
  "sell-game": buildSellGame,
  "revenue-share": buildRevenueShare,
};

/* ─── Public API ─────────────────────────────────────────── */

export function buildDocument(contractId: string, data: ContractFormData): Document {
  const template = TEMPLATES[contractId];
  const children: Paragraph[] = template
    ? template(data)
    : [
        ...companyHeader("CONTRACT"),
        p("This contract has been generated by BuildingBlox Studio."),
      ];

  return new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: BODY_SIZE, color: "374151" },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `${COMPANY} — Confidential Document`, font: FONT, size: SMALL_SIZE, color: "9CA3AF" }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children,
      },
    ],
  });
}
