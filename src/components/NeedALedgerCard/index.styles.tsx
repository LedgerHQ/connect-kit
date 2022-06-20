import styled from "styled-components";
import modalBackground from "../../assets/images/ModalBackground.png";
import { CardContent } from "../Modal/Card.styles";

export const BuyNowButton = styled.button`
  width: 100%;
  height: 3rem;
  border-radius: 3rem;
  background: transparent;
  color: #fff;
  outline: none;
  border: 1px solid #fff;
`;

export const BuyNowText = styled.p`
  font-weight: bold;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
`;

export const NeedALedgerCardContent = styled(CardContent)`
  background: url(${modalBackground});
  background-size: cover;
  background-repeat: no-repeat;
`;