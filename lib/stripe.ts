import { getOptionalEnv } from "./utils";

export type StripeConfig = {
  secretKey?: string;
  webhookSecret?: string;
};

export function getStripeConfig(): StripeConfig {
  return {
    secretKey: getOptionalEnv("STRIPE_SECRET_KEY"),
    webhookSecret: getOptionalEnv("STRIPE_WEBHOOK_SECRET"),
  };
}

