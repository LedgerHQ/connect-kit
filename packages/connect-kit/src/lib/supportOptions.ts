import { getDebugLogger } from "./logger";
import { SupportedProviders } from "./provider";

const log = getDebugLogger('supportOptions');
let moduleSupportOptions: CheckSupportOptions;

export type CheckSupportOptions = {
  providerType: SupportedProviders;
  isHeadless?: boolean;
  chainId?: number;
  bridge?: string;
  infuraId?: string;
  rpc?: { [chainId: number]: string; };
}

export const setSupportOptions = (options: CheckSupportOptions): void => {
  log('setSupportOptions', options);

  moduleSupportOptions = options;
}

export const getSupportOptions = (): CheckSupportOptions => {
  log('getSupportOptions');

  return moduleSupportOptions;
}
