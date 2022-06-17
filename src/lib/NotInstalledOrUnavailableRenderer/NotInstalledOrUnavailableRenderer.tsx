import { createRoot, Root } from 'react-dom/client';
import { NotInstalledOrUnavailable } from "../../components";

export default class NotInstalledOrUnavailableRenderer {
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

    this.root.render(<NotInstalledOrUnavailable isOpen />);
  }
}
