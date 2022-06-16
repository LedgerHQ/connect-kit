export class PlatformOrBrowserNotSupportedError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "Your current platform or browser are not supported.";
  }
}

export class NotLedgerConnectProviderError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "The Ledger Connect browser extension was not found.";
  }
}

export type ShowAppropriateModalResponse = {
  error: Error | undefined;
};
