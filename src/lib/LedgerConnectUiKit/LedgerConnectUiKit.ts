import NotSupportedRenderer from "../NotSupportedRenderer";
import NotInstalledOrUnavailableRenderer from "../NotInstalledOrUnavailableRenderer";
import { checkLedgerConnect } from "../checkLedgerConnect";
import {
  PlatformOrBrowserNotSupportedError,
  NotLedgerConnectProviderError,
  ShowAppropriateModalResponse,
} from "./types";
import { setIsModalOpen } from "../../components/Modal";

export default class LedgerConnectUiKit {
  private readonly notSupportedRenderer: NotSupportedRenderer;
  private readonly notInstalledOrUnavailableRenderer: NotInstalledOrUnavailableRenderer;
  private attached = false;
  private root: Element | null = null;

  constructor() {
    this.notSupportedRenderer = new NotSupportedRenderer();
    this.notInstalledOrUnavailableRenderer =
      new NotInstalledOrUnavailableRenderer();
    this.showAppropriateModal();
  }

  private attach(): void {
    console.log("call to attach Ledger Connect UI");

    if (this.attached) {
      throw new Error("Ledger Connect UI Kit is already attached");
    }

    if (!this.root) {
      const el = document.body;
      this.root = document.createElement("div");
      this.root.className = "-lcuikit-root";
      el.appendChild(this.root);
    }

    this.attached = true;
  }

  public showAppropriateModal(): ShowAppropriateModalResponse {
    let error;

    if (!this.root) {
      this.attach();
    } else {
      const environment = checkLedgerConnect();

      if (!environment.isSupportedPlatform || !environment.isSupportedBrowser) {
        error = new PlatformOrBrowserNotSupportedError();
        console.log(error.message);

        this.notSupportedRenderer.attach(this.root);
        setIsModalOpen(true);
      } else if (!environment.isLedgerConnectExtensionLoaded) {
        error = new NotLedgerConnectProviderError();
        console.log(error.message);

        this.notInstalledOrUnavailableRenderer.attach(this.root);
        setIsModalOpen(true);
      }
    }

    return {
      error,
    };
  }
}
