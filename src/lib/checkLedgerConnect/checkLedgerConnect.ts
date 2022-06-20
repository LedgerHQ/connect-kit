import getBrowser from "../getBrowser";

export type InjectedProvider = Record<string, boolean> &
  Record<string, InjectedProvider[]>;

export interface CustomWindow extends Window {
  ethereum: InjectedProvider;
}

const LedgerConnectNameSpace = "ethereum";
const LedgerConnectIdentityFlag = "isLedgerConnect";

declare const window: CustomWindow;

export function checkLedgerConnect() {
  const device = getBrowser();

  // check supported browsers
  const isSupportedBrowser = device.browser.name === "Safari";

  // check supported platforms
  const isSupportedPlatform =
    device.type === "mobile" || device.type === "tablet";

  // TODO check LLM installed, do a deep link request
  // const isLedgerLiveMobileInstalled = false;

  // check provider
  const provider = window[LedgerConnectNameSpace];
  const isProviderDefined = !!provider;

  // check extension enabled
  const isLedgerConnectExtensionLoaded =
    !!provider && !!provider[LedgerConnectIdentityFlag];

  return {
    isSupportedBrowser,
    isSupportedPlatform,
    // isLedgerLiveMobileInstalled,
    isProviderDefined,
    isLedgerConnectExtensionLoaded,
  };
}
