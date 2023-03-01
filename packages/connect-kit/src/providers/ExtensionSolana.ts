import { ProviderNotFoundError } from "../lib/errors";
import { ProviderResult } from "../lib/provider";
import { getDebugLogger } from "../lib/logger";

const log = getDebugLogger('ExtensionSolana');

export const EXTENSION_SOLANA_PROVIDER = 'solana'
export const EXTENSION_SOLANA_PROP = 'isLedgerConnect'

export interface SolanaProvider {
  [EXTENSION_SOLANA_PROP]: boolean;
  signTransaction(...args: unknown[]): Promise<unknown>;
  signAllTransactions(...args: unknown[]): Promise<unknown>;
  signAndSendTransaction(...args: unknown[]): Promise<unknown>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

interface WindowWithSolana {
  [EXTENSION_SOLANA_PROVIDER]?: SolanaProvider;
}

/**
 * Gets the Solana provider.
 */
export function getSolanaProvider (): ProviderResult {
  log('getSolanaProvider');

  const provider = (window as WindowWithSolana)[EXTENSION_SOLANA_PROVIDER];

  if (
    typeof provider === "undefined" ||
    typeof provider[EXTENSION_SOLANA_PROP] === "undefined"
  ) {
    throw new ProviderNotFoundError();
  }

  return provider;
}
