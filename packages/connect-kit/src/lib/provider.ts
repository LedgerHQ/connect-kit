import WalletConnectProvider from "@walletconnect/ethereum-provider/dist/esm";
import { ProviderTypeIsNotSupportedError } from "./errors";
import { EthereumProvider, getEthereumProvider } from "../providers/Ethereum";
import { getSolanaProvider, SolanaProvider } from "../providers/Solana";
import { getWalletConnectProvider } from "../providers/WalletConnect";
import { getLogger } from "./logger";

const log = getLogger('getProvider');

// chains

export enum ConnectSupportedChains {
  EthereumMainnet = 1,
}

let moduleChainId: ConnectSupportedChains;

export function setChainId(chainId: ConnectSupportedChains): void {
  log('setChainId', chainId);

  moduleChainId = chainId;
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

export type ProviderResult = EthereumProvider | SolanaProvider | WalletConnectProvider

let moduleProviderType: SupportedProviders;
let moduleProviderImplementations: SupportedProviderImplementations;

export function setProviderType(providerType: SupportedProviders): void {
  log('setProviderType', providerType);

  moduleProviderType = providerType;
}

export function setProviderImplementation(
  setProviderImplementation: SupportedProviderImplementations
): void {
  log('setProviderImplementation', setProviderImplementation);

  moduleProviderImplementations = setProviderImplementation;
}

export async function getProvider (): Promise<ProviderResult> {
  log('getProvider', moduleProviderType, moduleProviderImplementations);

  switch (moduleProviderType) {
    case SupportedProviders.Ethereum:
      if (moduleProviderImplementations === SupportedProviderImplementations.LedgerConnect) {
        return getEthereumProvider();
      }

      return getWalletConnectProvider();
      break;
    case SupportedProviders.Solana:
      return getSolanaProvider();
      break;
    default:
      throw new ProviderTypeIsNotSupportedError();
  }
}
