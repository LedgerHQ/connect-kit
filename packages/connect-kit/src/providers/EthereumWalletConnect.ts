import WalletConnectProvider from '@walletconnect/ethereum-provider/dist/umd/index.min.js';
import { getErrorLogger, getDebugLogger } from '../lib/logger';
import { EthereumProvider, EthereumRequestPayload } from './EthereumConnect';
import { showModal } from '../lib/modal';
import { UserRejectedRequestError } from '../lib/errors';
import { getBrowser } from '../lib/browser';
import { setIsModalOpen } from '../components/Modal/Modal';
import { getSupportOptions } from '../lib/supportOptions';

const log = getDebugLogger('WalletConnect');
const logError = getErrorLogger('WalletConnect');
let walletConnectProvider: WalletConnectProvider;
let walletConnectOptions: WalletConnectProviderOptions;
let isHeadless: boolean;

export interface WalletConnectProviderOptions {
  chainId?: number;
  bridge?: string;
  infuraId?: string;
  rpc?: { [chainId: number]: string };
}

export async function initWalletConnectProvider(): Promise<void> {
  log('initWalletConnectProvider');
  log('creating new provider instance');

  const supportOptions = getSupportOptions();
  walletConnectOptions = { ...supportOptions };
  isHeadless = supportOptions.isHeadless || false;

  const provider = new WalletConnectProvider({
    ...walletConnectOptions,
    qrcode: false,
  });
  walletConnectProvider = provider;
  assignProviderEvents(provider);

  if (!isWalletConnectProviderConnected()) {
    await provider.connector.createSession({
      chainId: walletConnectOptions.chainId
    });
    log('created session with handshakeTopic', provider.connector.handshakeTopic);
  } else {
    log('reconnected to session with handshakeTopic', provider.connector.handshakeTopic);
  }
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
            log('created session with handshakeTopic', provider.connector.handshakeTopic);

            if (!isHeadless) {
              showModal('ConnectWithLedgerLiveModal', {
                // show the QR code if we are on a desktop browser
                withQrCode: device.type === 'desktop',
                uri: provider.connector.uri,
                // pass an onClose callback that throws when the modal is closed
                onClose: () => {
                  return reject(new UserRejectedRequestError());
                }
              });
            }
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

    // close modal when QR code is scanned
    setIsModalOpen(false);

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

export async function getEthereumWalletConnectProvider(): Promise<EthereumProvider> {
  log('getEthereumWalletConnectProvider');

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
