import { setIsModalOpen } from "../components/Modal/Modal";
import { createRoot, Root } from "react-dom/client";
import {
  ExtensionInstallModal,
  UseLedgerLiveModal,
  PlatformNotSupportedModal
} from "../components";
import { UseLedgerLiveModalProps } from "../components/UseLedgerLiveModal/UseLedgerLiveModal";
import { ExtensionInstallModalProps } from "../components/ExtensionInstallModal/ExtensionInstallModal";
import { getBrowser } from "./browser";
import { getSupportResult } from "./support";

type ModalType =
  'UseLedgerLiveModal' |
  'PlatformNotSupportedModal' |
  'ExtensionInstallModal'

let root: Root | null = null;

/**
 * Shows a modal component.
 */
export function showModal(
  modalType: ModalType,
  props?: ExtensionInstallModalProps | UseLedgerLiveModalProps
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
      case 'UseLedgerLiveModal':
        component = <UseLedgerLiveModal {...props} />;
        break;
      case "PlatformNotSupportedModal":
        component = <PlatformNotSupportedModal />
        break
      case 'ExtensionInstallModal':
        component = <ExtensionInstallModal {...props} />
        break;
    }

    root.render(component);
  }

  setIsModalOpen(true);
}

/**
 * Shows one of two modals depending on if the extension is supported or not.
 */
export function showExtensionOrLLModal(props: { uri: string, onClose: Function }) {
  const device = getBrowser();
  const supportResults = getSupportResult();

  // direct user to install the extension if supported
  if (supportResults.isLedgerConnectSupported &&
    supportResults.isChainIdSupported) {
    showModal('ExtensionInstallModal', {
      // pass an onClose callback that throws when the modal is closed
      onClose: props.onClose,
    });
  } else {
    showModal('UseLedgerLiveModal', {
      // show the QR code if we are on a desktop browser
      isDesktop: device.type === 'desktop',
      uri: props.uri,
      // pass an onClose callback that throws when the modal is closed
      onClose: props.onClose,
    });
  }
}
