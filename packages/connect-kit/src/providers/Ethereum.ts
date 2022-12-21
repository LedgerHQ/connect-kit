import { getDebugLogger } from "../lib/logger";
import { TryConnectEthereumProvider } from "./TryConnectEthereum";

const log = getDebugLogger('LedgerConnectEthereum');

export const LEDGER_ETHEREUM_PROVIDER = 'ethereum'
export const LEDGER_CONNECT_ETHEREUM_PROP = 'isLedgerConnect'

export type EthereumRequestPayload = {
  method: string;
  params?: unknown[] | object;
}

export interface EthereumProvider {
  providers?: EthereumProvider[];
  connector?: unknown,
  request<T = unknown>(args: EthereumRequestPayload): Promise<T>;
  disconnect?: {(): Promise<void>};
  emit(eventName: string | symbol, ...args: any[]): boolean;
  on(event: any, listener: any): void;
  removeListener(event: string, listener: any): void;
}

export interface LedgerConnectProvider extends EthereumProvider {
  [LEDGER_CONNECT_ETHEREUM_PROP]: boolean;
}

interface WindowWithEthereum {
  [LEDGER_ETHEREUM_PROVIDER]?: LedgerConnectProvider;
}

export function getEthereumProvider (): EthereumProvider {
  log('getEthereumProvider');

  let provider = (window as WindowWithEthereum)[LEDGER_ETHEREUM_PROVIDER];

  if (
    typeof provider === "undefined" ||
    typeof provider[LEDGER_CONNECT_ETHEREUM_PROP] === "undefined"
  ) {
    return new TryConnectEthereumProvider() as EthereumProvider;
  }

  return provider;
};
