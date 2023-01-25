import { setIsModalOpen } from "../components/Modal/Modal";
import { createRoot, Root } from "react-dom/client";
import {
  ExtensionUnavailableModal,
  ConnectWithLedgerLiveModal,
  PlatformNotSupportedModal
} from "../components";
import { ConnectWithLedgerLiveModalProps } from "../components/ConnectWithLedgerLiveModal/ConnectWithLedgerLiveModal";
import { ExtensionUnavailableModalProps } from "../components/ExtensionUnavailableModal/ExtensionUnavailableModal";
import { getBrowser } from "./browser";
import { getSupportResult } from "./support";
import { UserRejectedRequestError } from "./errors";

type ModalType =
  'ConnectWithLedgerLiveModal' |
  'PlatformNotSupportedModal' |
  'ExtensionUnavailableModal'

let root: Root | null = null;

/**
 * Shows a modal component.
 */
export function showModal(
  modalType: ModalType,
  props?: ExtensionUnavailableModalProps | ConnectWithLedgerLiveModalProps
) {
  if (!root) {
    const el = document.body;
    const container = document.createElement("div");
    container.className = "ledger-ck-modal";
    el.appendChild(container);
    root = createRoot(container)
  }

  if (root && !!modalType) {
    let component;

    switch (modalType) {
      case 'ConnectWithLedgerLiveModal':
        component = <ConnectWithLedgerLiveModal {...props} />;
        break;
      case "PlatformNotSupportedModal":
        component = <PlatformNotSupportedModal />
        break
      case 'ExtensionUnavailableModal':
        component = <ExtensionUnavailableModal {...props} />
        break;
    }

    root.render(component);
  }

  setIsModalOpen(true);
}

/**
 * Shows one of two modals depending on if the extension is supported or not.
 */
export function showExtensionOrLLModal(uri: string, callback: Function) {
  const device = getBrowser();
  const supportResults = getSupportResult();

  // direct user to install the extension if supported
  if (supportResults.isLedgerConnectSupported &&
    supportResults.isChainIdSupported) {
    showModal('ExtensionUnavailableModal', {
      // pass an onClose callback that throws when the modal is closed
      onClose: () => {
        callback(new UserRejectedRequestError());
      }
    });
  } else {
    showModal('ConnectWithLedgerLiveModal', {
      // show the QR code if we are on a desktop browser
      withQrCode: device.type === 'desktop',
      uri,
      // pass an onClose callback that throws when the modal is closed
      onClose: () => {
        callback(new UserRejectedRequestError());
      }
    });
  }
}
