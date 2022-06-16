import styled from "styled-components";
import modalBackground from "../../assets/images/ModalBackground.png";

export const Spacer = styled.div`
  margin-top: 1rem;
`;

export const BuyNowButtonContainer = styled.div`
  margin-top: 2rem;
`;

export const BuyNowButton = styled.button`
  width: 80vw;
  height: 3rem;
  border-radius: 3rem;
  background: transparent;
  color: #fff;
  outline: none;
  border: 1px solid #fff;
`;

export const BuyNowText = styled.p`
  font-weight: bold;
  font-size: 0.9rem;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
`;

export const ModalContent = styled.div`
  margin-top: 10%;
  width: 90vw;
  border-radius: 12px;
  z-index: 1;
  background: url(${modalBackground});
  background-size: cover;
  background-repeat: no-repeat;
`;
