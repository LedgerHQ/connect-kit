import { default as WalletConnectProvider } from '../support/EthereumProvider/EthereumProvider';
import { setIsModalOpen } from '../components/Modal/Modal';
import { setWalletConnectUri } from '../components/UseLedgerLiveModal/UseLedgerLiveModal';
import { UserRejectedRequestError } from '../lib/errors';
import { getDebugLogger, getErrorLogger } from "../lib/logger";
import { showLLModal } from '../lib/modal';
import {
  CheckSupportWalletConnectProviderOptions,
  getSupportOptions
} from '../lib/supportOptions';
import { EthereumRequestPayload } from './ExtensionEvm';
import { OPTIONAL_EVENTS, OPTIONAL_METHODS } from '../support/EthereumProvider/constants';

const log = getDebugLogger('WalletConnectEvm');
const logError = getErrorLogger('WalletConnectEvm');

/**
 * Specifies the required options for the provider.
 */
export type WalletConnectProviderOptions =
  CheckSupportWalletConnectProviderOptions & {
  projectId: string;
  chains: number[];
}

/**
 * Gets the WalletConnect provider.
 */
export async function getWalletConnectProvider(): Promise<WalletConnectProvider> {
  log('getWalletConnectProvider');

  try {
    const provider = await initWalletConnectProvider();
    assignWalletConnectProviderEvents(provider);
    // replace the provider's request function with the patched one
    provider.request = patchWalletConnectProviderRequest(provider);

    return provider;
  } catch (err) {
    const error = (err instanceof Error) ? err : new Error(String(err));
    logError('error', error);
    throw error;
  }
}

// internal

/**
 * Initializes a WalletConnect's provider instance.
 */
async function initWalletConnectProvider(): Promise<WalletConnectProvider> {
  log('initWalletConnectProvider');

  const providerOptions: WalletConnectProviderOptions = getSupportOptions();
  log('walletConnectProviderOptions is', providerOptions);

  // merge optionalMethods with WalletConnect defaults ignoring duplicates
  const optionalMethods = OPTIONAL_METHODS;
  if (providerOptions.optionalMethods && Array.isArray(providerOptions.optionalMethods))
    optionalMethods.push(...providerOptions.optionalMethods.filter((id) => optionalMethods.indexOf(id) < 0));

  // merge optionalEvents with WalletConnect defaults ignoring duplicates
  const optionalEvents = OPTIONAL_EVENTS;
  if (providerOptions.optionalEvents && Array.isArray(providerOptions.optionalEvents))
    optionalEvents.push(...providerOptions.optionalEvents.filter((id) => optionalEvents.indexOf(id) < 0));

  const ethereumInitOpts = {
    projectId: providerOptions.projectId,
    chains: providerOptions.chains,
    optionalChains: providerOptions.optionalChains,
    methods: providerOptions.methods,
    optionalMethods,
    events: providerOptions.events,
    optionalEvents,
    rpcMap: providerOptions.rpcMap,
    relayUrl: providerOptions.relayUrl,
    showQrModal: false,
  }
  log('ethereum init options are', ethereumInitOpts);
  log('creating a new provider instance');

  try {
    return WalletConnectProvider.init(ethereumInitOpts);
  } catch (err) {
    logError('Error while initializing ethereum provider');
    throw err;
  }
}

/**
 * Patches the eth_requestAccounts request to show our custom modal.
 */
function patchWalletConnectProviderRequest (provider: WalletConnectProvider) {
  log('patchWalletConnectProviderRequest');

  // get the provider's request function so we can call it later
  const baseRequest = provider.request.bind(provider);

  const providerOptions: WalletConnectProviderOptions = getSupportOptions();
  log('walletConnectProviderOptions is', providerOptions);

  return async function <T = unknown>({ method, params }: EthereumRequestPayload): Promise<T> {
    // patch eth_requestAccounts to handle the modal
    if (method === 'eth_requestAccounts') {
      log('calling patched', method, params);

      log('handling display_uri once');
      provider.once('display_uri', displayUriHandler);

      return new Promise(async (resolve, reject) => {
        try {
          if (!provider?.session?.connected) {
            showLLModal({
              uri: '',
              onClose: () => {
                logError('user rejected');
                reject(new UserRejectedRequestError());
              }
            });

            log('creating a new session');
            // connect initializes the session and waits for connection
            await provider.connect({
              chains: providerOptions.chains,
              optionalChains: providerOptions.optionalChains,
            });

            // call the original provider request
            resolve(await baseRequest({ method, params }));
          } else {
            log('reusing existing session');
            // call the original provider request
            resolve(await baseRequest({ method, params }));
          }
        } catch(err) {
          // should catch both user reject and connection declining
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
function assignWalletConnectProviderEvents(provider: WalletConnectProvider) {
  log('assignWalletConnectProviderEvents');

  if (!provider) return;
  removeEvents(provider);
  provider.on('connect', connectHandler);
  provider.on('session_delete', disconnectHandler);

  function removeEvents(provider: WalletConnectProvider) {
    if (!provider) return;
    provider.removeListener('connect', connectHandler);
    provider.removeListener('session_delete', disconnectHandler);
  }

  function connectHandler(props: any) {
    log('connectHandler', props);

    setIsModalOpen(false);
  }

  function disconnectHandler(params: any) {
    log('disconnectHandler', params);

    provider.disconnect();
    removeEvents(provider);
  }

  log('provider is', provider);
}

function displayUriHandler(uri: string) {
  log('displayUriHandler', uri);

  // update the modal URI when we get it
  setWalletConnectUri(uri);
}
