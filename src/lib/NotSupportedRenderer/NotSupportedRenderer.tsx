import { createRoot, Root } from "react-dom/client";
import { NotSupportedModal } from "../../components";

export default class NotSupportedRenderer {
  private root: Root | null = null;

  public attach(el: Element): void {
    if (!this.root) {
      const container = document.createElement("div");
      container.className = "-lcuikit-platform-not-supported-screen";
      el.appendChild(container);
      this.root = createRoot(container)
      this.root.render(<NotSupportedModal />);
    }
  }
}
