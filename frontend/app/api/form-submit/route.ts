/**
 * app/api/form-submit/route.ts
 *
 * Handles form submissions from FormBlock.
 *
 * Flow:
 *  1. Rate limit by IP — 5 submissions per minute per IP
 *  2. Parse and validate request body
 *  3. Fetch form submission config from Sanity by formId
 *  4. Server-side validate required fields
 *  5. Send email via nodemailer and/or POST to webhook
 *  6. Return { success, message }
 *
 * Environment variables required:
 *   SMTP_HOST        — e.g. smtp.gmail.com
 *   SMTP_PORT        — e.g. 587
 *   SMTP_USER        — your SMTP username/email
 *   SMTP_PASS        — your SMTP password or app password
 *   SMTP_FROM        — From address (e.g. "Forms <noreply@yourdomain.com>")
 */

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { sanityClient } from "@/sanity/client";
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";

// ─── Sanity query ─────────────────────────────────────────────────────────────

// Fetch form config directly from page builder sections
const formConfigFromPageQuery = `
  *[_type in ["page", "blog"]] {
    "match": pageBuilder[_type == "formBlock" && _key == $formId][0] {
      submissionType,
      emailTo,
      emailSubject,
      replyTo,
      webhookUrl,
      webhookSecret,
      "successRedirectSlug": successRedirect->slug.current,
      steps[]{
        fields[]{
          name { current },
          label,
          required,
          fieldType
        }
      }
    }
  }[match != null][0].match
`;

type FieldConfig = {
  name: { current: string };
  label?: string;
  required?: boolean;
  fieldType: string;
};

type FormConfig = {
  submissionType: "email" | "webhook" | "both";
  emailTo?: string;
  emailSubject?: string;
  replyTo?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  successRedirectSlug?: string;
  steps: { fields: FieldConfig[] }[];
};

// ─── Email helpers ────────────────────────────────────────────────────────────

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function buildEmailHtml(
  data: Record<string, unknown>,
  fields: FieldConfig[],
): string {
  const rows = fields
    .filter((f) => f.fieldType !== "hidden")
    .map((f) => {
      const name = f.name.current;
      const label = f.label || name;
      const value = data[name];
      const display = Array.isArray(value)
        ? value.join(", ")
        : value instanceof Date
          ? value.toLocaleDateString()
          : String(value ?? "—");

      return `
        <tr>
          <td style="padding:8px 12px;font-weight:600;background:#f5f5f5;border:1px solid #e0e0e0;white-space:nowrap">
            ${label}
          </td>
          <td style="padding:8px 12px;border:1px solid #e0e0e0">
            ${display}
          </td>
        </tr>`;
    })
    .join("");

  return `
    <html>
      <body style="font-family:sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="margin-bottom:16px">New Form Submission</h2>
        <table style="width:100%;border-collapse:collapse">
          ${rows}
        </table>
      </body>
    </html>`;
}

// ─── Server-side validation ───────────────────────────────────────────────────

function serverValidate(
  fields: FieldConfig[],
  data: Record<string, unknown>,
): string | null {
  for (const field of fields) {
    if (!field.required) continue;
    const val = data[field.name.current];
    if (val === null || val === undefined || val === "") {
      return `${field.label || field.name.current} is required`;
    }
    if (Array.isArray(val) && val.length === 0) {
      return `${field.label || field.name.current} is required`;
    }
  }
  return null;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Rate limit ──────────────────────────────────────────────────────────
  const { allowed, retryAfter } = rateLimit(req, {
    max: 5,
    windowMs: 60_000,
    prefix: "form-submit",
  });
  if (!allowed) return rateLimitResponse(retryAfter);

  // ── Parse body ──────────────────────────────────────────────────────────
  let body: { formId: string; data: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }

  const { formId, data } = body;
  if (!formId || typeof formId !== "string") {
    return NextResponse.json(
      { success: false, message: "Missing formId" },
      { status: 400 },
    );
  }

  // ── Fetch form config from Sanity ───────────────────────────────────────
  let config: FormConfig | null = null;
  try {
    config = await sanityClient.fetch(formConfigFromPageQuery, { formId });
  } catch (err) {
    console.error("[form-submit] Failed to fetch form config:", err);
  }

  if (!config) {
    return NextResponse.json(
      { success: false, message: "Form configuration not found" },
      { status: 404 },
    );
  }

  // ── Server-side validation ──────────────────────────────────────────────
  const allFields = config.steps.flatMap((s) => s.fields);
  const validationError = serverValidate(allFields, data);
  if (validationError) {
    return NextResponse.json(
      { success: false, message: validationError },
      { status: 422 },
    );
  }

  // ── Send email ──────────────────────────────────────────────────────────
  if (config.submissionType === "email" || config.submissionType === "both") {
    if (!config.emailTo) {
      console.error("[form-submit] emailTo is not configured");
    } else {
      try {
        const transporter = createTransporter();
        const replyToValue =
          config.replyTo && typeof data[config.replyTo] === "string"
            ? (data[config.replyTo] as string)
            : undefined;

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: config.emailTo,
          subject: config.emailSubject ?? "New form submission",
          html: buildEmailHtml(data, allFields),
          ...(replyToValue && { replyTo: replyToValue }),
        });
      } catch (err) {
        console.error("[form-submit] Failed to send email:", err);
        if (config.submissionType === "email") {
          return NextResponse.json(
            {
              success: false,
              message: "Failed to send email. Please try again.",
            },
            { status: 500 },
          );
        }
      }
    }
  }

  // ── Send webhook ────────────────────────────────────────────────────────
  if (config.submissionType === "webhook" || config.submissionType === "both") {
    if (!config.webhookUrl) {
      console.error("[form-submit] webhookUrl is not configured");
    } else {
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (config.webhookSecret) {
          headers["X-Webhook-Secret"] = config.webhookSecret;
        }

        const webhookRes = await fetch(config.webhookUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({ formId, data }),
        });

        if (!webhookRes.ok) {
          throw new Error(`Webhook responded with ${webhookRes.status}`);
        }
      } catch (err) {
        console.error("[form-submit] Webhook failed:", err);
        if (config.submissionType === "webhook") {
          return NextResponse.json(
            { success: false, message: "Failed to submit. Please try again." },
            { status: 500 },
          );
        }
      }
    }
  }

  return NextResponse.json({
    success: true,
    redirectSlug: config.successRedirectSlug ?? null,
  });
}
