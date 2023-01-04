// chain

export enum SupportedChains {
  EthereumMainnet = 1,
}

export enum SupportedProviderImplementations {
  LedgerConnect = 'LedgerConnect',
  WalletConnect = 'WalletConnect',
}

// logging

export type EnableDebugLogsFunction = () => void;

// support

export type CheckSupportOptions = {
  providerType: SupportedProviders;
  isHeadless?: boolean;
  chainId?: number;
  bridge?: string;
  infuraId?: string;
  rpc?: { [chainId: number]: string };
}

export type CheckSupportResult = {
  isLedgerConnectSupported: boolean;
  isLedgerConnectEnabled: boolean;
  isChainIdSupported?: boolean;
  providerImplementation: SupportedProviderImplementations;
};

export type CheckSupportFunction = (options: CheckSupportOptions) => CheckSupportResult

// ethereum

export type EthereumRequestPayload = {
  method: string;
  params?: unknown[] | object;
}

export const LEDGER_CONNECT_ETHEREUM_PROP = 'isLedgerConnect'
export const LEDGER_CONNECT_ETHEREUM_SUPPORTED_PROP = 'isLedgerConnectSupported'

export interface EthereumProvider {
  providers?: EthereumProvider[];
  // present on the Ethereum Connect provider
  [LEDGER_CONNECT_ETHEREUM_PROP]?: boolean;
  // present on the Ethereum TryConnect provider
  [LEDGER_CONNECT_ETHEREUM_SUPPORTED_PROP]?: boolean;
  // present on the WalletConnect provider
  connector?: unknown,
  disconnect?: {(): Promise<void>};
  // common Ethereum provider props
  request<T = unknown>(args: EthereumRequestPayload): Promise<T>;
  emit(eventName: string | symbol, ...args: any[]): boolean;
  on(event: any, listener: any): void;
  removeListener(event: string, listener: any): void;
}

// solana

export interface SolanaProvider {
  signTransaction(...args: unknown[]): Promise<unknown>;
  signAllTransactions(...args: unknown[]): Promise<unknown>;
  signAndSendTransaction(...args: unknown[]): Promise<unknown>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

// getProvider

export enum SupportedProviders {
  Ethereum = 'Ethereum',
  Solana = 'Solana',
}

export type ProviderResult = EthereumProvider | SolanaProvider;

export type GetProviderFunction = () => Promise<ProviderResult>;

// script loader

export interface LedgerConnectKit {
  enableDebugLogs: EnableDebugLogsFunction;
  checkSupport: CheckSupportFunction;
  getProvider: GetProviderFunction;
};

export async function loadConnectKit(): Promise<LedgerConnectKit> {
  // const src = "https://cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1";
  const src = "https://idyllic-kelpie-25742f.netlify.app/umd/index.js";
  const globalName = "ledgerConnectKit";

  return new Promise((resolve, reject) => {
    const scriptId = `ledger-ck-script-${globalName}`;

    // we don't support server side rendering, reject with no stack trace for now
    if (typeof document === 'undefined') {
      reject('Connect Kit does not support server side');
      return;
    }

    if (document.getElementById(scriptId)) {
      resolve((window as { [key: string]: any })[globalName]);
    } else {
      const script = document.createElement("script");
      script.src = src;
      script.id = scriptId;
      script.addEventListener("load", () => {
        resolve((window as { [key: string]: any })[globalName]);
      })
      script.addEventListener("error", (e) => {
        reject(e.error);
      });
      document.head.appendChild(script);
    }
  });
}
