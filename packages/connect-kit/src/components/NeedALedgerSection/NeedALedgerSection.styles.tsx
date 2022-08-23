import styled from "styled-components";
import nanoX from "../../assets/images/NanoX.png";
import { ModalButton } from "../Modal/Modal.styles";

export const CustomBackground = styled.div`
  background: url(${nanoX});
  background-size: 260px;
  background-repeat: no-repeat;
  background-position: right bottom;
`;

export const ContentWrapper = styled.div`
  padding: 0 3rem 0 0;
`;

export const BuyNowButton = styled(ModalButton)`
  width: 7rem;
  margin-top: 1rem;
`;
