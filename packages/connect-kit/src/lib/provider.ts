import { ProviderTypeIsNotSupportedError } from "./errors";
import { EthereumProvider, getExtensionProvider } from "../providers/Extension";
import { getSolanaProvider, SolanaProvider } from "../providers/Solana";
import { getWalletConnectLegacyProvider } from "../providers/WalletConnectLegacy";
import { getWalletConnectProvider } from "../providers/WalletConnect";
import { getDebugLogger } from "./logger";
import { getSupportOptions } from "./supportOptions";

const log = getDebugLogger('getProvider');

// chains

// TODO review for Solana
export const DEFAULT_CHAIN_ID: number = 1;
export const DEFAULT_REQUIRED_CHAINS: number[] = [DEFAULT_CHAIN_ID];

// providers

export const DEFAULT_WALLETCONNECT_VERSION: number = 1;

export enum SupportedProviders {
  Ethereum = 'Ethereum',
  Solana = 'Solana',
}

export enum SupportedProviderImplementations {
  LedgerConnect = 'LedgerConnect',
  WalletConnect = 'WalletConnect',
}

export type ProviderResult = EthereumProvider | SolanaProvider

let moduleProviderImplementation: SupportedProviderImplementations;

/**
 * Sets the provider implementation to be used by getProvider.
 */
export function setProviderImplementation(
  providerImplementation: SupportedProviderImplementations
): void {
  log('setProviderImplementation', providerImplementation);

  moduleProviderImplementation = providerImplementation;
}

/**
 * Gets a provider instance based on the implementation set earlier.
 */
export async function getProvider (): Promise<ProviderResult> {
  log('getProvider', moduleProviderImplementation);

  const supportOptions = getSupportOptions();

  switch (supportOptions.providerType) {
    case SupportedProviders.Ethereum:
      if (moduleProviderImplementation === SupportedProviderImplementations.LedgerConnect) {
        return getExtensionProvider();
      }

      if (supportOptions.version === 1) {
        return await getWalletConnectLegacyProvider();
      }

      return await getWalletConnectProvider();
      break;
    case SupportedProviders.Solana:
      return getSolanaProvider();
      break;
    default:
      throw new ProviderTypeIsNotSupportedError();
  }
}
