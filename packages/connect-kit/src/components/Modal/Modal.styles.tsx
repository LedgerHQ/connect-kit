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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;

  @media ${devices.notPhone} {
    justify-content: start;
    align-items: end;
  }
`;

export const ModalContent = styled.div`
  position: relative;
  bottom: 0px;
  left: 0px;
  width: 100%;
  border-radius: ${borderRadius} ${borderRadius} 0 0;
  background: #131214;

  transform: scale(1);
  transition: opacity .25s,transform .25s;

  @media ${devices.notPhone} {
    margin: 2.6rem;
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
  border-top: 1px solid #2b2a2b;

  padding: ${modalPadding} ${modalPadding} 0 ${modalPadding};
  margin-bottom: ${modalPadding};

  font-size: 0.9rem;
  font-weight: 500;
  color: #C3C3C3;
`;

export const ModalTitle = styled.h2`
  font-size: 1.6rem;
  line-height: 2.2rem;
  color: #fff;
  font-weight: 600;
  margin: 0;
`;

export const ModalSubtitle = styled.h3`
  font-size: 1.3rem;
  color: #fff;
  font-weight: 500;
  margin: 0;
`;

export const ModalText = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  margin: 12px 0 0 0;
`;

export type VariantOptions = {
  variant?: string
}

export const ModalButton = styled.button<{ variant: string }>`
  width: 100%;
  margin-top: 24px;
  border-radius: 3rem;
  padding: 0.8rem 1rem;
  font-weight: 500;

  transition: all .5s ease;

  ${({variant}) => (variant == 'primary' ? css`
  border: none;
  background-color: white;
  color: #000;
  &:hover, &:focus {
    background-color: rgba(255, 255, 255, 0.8);
  }
  ` : css`
  border: 1px solid #565656;
  background-color: transparent;
  color: #fff;
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  `)}
`;

export const Stack = styled.div<{
  direction: "row" | "column",
  gap: number
}>`
  boxSizing: 'border-box';
  display: flex;
  ${({gap}) => css`
    gap: ${gap | 0}rem;
  `}

  ${({direction}) => css`
    flex-direction: ${direction};
  `}
`;
