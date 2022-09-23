// support

export type ConnectSupport = {
  isConnectSupported: boolean;
  isLedgerConnectExtensionLoaded: boolean;
  isLedgerLiveMobileInstalled: boolean | undefined;
  isWebUSBSupported: boolean;
  isU2FSupported: boolean;
};

export type ConnectSupportFunction = () => ConnectSupport;

// ethereum

export interface EthereumProvider {
  providers?: EthereumProvider[];
  request(...args: unknown[]): Promise<unknown>;
  on(...args: unknown[]): void;
  removeListener(...args: unknown[]): void;
}

export type GetEthereumProviderFunction = () => EthereumProvider | null;

// solana

export interface SolanaProvider {
  signTransaction(...args: unknown[]): Promise<unknown>;
  signAllTransactions(...args: unknown[]): Promise<unknown>;
  signAndSendTransaction(...args: unknown[]): Promise<unknown>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export type GetSolanaProviderFunction = () => SolanaProvider | null;

// getProvider

export enum SupportedProviders {
  ethereum = 'ethereum',
  solana = 'solana'
}

export type GetProviderFunction = (provider: SupportedProviders) => EthereumProvider | SolanaProvider | null;

// modal

export type ShowModalOptions = ConnectSupport & { connectorSupportsUsb?: boolean }

export type ShowModalResult = {
  error?: Error
}

export type ShowModalFunction = (params: ShowModalOptions) => ShowModalResult;

// script loader

function loadScript(src: string, globalName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptId = `ledger-ck-script-${globalName}`

    if (document.getElementById(scriptId)) {
      resolve((window as { [key: string]: any })[globalName])
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.id = scriptId
    script.addEventListener("load", () => {
      resolve((window as { [key: string]: any })[globalName])
    })
    script.addEventListener("error", (e) => reject(e.error));
    document.head.appendChild(script)
  })
}

export interface LedgerConnectKit {
  checkConnectSupport: ConnectSupportFunction;
  getProvider: GetProviderFunction;
  getEthereumProvider: GetEthereumProviderFunction;
  getSolanaProvider: GetSolanaProviderFunction;
  showModal: ShowModalFunction;
};

export async function loadConnectKit(): Promise<LedgerConnectKit> {
  const CONNECT_KIT_CDN_URL = "https://incomparable-duckanoo-b48572.netlify.app/umd/index.js"
  const CONNECT_KIT_GLOBAL_NAME = "ledgerConnectKit"

  return await loadScript(CONNECT_KIT_CDN_URL, CONNECT_KIT_GLOBAL_NAME)
}
