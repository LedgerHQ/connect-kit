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

// accepts a boolean informing of the connector support for USB
type showModalOptions = ConnectSupport & { connectorSupportsUsb: boolean }

export const showModal = ({
  isConnectSupported,
  isLedgerConnectExtensionLoaded,
  isWebUSBSupported,
  isU2FSupported,
  connectorSupportsUsb = false,
}: showModalOptions) => {
  let error;

  if (!root) {
    const el = document.body;
    const container = document.createElement("div");
    container.className = "-lcuikit-modal";
    el.appendChild(container);
    root = createRoot(container)
  }

  // only check for USB support on browser if the connector supports USB
  const isUSBSupported = connectorSupportsUsb && (isWebUSBSupported || isU2FSupported)

  if (!isConnectSupported && !isUSBSupported) {
    // if none of the connection methods is supported, show the Platform Not
    // Supported modal
    error = new PlatformOrBrowserNotSupportedError();
    rendererModal("PlatformNotSupportedModal");
    setIsModalOpen(true);
  } else if (isConnectSupported && !isLedgerConnectExtensionLoaded) {
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
