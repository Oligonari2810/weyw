import { getOptionalEnv } from "./utils";

export type WhatsAppConfig = {
  from?: string;
  token?: string;
};

export function getWhatsAppConfig(): WhatsAppConfig {
  return {
    from: getOptionalEnv("WHATSAPP_FROM"),
    token: getOptionalEnv("WHATSAPP_TOKEN"),
  };
}

export async function sendWhatsAppMessage(to: string, body: string) {
  // Placeholder: aquí integrarías Twilio/Meta API.
  return { ok: true, to, body };
}

