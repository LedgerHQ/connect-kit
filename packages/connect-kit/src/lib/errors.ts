export class ProviderNotFoundError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = 'The Ledger Extension was not found.';
  }
}

export class ProviderTypeIsNotSupportedError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = 'The specified provider is not supported.';
  }
}

export class ProviderRpcError extends Error {
  readonly code: number;

  public constructor(code: number, message: string) {
    super();
    this.name = this.constructor.name;
    this.code = code;
    this.message = message;
  }

  toString() {
    return `${this.message} (${this.code})`;
  }
}

export class UserRejectedRequestError extends Error {
  readonly code: number;

  public constructor() {
    super();
    this.name = this.constructor.name;
    this.code = 4001;
    this.message = 'User rejected request';
  }
}

export class NoServerSideError extends Error {
  public constructor() {
    super();
    this.message = 'Connect Kit does not support server side.';
  }
}
