import { getOptionalEnv } from "./utils";

export type EmailConfig = {
  from?: string;
  provider?: string;
};

export function getEmailConfig(): EmailConfig {
  return {
    from: getOptionalEnv("EMAIL_FROM"),
    provider: getOptionalEnv("EMAIL_PROVIDER"),
  };
}

export async function sendEmail(to: string, subject: string, html: string) {
  // Placeholder: aquí integrarías SendGrid/Resend/SES, etc.
  return { ok: true, to, subject, htmlLength: html.length };
}

