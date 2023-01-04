import { getEthereumConnectProvider } from "../providers/EthereumConnect";
import { getSolanaConnectProvider } from "../providers/SolanaConnect";
import { isLedgerConnectSupported } from "./connectSupport";
import { getBrowser } from "./browser";
import {
  ConnectSupportedChains,
  SupportedProviders,
  isChainIdSupported,
  setProviderImplementation,
  SupportedProviderImplementations,
} from "./provider";
import { getDebugLogger } from "./logger";
import { showModal } from "./modal";
import { CheckSupportOptions, setSupportOptions } from "./supportOptions";

const log = getDebugLogger('support');

export type CheckSupportResult = {
  isLedgerConnectSupported?: boolean;
  isLedgerConnectEnabled?: boolean;
  isChainIdSupported?: boolean;
  providerImplementation: SupportedProviderImplementations;
}

export function checkSupport(options: CheckSupportOptions): CheckSupportResult {
  log('checkSupport');

  setSupportOptions(options);

  // default to Ethereum Mainnet if not specified
  const chainId = options.chainId || 1;

  switch (options.providerType) {
    case SupportedProviders.Ethereum:
      return checkEthereumSupport({ ...options, chainId });
      break;
    case SupportedProviders.Solana:
      return checkSolanaSupport();
      break
  }
}

// same as CheckSupportOptions but chainId is now required
export type CheckEthereumSupportOptions = CheckSupportOptions & {
  chainId: ConnectSupportedChains;
}

function checkEthereumSupport(options: CheckEthereumSupportOptions) {
  const device = getBrowser();
  let isLedgerConnectEnabled: boolean = false;

  try {
    // just check if we can get the Connect provider
    const ethereumProvider = getEthereumConnectProvider();
    isLedgerConnectEnabled = !!ethereumProvider;
  } catch (err) {
    // swallow any error
  }

  const checkSupportResult: CheckSupportResult = {
    isLedgerConnectSupported: isLedgerConnectSupported(device),
    isLedgerConnectEnabled: isLedgerConnectEnabled,
    isChainIdSupported: isChainIdSupported(options.chainId),
    providerImplementation: SupportedProviderImplementations.LedgerConnect,
  };

  if (
    !checkSupportResult.isLedgerConnectSupported ||
    !checkSupportResult.isChainIdSupported
  ) {
    // unsupported platform or chainId, use WalletConnect
    checkSupportResult.providerImplementation = SupportedProviderImplementations.WalletConnect;
  }

  setProviderImplementation(checkSupportResult.providerImplementation);

  return checkSupportResult;
}

function checkSolanaSupport() {
  const device = getBrowser();
  let isLedgerConnectEnabled: boolean = false;

  try {
    // just check if we can get the provider
    const solanaProvider = getSolanaConnectProvider();
    isLedgerConnectEnabled = !!solanaProvider;
  } catch (err) {
    // swallow any error
  }

  const checkSupportResult: CheckSupportResult = {
    isLedgerConnectSupported: isLedgerConnectSupported(device),
    isLedgerConnectEnabled: isLedgerConnectEnabled,
    providerImplementation: SupportedProviderImplementations.LedgerConnect,
  }

  if (!checkSupportResult.isLedgerConnectSupported) {
    showModal("PlatformNotSupportedModal");
  } else if (
    checkSupportResult.isLedgerConnectSupported &&
    !checkSupportResult.isLedgerConnectEnabled
  ) {
    // if we're on a supported platform but Connect is not enabled
    showModal("ExtensionUnavailableModal");
  }

  return checkSupportResult;
}
