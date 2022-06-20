import { createRoot, Root } from "react-dom/client";
import { PlatformNotSupportedModal } from "../components";

export default class ModalRenderer {
  private root: Root | null = null;

  public attach(el: Element): void {
    if (!this.root) {
      const container = document.createElement("div");
      container.className = "-lcuikit-platform-not-supported-screen";
      el.appendChild(container);
      this.root = createRoot(container)
      this.root.render(<PlatformNotSupportedModal />);
    }
  }
}
