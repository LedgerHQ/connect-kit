import EventEmitter from "events";
import { ProviderRpcError, UserRejectedRequestError } from "../lib/errors";
import { showModal } from "../lib/modal";
import { EthereumRequestPayload } from "./Ethereum";
import { getDebugLogger, getErrorLogger } from "../lib/logger";

const log = getDebugLogger('TryConnectEthereum');
const logError = getErrorLogger('TryConnectEthereum');

export class TryConnectEthereumProvider extends EventEmitter {
  constructor() {
    super();
  }

  public request(payload: EthereumRequestPayload) {
    if (payload.method === 'eth_accounts') {
      return [];
    } else if (payload.method === 'eth_requestAccounts') {
      log('calling eth_requestAccounts', payload.params);

      return new Promise(async (resolve, reject) => {
        showModal('ExtensionUnavailableModal', {
          // pass an onClose callback that throws when the modal is closed
          onClose: () => {
            reject(new UserRejectedRequestError());
          }
        });
      });
    } else {
      const message = `Method ${payload.method} not supported.`;
      logError(message);
      throw new ProviderRpcError(4200, message);
    }
  }
}
