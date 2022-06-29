import { ReactElement, useEffect, useState } from "react";
import { Backdrop } from "./Backdrop.styles";
import { ModalContent, ModalWrapper } from "./index.styles";

let setIsModalOpen = (isOpen: boolean) => {};

interface ModalProps {
  isOpen?: boolean;
  children: ReactElement | null;
}

const Modal = ({ isOpen = true, children }: ModalProps) => {
  const [isOpenState, setIsOpen] = useState<boolean>(false);

  setIsModalOpen = (isModalOpen: boolean) => {
    if (isModalOpen !== null) {
      setIsOpen(isModalOpen);
    }
  };

  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);

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

export { setIsModalOpen };
export default Modal;
