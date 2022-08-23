import Modal from "../Modal/Modal";
import {
  ModalSection,
  ModalTitle,
} from "../Modal/Modal.styles";
import {
  InstallButton,
  ConnectFeature,
} from "./ExtensionUnavailableModal.styles";
import { default as LightbulbSvg } from "../../assets/svg/Lightbulb.svg";
import { default as CheckmarkSvg } from "../../assets/svg/Checkmark.svg";
import NeedALedgerSection from "../NeedALedgerSection";

const ExtensionUnavailableModal = () => {
  const onJoinBetaClick = () => {
    window.open("https://get-connect.ledger.com/", "_blank");
  };

  return (
    <Modal>
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
          <InstallButton variant="primary" onClick={onJoinBetaClick}>Join the Beta</InstallButton>
        </ModalSection>

        <NeedALedgerSection />
      </>
    </Modal>
  );
};

export default ExtensionUnavailableModal;
