import { render } from "react-dom";
import { NotInstalledOrUnavailable } from "../../components";

export default class NotInstalledOrUnavailableRenderer {
  private root: Element | null = null;

  public attachAndShow(el: Element): void {
    if (!this.root) {
      this.root = document.createElement("div");
      this.root.className = "-lcuikit-platform-not-supported-screen";
      el.appendChild(this.root);
    }

    this.render();
  }

  private render(): void {
    if (!this.root) {
      return;
    }

    render(<NotInstalledOrUnavailable isOpen />, this.root);
  }
}
