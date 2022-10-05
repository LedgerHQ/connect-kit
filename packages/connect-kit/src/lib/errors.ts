export class PlatformOrBrowserNotSupportedError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "Your current platform or browser is not supported.";
  }
}

export class NotLedgerConnectProviderError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "The Ledger Connect extension was not found.";
  }
}
