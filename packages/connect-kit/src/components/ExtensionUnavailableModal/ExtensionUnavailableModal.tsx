import Modal, { ModalProps } from "../Modal/Modal";
import {
  ModalButton,
  ModalSection,
  ModalTitle,
} from "../Modal/Modal.styles";
import { ConnectFeature } from "./ExtensionUnavailableModal.styles";
import { default as LightbulbSvg } from "../../assets/svg/Lightbulb.svg";
import { default as CheckmarkSvg } from "../../assets/svg/Checkmark.svg";
import { getDebugLogger } from "../../lib/logger";

const log = getDebugLogger('ExtensionUnavailableModal')

export type ExtensionUnavailableModalProps = ModalProps;

const ExtensionUnavailableModal = ({
  onClose = () => void 0,
}: ExtensionUnavailableModalProps) => {
  log('initializing');

  const onInstallLedgerExtensionClick = () => {
    window.open("https://apps.apple.com/app/ledger-extension-browse-web3/id1627727841", "_blank");
  };

  return (
    <Modal onClose={() => onClose()}>
      <>
        <ModalSection>
          <ModalTitle>With Ledger Extension, you can:</ModalTitle>
          <ConnectFeature>
            <img src={LightbulbSvg} />
            Connect your Ledger directly to any dApp on Ethereum and Polygon
          </ConnectFeature>
          <ConnectFeature>
            <img src={CheckmarkSvg} />
            Get warnings about risky transactions before signing them.
          </ConnectFeature>
          <ModalButton variant="primary" onClick={onInstallLedgerExtensionClick}>Install Ledger Extension</ModalButton>
        </ModalSection>
      </>
    </Modal>
  );
};

export default ExtensionUnavailableModal;
