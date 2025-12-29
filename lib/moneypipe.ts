import { getOptionalEnv } from "./utils";

export type MoneyPipeConfig = {
  apiKey?: string;
  baseUrl?: string;
};

export function getMoneyPipeConfig(): MoneyPipeConfig {
  return {
    apiKey: getOptionalEnv("MONEYPIPE_API_KEY"),
    baseUrl: getOptionalEnv("MONEYPIPE_BASE_URL"),
  };
}

