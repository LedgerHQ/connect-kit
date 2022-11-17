import WalletConnectProvider from "@walletconnect/ethereum-provider/dist/esm";
import { ProviderTypeIsNotSupportedError, UserRejectedRequestError } from "./errors";
import { EthereumProvider, EthereumRequestPayload, getEthereumProvider } from "../providers/Ethereum";
import { getSolanaProvider, SolanaProvider } from "../providers/Solana";
import { getWalletConnectProvider, isWalletConnectProviderConnected } from "../providers/WalletConnect";
import { getDebugLogger, getErrorLogger } from "./logger";
import { showModal } from "./modal";
import { getBrowser } from "./browser";

const log = getDebugLogger('getProvider');
const logError = getErrorLogger('getProvider');

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

export type ProviderResult = EthereumProvider | SolanaProvider | WalletConnectProvider

let moduleProviderType: SupportedProviders;
let moduleProviderImplementation: SupportedProviderImplementations;
let moduleProviderInstance: EthereumProvider;

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

  if (!!moduleProviderInstance) {
    log('returning existing provider instance')
    return moduleProviderInstance;
  }

  switch (moduleProviderType) {
    case SupportedProviders.Ethereum:
      let provider: EthereumProvider;

      if (moduleProviderImplementation === SupportedProviderImplementations.LedgerConnect) {
        provider = getEthereumProvider() as EthereumProvider;
      } else {
        provider = await getWalletConnectProvider();
      }

      // replace the provider's request function with the patched one
      provider.request = patchProviderRequest(provider);
      moduleProviderInstance = provider;

      return provider;
      break;
    case SupportedProviders.Solana:
      return getSolanaProvider();
      break;
    default:
      throw new ProviderTypeIsNotSupportedError();
  }
}

function patchProviderRequest (provider: EthereumProvider) {
  // get the provider's request function so we can call it later
  const baseRequest = provider.request.bind(provider);
  const device = getBrowser();

  return async ({ method, params }: EthereumRequestPayload) => {
    // patch eth_requestAccounts to handle the modal
    if (method === 'eth_requestAccounts') {
      log('calling patched', method, params);

      return new Promise<string[]>(async (resolve, reject) => {
        try {
          // only show the modal if provider is WalletConnect and there is no
          // active connection
          if (
            moduleProviderImplementation === SupportedProviderImplementations.WalletConnect &&
            !isWalletConnectProviderConnected()
          ) {
            showModal('ConnectWithLedgerLiveModal', {
              // show the QR code if we are on a desktop browser
              withQrCode: device.type === 'desktop',
              // pass an onClose callback that throws when the modal is closed
              onClose: () => {
                reject(new UserRejectedRequestError());
              }
            });
          }

          // call the original provider request
          return resolve(await baseRequest({ method, params }) as string[]);
        } catch(err) {
          logError('error', err);
          return reject(err);
        }
      });
    } else {
      log('calling provider', method, params);
      // call the original provider request
      return await baseRequest({ method, params });
    }
  }
}
