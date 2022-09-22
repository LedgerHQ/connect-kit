// support

export type ConnectSupport = {
  isConnectSupported: boolean;
  isLedgerConnectExtensionLoaded: boolean;
  isLedgerLiveMobileInstalled: boolean | undefined;
  isWebUSBSupported: boolean;
  isU2FSupported: boolean;
};

export interface ConnectSupportFunction {
  (): ConnectSupport;
}

// ethereum

export interface EthereumProvider {
  providers?: EthereumProvider[]
  request(...args: any[]): Promise<any>
  on(...args: any[]): void
  removeListener(...args: any[]): void
}

export interface GetEthereumProviderFunction {
  (): EthereumProvider | null
}

// solana

export interface SolanaProvider {
  signTransaction(...args: any[]): Promise<any>
  signAllTransactions(...args: any[]): Promise<any>
  signAndSendTransaction(...args: any[]): Promise<any>
  connect(): Promise<void>
  disconnect(): Promise<void>
}

export interface GetSolanaProviderFunction {
  (): SolanaProvider | null
}

// getProvider

export const SupportedProviders = {
  ethereum: 'ethereum',
  solana: 'solana'
} as const;
export type SupportedProvidersType = typeof SupportedProviders
export type SupportedProvider =  SupportedProvidersType[keyof SupportedProvidersType]

export interface GetProviderFunction {
  (provider: SupportedProvider): EthereumProvider | SolanaProvider | null
}

// modal

export type ShowModalOptions = ConnectSupport & { connectorSupportsUsb: boolean }

export type ShowModalResult = {
  error?: Error
}

export interface ShowModalFunction {
  (params: ShowModalOptions): ShowModalResult
}

export type LedgerConnectKit = {
  checkConnectSupport: ConnectSupportFunction;
  getProvider: GetProviderFunction;
  getEthereumProvider: GetEthereumProviderFunction;
  getSolanaProvider: GetSolanaProviderFunction;
  showModal: ShowModalFunction;
};

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

export async function loadConnectKit(): Promise<LedgerConnectKit> {
  const CONNECT_KIT_CDN_URL = "https://incomparable-duckanoo-b48572.netlify.app/umd/index.js"
  const CONNECT_KIT_GLOBAL_NAME = "ledgerConnectKit"

  return await loadScript(CONNECT_KIT_CDN_URL, CONNECT_KIT_GLOBAL_NAME)
}
