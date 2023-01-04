import EventEmitter from "events";
import { ProviderRpcError, UserRejectedRequestError } from "../lib/errors";
import { showModal } from "../lib/modal";
import { EthereumProvider, EthereumRequestPayload } from "./EthereumConnect";
import { getDebugLogger, getErrorLogger } from "../lib/logger";
import { getSupportOptions } from "../lib/supportOptions";

const log = getDebugLogger('TryConnectEthereum');
const logError = getErrorLogger('TryConnectEthereum');
let isHeadless: boolean;

export function getEthereumTryConnectProvider (): EthereumProvider {
  log('getEthereumTryConnectProvider');

  return new EthereumTryConnectProvider() as EthereumProvider;
}

class EthereumTryConnectProvider extends EventEmitter {
  // allow consumers to know that the Connect extension can be installed
  public isLedgerConnectSupported: boolean = true;

  constructor() {
    super();

    const supportOptions = getSupportOptions();
    isHeadless = supportOptions.isHeadless || false;
  }

  public request(payload: EthereumRequestPayload) {
    const methodNotSupportedMessage = `Method ${payload.method} not supported.`;

    if (payload.method === 'eth_accounts') {
      return [];
    } else if (payload.method === 'eth_requestAccounts') {
      log('calling eth_requestAccounts', payload.params);

      return new Promise(async (resolve, reject) => {
        if (!isHeadless) {
          showModal('ExtensionUnavailableModal', {
            // pass an onClose callback that throws when the modal is closed
            onClose: () => {
              return reject(new UserRejectedRequestError());
            }
          });
        } else {
          logError(methodNotSupportedMessage);
          return reject(new ProviderRpcError(4200, methodNotSupportedMessage));
        }
      });
    } else if (payload.method === 'eth_chainId') {
      return '0x1';
    } else if (payload.method === 'net_version') {
      return '1';
    } else {
      logError(methodNotSupportedMessage);
      throw new ProviderRpcError(4200, methodNotSupportedMessage);
    }
  }
}
