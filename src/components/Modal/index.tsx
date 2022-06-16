import { ReactElement, useEffect, useState } from "react";
import Backdrop from "./Backdrop";

interface ModalProps {
  isOpen: boolean;
  children: ReactElement | null;
}

const Modal = ({ isOpen, children }: ModalProps) => {
  const [isOpenState, setIsOpen] = useState<boolean>(isOpen);

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

export default Modal;
