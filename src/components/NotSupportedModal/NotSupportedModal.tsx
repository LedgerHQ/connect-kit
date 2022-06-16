import { useState } from "react";
import Modal from "../Modal";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalFooterText,
  ModalHeader,
  ModalSubtitle,
  ModalTitle,
  ModalSpacer,
  ModalWrapper,
  CloseButtonWrapper,
} from "../Modal/index.styles";
import { default as LedgerConnectSvg } from "../../assets/svg/LedgerConnect.svg";
import { default as AppleSvg } from "../../assets/svg/Apple.svg";
import { default as XButtonSvg } from "../../assets/svg/X.svg";
import { TextSpacer } from "./NotSupportedModal.styles";
import BottomModal from "../BottomModal";

interface NotSupportedModalProps {
  isOpen: boolean;
}

const NotSupportedModal = ({ isOpen }: NotSupportedModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(isOpen);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal isOpen={isModalOpen}>
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
                <ModalTitle>
                  Sorry, we don't support this platform just yet.
                </ModalTitle>
                <TextSpacer />
                <ModalSubtitle>
                  We're working hard to expand our coverage.
                  <br />
                  Until we get there you can try Connect on...
                </ModalSubtitle>
              </ModalBody>
              <ModalFooter>
                <img src={AppleSvg} />
                <ModalFooterText>Safari on iOS</ModalFooterText>
              </ModalFooter>
            </ModalSpacer>
          </ModalContent>
        </ModalWrapper>
        <BottomModal />
      </>
    </Modal>
  );
};

export default NotSupportedModal;
