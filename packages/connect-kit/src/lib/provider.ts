import { ProviderTypeIsNotSupportedError } from "./errors";
import { EthereumProvider, getEthereumProvider } from "../providers/Ethereum";
import { getSolanaProvider, SolanaProvider } from "../providers/Solana";
import { getWalletConnectProvider } from "../providers/WalletConnect";
import { getDebugLogger } from "./logger";

const log = getDebugLogger('getProvider');

// chains

export enum ConnectSupportedChains {
  EthereumMainnet = 1,
  Polygon = 137,
}

export function isChainIdSupported(chainId: number): boolean {
  return !!ConnectSupportedChains[chainId];
}

// providers

export enum SupportedProviders {
  Ethereum = 'Ethereum',
  Solana = 'Solana',
}

export enum SupportedProviderImplementations {
  LedgerConnect = 'LedgerConnect',
  WalletConnect = 'WalletConnect',
}

export type ProviderResult = EthereumProvider | SolanaProvider

let moduleProviderType: SupportedProviders;
let moduleProviderImplementation: SupportedProviderImplementations;

export function setProviderType(providerType: SupportedProviders): void {
  log('setProviderType', providerType);

  moduleProviderType = providerType;
}

export function setProviderImplementation(
  providerImplementation: SupportedProviderImplementations
): void {
  log('setProviderImplementation', providerImplementation);

  moduleProviderImplementation = providerImplementation;
}

export async function getProvider (): Promise<ProviderResult> {
  log('getProvider', moduleProviderType, moduleProviderImplementation);

  switch (moduleProviderType) {
    case SupportedProviders.Ethereum:
      let provider: EthereumProvider;

      if (moduleProviderImplementation === SupportedProviderImplementations.LedgerConnect) {
        provider = getEthereumProvider();
      } else {
        provider = await getWalletConnectProvider();
      }

      return provider;
      break;
    case SupportedProviders.Solana:
      return getSolanaProvider();
      break;
    default:
      throw new ProviderTypeIsNotSupportedError();
  }
}
