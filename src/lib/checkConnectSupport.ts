import { Device, getBrowser } from "./getBrowser";

/* USB support */

type CustomNavigator = Navigator & { usb: { getDevices(): void } }

const isWebUSBSupported = (): boolean => {
  return (
    !!navigator &&
      !!(navigator as CustomNavigator).usb &&
      typeof (navigator as CustomNavigator).usb.getDevices === 'function'
  )
}

const isU2FSupported = (device: Device): boolean => {
  return (
    typeof navigator.credentials?.create === 'function' ||
    typeof navigator.credentials?.get === 'function') &&
    // Exclude these as even if they support U2F (when using HTTPS) they cannot
    // not use USB, or are being excluded by @ledgerhq/hw-transport-u2f
    //
    // Safari (both on macOS and iOS)
    !(device.browser.name === "Safari") &&
    // any browser on iOS
    !(device.os.name === "iOS")
}

/* Ledger Connect extension support */

type InjectedProvider = Record<string, boolean> &
  Record<string, InjectedProvider[]>;

interface CustomWindow extends Window {
  ethereum: InjectedProvider;
}

declare const window: CustomWindow;
const LedgerConnectNameSpace = "ethereum";
const LedgerConnectIdentityFlag = "isLedgerConnect";

export type CheckConnectSupport = {
  isConnectSupported: boolean,
  isProviderDefined: boolean,
  isLedgerConnectExtensionLoaded: boolean,
  isLedgerLiveMobileInstalled: boolean,
  isWebUSBSupported: boolean,
  isU2FSupported: boolean
}

export function checkConnectSupport(): CheckConnectSupport {
  const device = getBrowser();

  // check Connect support, currently Safari only on iOS/iPadOS
  const isConnectSupported =
    device.os.name === "iOS" && device.browser.name === "Safari";

  // TODO check if LLM is installed, do a deep link request
  const isLedgerLiveMobileInstalled = false;

  // check provider
  const provider = window[LedgerConnectNameSpace];
  const isProviderDefined = !!provider;

  // check extension enabled
  const isLedgerConnectExtensionLoaded =
    !!provider && !!provider[LedgerConnectIdentityFlag];

  const supportResponse = {
    isConnectSupported,
    isProviderDefined,
    isLedgerConnectExtensionLoaded,
    isLedgerLiveMobileInstalled,
    isWebUSBSupported: isWebUSBSupported(),
    isU2FSupported: isU2FSupported(device)
  };

  return supportResponse;
}
