import { createRoot, Root } from 'react-dom/client';
import { NotInstalledOrUnavailable } from "../../components";

export default class NotInstalledOrUnavailableRenderer {
  private root: Root | null = null;

  public attach(el: Element): void {
    if (!this.root) {
      const container = document.createElement("div");
      container.className = "-lcuikit-platform-not-supported-screen";
      el.appendChild(container);
      this.root = createRoot(container)
      this.root.render(<NotInstalledOrUnavailable />);
    }
  }
}
