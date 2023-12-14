// chain

export enum SupportedProviderImplementations {
  LedgerConnect = "LedgerConnect",
  WalletConnect = "WalletConnect",
}

// logging

export type EnableDebugLogsFunction = () => void;

// support

export type CheckSupportOptions = {
  walletConnectVersion?: number;
  providerType: SupportedProviders;

  // WalletConnect v2 init parameters
  projectId?: string; // REQUIRED WC v2 project id, throws if v2 and not set
  chains?: number[]; // REQUIRED ethereum chains, has default
  optionalChains?: number[]; // OPTIONAL ethereum chains
  methods?: string[]; // REQUIRED ethereum methods, has default
  optionalMethods?: string[]; // OPTIONAL ethereum methods
  events?: string[]; // REQUIRED ethereum events, has default
  optionalEvents?: string[]; // OPTIONAL ethereum events
  rpcMap?: { [chainId: string]: string }; // OPTIONAL rpc urls for each chain

  // WalletConnect v1 init parameters
  chainId?: number;
  bridge?: string;
  infuraId?: string;
  rpc?: { [chainId: number]: string };
};

export type CheckSupportResult = {
  isLedgerConnectSupported: boolean;
  isLedgerConnectEnabled: boolean;
  isChainIdSupported?: boolean;
  providerImplementation: SupportedProviderImplementations;
};

export type CheckSupportFunction = (
  options: CheckSupportOptions
) => CheckSupportResult;

// ethereum

export type EthereumRequestPayload = {
  method: string;
  params?: unknown[] | object;
};

export interface EthereumProvider {
  providers?: EthereumProvider[];
  connector?: unknown;
  session?: unknown;
  chainId: string | number;
  request<T = unknown>(args: EthereumRequestPayload): Promise<T>;
  disconnect?: { (): Promise<void> };
  on(event: any, listener: any): void;
  removeListener(event: string, listener: any): void;
}

// getProvider

export enum SupportedProviders {
  Ethereum = 'Ethereum',
}

export type ProviderResult = EthereumProvider;

export type GetProviderFunction = () => Promise<ProviderResult>;

// script loader

export interface LedgerConnectKit {
  enableDebugLogs: EnableDebugLogsFunction;
  checkSupport: CheckSupportFunction;
  getProvider: GetProviderFunction;
}

export async function loadConnectKit(): Promise<LedgerConnectKit> {
  const src = "https://unpkg.com/@ledgerhq/connect-kit@1.1.4";
  const globalName = "ledgerConnectKit";

  return new Promise((resolve, reject) => {
    const scriptId = `ledger-ck-script-${globalName}`;

    // we don't support server side rendering, reject with no stack trace for now
    if (typeof document === "undefined") {
      reject("Connect Kit does not support server side");
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
      });
      script.addEventListener("error", (e) => {
        reject(e.error);
      });
      document.head.appendChild(script);
    }
  });
}
