import { Device, getBrowser } from "./getBrowser";
import { getEthereumProvider } from "./getProvider";

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
    // use USB, or are being excluded by @ledgerhq/hw-transport-u2f
    //
    // Safari (both on macOS and iOS)
    !(device.browser.name === "Safari") &&
    // any browser on iOS
    !(device.os.name === "iOS")
}

/* Ledger Connect extension support */

// check if Connect supports the user's platform
function isConnectSupported (device: Device): boolean {
  return (device.os.name === "iOS" && device.browser.name === "Safari");
}

export type ConnectSupport = {
  isConnectSupported: boolean,
  isLedgerConnectExtensionLoaded: boolean,
  isLedgerLiveMobileInstalled: boolean | undefined,   // not used yet
  isWebUSBSupported: boolean,
  isU2FSupported: boolean
}

export function checkConnectSupport(): ConnectSupport {
  const device = getBrowser();

  return {
    isConnectSupported: isConnectSupported(device),
    isLedgerConnectExtensionLoaded: !!getEthereumProvider(),
    isLedgerLiveMobileInstalled: undefined,
    isWebUSBSupported: isWebUSBSupported(),
    isU2FSupported: isU2FSupported(device)
  };
}
