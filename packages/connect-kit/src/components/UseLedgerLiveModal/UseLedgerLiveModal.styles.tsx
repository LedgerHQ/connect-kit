import { QRCodeSVG } from "qrcode.react";
import styled from "styled-components";
import { devices } from "../Modal/Modal.styles";

export const QrCode = styled(QRCodeSVG)`
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
  padding: 15px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 0.1rem;
  border-radius: 1rem;
  background-color: white;

  @media ${devices.smallPhone} {
    width: 200px;
    height: 200px;
  }
`;

export const QrCodeSection = styled.div`
  margin: 1rem 0;
  border-top: none;
  padding-top: 0;
`;
