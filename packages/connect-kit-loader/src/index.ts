import Analytics from "analytics";
import segmentPlugin from "@analytics/segment";

declare global {
  interface Window {
    analytics: any;
  }
}

// chain

export enum SupportedProviderImplementations {
  LedgerConnect = "LedgerConnect",
  WalletConnect = "WalletConnect",
}

// logging

export type EnableDebugLogsFunction = () => void;

// support

export type CheckSupportOptions = {
  walletConnectVersion?: number;
  providerType: SupportedProviders;

  // WalletConnect v2 init parameters
  projectId?: string; // REQUIRED WC v2 project id, throws if v2 and not set
  chains?: number[]; // REQUIRED ethereum chains, has default
  optionalChains?: number[]; // OPTIONAL ethereum chains
  methods?: string[]; // REQUIRED ethereum methods, has default
  optionalMethods?: string[]; // OPTIONAL ethereum methods
  events?: string[]; // REQUIRED ethereum events, has default
  optionalEvents?: string[]; // OPTIONAL ethereum events
  rpcMap?: { [chainId: string]: string }; // OPTIONAL rpc urls for each chain

  // WalletConnect v1 init parameters
  chainId?: number;
  bridge?: string;
  infuraId?: string;
  rpc?: { [chainId: number]: string };
};

export type CheckSupportResult = {
  isLedgerConnectSupported: boolean;
  isLedgerConnectEnabled: boolean;
  isChainIdSupported?: boolean;
  providerImplementation: SupportedProviderImplementations;
};

export type CheckSupportFunction = (
  options: CheckSupportOptions
) => CheckSupportResult;

// ethereum

export type EthereumRequestPayload = {
  method: string;
  params?: unknown[] | object;
};

export interface EthereumProvider {
  providers?: EthereumProvider[];
  connector?: unknown;
  session?: unknown;
  chainId: string | number;
  request<T = unknown>(args: EthereumRequestPayload): Promise<T>;
  disconnect?: { (): Promise<void> };
  on(event: any, listener: any): void;
  removeListener(event: string, listener: any): void;
}

// getProvider

export enum SupportedProviders {
  Ethereum = 'Ethereum',
}

export type ProviderResult = EthereumProvider;

export type GetProviderFunction = () => Promise<ProviderResult>;

// script loader

export interface LedgerConnectKit {
  enableDebugLogs: EnableDebugLogsFunction;
  checkSupport: CheckSupportFunction;
  getProvider: GetProviderFunction;
}

const initAnalytics = () => {
  var analytics = (window.analytics = window.analytics || []);

  // Create a queue, but don't obliterate an existing one!
  // If the real analytics.js is already on the page return.
  if (analytics.initialize) return analytics;
  console.log("init analytics 1");
  // If the snippet was invoked already show an error.
  if (analytics.invoked) {
    if (window.console && console.error) {
      console.error("Segment snippet included twice.");
    }
    return;
  }
  console.log("init analytics 2");

  // Invoked flag, to make sure the snippet
  // is never invoked twice.
  analytics.invoked = true;
  // A list of the methods in Analytics.js to stub.
  analytics.methods = [
    "trackSubmit",
    "trackClick",
    "trackLink",
    "trackForm",
    "pageview",
    "identify",
    "reset",
    "group",
    "track",
    "ready",
    "alias",
    "debug",
    "page",
    "once",
    "off",
    "on",
    "addSourceMiddleware",
    "addIntegrationMiddleware",
    "setAnonymousId",
    "addDestinationMiddleware",
  ];
  // Define a factory to create stubs. These are placeholders
  // for methods in Analytics.js so that you never have to wait
  // for it to load to actually record data. The `method` is
  // stored as the first argument, so we can replay the data.
  analytics.factory = function (method: any) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(method);
      analytics.push(args);
      return analytics;
    };
  };
  // For each of our methods, generate a queueing stub.
  for (var i = 0; i < analytics.methods.length; i++) {
    var key = analytics.methods[i];
    analytics[key] = analytics.factory(key);
  }
  // Define a method to load Analytics.js from our CDN,
  // and that will be sure to only ever load it once.
  analytics.load = function (key: any, options: any) {
    // Create an async script element based on your key.
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";
    // Insert our script next to the first script element.
    var first = document.getElementsByTagName("script")[0];
    first.parentNode?.insertBefore(script, first);
    analytics._loadOptions = options;
  };
  analytics._writeKey = "private_key";
  // Add a version to keep track of what's in the wild.
  analytics.SNIPPET_VERSION = "4.15.2";
  // Load Analytics.js with your key, which will automatically
  // load the tools you've enabled for your account. Boosh!
  analytics.load("private_key");
  // Make the first page call to load the integrations. If
  // you'd like to manually name or tag the page, edit or
  // move this call however you'd like.

  return analytics;
};

export async function loadConnectKit(): Promise<LedgerConnectKit> {
  const src = "connect-kit.vercel.app/umd/index.js";
  const globalName = "ledgerConnectKit";
  const analytics = initAnalytics();

  analytics.track("New Connection", {
    host: window.location.hostname,
  });

  return new Promise((resolve, reject) => {
    const scriptId = `ledger-ck-script-${globalName}`;

    // we don't support server side rendering, reject with no stack trace for now
    if (typeof document === "undefined") {
      reject("Connect Kit does not support server side");
      return;
    }

    if (document.getElementById(scriptId)) {
      resolve((window as { [key: string]: any })[globalName]);
    } else {
      const script = document.createElement("script");
      script.src = src;
      script.id = scriptId;
      script.addEventListener("load", () => {
        resolve((window as { [key: string]: any })[globalName]);
      });
      script.addEventListener("error", (e) => {
        reject(e.error);
      });
      document.head.appendChild(script);
    }
  });
}
