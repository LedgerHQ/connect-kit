import { render } from "react-dom";
import { NotSupportedModal } from "../../components";

export default class NotSupportedRenderer {
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

    render(<NotSupportedModal isOpen />, this.root);
  }
}
