import { getEthereumProvider } from "../providers/Ethereum";
import { getSolanaProvider } from "../providers/Solana";
import { initWalletConnectProvider, isWalletConnectProviderConnected } from "../providers/WalletConnect";
import { isLedgerConnectSupported } from "./connectSupport";
import { getBrowser } from "./browser";
import {
  ConnectSupportedChains,
  SupportedProviders,
  setChainId,
  isChainIdSupported,
  setProviderImplementation,
  SupportedProviderImplementations,
  setProviderType
} from "./provider";
import { getLogger } from "./logger";
import { showModal } from "./modal";

const log = getLogger('checkSupport');

export type CheckSupportOptions = {
  providerType: SupportedProviders;
  chainId?: ConnectSupportedChains;
  bridge?: string;
  infuraId?: string;
  rpc: { [chainId: number]: string; };
}

export type CheckSupportResult = {
  isLedgerConnectSupported?: boolean;
  isLedgerConnectEnabled?: boolean;
  isChainIdSupported?: boolean;
  providerImplementation: SupportedProviderImplementations;
}

export function checkSupport(options: CheckSupportOptions): CheckSupportResult {
  log('initializing', options);

  setProviderType(options.providerType);

  // default to Ethereum Mainnet if not specified
  const chainId = options.chainId || 1;
  setChainId(chainId);

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
    const ethereumProvider = getEthereumProvider();
    isLedgerConnectEnabled = !!ethereumProvider;
  } catch (err) {
    // swallow any error
  }

  const checkSupportResult: CheckSupportResult = {
    isLedgerConnectSupported: isLedgerConnectSupported(device),
    isLedgerConnectEnabled: !!isLedgerConnectEnabled,
    isChainIdSupported: isChainIdSupported(options.chainId),
    providerImplementation: SupportedProviderImplementations.LedgerConnect,
  };

  if (
    !checkSupportResult.isLedgerConnectSupported ||
    !checkSupportResult.isChainIdSupported
  ) {
    // unsupported platform or chainId, use WalletConnect
    checkSupportResult.providerImplementation = SupportedProviderImplementations.WalletConnect;
    initWalletConnectProvider({
      bridge: options.bridge,
      infuraId: options.infuraId,
      rpc: options.rpc,
      chainId: options.chainId,
    });

    // don't show the modal if the WalletConnect provider is connected
    if (isWalletConnectProviderConnected()) {
      return checkSupportResult;
    }

    // show the QR code if we are on a desktop browser
    const withQrCode = (device.type === 'desktop');
    showModal('ConnectWithLedgerLiveModal', { withQrCode });
  } else if (
    checkSupportResult.isLedgerConnectSupported &&
    !checkSupportResult.isLedgerConnectEnabled
  ) {
    // supported platform but Connect is not enabled
    showModal("ExtensionUnavailableModal");
  }

  setProviderImplementation(checkSupportResult.providerImplementation);

  return checkSupportResult;
}

function checkSolanaSupport() {
  const device = getBrowser();
  let isLedgerConnectEnabled: boolean = false;

  try {
    // just check if we can get the provider
    const ethereumProvider = getSolanaProvider();
    isLedgerConnectEnabled = !!ethereumProvider;
  } catch (err) {
    // swallow any error
  }

  const checkSupportResult: CheckSupportResult = {
    isLedgerConnectSupported: isLedgerConnectSupported(device),
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
    showModal("ExtensionUnavailableModal");
  }

  return checkSupportResult;
}
