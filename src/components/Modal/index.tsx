import { ReactElement, useEffect, useState } from "react";
import Backdrop from "./Backdrop";

let setIsModalOpen = (isOpen: boolean) => {};

interface ModalProps {
  isOpen?: boolean;
  children: ReactElement | null;
}

const Modal = ({ isOpen = true, children }: ModalProps) => {
  const [isOpenState, setIsOpen] = useState<boolean>(false);

  setIsModalOpen = (isModalOpen: boolean) => {
    if (isModalOpen != null) {
      setIsOpen(isModalOpen);
    }
  }

  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);

  return (
    <>
      {isOpenState && (
        <>
          <Backdrop />
          {children}
        </>
      )}
    </>
  );
};

export { setIsModalOpen };
export default Modal;
