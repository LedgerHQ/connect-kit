import {
  areAllRequiredChainsSupported,
  getExtensionProvider,
  isExtensionSupported
} from "../providers/ExtensionEvm";
import { getSolanaProvider } from "../providers/ExtensionSolana";
import { getBrowser } from "./browser";
import {
  SupportedProviders,
  setProviderImplementation,
  SupportedProviderImplementations,
} from "./provider";
import { getDebugLogger } from "./logger";
import { showModal } from "./modal";
import {
  CheckSupportOptions,
  getSupportOptions,
  setSupportOptions,
  ValidatedSupportOptions
} from "./supportOptions";

const log = getDebugLogger('support');
let moduleSupportResult: CheckSupportResult;

export type CheckSupportResult = {
  isLedgerConnectSupported?: boolean;
  isLedgerConnectEnabled?: boolean;
  isChainIdSupported?: boolean;
  providerImplementation: SupportedProviderImplementations;
}

/**
 * Check support for user's platform.
 */
export function checkSupport(options: CheckSupportOptions): CheckSupportResult {
  log('checkSupport', options);

  setSupportOptions(options);
  const supportOptions = getSupportOptions();
  let checkSupportResult: CheckSupportResult;

  switch (supportOptions.providerType) {
    case SupportedProviders.Ethereum:
      checkSupportResult = checkEthereumSupport(supportOptions);
      break;
    case SupportedProviders.Solana:
      checkSupportResult = checkSolanaSupport();
      break;
  }

  log('checkSupportResult is', checkSupportResult);

  moduleSupportResult = checkSupportResult;
  return checkSupportResult;
}

/**
 * Gets support results.
 */
export function getSupportResult(): CheckSupportResult {
  log('getSupportResult');

  return moduleSupportResult;
}

/**
 * Check support for Ethereum.
 */
function checkEthereumSupport(options: ValidatedSupportOptions) {
  log('checkEthereumSupport', options);

  const device = getBrowser();
  let isLedgerConnectEnabled: boolean = false;

  try {
    // just check if we can get the Connect provider
    const ethereumProvider = getExtensionProvider();
    isLedgerConnectEnabled = !!ethereumProvider;
  } catch (err) {
    // swallow any error
  }

  const checkSupportResult: CheckSupportResult = {
    isLedgerConnectSupported: isExtensionSupported(device),
    isLedgerConnectEnabled: !!isLedgerConnectEnabled,
    isChainIdSupported: areAllRequiredChainsSupported(options.chains),
    // set initial provider implementation to the extension
    providerImplementation: SupportedProviderImplementations.LedgerConnect,
  };

  // set implementation to WalletConnect if
  // - platform not supported
  // - required chains not supported
  // - extension not enabled (so we can guide users to install it)
  if (
    !checkSupportResult.isLedgerConnectSupported ||
    !checkSupportResult.isLedgerConnectEnabled ||
    !checkSupportResult.isChainIdSupported
  ) {
    // unsupported platform or chainId, or extension not enabled, use WalletConnect
    checkSupportResult.providerImplementation = SupportedProviderImplementations.WalletConnect;
  }

  setProviderImplementation(checkSupportResult.providerImplementation);

  return checkSupportResult;
}

/**
 * Check support for Solana.
 */
function checkSolanaSupport() {
  log('checkSolanaSupport');

  const device = getBrowser();
  let isLedgerConnectEnabled: boolean = false;

  try {
    // just check if we can get the provider
    const solanaProvider = getSolanaProvider();
    isLedgerConnectEnabled = !!solanaProvider;
  } catch (err) {
    // swallow any error
  }

  const checkSupportResult: CheckSupportResult = {
    isLedgerConnectSupported: isExtensionSupported(device),
    isLedgerConnectEnabled: !!isLedgerConnectEnabled,
    providerImplementation: SupportedProviderImplementations.LedgerConnect,
  }

  if (!checkSupportResult.isLedgerConnectSupported) {
    showModal("PlatformNotSupportedModal");
  } else if (
    checkSupportResult.isLedgerConnectSupported &&
    !checkSupportResult.isLedgerConnectEnabled
  ) {
    // if we're on a supported platform but Connect is not enabled
    showModal("ExtensionInstallModal");
  }

  return checkSupportResult;
}
