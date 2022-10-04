import { isLedgerConnectSupported } from "./checkConnectSupport";
import { NotLedgerConnectProviderError, PlatformOrBrowserNotSupportedError } from "./errors";
import { getBrowser } from "./getBrowser";
import { getEthereumProvider } from "./getProvider";
import { showModal } from "./showModal";

export type CheckSupportOptions = {
  connectorSupportsUsb?: boolean;
  browserSupportsUsb?: boolean;
}

export type CheckSupportResult = {
  isLedgerConnectSupported: boolean;
  isLedgerConnectEnabled: boolean;
  isLedgerLiveMobileInstalled?: boolean;   // not used yet
  error?: Error;
}

export function checkSupport(options?: CheckSupportOptions): CheckSupportResult {
  const device = getBrowser();

  const checkSupportResult: CheckSupportResult = {
    isLedgerConnectSupported: isLedgerConnectSupported(device),
    isLedgerConnectEnabled: !!getEthereumProvider(),
  };

  const isUSBSupported = !!options?.connectorSupportsUsb && !!options?.browserSupportsUsb
  const noSupportedTransports = !checkSupportResult.isLedgerConnectSupported && !isUSBSupported

  if (noSupportedTransports) {
    // if none of the connection methods is supported, show the Platform Not
    // Supported modal
    checkSupportResult.error = new PlatformOrBrowserNotSupportedError();

    if (!!options?.connectorSupportsUsb) {
      showModal("PlatformNotSupportedModalWithUsb");
    } else {
      showModal("PlatformNotSupportedModal");
    }
  } else if (
    checkSupportResult.isLedgerConnectSupported &&
    !checkSupportResult.isLedgerConnectEnabled
  ) {
    // if we're on a supported platform but Connect is not enabled show the
    // Try Ledger Connect modal
    checkSupportResult.error = new NotLedgerConnectProviderError();
    showModal("NotInstalledOrUnavailable");
  }

  return checkSupportResult;
}
