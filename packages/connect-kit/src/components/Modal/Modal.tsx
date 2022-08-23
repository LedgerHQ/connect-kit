import { ReactElement, useState } from "react";
import { Backdrop } from "./Backdrop.styles";
import { CloseButton, ModalContent, ModalHeader, ModalWrapper } from "./Modal.styles";
import { default as LedgerConnectSvg } from "../../assets/svg/LedgerConnect.svg";
import { default as XButtonSvg } from "../../assets/svg/X.svg";

export let setIsModalOpen = (isModalOpen: boolean) => {};

interface ModalProps {
  isOpen?: boolean;
  children: ReactElement | null;
}

export const Modal = ({ children }: ModalProps) => {
  const [isOpenState, setIsOpen] = useState<boolean>(true);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  setIsModalOpen = (isModalOpen: boolean) => {
    if (isModalOpen !== null) {
      setIsOpen(isModalOpen);
    }
  };

  return (
    <>
      {isOpenState && (
        <>
          <Backdrop />
          <ModalWrapper>
            <ModalContent>
              <ModalHeader>
                <img src={LedgerConnectSvg} />
                <CloseButton onClick={handleClose}>
                  <img src={XButtonSvg} />
                </CloseButton>
              </ModalHeader>

              <>{children}</>
            </ModalContent>
          </ModalWrapper>
        </>
      )}
    </>
  );
};

export default Modal;
