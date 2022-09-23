export enum SupportedProviders {
  ethereum = 'ethereum',
  solana = 'solana'
}

export function getProvider (provider: SupportedProviders) {
  switch (provider) {
    case SupportedProviders.ethereum:
      return getEthereumProvider()
      break
    case SupportedProviders.solana:
      return getSolanaProvider()
      break
    default:
      return null
  }
}

// Ethereum provider

export const LEDGER_ETHEREUM_PROVIDER = 'ethereum'
export const LEDGER_CONNECT_ETHEREUM_PROP = 'isLedgerConnect'

export interface EthereumProvider {
  [LEDGER_CONNECT_ETHEREUM_PROP]: boolean;
  providers?: EthereumProvider[];
  request(...args: unknown[]): Promise<unknown>;
  on(...args: unknown[]): void;
  removeListener(...args: unknown[]): void;
}

export interface WindowWithEthereum {
  [LEDGER_ETHEREUM_PROVIDER]?: EthereumProvider;
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
  [LEDGER_CONNECT_SOLANA_PROP]: boolean;
  signTransaction(...args: unknown[]): Promise<unknown>;
  signAllTransactions(...args: unknown[]): Promise<unknown>;
  signAndSendTransaction(...args: unknown[]): Promise<unknown>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export interface WindowWithSolana {
  [LEDGER_SOLANA_PROVIDER]?: SolanaProvider
}

export function getSolanaProvider () {
  const provider = (window as WindowWithSolana)[LEDGER_SOLANA_PROVIDER]

  if (typeof provider !== "undefined" && provider[LEDGER_CONNECT_SOLANA_PROP]) {
    return provider
  }

  return null
}
