import { setIsModalOpen } from "../components/Modal/Modal";
import { createRoot, Root } from "react-dom/client";
import {
  ExtensionUnavailableModal,
  ConnectWithLedgerLiveModal,
  PlatformNotSupportedModal
} from "../components";
import { ConnectWithLedgerLiveModalProps } from "../components/ConnectWithLedgerLiveModal/ConnectWithLedgerLiveModal";
import { ExtensionUnavailableModalProps } from "../components/ExtensionUnavailableModal/ExtensionUnavailableModal";

type ModalType =
  'ConnectWithLedgerLiveModal' |
  'PlatformNotSupportedModal' |
  'ExtensionUnavailableModal'

let root: Root | null = null;

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
