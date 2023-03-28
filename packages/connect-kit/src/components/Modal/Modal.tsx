import { ReactElement, useState } from "react";
import { Backdrop } from "./Backdrop.styles";
import { CloseButton, ModalContent, ModalHeader, ModalWrapper } from "./Modal.styles";
import { default as LedgerSvg } from "../../assets/svg/Ledger.svg";
import { default as XButtonSvg } from "../../assets/svg/X.svg";

export let setIsModalOpen = (isModalOpen: boolean) => {};

export interface ModalProps {
  isOpen?: boolean;
  onClose?: Function;
  children?: ReactElement | null;
}

export const Modal = ({ onClose, children }: ModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  // assign the set state function to the exported one
  setIsModalOpen = setIsOpen;

  const handleClose = () => {
    setIsModalOpen(false);
    onClose && onClose();
  };

  const handleOutsideClick = (e: any) => {
    if (e?.target?.id === 'ModalWrapper') {
      handleClose();
    }
  }

  if (isOpen) {
    return (
      <>
        <Backdrop />
        <ModalWrapper id="ModalWrapper" onClick={handleOutsideClick}>
          <ModalContent>
            <ModalHeader>
              <img src={LedgerSvg} />
              <CloseButton onClick={handleClose}>
                <img src={XButtonSvg} />
              </CloseButton>
            </ModalHeader>

            <>{children}</>
          </ModalContent>
        </ModalWrapper>
      </>
    );
  }
  return null;
};

export default Modal;
