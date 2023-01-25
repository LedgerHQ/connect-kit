import type { CoreTypes } from '@walletconnect/types';
import { WalletConnectProviderOptions } from "../providers/WalletConnect";
import { WalletConnectLegacyProviderOptions } from '../providers/WalletConnectLegacy';
import { getDebugLogger } from "./logger";
import {
  SupportedProviders,
  DEFAULT_REQUIRED_CHAINS,
  DEFAULT_WALLETCONNECT_VERSION,
  DEFAULT_CHAIN_ID
} from "./provider";

const log = getDebugLogger('supportOptions');
let moduleSupportOptions: ValidatedSupportOptions;

type CheckSupportCommonOptions = {
  version?: number;                  // OPTIONAL, has default
  providerType: SupportedProviders;  // REQUIRED
}

// WalletConnect v2 init parameters
export type CheckSupportWalletConnectProviderOptions = {
  projectId?: string;              // REQUIRED WC v2 project id, throws if v2 and not set
  chains?: number[];               // REQUIRED ethereum chains, has default
  optionalChains?: number[];       // OPTIONAL ethereum chains
  methods?: string[];              // REQUIRED ethereum methods, has default
  optionalMethods?: string[];      // OPTIONAL ethereum methods
  events?: string[];               // REQUIRED ethereum events, has default
  optionalEvents?: string[];       // OPTIONAL ethereum events
  rpcMap?: { [chainId: string]: string; };  // OPTIONAL rpc urls for each chain
  metadata?: CoreTypes.Metadata;   // OPTIONAL metadata of your app
}

// WalletConnect v1 init parameters
export type CheckSupportWalletConnectLegacyProviderOptions = {
  chainId?: number;
  bridge?: string;
  infuraId?: string;
  rpc?: { [chainId: number]: string };
}

// exposed API parameters type, allows some undefined parameters
export type CheckSupportOptions =
  CheckSupportCommonOptions &
  CheckSupportWalletConnectProviderOptions &
  CheckSupportWalletConnectLegacyProviderOptions;

// stricter validated parameters type, after defaults are set
export type ValidatedSupportOptions = CheckSupportOptions &
  WalletConnectProviderOptions &
  WalletConnectLegacyProviderOptions;

/**
 * Sets defaults and makes the result available for other modules.
 */
export const setSupportOptions = (options: CheckSupportOptions): void => {
  log('setSupportOptions', options);

  const validatedOptions: ValidatedSupportOptions = {
    ...options,
    version: options.version || DEFAULT_WALLETCONNECT_VERSION,
    chains: options.chains || DEFAULT_REQUIRED_CHAINS,
    chainId: options.chainId || DEFAULT_CHAIN_ID,
    projectId: options.projectId || '',
  };

  if (options.version === 2 && (!options.projectId || options.projectId === '')) {
    throw new Error(
      'WalletConnect requires a projectId. Please visit https://cloud.walletconnect.com to get one.'
    )
  }

  moduleSupportOptions = validatedOptions;
}

/**
 * Gets the validated support options.
 */
export const getSupportOptions = (): ValidatedSupportOptions => {
  log('getSupportOptions');

  return moduleSupportOptions;
}
