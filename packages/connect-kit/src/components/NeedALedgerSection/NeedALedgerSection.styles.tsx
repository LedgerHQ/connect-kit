import styled from "styled-components";
import nanoX from "../../assets/images/NanoX.png";
import { ModalButton, ModalSection } from "../Modal/Modal.styles";

export const CustomBackground = styled.div`
  background: url(${nanoX});
  background-size: 260px;
  background-repeat: no-repeat;
  background-position: right 128%;
`;

export const ContentWrapper = styled(ModalSection)`
  padding-right: 3rem;
`;

export const BuyNowButton = styled(ModalButton)`
  width: 7rem;
  margin-bottom: 0.6rem;
`;
