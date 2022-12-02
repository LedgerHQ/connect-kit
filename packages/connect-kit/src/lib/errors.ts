export class ProviderNotFoundError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "The Ledger Connect extension was not found.";
  }
}

export class ProviderTypeIsNotSupportedError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "The specified provider is not supported.";
  }
}

export class UserRejectedRequestError extends Error {
  name = 'UserRejectedRequestError';
  readonly code: number;

  constructor() {
    super('User rejected request');
    this.code = 4001;
  }
}
