import { createRoot, Root } from "react-dom/client";
import { NotSupportedModal } from "../../components";

export default class NotSupportedRenderer {
  private root: Root | null = null;

  public attachAndShow(el: Element): void {
    if (!this.root) {
      const container = document.createElement("div");
      container.className = "-lcuikit-platform-not-supported-screen";
      el.appendChild(container);
      this.root = createRoot(container)
    }

    this.render();
  }

  private render(): void {
    if (!this.root) {
      return;
    }

    this.root.render(<NotSupportedModal isOpen />);
  }
}
