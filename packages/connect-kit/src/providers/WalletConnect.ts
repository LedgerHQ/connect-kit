import WalletConnectProvider from '@walletconnect/ethereum-provider/dist/umd/index.min.js';
import { ProviderResult } from '../lib/provider';
import { getErrorLogger, getLogger } from '../lib/logger';
import { setIsModalOpen } from '../components/Modal/Modal';

const log = getLogger('WalletConnect');
const logError = getErrorLogger('WalletConnect');

let walletConnectProvider: WalletConnectProvider;
// needed for controlling when provider events are assigned
let hasAssignedProviderEvents: boolean = false;

export interface initWalletConnectProviderOptions {
  bridge?: string;
  infuraId?: string;
  rpc?: { [chainId: number]: string };
  chainId?: number;
}

export function initWalletConnectProvider (options: initWalletConnectProviderOptions): void {
  log('initWalletConnectProvider', options);

  if (!!walletConnectProvider) {
    log('we already have a provider');
    // assign events after disconnecting so that the connect event fires
    assignProviderEvents(walletConnectProvider);
    return;
  }

  const bridge = options.bridge || 'https://bridge.walletconnect.org';
  const infuraId = options.infuraId || '';
  const rpc = options.rpc;
  const chainId = options.chainId || 1;

  const provider = new WalletConnectProvider({
    bridge,
    qrcode: false,
    infuraId,
    rpc,
    chainId,
  });

  assignProviderEvents(provider);

  log('assigning new provider instance');
  walletConnectProvider = provider;
}

function assignProviderEvents(provider: WalletConnectProvider) {
  log('assignProviderEvents');

  if (hasAssignedProviderEvents) {
    return;
  }

  provider.connector.on('connect', connectHandler);
  provider.on("disconnect", disconnectHandler);
  hasAssignedProviderEvents = true;

  function connectHandler(error: Error | null, payload: any) {
    log('connectHandler', payload);

    if (error) {
      logError('error', error);
      throw error;
    }

    // hide the Connect Kit modal when connected
    setIsModalOpen(false);
  }

  function disconnectHandler(code: number, reason: string) {
    log('handleDisconnect', code, reason);

    provider.connector.killSession();

    provider.removeListener("disconnect", disconnectHandler);
    hasAssignedProviderEvents = false;
  }
};

export function isWalletConnectProviderConnected () {
  log('isWalletConnectProviderConnected', walletConnectProvider.connected);

  return walletConnectProvider.connected;
}

export function getWalletConnectUri() {
  log('getWalletConnectUri');

  return walletConnectProvider?.connector?.uri;
}

export function getWalletConnectProvider(): Promise<ProviderResult> {
  return new Promise((resolve, reject) => {
    log('getWalletConnectProvider');

    try {
      walletConnectProvider.enable().then(() => {
        resolve(walletConnectProvider);
      });
    } catch (err) {
      logError('error', err);

      let error: Error;

      if (err instanceof Error) {
        error = err
      } else {
        error = new Error(String(err))
      }

      reject(error);
    }
  })
}
