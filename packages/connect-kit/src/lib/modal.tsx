import { setIsModalOpen } from "../components/Modal/Modal";
import { createRoot, Root } from "react-dom/client";
import {
  ExtensionUnavailableModal,
  ConnectWithLedgerLiveModal,
  PlatformNotSupportedModal
} from "../components";

type ModalType =
  'ConnectWithLedgerLiveModal' |
  'PlatformNotSupportedModal' |
  'ExtensionUnavailableModal'

let root: Root | null = null;

export function showModal(modalType: ModalType, props?: {} ) {
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
        component = <ExtensionUnavailableModal />
        break;
    }

    root.render(component);
  }

  setIsModalOpen(true);
}
