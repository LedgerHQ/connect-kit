import styled from "styled-components";

export const ModalWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div`
  margin-top: 10%;
  width: 90vw;
  border-radius: 12px;
  background: #000;
  z-index: 1;
`;

export const ModalHeader = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

export const ModalBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const ModalFooter = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

export const ModalTitle = styled.h1`
  font-size: 2rem;
  color: #fff;
  font-weight: 400;
  margin-block-end: 0;
`;

export const ModalSubtitle = styled.p`
  font-size: 0.95rem;
  color: #fff;
  margin-block-end: 0;
  margin-block-start: 0;
`;

export const ModalFooterText = styled.h4`
  font-size: 1.3rem;
  color: #fff;
  margin-left: 0.5rem;
  font-weight: 400;
`;

export const ModalSpacer = styled.div`
  margin: 1rem;
`;

export const CloseButtonWrapper = styled.button`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
`;
