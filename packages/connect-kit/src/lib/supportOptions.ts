import { WalletConnectProviderOptions } from "../providers/WalletConnectEvm";
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
  walletConnectVersion?: number;     // OPTIONAL, has default
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
  relayUrl?: string;
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

  const walletConnectVersion = options.walletConnectVersion || DEFAULT_WALLETCONNECT_VERSION;

  let chains: number[];
  let chainId: number;
  let optionalChains: number[] = [];

  // set default chains and chainId
  // for WalletConnect v1 we only care about chainId
  // for WalletConnect v2 we only care about chains
  if (walletConnectVersion === 1) {
    chainId = options.chainId || DEFAULT_CHAIN_ID;
    chains = [chainId];
  } else {
    chains = options.chains || DEFAULT_REQUIRED_CHAINS;
    chainId = chains[0];

    // put all the required chains first in the optional chains list,
    // we get connection problems otherwise
    optionalChains.push(...chains);
    // add optional chains at the end
    if (options.optionalChains?.length) {
      optionalChains.push(
        ...options.optionalChains.filter((id) => optionalChains.indexOf(id) < 0)
      );
    }
  }

  const validatedOptions: ValidatedSupportOptions = {
    ...options,
    walletConnectVersion,
    chains,
    chainId,
    optionalChains,
    projectId: options.projectId || '',
  };

  if (walletConnectVersion === 2 && (!options.projectId || options.projectId === '')) {
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
