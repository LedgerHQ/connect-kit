import bowser from "bowser";

export declare type Platform =
  | DeviceOSName
  | DeviceBrowserName
  | DeviceType
  | "all";
export declare type DeviceOS = {
  name: DeviceOSName;
  version: string;
};
export declare type DeviceBrowser = {
  name: DeviceBrowserName;
  version: string;
};
export declare type DeviceOSName =
  | "Windows Phone"
  | "Windows"
  | "macOS"
  | "iOS"
  | "Android"
  | "Linux"
  | "Chrome OS";
export declare type DeviceBrowserName =
  | "Android Browser"
  | "Chrome"
  | "Chromium"
  | "Firefox"
  | "Microsoft Edge"
  | "Opera"
  | "Safari";

export declare type DeviceType = "desktop" | "mobile" | "tablet";

export declare type Device = {
  os: DeviceOS;
  type: DeviceType;
  browser: DeviceBrowser;
};

function getBrowser(): Device {
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

export default getBrowser;
