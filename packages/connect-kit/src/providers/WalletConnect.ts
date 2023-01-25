import WalletConnectProvider, { default as EthereumProvider } from '@walletconnect/ethereum-provider/dist/index.umd.js';
import { setIsModalOpen } from '../components/Modal/Modal';
import { getBrowser } from '../lib/browser';
import { getDebugLogger, getErrorLogger } from "../lib/logger";
import { showExtensionOrLLModal } from '../lib/modal';
import { DEFAULT_REQUIRED_CHAINS } from '../lib/provider';
import { CheckSupportWalletConnectProviderOptions, getSupportOptions } from '../lib/supportOptions';
import { EthereumRequestPayload } from './Extension';

const log = getDebugLogger('WalletConnect v2');
const logError = getErrorLogger('WalletConnect v2');

let walletConnectProvider: WalletConnectProvider;
let walletConnectProviderOptions: WalletConnectProviderOptions;

const DEFAULT_WCV2_CONFIG = {
  chains: DEFAULT_REQUIRED_CHAINS,
  methods: [
    'eth_sendTransaction',
    'eth_sign',
    'eth_signTransaction',
    'eth_signTypedData',
    'eth_signTypedData_v4',
    'personal_sign',
  ],
  events: [
    'accountsChanged',
    'chainChanged'
  ],
}

/**
 * Specifies the required options for the provider.
 */
export type WalletConnectProviderOptions =
  CheckSupportWalletConnectProviderOptions & {
  projectId: string;
  chains: number[];
  // TODO
  // methods: string[];          // OPTIONAL ethereum methods
  // events: string[];           // OPTIONAL ethereum events
}

/**
 * Gets the WalletConnect provider.
 */
export async function getWalletConnectProvider(): Promise<WalletConnectProvider> {
  log('getWalletConnectProvider');

  try {
    await initWalletConnectProvider();

    return walletConnectProvider;
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
async function initWalletConnectProvider(): Promise<void> {
  log('initWalletConnectProvider');

  const supportOptions = getSupportOptions();
  walletConnectProviderOptions = { ...supportOptions };
  log('walletConnectProviderOptions is', walletConnectProviderOptions);

  if (!walletConnectProvider) {
    const ethereumInitOpts = {
      projectId: walletConnectProviderOptions.projectId,
      chains: walletConnectProviderOptions.chains || DEFAULT_WCV2_CONFIG.chains,
      optionalChains: walletConnectProviderOptions.optionalChains,
      // methods: null,
      methods: walletConnectProviderOptions.methods || DEFAULT_WCV2_CONFIG.methods,
      optionalMethods: walletConnectProviderOptions.optionalMethods,
      // events: null,
      events: walletConnectProviderOptions.events || DEFAULT_WCV2_CONFIG.events,
      optionalEvents: walletConnectProviderOptions.optionalEvents,
      // rpcMap: null,
      rpcMap: walletConnectProviderOptions.rpcMap,
      // metadata: null,
      metadata: walletConnectProviderOptions.metadata,
      showQrModal: false,
    }
    log('ethereum init options are', ethereumInitOpts);

    try {
      const provider: WalletConnectProvider = await EthereumProvider.init(ethereumInitOpts);

      // replace the provider's request function with the patched one
      provider.request = patchWalletConnectProviderRequest(provider);

      log('created a new provider instance', walletConnectProvider);
      walletConnectProvider = provider;
    } catch (err) {
      logError('Error while initializing ethereum provider');
      throw err;
    }
  } else {
    log('reusing provider instance', walletConnectProvider);
  }

  // assign events each time we get the provider because they are removed
  // when disconnecting
  //
  // TODO still wouldn't be called if DApp just calls eth_requestAccounts on
  //   connect?
  assignWalletConnectProviderEvents(walletConnectProvider);
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
            // TODO provider.signer.uri is not available at this point, and is
            //   only set when the session is created by calling connect
            //
            // console.log('uri', provider.signer.uri);
            // showExtensionOrLLModal(provider.signer.uri, reject),

            // TODO doing it this way doesn't allow us to unregister the event
            //
            // const handlerDisplayUri = (uri: string) => {
            //   log('displayUriHandler', uri);
            //   showExtensionOrLLModal(uri, reject),
            // }
            // provider.on('display_uri', handlerDisplayUri);

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
  provider.on('session_event', sessionEventHandler);
  provider.on('session_update', sessionEventHandler);
  provider.on('session_delete', disconnectHandler);
  provider.on('accountsChanged', accountsChangedHandler);
  provider.on('chainChanged', chainChangedHandler);
  provider.on('display_uri', displayUriHandler);

  function disconnectHandler(code: number, reason: string) {
    log('disconnectHandler', code, reason);

    provider.removeListener('connect', connectHandler);
    provider.removeListener('session_event', sessionEventHandler);
    provider.removeListener('session_update', sessionEventHandler);
    provider.removeListener('session_delete', disconnectHandler);
    provider.removeListener('accountsChanged', accountsChangedHandler);
    provider.removeListener('chainChanged', chainChangedHandler);
    provider.removeListener("display_uri", displayUriHandler);
  }
};

function connectHandler(props: any) {
  log('connectHandler', props);

  setIsModalOpen(false);
}

function sessionEventHandler(params: any) {
  log('eventHandler', params);
}

function accountsChangedHandler(params: any) {
  log('accountsChangedHandler', params);
}

function chainChangedHandler(params: any) {
  log('chainChangedHandler', params);
}

function displayUriHandler(uri: string) {
  log('displayUriHandler', uri);
  const device = getBrowser();

  showExtensionOrLLModal(uri, (err: any) => { throw err })

  // TODO call setUri on LL modal
}
