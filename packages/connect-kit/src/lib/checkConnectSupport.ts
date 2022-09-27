import { Device } from "./getBrowser";

// check if Connect supports the user's platform
export function isLedgerConnectSupported (device: Device): boolean {
  return (device.os.name === "iOS" && device.browser.name === "Safari");
}
