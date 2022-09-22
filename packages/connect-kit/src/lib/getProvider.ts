export const SupportedProviders = {
  ethereum: 'ethereum',
  solana: 'solana'
} as const;
type SupportedProvidersType = typeof SupportedProviders
export type SupportedProvider = SupportedProvidersType[keyof SupportedProvidersType]

export function getProvider (provider: SupportedProvider) {
  switch (provider) {
    case SupportedProviders.ethereum:
      return getEthereumProvider()
      break
    case SupportedProviders.solana:
      return getSolanaProvider()
      break
    defualt:
      return null
  }
}

// Ethereum provider

export const LEDGER_ETHEREUM_PROVIDER = 'ethereum'
export const LEDGER_CONNECT_ETHEREUM_PROP = 'isLedgerConnect'

export interface EthereumProvider {
  [LEDGER_CONNECT_ETHEREUM_PROP]: boolean
  providers?: EthereumProvider[]
  on(): void
  request(): Promise<any>
  removeListener(): void
}

export declare interface WindowWithEthereum {
  [LEDGER_ETHEREUM_PROVIDER]?: EthereumProvider
}

export function getEthereumProvider () {
  const provider = (window as WindowWithEthereum)[LEDGER_ETHEREUM_PROVIDER]

  if (typeof provider !== "undefined" && provider[LEDGER_CONNECT_ETHEREUM_PROP]) {
    return provider
  }

  return null
};

// Solana provider

export const LEDGER_SOLANA_PROVIDER = 'solana'
export const LEDGER_CONNECT_SOLANA_PROP = 'isPhantom'

export interface SolanaProvider {
  [LEDGER_CONNECT_SOLANA_PROP]: boolean
  signTransaction(...args: any[]): Promise<any>
  signAllTransactions(...args: any[]): Promise<any>
  signAndSendTransaction(...args: any[]): Promise<any>
  connect(): Promise<void>
  disconnect(): Promise<void>
}

export declare interface WindowWithSolana {
  [LEDGER_SOLANA_PROVIDER]?: SolanaProvider
}

export function getSolanaProvider () {
  const provider = (window as WindowWithSolana)[LEDGER_SOLANA_PROVIDER]

  if (typeof provider !== "undefined" && provider[LEDGER_CONNECT_SOLANA_PROP]) {
    return provider
  }

  return null
}
