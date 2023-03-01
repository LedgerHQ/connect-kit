import WalletConnectProvider, {
  default as EthereumProvider
} from '@walletconnect/ethereum-provider/dist/index.umd.js';
import { setIsModalOpen } from '../components/Modal/Modal';
import { setWalletConnectUri } from '../components/UseLedgerLiveModal/UseLedgerLiveModal';
import { getDebugLogger, getErrorLogger } from "../lib/logger";
import { showExtensionOrLLModal } from '../lib/modal';
import {
  CheckSupportWalletConnectProviderOptions,
  getSupportOptions
} from '../lib/supportOptions';
import { EthereumRequestPayload } from './ExtensionEvm';

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
    return await initWalletConnectProvider();
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

  const ethereumInitOpts = {
    projectId: providerOptions.projectId,
    chains: providerOptions.chains,
    optionalChains: providerOptions.optionalChains,
    methods: providerOptions.methods,
    optionalMethods: providerOptions.optionalMethods,
    events: providerOptions.events,
    optionalEvents: providerOptions.optionalEvents,
    rpcMap: providerOptions.rpcMap,
    metadata: providerOptions.metadata,
    showQrModal: false,
  }
  log('ethereum init options are', ethereumInitOpts);

  try {
    const provider: WalletConnectProvider = await EthereumProvider.init(ethereumInitOpts);

    // provider.setDefaultChain(supportOptions.chainId);
    assignWalletConnectProviderEvents(provider);

    // replace the provider's request function with the patched one
    provider.request = patchWalletConnectProviderRequest(provider);

    log('created a new provider instance', provider);
    return provider;
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

  return async function <T = unknown>({ method, params }: EthereumRequestPayload): Promise<T> {
    // patch eth_requestAccounts to handle the modal
    if (method === 'eth_requestAccounts') {
      log('calling patched', method, params);

      return new Promise(async (resolve, reject) => {
        try {
          if (!provider?.session?.connected) {
            showExtensionOrLLModal('', reject),

            // connect initializes the session and waits for connection
            await provider.connect();
          } else {
            log('reusing existing session');
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
function assignWalletConnectProviderEvents(provider: WalletConnectProvider) {
  log('assignWalletConnectProviderEvents');

  provider.on('connect', connectHandler);
  provider.on('display_uri', displayUriHandler);
  provider.on('session_delete', disconnectHandler);

  function disconnectHandler(params: any) {
    log('disconnectHandler', params);

    provider.connector?.disconnect();

    provider.removeListener('connect', connectHandler);
    provider.removeListener('session_delete', disconnectHandler);
    provider.removeListener("display_uri", displayUriHandler);
  }

  log('provider is', provider);
}

function connectHandler(props: any) {
  log('connectHandler', props);

  setIsModalOpen(false);
}

function displayUriHandler(uri: string) {
  log('displayUriHandler', uri);

  // update the modal URI when we get it
  setWalletConnectUri(uri);
}
