import WalletConnectProvider from "@walletconnect/legacy-provider/dist/umd/index.min.js";
import { getErrorLogger, getDebugLogger } from '../lib/logger';
import { EthereumProvider, EthereumRequestPayload } from './Extension';
import { showExtensionOrLLModal } from '../lib/modal';
import { setIsModalOpen } from '../components/Modal/Modal';
import { CheckSupportOptions, CheckSupportWalletConnectLegacyProviderOptions, getSupportOptions } from '../lib/supportOptions';

const log = getDebugLogger('WalletConnect');
const logError = getErrorLogger('WalletConnect');
let walletConnectProvider: WalletConnectProvider;

// alias to check support type
export type WalletConnectLegacyProviderOptions = CheckSupportWalletConnectLegacyProviderOptions;

/**
 * Gets the legacy WalletConnect provider.
 */
export async function getWalletConnectLegacyProvider(): Promise<EthereumProvider> {
  log('getWalletConnectLegacyProvider');

  try {
    await initWalletConnectLegacyProvider();

    return walletConnectProvider as unknown as EthereumProvider;
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

  const supportOptions: WalletConnectLegacyProviderOptions = getSupportOptions();
  const provider = new WalletConnectProvider({
    chainId: supportOptions.chainId,
    qrcode: false,
  });

  assignWalletConnectLegacyProviderEvents(provider);

  // replace the provider's request function with the patched one
  provider.request = patchWalletConnectLegacyProviderRequest(provider);

  log('created a new legacy provider instance', walletConnectProvider);
  walletConnectProvider = provider;
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

      return new Promise(async (resolve, reject) => {
        try {
          if (!walletConnectProvider.connected) {
            await provider.connector.createSession({
              chainId: supportOptions.chainId
            });
            log('new session with handshakeTopic', provider.connector.handshakeTopic);

            // show the extension install modal or the WC URI
            showExtensionOrLLModal(provider.connector.uri, reject);
          }

          // call the original provider request
          return resolve(await baseRequest({ method, params }));
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

  function connectHandler(error: Error | null, payload: any) {
    log('connectHandler', payload);

    // close modal when QR code is scanned
    setIsModalOpen(false);

    if (error) {
      logError('error', error);
      throw error;
    }
  }

  function disconnectHandler(code: number, reason: string) {
    log('disconnectHandler', code, reason);

    if (typeof localStorage !== 'undefined') {
      // remove local storage session so user can connect again
      localStorage.removeItem('walletconnect');
    }

    provider.removeListener("disconnect", disconnectHandler);
  }
};
