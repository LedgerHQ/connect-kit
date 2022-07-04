import { setIsModalOpen } from "../components/Modal";
import { createRoot, Root } from "react-dom/client";
import { NotInstalledOrUnavailable, PlatformNotSupportedModal } from "../components";
import { ConnectSupport } from "./checkConnectSupport";

class PlatformOrBrowserNotSupportedError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "Your current platform or browser is not supported.";
  }
}

class NotLedgerConnectProviderError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "The Ledger Connect extension was not found.";
  }
}

type ModalType =
  'PlatformNotSupportedModal' |
  'NotInstalledOrUnavailable';

const modals = {
  'PlatformNotSupportedModal': <PlatformNotSupportedModal />,
  'NotInstalledOrUnavailable': <NotInstalledOrUnavailable />
};

let root: Root | null = null;

const rendererModal = (modalType: ModalType): void => {
  if (root && !!modals[modalType]) {
    root.render(modals[modalType]);
  }
}

export const showModal = (support: ConnectSupport) => {
  let error;

  if (!root) {
    const el = document.body;
    const container = document.createElement("div");
    container.className = "-lcuikit-modal";
    el.appendChild(container);
    root = createRoot(container)
  }

  if (!support.isConnectSupported && !support.isWebUSBSupported && !support.isU2FSupported) {
    // if none of the connection methods is supported, show the Platform Not
    // Supported modal
    error = new PlatformOrBrowserNotSupportedError();
    rendererModal("PlatformNotSupportedModal");
    setIsModalOpen(true);
  } else if (support.isConnectSupported && !support.isLedgerConnectExtensionLoaded) {
    // if we're on a supported platform but Connect is not enabled show the
    // Try Ledger Connect modal
    error = new NotLedgerConnectProviderError();
    rendererModal("NotInstalledOrUnavailable");
    setIsModalOpen(true);
  }

  return {
    error
  };
}
