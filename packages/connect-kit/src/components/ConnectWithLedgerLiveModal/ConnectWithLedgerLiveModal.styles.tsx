import { QRCodeSVG } from "qrcode.react";
import styled, { css } from "styled-components";
import { ModalSection } from "../Modal/Modal.styles";

export const QrCode = styled(QRCodeSVG)`
  flex-grow: 0;
  flex-shrink: 0;
  padding: 0.5rem;
  margin-top: 0.1rem;
  height: 128px;
  width: 128px;
  border-radius: 1rem;
  background-color: white;
`;

export const QrCodeSection = styled(ModalSection)`
  margin: 1.8rem 0 1.5rem 0;
  border-top: none;
  padding-top: 0;
`;
