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
  chainId: SupportedChains;
  bridge?: string;
  infuraId?: string;
  rpc: { [chainId: number]: string; };
}

export type CheckSupportResult = {
  isLedgerConnectSupported: boolean;
  isLedgerConnectEnabled: boolean;
  isLedgerLiveMobileInstalled: boolean | undefined;
  providerImplementation: SupportedProviderImplementations;
};

export type CheckSupportFunction = (options: CheckSupportOptions) => CheckSupportResult

// ethereum

export interface EthereumProvider {
  providers?: EthereumProvider[];
  request(...args: unknown[]): Promise<unknown>;
  on(...args: unknown[]): void;
  removeListener(...args: unknown[]): void;
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
  const src = "https://idyllic-kelpie-25742f.netlify.app/umd/index.js";
  const globalName = "ledgerConnectKit";

  return new Promise((resolve, reject) => {
    const scriptId = `ledger-ck-script-${globalName}`;

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
