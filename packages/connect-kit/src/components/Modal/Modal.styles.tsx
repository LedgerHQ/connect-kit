import styled, { css } from "styled-components";

const devices = {
  notPhone: `only screen and (min-width: 640px)`,
};

const borderRadius = '1.2rem';

export const ModalWrapper = styled.div`
  z-index: 999;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;

  /* workaround for bottom toolbar on Safari and Chrome hidding content */
  height: 100%; /* fallback */
  height: fill-available;
  height: stretch; /* latest specification */

  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media ${devices.notPhone} {
    align-items: center;
  }
`;

export const ModalContent = styled.div`
  position: relative;
  bottom: 0px;
  left: 0px;
  width: 100%;

  display: flex;
  flex-direction: column;
  border-radius: ${borderRadius} ${borderRadius} 0 0;
  background: #131214;

  transform: scale(1);
  transition: opacity .25s,transform .25s;

  @media ${devices.notPhone} {
     max-width: 420px;
     border-radius: ${borderRadius};
  }
`;

export const CloseButton = styled.button`
  margin: 0.2rem 0.2rem 0 0;
  width: 18px;
  height: 18px;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
`;

const modalPadding = '1rem';

export const ModalHeader = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  padding: ${modalPadding};
  padding-bottom: 0.9rem;
`;

export const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #2b2a2b;
  padding: ${modalPadding};

  font-size: 0.9rem;
  font-weight: 500;
  color: #C3C3C3;
`;

export const ModalTitle = styled.h2`
  font-size: 1.6rem;
  line-height: 2.2rem;
  color: #fff;
  font-weight: 600;
  margin-block-end: 0;
  margin-bottom: 0.8rem;
`;

export const ModalSubtitle = styled.h3`
  font-size: 1.4rem;
  color: #fff;
  font-weight: 500;
  margin-block-end: 0;
  margin-block-start: 0;
  margin-bottom: 0.5rem;
`;

export const ModalText = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  margin-block-end: 0;
  margin-block-start: 0;
  margin-bottom: 0.5rem;
`;

export type VariantOptions = {
  variant?: string
}

export const ModalButton = styled.button<{ variant: string }>`
  padding: 0.8rem 1rem;
  outline: none;
  border-radius: 3rem;
  font-weight: 500;

  ${({variant}) => (variant == 'primary' ? css`
    border: none;
    background-color: white;
    color: #000;
  ` : css`
    border: 1px solid #565656;
    background-color: transparent;
    color: #fff;
  `)}
`;
