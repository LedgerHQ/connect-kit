import { Device } from "./browser";

// check if Connect supports the user's platform
export function isLedgerConnectSupported (device: Device): boolean {
  return (
    (device.os.name === "iOS" || device.os.name === "macOS") &&
    device.browser.name === "Safari"
  );
}
