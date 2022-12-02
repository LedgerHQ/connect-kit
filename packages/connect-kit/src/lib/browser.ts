import bowser from "bowser"

declare type DeviceOS = {
  name: DeviceOSName;
  version: string;
};
declare type DeviceBrowser = {
  name: DeviceBrowserName;
  version: string;
};
declare type DeviceOSName =
  | "Windows Phone"
  | "Windows"
  | "macOS"
  | "iOS"
  | "Android"
  | "Linux"
  | "Chrome OS";
declare type DeviceBrowserName =
  | "Android Browser"
  | "Chrome"
  | "Chromium"
  | "Firefox"
  | "Microsoft Edge"
  | "Opera"
  | "Brave"
  | "Safari";

declare type DeviceType = "desktop" | "mobile" | "tablet";

export declare type Device = {
  os: DeviceOS;
  type: DeviceType;
  browser: DeviceBrowser;
};

interface BraveNavigator extends Navigator {
  brave: { isBrave: Function };
}

function isBrave() {
  return (
    (window.navigator as BraveNavigator).brave?.isBrave?.name === "isBrave"
  )
}

export function getBrowser(): Device {
  const parsed = bowser.getParser(window.navigator.userAgent);
  const os = parsed.getOS();
  const browser = parsed.getBrowser();
  const { type } = parsed.getPlatform();

  if (isBrave()) {
    browser.name = "Brave";
  }

  return {
    type: type as DeviceType,
    os: os as DeviceOS,
    browser: browser as DeviceBrowser,
  };
}
