import { NextRequest } from "next/server";
import { Packer } from "docx";
import { buildDocument } from "@/lib/contracts/builder";
import { CONTRACTS } from "@/lib/contracts/types";
import type { ContractFormData } from "@/lib/contracts/types";

export async function POST(request: NextRequest) {
  let body: { contractId: string; data: ContractFormData };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  const { contractId, data } = body;

  if (!contractId || !data) {
    return new Response(JSON.stringify({ error: "contractId and data are required" }), { status: 400 });
  }

  const config = CONTRACTS.find((c) => c.id === contractId);
  if (!config) {
    return new Response(JSON.stringify({ error: `Unknown contract type: ${contractId}` }), {
      status: 400,
    });
  }

  // Validate required fields
  const missing = config.fields
    .filter((f) => f.required && !data[f.key]?.trim())
    .map((f) => f.label);

  if (missing.length > 0) {
    return new Response(
      JSON.stringify({ error: `Missing required fields: ${missing.join(", ")}` }),
      { status: 422 },
    );
  }

  try {
    const doc = buildDocument(contractId, data);
    const buffer = await Packer.toBuffer(doc);

    const fileName = `${config.label.replace(/\s+/g, "-").toLowerCase()}-contract.docx`;

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[contracts/generate]", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate document. Please try again." }),
      { status: 500 },
    );
  }
}
