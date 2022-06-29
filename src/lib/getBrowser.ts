import bowser from "bowser"

declare type Platform =
  | DeviceOSName
  | DeviceBrowserName
  | DeviceType
  | "all";
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
  | "Safari";

declare type DeviceType = "desktop" | "mobile" | "tablet";

export declare type Device = {
  os: DeviceOS;
  type: DeviceType;
  browser: DeviceBrowser;
};

export function getBrowser(): Device {
  const parsed = bowser.getParser(window.navigator.userAgent);
  const os = parsed.getOS();
  const browser = parsed.getBrowser();
  const { type } = parsed.getPlatform();

  return {
    type: type as DeviceType,
    os: os as DeviceOS,
    browser: browser as DeviceBrowser,
  };
}
