import { ReactElement, useEffect, useState } from "react";
import { Backdrop } from "./Backdrop.styles";
import { ModalContent, ModalWrapper } from "./index.styles";

export let setIsModalOpen = (isOpen: boolean) => {};

interface ModalProps {
  isOpen?: boolean;
  children: ReactElement | null;
}

export const Modal = ({ children }: ModalProps) => {
  const [isOpenState, setIsOpen] = useState<boolean>(true);

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
              <>{children}</>
            </ModalContent>
          </ModalWrapper>
        </>
      )}
    </>
  );
};

export default Modal;
