import { getDebugLogger } from "../lib/logger";
import { Device } from "../lib/browser";
import { ProviderNotFoundError } from "../lib/errors";

const log = getDebugLogger('Extension');

export const LEDGER_EXTENSION_ETHEREUM_GLOBAL = 'ethereum'
export const LEDGER_EXTENSION_ETHEREUM_PROP = 'isLedgerConnect'
export enum EXTENSION_SUPPORTED_CHAINS {
  EthereumMainnet = 1,
  Polygon = 137,
}
// TODO implement doesExtensionSupportRequiredMethods
export const EXTENSION_SUPPORTED_METHODS = [
  'eth_sendTransaction',
  'eth_sign',
  'eth_signTransaction',
  'eth_signTypedData',
  'eth_signTypedData_v4',
  'personal_sign',
];
// TODO implement doesExtensionSupportRequiredEvents
export const EXTENSION_SUPPORTED_EVENTS = [
  'accountsChanged',
  'chainChanged'
];

/**
 * Checks if the user's platform supports the extension.
 */
export function isExtensionSupported (device: Device): boolean {
  return (
    (device.os.name === "iOS" || device.os.name === "macOS") &&
    device.browser.name === "Safari"
  );
}

/**
 * Checks if the chain id is supported by the extension.
 */
export function isChainIdSupported(chainId: number): boolean {
  return !!EXTENSION_SUPPORTED_CHAINS[chainId];
}

/**
 * Checks if all the chain ids are supported by the extension.
 */
export function areAllChainsSupported(chains: number[]): boolean {
  return chains.every(isChainIdSupported);
}

export type EthereumRequestPayload = {
  method: string;
  params?: unknown[] | Record<string, unknown> | undefined;
}

/**
 * A common interface for all the returned providers.
 */
export interface EthereumProvider {
  providers?: EthereumProvider[];
  connector?: unknown,
  request<T = unknown>(args: EthereumRequestPayload): Promise<T>;
  disconnect?: {(): Promise<void>};
  on(event: any, listener: any): void;
  removeListener(event: string, listener: any): void;
}

export interface LedgerConnectProvider extends EthereumProvider {
  [LEDGER_EXTENSION_ETHEREUM_PROP]: boolean;
}

interface WindowWithEthereum {
  [LEDGER_EXTENSION_ETHEREUM_GLOBAL]?: LedgerConnectProvider;
}

/**
 * Gets the extension provider. In case it does not exist returns an instance
 * of the install provider.
 */
export function getExtensionProvider (): EthereumProvider {
  log('getEthereumProvider');

  let provider = (window as WindowWithEthereum)[LEDGER_EXTENSION_ETHEREUM_GLOBAL];

  if (
    typeof provider === "undefined" ||
    typeof provider[LEDGER_EXTENSION_ETHEREUM_PROP] === "undefined"
  ) {
    throw new ProviderNotFoundError();
  }

  return provider;
};
