import WalletConnectProvider from '@walletconnect/ethereum-provider/dist/umd/index.min.js';
import { getErrorLogger, getDebugLogger } from '../lib/logger';
import { setIsModalOpen } from '../components/Modal/Modal';
import { setWalletConnectUri } from '../components/ConnectWithLedgerLiveModal/ConnectWithLedgerLiveModal';
import { EthereumProvider } from './Ethereum';

const log = getDebugLogger('WalletConnect');
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
  provider.connector.on("display_uri", displayUriHandler);
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

  function displayUriHandler(error: Error | null, payload: any) {
    log('displayUriHandler', error, payload);

    const uri = payload.params[0];
    setWalletConnectUri(uri);
  }

  function disconnectHandler(code: number, reason: string) {
    log('disconnectHandler', code, reason);

    provider.removeListener("disconnect", disconnectHandler);
    hasAssignedProviderEvents = false;
  }
};

export function isWalletConnectProviderConnected () {
  log('isWalletConnectProviderConnected', walletConnectProvider.connected);

  return walletConnectProvider.connected;
}

export async function getWalletConnectProvider(): Promise<EthereumProvider> {
  log('getWalletConnectProvider');

  try {
    await walletConnectProvider.enable();
    return walletConnectProvider as EthereumProvider;
  } catch (err) {
    const error = (err instanceof Error) ? err : new Error(String(err));
    logError('error', error);
    throw error;
  }
}
