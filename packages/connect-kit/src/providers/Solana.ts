import { ProviderNotFoundError } from "../lib/errors";
import { ProviderResult } from "../lib/provider";
import { getLogger } from "../lib/logger";

const log = getLogger('LedgerConnectSolana');

export const LEDGER_SOLANA_PROVIDER = 'solana'
export const LEDGER_CONNECT_SOLANA_PROP = 'isLedgerConnect'

export interface SolanaProvider {
  [LEDGER_CONNECT_SOLANA_PROP]: boolean;
  signTransaction(...args: unknown[]): Promise<unknown>;
  signAllTransactions(...args: unknown[]): Promise<unknown>;
  signAndSendTransaction(...args: unknown[]): Promise<unknown>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

interface WindowWithSolana {
  [LEDGER_SOLANA_PROVIDER]?: SolanaProvider;
}

export function getSolanaProvider (): ProviderResult {
  log('getSolanaProvider');

  const provider = (window as WindowWithSolana)[LEDGER_SOLANA_PROVIDER];

  if (
    typeof provider === "undefined" ||
    typeof provider[LEDGER_CONNECT_SOLANA_PROP] === "undefined"
  ) {
    throw new ProviderNotFoundError();
  }

  return provider;
}
