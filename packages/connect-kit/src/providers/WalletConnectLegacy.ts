import WalletConnectProvider from "@walletconnect/legacy-provider/dist/umd/index.min.js";
import { getErrorLogger, getDebugLogger } from '../lib/logger';
import { EvmProvider, EthereumRequestPayload } from './ExtensionEvm';
import { showExtensionOrLLModal } from '../lib/modal';
import { setIsModalOpen } from '../components/Modal/Modal';
import {
  CheckSupportOptions,
  CheckSupportWalletConnectLegacyProviderOptions,
  getSupportOptions
} from '../lib/supportOptions';
import { UserRejectedRequestError } from "../lib/errors";

const log = getDebugLogger('WalletConnectLegacy');
const logError = getErrorLogger('WalletConnectLegacy');

// alias to check support type
export type WalletConnectLegacyProviderOptions = CheckSupportWalletConnectLegacyProviderOptions;

/**
 * Gets the legacy WalletConnect provider.
 */
export async function getWalletConnectLegacyProvider(): Promise<EvmProvider> {
  log('getWalletConnectLegacyProvider');

  try {
    return await initWalletConnectLegacyProvider() as unknown as EvmProvider;
  } catch (err) {
    const error = (err instanceof Error) ? err : new Error(String(err));
    logError('error', error);
    throw error;
  }
}

// internal

/**
 * Initializes a WalletConnect's legacy provider instance.
 */
async function initWalletConnectLegacyProvider(): Promise<void> {
  log('initWalletConnectLegacyProvider');

  const providerOptions: WalletConnectLegacyProviderOptions = getSupportOptions();
  log('walletConnectProviderOptions is', providerOptions);

  const provider = new WalletConnectProvider({
    chainId: providerOptions.chainId,
    bridge: providerOptions.bridge,
    infuraId: providerOptions.infuraId,
    rpc: providerOptions.rpc,
    qrcode: false,
  });
  assignWalletConnectLegacyProviderEvents(provider);

  // replace the provider's request function with the patched one
  provider.request = patchWalletConnectLegacyProviderRequest(provider);

  log('created a new legacy provider instance', provider);
  return provider;
}

/**
 * Patches the eth_requestAccounts request to show our custom modal.
 */
function patchWalletConnectLegacyProviderRequest (provider: WalletConnectProvider) {
  log('patchWalletConnectLegacyProviderRequest');

  // get the provider's request function so we can call it later
  const baseRequest = provider.request.bind(provider);
  const supportOptions: CheckSupportOptions = getSupportOptions();

  return async function <T = unknown>({ method, params }: EthereumRequestPayload): Promise<T> {
    // patch eth_requestAccounts to handle the modal
    if (method === 'eth_requestAccounts') {
      log('calling patched', method, params);

      return new Promise((resolve, reject) => {
        try {
          if (!provider.connected) {
            provider.connector.createSession({
              chainId: supportOptions.chainId
            }).then(() => {
              // show the extension install modal or the WC URI
              showExtensionOrLLModal({
                uri: provider.connector.uri,
                onClose: () => {
                  reject(new UserRejectedRequestError());
                }
              });

              // call the original provider request
              resolve(baseRequest({ method, params }));
            });
          }
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

/**
 * Assigns the provider event handlers.
 */
function assignWalletConnectLegacyProviderEvents(provider: WalletConnectProvider) {
  log('assignWalletConnectLegacyProviderEvents');

  provider.connector.on('connect', connectHandler);
  provider.on('disconnect', disconnectHandler);

  function disconnectHandler(code: number, reason: string) {
    log('disconnectHandler', code, reason);

    if (typeof localStorage !== 'undefined') {
      // remove local storage session so user can connect again
      localStorage.removeItem('walletconnect');
    }

    provider.removeListener("disconnect", disconnectHandler);
  }
};

function connectHandler(props: any) {
  log('connectHandler', props);

  setIsModalOpen(false);
}
