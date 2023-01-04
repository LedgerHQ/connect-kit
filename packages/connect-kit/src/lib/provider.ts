import { ProviderTypeIsNotSupportedError } from "./errors";
import { EthereumProvider, getEthereumConnectProvider } from "../providers/EthereumConnect";
import { getSolanaConnectProvider, SolanaProvider } from "../providers/SolanaConnect";
import { getEthereumWalletConnectProvider } from "../providers/EthereumWalletConnect";
import { getDebugLogger } from "./logger";
import { getEthereumTryConnectProvider } from "../providers/EthereumTryConnect";
import { getSupportOptions } from "./supportOptions";

const log = getDebugLogger('getProvider');

// chains

export enum ConnectSupportedChains {
  EthereumMainnet = 1,
}

export function isChainIdSupported(chainId: ConnectSupportedChains): boolean {
  return chainId === ConnectSupportedChains.EthereumMainnet;
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

let moduleProviderImplementation: SupportedProviderImplementations;

export function setProviderImplementation(
  providerImplementation: SupportedProviderImplementations
): void {
  log('setProviderImplementation', providerImplementation);

  moduleProviderImplementation = providerImplementation;
}

export async function getProvider (): Promise<ProviderResult> {
  log('getProvider', moduleProviderImplementation);

  const supportOptions = getSupportOptions();

  switch (supportOptions.providerType) {
    case SupportedProviders.Ethereum:
      let provider: EthereumProvider;

      if (moduleProviderImplementation === SupportedProviderImplementations.LedgerConnect) {
        try {
          provider = getEthereumConnectProvider();
        } catch (err) {
          provider = getEthereumTryConnectProvider();
        }
      } else {
        provider = await getEthereumWalletConnectProvider();
      }

      return provider;
      break;
    case SupportedProviders.Solana:
      return getSolanaConnectProvider();
      break;
    default:
      throw new ProviderTypeIsNotSupportedError();
  }
}
