import { getDebugLogger } from "../lib/logger";
import { Device } from "../lib/browser";
import { NoServerSideError, ProviderNotFoundError } from "../lib/errors";
import { getSupportOptions } from "../lib/supportOptions";
import { getHexChainId } from "../lib/provider";

const log = getDebugLogger('ExtensionEvm');

export const EXTENSION_EVM_GLOBAL = 'ethereum';
export const EXTENSION_EVM_PROP = 'isLedgerConnect';

export enum ExtensionSupportedChains {
  EthereumMainnet = 1,
  Polygon = 137,
};

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
  return !!ExtensionSupportedChains[chainId];
}

/**
 * Checks if all the chain ids are supported by the extension.
 */
export function areAllRequiredChainsSupported(chains: number[]): boolean {
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
  connector?: unknown;
  session?: unknown;
  chainId: string | number;
  request<T = unknown>(args: EthereumRequestPayload): Promise<T>;
  disconnect?: {(): Promise<void>};
  // emit(eventName: string | symbol, ...args: any[]): boolean;
  on(event: any, listener: any): void;
  removeListener(event: string, listener: any): void;
}

export interface ExtensionEvmProvider extends EthereumProvider {
  [EXTENSION_EVM_PROP]: boolean;
}

interface WindowWithEthereum {
  [EXTENSION_EVM_GLOBAL]?: ExtensionEvmProvider;
}

/**
 * Gets the extension provider. In case it does not exist returns an instance
 * of the install provider.
 */
export function getExtensionProvider(): EthereumProvider {
  log('getEthereumProvider');

  if (typeof window === 'undefined') {
    throw new NoServerSideError();
  }

  let provider = (window as WindowWithEthereum)[EXTENSION_EVM_GLOBAL];
  log('provider is', provider);

  if (
    typeof provider === "undefined" ||
    typeof provider[EXTENSION_EVM_PROP] === "undefined"
  ) {
    throw new ProviderNotFoundError();
  }

  // switch chains if not the same
  const supportOptions = getSupportOptions();
  const requestedChainId = getHexChainId(supportOptions.chainId || 0);
  const providerChainId = getHexChainId(provider.chainId)

  if (providerChainId != requestedChainId) {
    log ('chainIds are different, changing to', requestedChainId);
    // request chain change but don't await on it
    provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: requestedChainId,
      }]});
  }

  return provider;
}
