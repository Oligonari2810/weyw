export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta variable de entorno: ${name}`);
  return value;
}

export function getOptionalEnv(name: string): string | undefined {
  return process.env[name];
}

export function nowIso(): string {
  return new Date().toISOString();
}

