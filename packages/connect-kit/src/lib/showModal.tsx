import { setIsModalOpen } from "../components/Modal/Modal";
import { createRoot, Root } from "react-dom/client";
import { NotInstalledOrUnavailable, PlatformNotSupportedModal } from "../components";

type ModalType =
  'PlatformNotSupportedModal' |
  'PlatformNotSupportedModalWithUsb' |
  'NotInstalledOrUnavailable';

const modals = {
  'PlatformNotSupportedModal': <PlatformNotSupportedModal />,
  'PlatformNotSupportedModalWithUsb': <PlatformNotSupportedModal withUsb />,
  'NotInstalledOrUnavailable': <NotInstalledOrUnavailable />
};

let root: Root | null = null;

export function showModal(modalType: ModalType) {
  if (!root) {
    const el = document.body;
    const container = document.createElement("div");
    container.className = "ledger-ck-modal";
    el.appendChild(container);
    root = createRoot(container)
  }

  if (root && !!modals[modalType]) {
    root.render(modals[modalType]);
  }

  setIsModalOpen(true);
}
