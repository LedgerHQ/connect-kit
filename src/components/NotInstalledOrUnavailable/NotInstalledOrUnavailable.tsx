import Modal, { setIsModalOpen } from "../Modal";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalSpacer,
  ModalWrapper,
  CloseButtonWrapper,
  ModalSubtitle,
  ModalTitle,
} from "../Modal/index.styles";
import {
  IconContainer,
  JoinBetaButton,
  JoinBetaButtonWrapper,
  JoinBetaText,
  ModalSubtitleContainer,
} from "./NotInstalledOrUnavailable.styles";
import BottomModal from "../BottomModal";
import { default as LedgerConnectSvg } from "../../assets/svg/LedgerConnect.svg";
import { default as XButtonSvg } from "../../assets/svg/X.svg";
import { default as LightbulbSvg } from "../../assets/svg/Lightbulb.svg";
import { default as CheckmarkSvg } from "../../assets/svg/Checkmark.svg";

const NotInstalledOrUnavailable = () => {
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const onJoinBetaClick = () => {
    window.open("https://get-connect.ledger.com/", "_blank");
  };

  return (
    <Modal>
      <>
        <ModalWrapper>
          <ModalContent>
            <ModalSpacer>
              <ModalHeader>
                <img src={LedgerConnectSvg} />
                <CloseButtonWrapper onClick={handleClose}>
                  <img src={XButtonSvg} />
                </CloseButtonWrapper>
              </ModalHeader>
              <ModalBody>
                <ModalTitle> Try Ledger Connect </ModalTitle>
                <ModalSubtitleContainer>
                  <IconContainer>
                    <img src={LightbulbSvg} />
                  </IconContainer>
                  <ModalSubtitle>
                    One secure wallet and extension that works across all dApps.
                  </ModalSubtitle>
                </ModalSubtitleContainer>
                <ModalSubtitleContainer>
                  <IconContainer>
                    <img src={CheckmarkSvg} />
                  </IconContainer>
                  <ModalSubtitle>
                    Stay safe and prevent harmful transactions with Web3 Check.
                  </ModalSubtitle>
                </ModalSubtitleContainer>
              </ModalBody>
              <ModalFooter>
                <JoinBetaButtonWrapper>
                  <JoinBetaButton onClick={onJoinBetaClick}>
                    <JoinBetaText>Join the Beta</JoinBetaText>
                  </JoinBetaButton>
                </JoinBetaButtonWrapper>
              </ModalFooter>
            </ModalSpacer>
          </ModalContent>
        </ModalWrapper>
        <BottomModal />
      </>
    </Modal>
  );
};

export default NotInstalledOrUnavailable;
