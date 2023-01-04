import { ProviderNotFoundError } from "../lib/errors";
import { getDebugLogger } from "../lib/logger";

const log = getDebugLogger('LedgerConnectEthereum');

export const LEDGER_ETHEREUM_PROVIDER = 'ethereum'
export const LEDGER_CONNECT_ETHEREUM_PROP = 'isLedgerConnect'
export const LEDGER_CONNECT_ETHEREUM_SUPPORTED_PROP = 'isLedgerConnectSupported'

export type EthereumRequestPayload = {
  method: string;
  params?: unknown[] | object;
}

export interface EthereumProvider {
  providers?: EthereumProvider[];
  // present on the Ethereum Connect provider
  [LEDGER_CONNECT_ETHEREUM_PROP]?: boolean;
  // present on the Ethereum TryConnect provider
  [LEDGER_CONNECT_ETHEREUM_SUPPORTED_PROP]?: boolean;
  // present on the WalletConnect provider
  connector?: unknown,
  disconnect?: {(): Promise<void>};
  // common Ethereum provider props
  request<T = unknown>(args: EthereumRequestPayload): Promise<T>;
  emit(eventName: string | symbol, ...args: any[]): boolean;
  on(event: any, listener: any): void;
  removeListener(event: string, listener: any): void;
}

interface WindowWithEthereum {
  [LEDGER_ETHEREUM_PROVIDER]?: EthereumProvider;
}

export function getEthereumConnectProvider (): EthereumProvider {
  log('getEthereumConnectProvider');

  const provider = (window as WindowWithEthereum)[LEDGER_ETHEREUM_PROVIDER];

  if (
    typeof provider === "undefined" ||
    typeof provider[LEDGER_CONNECT_ETHEREUM_PROP] === "undefined"
  ) {
    throw new ProviderNotFoundError();
  }

  return provider;
};
