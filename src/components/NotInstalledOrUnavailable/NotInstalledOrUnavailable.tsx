import { useState } from "react";
import Modal from "../Modal";
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
import { ReactComponent as LedgerConnectSvg } from "../../assets/svg/LedgerConnect.svg";
import { ReactComponent as XButtonSvg } from "../../assets/svg/X.svg";
import { ReactComponent as Lightbulb } from "../../assets/svg/Lightbulb.svg";
import { ReactComponent as Checkmark } from "../../assets/svg/Checkmark.svg";
import {
  IconContainer,
  JoinBetaButton,
  JoinBetaButtonWrapper,
  JoinBetaText,
  ModalSubtitleContainer,
} from "./NotInstalledOrUnavailable.styles";
import BottomModal from "../BottomModal";

interface NotInstalledOrUnavailableProps {
  isOpen: boolean;
}

const NotInstalledOrUnavailable = ({
  isOpen,
}: NotInstalledOrUnavailableProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(isOpen);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const onJoinBetaClick = () => {
    window.open("https://get-connect.ledger.com/", "_blank");
  };

  return (
    <Modal isOpen={isModalOpen}>
      <>
        <ModalWrapper>
          <ModalContent>
            <ModalSpacer>
              <ModalHeader>
                <LedgerConnectSvg />
                <CloseButtonWrapper onClick={handleClose}>
                  <XButtonSvg />
                </CloseButtonWrapper>
              </ModalHeader>
              <ModalBody>
                <ModalTitle> Try Ledger Connect </ModalTitle>
                <ModalSubtitleContainer>
                  <IconContainer>
                    <Lightbulb />
                  </IconContainer>
                  <ModalSubtitle>
                    One secure wallet and extension that works across all dApps.
                  </ModalSubtitle>
                </ModalSubtitleContainer>
                <ModalSubtitleContainer>
                  <IconContainer>
                    <Checkmark />
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
