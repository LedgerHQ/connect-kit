import styled from "styled-components";

export const ModalWrapper = styled.div`
  z-index: 999;
  width: 100vw;
  height: 100vh;
  display: flex;
  position: fixed;
  top: 0px;
  left: 0px;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div`
  display: flex;
  position: relative;
  max-width: 500px;
  flex-direction: column;
  transform: scale(1);
  transition: opacity .25s,transform .25s;
`;

export const CloseButtonWrapper = styled.button`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
`;
