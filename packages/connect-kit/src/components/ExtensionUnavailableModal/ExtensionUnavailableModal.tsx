import Modal, { ModalProps } from "../Modal/Modal";
import {
  ModalButton,
  ModalSection,
  ModalTitle,
} from "../Modal/Modal.styles";
import { ConnectFeature } from "./ExtensionUnavailableModal.styles";
import { default as LightbulbSvg } from "../../assets/svg/Lightbulb.svg";
import { default as CheckmarkSvg } from "../../assets/svg/Checkmark.svg";
import NeedALedgerSection from "../NeedALedgerSection";
import { getDebugLogger } from "../../lib/logger";

const log = getDebugLogger('ExtensionUnavailableModal')

export type ExtensionUnavailableModalProps = ModalProps;

const ExtensionUnavailableModal = ({
  onClose = () => void 0,
}: ExtensionUnavailableModalProps) => {
  log('initializing');

  const onJoinBetaClick = () => {
    window.open("https://get-connect.ledger.com/onboarding", "_blank");
  };

  return (
    <Modal onClose={() => onClose()}>
      <>
        <ModalSection>
          <ModalTitle>Try Ledger Connect</ModalTitle>
          <ConnectFeature>
            <img src={LightbulbSvg} />
            One secure wallet and extension that works across all dApps.
          </ConnectFeature>
          <ConnectFeature>
            <img src={CheckmarkSvg} />
            Stay safe and prevent harmful transactions with Web3 Check.
          </ConnectFeature>
          <ModalButton variant="primary" onClick={onJoinBetaClick}>Install now</ModalButton>
        </ModalSection>

        <NeedALedgerSection />
      </>
    </Modal>
  );
};

export default ExtensionUnavailableModal;
