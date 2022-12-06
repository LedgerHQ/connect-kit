import WalletConnectProvider from '@walletconnect/ethereum-provider/dist/umd/index.min.js';
import { getErrorLogger, getDebugLogger } from '../lib/logger';
import { EthereumProvider, EthereumRequestPayload } from './Ethereum';
import { showModal } from '../lib/modal';
import { UserRejectedRequestError } from '../lib/errors';
import { getBrowser } from '../lib/browser';

const log = getDebugLogger('WalletConnect');
const logError = getErrorLogger('WalletConnect');

let walletConnectProvider: WalletConnectProvider;
let walletConnectOptions: initWalletConnectProviderOptions;

export interface initWalletConnectProviderOptions {
  chainId?: number;
  bridge?: string;
  infuraId?: string;
  rpc?: { [chainId: number]: string };
}

export function setWalletConnectOptions(options: initWalletConnectProviderOptions) {
  log('setWalletConnectOptions');
  walletConnectOptions = options;
}

export async function initWalletConnectProvider(): Promise<void> {
  log('initWalletConnectProvider');

  const provider = new WalletConnectProvider({
    ...walletConnectOptions,
    qrcode: false,
  });

  assignProviderEvents(provider);

  log('creating new provider instance');
  walletConnectProvider = provider;
}

function patchProviderRequest (provider: WalletConnectProvider) {
  // get the provider's request function so we can call it later
  const baseRequest = provider.request.bind(provider);
  const device = getBrowser();

  return async function <T = unknown>({ method, params }: EthereumRequestPayload): Promise<T> {
    // patch eth_requestAccounts to handle the modal
    if (method === 'eth_requestAccounts') {
      log('calling patched', method, params);

      return new Promise(async (resolve, reject) => {
        try {
          if (!isWalletConnectProviderConnected()) {
            await provider.connector.createSession({
              chainId: walletConnectOptions.chainId
            });
            log('new session with handshakeTopic', provider.connector.handshakeTopic);

            showModal('ConnectWithLedgerLiveModal', {
              // show the QR code if we are on a desktop browser
              withQrCode: device.type === 'desktop',
              uri: provider.connector.uri,
              // pass an onClose callback that throws when the modal is closed
              onClose: () => {
                reject(new UserRejectedRequestError());
              }
            });
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

function assignProviderEvents(provider: WalletConnectProvider) {
  log('assignProviderEvents');

  provider.connector.on('connect', connectHandler);
  provider.on('disconnect', disconnectHandler);

  function connectHandler(error: Error | null, payload: any) {
    log('connectHandler', payload);

    if (error) {
      logError('error', error);
      throw error;
    }
  }

  function disconnectHandler(code: number, reason: string) {
    log('disconnectHandler', code, reason);

    provider.removeListener("disconnect", disconnectHandler);
  }
};

export function isWalletConnectProviderConnected() {
  log('isWalletConnectProviderConnected', walletConnectProvider.connected);

  return walletConnectProvider.connected;
}

export async function getWalletConnectProvider(): Promise<EthereumProvider> {
  log('getWalletConnectProvider');

  try {
    await initWalletConnectProvider();
    // replace the provider's request function with the patched one
    walletConnectProvider.request = patchProviderRequest(walletConnectProvider);

    return walletConnectProvider as unknown as EthereumProvider;
  } catch (err) {
    const error = (err instanceof Error) ? err : new Error(String(err));
    logError('error', error);
    throw error;
  }
}
