import styled, { css } from "styled-components";

export const devices = {
  notPhone: `only screen and (min-width: 640px)`,
  smallPhone: `only screen and (max-height: 640px)`,
};

const borderRadius = '1.2rem';

export const ModalWrapper = styled.div`
  z-index: 999;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100%;

  font: 14px inter, sans-serif;
  font-family: "Segoe UI", Helvetica, Arial, sans-serif;
  font-feature-settings: "kern";
  text-align: left !important;

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
    max-width: 340px;
    margin: auto;
    border-radius: ${borderRadius};
  }
`;

export const CloseButton = styled.button`
  box-sizing: border-box;
  margin: 0.2rem 0.2rem 0 0;
  border: none;
  padding: 0;
  width: 18px;
  height: 18px;
  background: transparent;
  outline: none;
  cursor: pointer;

  & > img {
    width: 18px;
    height: 18px;
  }
`;

const modalPadding = '15px';

export const ModalHeader = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  padding: ${modalPadding};
  padding-bottom: 0.9rem;
`;

export const ModalSection = styled.div<{
  textAlign?: "inherit" | "center"
}>`
  margin-bottom: ${modalPadding};
  border-top: 1px solid #2b2a2b;
  padding: ${modalPadding} ${modalPadding} 0 ${modalPadding};
  color: #C3C3C3;

  ${({textAlign}) => (textAlign && css`
    text-align: ${textAlign};
  `)}
`;

export const ModalTitle = styled.h2`
  color: #fff;
  margin: 0;
  line-height: 28px;
  font-size: 24px;
  font-weight: 600;

  @media ${devices.smallPhone} {
    font-size: 18px;
  }
`;

export const ModalSubtitle = styled.h3`
  color: #fff;
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
`;

export const ModalText = styled.p<{ noMargin?: boolean }>`
  ${({noMargin}) => (noMargin ? css`
    margin: 0;
  ` : `
    margin: 12px 0 0 0;
  `)}
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
`;

export type VariantOptions = {
  variant?: string
}

export const ModalButton = styled.button<{ variant: string, extraMargin?: boolean }>`
  width: 100%;

  ${({extraMargin}) => (extraMargin ? css`
    margin: 2rem 0 1.2rem 0;
  ` : css`
    margin-top: 1.2rem;
  `)}

  border-radius: 3rem;
  padding: 0.8rem 1rem;

  font-size: 14px;
  font-weight: 600;
  line-height: 17px;

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

export const Link = styled.a`
  color: #BBB0FF;
  cursor: pointer;
`;
