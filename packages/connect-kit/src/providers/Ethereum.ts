import { ProviderNotFoundError } from "../lib/errors";
import { ProviderResult } from "../lib/provider";
import { getDebugLogger } from "../lib/logger";

const log = getDebugLogger('LedgerConnectEthereum');

export const LEDGER_ETHEREUM_PROVIDER = 'ethereum'
export const LEDGER_CONNECT_ETHEREUM_PROP = 'isLedgerConnect'

export interface EthereumProvider {
  providers?: EthereumProvider[];
  request(...args: unknown[]): Promise<unknown>;
  disconnect?: {(): Promise<void>};
  emit(eventName: string | symbol, ...args: any[]): boolean;
  on(...args: unknown[]): void;
  removeListener(...args: unknown[]): void;
}

export interface LedgerConnectProvider extends EthereumProvider {
  [LEDGER_CONNECT_ETHEREUM_PROP]: boolean;
}

interface WindowWithEthereum {
  [LEDGER_ETHEREUM_PROVIDER]?: LedgerConnectProvider;
}

export function getEthereumProvider (): ProviderResult {
  log('getEthereumProvider');

  const provider = (window as WindowWithEthereum)[LEDGER_ETHEREUM_PROVIDER];

  if (
    typeof provider === "undefined" ||
    typeof provider[LEDGER_CONNECT_ETHEREUM_PROP] === "undefined"
  ) {
    throw new ProviderNotFoundError();
  }

  return provider;
};
